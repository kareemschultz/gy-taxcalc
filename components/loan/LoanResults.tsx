"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BadgeDollarSign,
  CalendarClock,
  CircleDollarSign,
  Landmark,
  PiggyBank,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { compareBanks, resolveLoanPrincipal } from "@/lib/loan/calculator"
import type { LoanInputs, LoanResults, YearlyRow, AmortizationRow } from "@/lib/loan/types"
import { LoanIntelligence } from "@/components/loan/LoanIntelligence"
import { LoanCharts } from "@/components/loan/LoanCharts"
import { ResultActions } from "@/components/results/result-actions"

function Money({ amount, prefix = "GY$" }: { amount: number; prefix?: string }) {
  return <span className="tabular-nums">{formatCurrency(amount).replace("$", prefix)}</span>
}

function EmptyState() {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <CircleDollarSign className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Enter a principal amount to see loan results</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Monthly payment, payoff date, and charts update live.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: React.ReactNode
  valueClassName?: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className={valueClassName || "mt-1 text-sm font-semibold"}>{value}</div>
    </div>
  )
}

function SwipeHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="mt-2 flex items-center justify-end gap-2 px-1 text-[11px] text-muted-foreground sm:hidden"
      aria-hidden="true"
    >
      <span className="relative flex h-4 w-10 items-center overflow-hidden rounded-full border border-border/60 bg-muted/20">
        <motion.span
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="ml-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary/80"
        />
      </span>
      <span>Swipe for more tabs</span>
    </motion.div>
  )
}

function rowForView(
  row: AmortizationRow | YearlyRow,
  view: "monthly" | "yearly",
  paymentFrequency: "monthly" | "biweekly"
) {
  if (view === "monthly") {
    const monthly = row as AmortizationRow
    return {
      period: paymentFrequency === "biweekly" ? `Bi-weekly Period ${monthly.period}` : `Month ${monthly.period}`,
      payment: monthly.payment,
      principal: monthly.principal,
      interest: monthly.interest,
      balance: monthly.balance,
    }
  }

  const yearly = row as YearlyRow
  return {
    period: `Year ${yearly.year}`,
    payment: yearly.totalPayment,
    principal: yearly.totalPrincipal,
    interest: yearly.totalInterest,
    balance: yearly.endBalance,
  }
}

