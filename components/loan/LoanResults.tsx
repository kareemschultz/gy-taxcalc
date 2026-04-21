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
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { compareBanks, resolveLoanPrincipal } from "@/lib/loan/calculator"
import type { LoanInputs, LoanResults, YearlyRow, AmortizationRow } from "@/lib/loan/types"
import { LoanCharts } from "@/components/loan/LoanCharts"

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

function HeroCard({
  label,
  value,
  sub,
  text,
  accent = false,
}: {
  label: string
  value: number
  sub?: string
  text?: string
  accent?: boolean
}) {
  return (
    <Card className={accent ? "border-primary/30 bg-primary/5" : "bg-muted/20"}>
      <CardContent className="pt-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        {text ? <p className="mt-2 text-2xl font-bold">{text}</p> : <p className="mt-2 text-2xl font-bold"><Money amount={value} /></p>}
        {sub ? <p className="mt-1 text-sm text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

function rowForView(row: AmortizationRow | YearlyRow, view: "monthly" | "yearly") {
  if (view === "monthly") {
    const monthly = row as AmortizationRow
    return {
      period: `Month ${monthly.period}`,
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
    rowForView(row, view)
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HeroCard label={paymentLabel} value={displayPayment} accent />
        <HeroCard label="Total Interest" value={result.totalInterest} />
        <HeroCard label="Total Paid" value={result.totalPaid} />
        <HeroCard label="Payoff Date" value={0} text={result.payoffDate} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <StatCard label="Rate" value={`${result.effectiveRate.toFixed(2)}% effective`} />
        <StatCard label="Loan Term" value={`${result.termMonths} months`} />
        <StatCard
          label="Upfront Fee"
          value={result.processingFee > 0 ? formatCurrency(result.processingFee) : "None"}
        />
      </div>

      <Tabs defaultValue="summary" className="space-y-3">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="summary" className="min-w-[92px] flex-none sm:flex-1">
            Summary
          </TabsTrigger>
          <TabsTrigger value="schedule" className="min-w-[92px] flex-none sm:flex-1">
            Payment Schedule
          </TabsTrigger>
          <TabsTrigger value="banks" className="min-w-[92px] flex-none sm:flex-1">
            Compare Lenders
          </TabsTrigger>
          <TabsTrigger value="charts" className="min-w-[92px] flex-none sm:flex-1">
            Visual Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="space-y-4">
            <Card className="bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BadgeDollarSign className="size-4 text-primary" />
                  Loan Overview
                </CardTitle>
                <CardDescription>Key results for the selected loan setup.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid gap-2 md:grid-cols-2">
                  <StatCard label="Principal" value={formatCurrency(principal)} />
                  <StatCard label="Payoff Date" value={result.payoffDate} />
                </div>
                <Separator />
                <div className="grid gap-2 md:grid-cols-2">
                  <StatCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
                  <StatCard label="Total Paid" value={formatCurrency(result.totalPaid)} />
                </div>
              </CardContent>
            </Card>

            {result.monthsSaved !== undefined || result.biweeklyMonthsSaved !== undefined ? (
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PiggyBank className="size-4 text-primary" />
                    Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-2 md:grid-cols-4">
                    <StatCard label="Months Saved" value={String(savingsMonths)} />
                    <StatCard label="Interest Saved" value={formatCurrency(savingsInterest)} />
                    <StatCard label="New Payoff Date" value={result.newPayoffDate || result.payoffDate} />
                    <StatCard
                      label="New Payment"
                      value={
                        result.extraSchedule?.length
                          ? formatCurrency(
                              result.extraSchedule[0]?.payment || result.monthlyPayment
                            )
                          : formatCurrency(displayPayment)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {inputs.paymentFrequency === "biweekly" && result.biweeklyPayment ? (
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingDown className="size-4 text-primary" />
                    Bi-weekly vs Monthly
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-2 md:grid-cols-3">
                    <StatCard label="Bi-weekly Payment" value={formatCurrency(result.biweeklyPayment)} />
                    <StatCard
                      label="Interest Saved"
                      value={
                        result.biweeklyInterestSaved !== undefined
                          ? formatCurrency(result.biweeklyInterestSaved)
                          : "—"
                      }
                    />
                    <StatCard
                      label="Months Saved"
                      value={result.biweeklyMonthsSaved !== undefined ? String(result.biweeklyMonthsSaved) : "—"}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                Payment Schedule
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
                      {pageRows.map((row) => (
                        <tr key={row.period}>
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
                  Lender Comparison
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