export function LoanResults({
  inputs,
  result,
}: {
  inputs: LoanInputs | null
  result: LoanResults | null
}) {
  const [view, setView] = React.useState<"monthly" | "yearly">("monthly")
  const [page, setPage] = React.useState(0)

  React.useEffect(() => {
    setPage(0)
  }, [view, result])

  if (!result || !inputs || (inputs.principalGYD <= 0 && !inputs.purchasePrice)) {
    return <EmptyState />
  }

  const principal = resolveLoanPrincipal(inputs)
  const comparisonBanks = compareBanks(principal, inputs.termMonths)
  const displayPayment =
    inputs.paymentFrequency === "biweekly" && result.biweeklyPayment
      ? result.biweeklyPayment
      : result.monthlyPayment
  const paymentLabel = inputs.paymentFrequency === "biweekly" ? "Bi-weekly Payment" : "Monthly Payment"
  const rows = (view === "monthly" ? result.amortizationSchedule : result.yearlySchedule).map((row) =>
    rowForView(row, view, inputs.paymentFrequency)
  )
  const pageSize = 24
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageRows = rows.slice(page * pageSize, page * pageSize + pageSize)
  const savingsMonths = result.monthsSaved ?? result.biweeklyMonthsSaved ?? 0
  const savingsInterest = result.interestSaved ?? result.biweeklyInterestSaved ?? 0

  return (
    <motion.div
      id="loan-results"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-4"
    >
      <div className="rounded-xl border bg-muted/10 p-4">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{paymentLabel}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{formatCurrency(displayPayment)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Principal {formatCurrency(principal)} · Payoff {result.payoffDate}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric
              label="Total Interest"
              value={<span className="tabular-nums">{formatCurrency(result.totalInterest)}</span>}
            />
            <Metric
              label="Total Paid"
              value={<span className="tabular-nums">{formatCurrency(result.totalPaid)}</span>}
            />
            <Metric label="Payoff Date" value={<span className="font-medium">{result.payoffDate}</span>} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 border-t pt-3 text-sm text-muted-foreground">
          <span>Rate {result.effectiveRate.toFixed(2)}%</span>
          <span>Term {result.termMonths} months</span>
          <span>Upfront fee {result.processingFee > 0 ? formatCurrency(result.processingFee) : "None"}</span>
        </div>
      </div>

      <ResultActions
        fileName="loan-summary.txt"
        title="Loan Summary"
        subtitle="A clean export of the current loan scenario with payment and payoff details."
        summary={[
          { label: "Monthly Payment", value: formatCurrency(result.monthlyPayment) },
          { label: "Total Interest", value: formatCurrency(result.totalInterest) },
          { label: "Total Paid", value: formatCurrency(result.totalPaid) },
          { label: "Payoff Date", value: result.payoffDate },
        ]}
        sections={[
          {
            title: "Loan Overview",
            rows: [
              { label: "Principal", value: formatCurrency(principal) },
              { label: "Interest Rate", value: `${result.effectiveRate.toFixed(2)}% effective` },
              { label: "Loan Term", value: `${result.termMonths} months` },
              { label: "Upfront Fee", value: result.processingFee > 0 ? formatCurrency(result.processingFee) : "None" },
            ],
          },
          {
            title: "Savings and Comparison",
            rows: [
              { label: "Months Saved", value: String(savingsMonths) },
              { label: "Interest Saved", value: formatCurrency(savingsInterest) },
              { label: "New Payoff Date", value: result.newPayoffDate || result.payoffDate },
            ],
          },
        ]}
        lines={[
          `Monthly payment: ${formatCurrency(result.monthlyPayment)}`,
          `Total interest: ${formatCurrency(result.totalInterest)}`,
          `Total paid: ${formatCurrency(result.totalPaid)}`,
          `Payoff date: ${result.payoffDate}`,
        ]}
      />

      <Tabs defaultValue="summary" className="space-y-3">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="summary" className="min-w-[92px] flex-none sm:flex-1">
            Summary
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="min-w-[92px] flex-none sm:flex-1">
            What If
          </TabsTrigger>
          <TabsTrigger value="schedule" className="min-w-[92px] flex-none sm:flex-1">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="banks" className="min-w-[92px] flex-none sm:flex-1">
            Bank Rates
          </TabsTrigger>
          <TabsTrigger value="charts" className="min-w-[92px] flex-none sm:flex-1">
            Charts
          </TabsTrigger>
        </TabsList>
        <SwipeHint />

        <TabsContent value="summary">
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeDollarSign className="size-4 text-primary" />
                Loan Snapshot
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Quick summary of the selected loan setup.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Metric
                  label="Principal"
                  value={<span className="tabular-nums">{formatCurrency(principal)}</span>}
                />
                <Metric label="Payoff Date" value={<span className="font-medium">{result.payoffDate}</span>} />
                <Metric
                  label="Total Interest"
                  value={<span className="tabular-nums">{formatCurrency(result.totalInterest)}</span>}
                />
                <Metric
                  label="Total Paid"
                  value={<span className="tabular-nums">{formatCurrency(result.totalPaid)}</span>}
                />
              </div>
            </div>

            {result.monthsSaved !== undefined || result.biweeklyMonthsSaved !== undefined ? (
              <div className="rounded-xl border bg-muted/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <PiggyBank className="size-4 text-primary" />
                  Savings
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <Metric label="Months Saved" value={<span>{String(savingsMonths)}</span>} />
                  <Metric
                    label="Interest Saved"
                    value={<span className="tabular-nums">{formatCurrency(savingsInterest)}</span>}
                  />
                  <Metric
                    label="New Payoff Date"
                    value={<span className="font-medium">{result.newPayoffDate || result.payoffDate}</span>}
                  />
                  <Metric
                    label="New Payment"
                    value={
                      <span className="tabular-nums">
                        {result.extraSchedule?.length
                          ? formatCurrency(result.extraSchedule[0]?.payment || result.monthlyPayment)
                          : formatCurrency(displayPayment)}
                      </span>
                    }
                  />
                </div>
              </div>
            ) : null}

            {inputs.paymentFrequency === "biweekly" && result.biweeklyPayment ? (
              <div className="rounded-xl border bg-muted/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingDown className="size-4 text-primary" />
                  Bi-weekly vs Monthly
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Metric
                    label="Bi-weekly Payment"
                    value={<span className="tabular-nums">{formatCurrency(result.biweeklyPayment)}</span>}
                  />
                  <Metric
                    label="Interest Saved"
                    value={
                      <span className="tabular-nums">
                        {result.biweeklyInterestSaved !== undefined
                          ? formatCurrency(result.biweeklyInterestSaved)
                          : "—"}
                      </span>
                    }
                  />
                  <Metric
                    label="Months Saved"
                    value={<span>{result.biweeklyMonthsSaved !== undefined ? String(result.biweeklyMonthsSaved) : "—"}</span>}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="intelligence">
          <LoanIntelligence inputs={inputs} result={result} />
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                Amortization Schedule
              </CardTitle>
              <CardDescription>Monthly or yearly view of each payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={view === "monthly" ? "default" : "outline"}
                  onClick={() => setView("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={view === "yearly" ? "default" : "outline"}
                  onClick={() => setView("yearly")}
                >
                  Yearly
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border bg-background">
                <div className="max-h-[32rem] overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Period</th>
                        <th className="px-3 py-2 text-right">Payment</th>
                        <th className="px-3 py-2 text-right">Principal</th>
                        <th className="px-3 py-2 text-right">Interest</th>
                        <th className="px-3 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pageRows.map((row, index) => (
                        <tr
                          key={row.period}
                          className={page === 0 && index === 0 ? "bg-primary/5" : undefined}
                        >
                          <td className="px-3 py-2">{row.period}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.payment)}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.principal)}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.interest)}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t bg-muted/20 text-sm font-medium">
                      <tr>
                        <td className="px-3 py-2">Totals</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(rows.reduce((sum, row) => sum + row.payment, 0))}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(rows.reduce((sum, row) => sum + row.principal, 0))}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(rows.reduce((sum, row) => sum + row.interest, 0))}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatCurrency(rows.at(-1)?.balance || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {totalPages > 1 ? (
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page <= 0}
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks">
          <div className="space-y-3">
            <Card className="bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Landmark className="size-4 text-primary" />
                  Bank Rates
                </CardTitle>
                <CardDescription>Rate estimates as of April 2026.</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {comparisonBanks.map((bank) => (
                <Card key={bank.shortName} className="bg-muted/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{bank.shortName}</CardTitle>
                    <CardDescription>{bank.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rate Range</span>
                      <span className="font-medium">
                        {bank.minRate}% - {bank.maxRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Payment</span>
                      <span className="font-medium">
                        {formatCurrency(bank.monthlyPaymentMin)} - {formatCurrency(bank.monthlyPaymentMax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-medium">
                        {formatCurrency(bank.totalInterestMin)} - {formatCurrency(bank.totalInterestMax)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              These are reference estimates only. Contact the lender for current underwriting rules.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <LoanCharts inputs={inputs} result={result} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
