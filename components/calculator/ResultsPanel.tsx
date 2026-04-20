"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calculator,
  Calendar,
  BadgeDollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { formatCurrency, formatPercent } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"
import { PAYMENT_FREQUENCIES } from "@/lib/tax/constants"
import { TaxBreakdownChart } from "./TaxBreakdownChart"
import { AnnualCashflowChart } from "./AnnualCashflowChart"

/* ── animated number ──────────────────────────────────── */
function AnimatedCurrency({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="tabular-nums"
    >
      {formatCurrency(value)}
    </motion.span>
  )
}

/* ── stat row ─────────────────────────────────────────── */
function StatRow({
  label,
  value,
  sub,
  variant = "default",
}: {
  label: string
  value: number
  sub?: string
  variant?: "default" | "deduction" | "total" | "highlight"
}) {
  const variantStyles = {
    default: "text-foreground",
    deduction: "text-destructive",
    total: "text-primary font-semibold",
    highlight: "text-primary font-bold text-base",
  }
  return (
    <div
      className={`flex items-baseline justify-between py-1.5 ${
        variant === "total" || variant === "highlight" ? "border-t mt-1 pt-2.5" : ""
      }`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${variantStyles[variant]}`}>
        <AnimatedCurrency value={value} />
        {sub && (
          <span className="ml-1 text-[11px] text-muted-foreground">{sub}</span>
        )}
      </span>
    </div>
  )
}

/* ── placeholder ──────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div className="rounded-full bg-muted p-4">
        <Calculator className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Enter your salary to calculate</p>
        <p className="text-xs text-muted-foreground mt-1">
          Results appear here in real-time
        </p>
      </div>
    </motion.div>
  )
}

/* ── main component ───────────────────────────────────── */
interface ResultsPanelProps {
  results: CalculationResults | null
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results || results.basicSalary === 0) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6">
          <EmptyState />
        </CardContent>
      </Card>
    )
  }

  const {
    regularMonthlyGrossIncome,
    monthlyNetSalary,
    nisContribution,
    incomeTax,
    personalAllowance,
    taxableIncome,
    childAllowance,
    actualInsuranceDeduction,
    loanPayment,
    creditUnionDeduction,
    monthlyGratuityAccrual,
    sixMonthGratuity,
    monthSixTotal,
    monthTwelveTotal,
    vacationAllowance,
    annualGrossIncome,
    annualTaxPayable,
    annualNisContribution,
    annualNetSalary,
    annualGratuityTotal,
    annualTotal,
    paymentFrequency,
    grossIncomeForTaxableCalculation,
    overtimeAllowance,
    secondJobAllowance,
    nonTaxableAllowances,
  } = results

  const freqLabel = PAYMENT_FREQUENCIES[paymentFrequency].periodLabel
  const effectiveTaxRate = annualGrossIncome > 0
    ? (annualTaxPayable / annualGrossIncome) * 100
    : 0
  const takeHomeRate = annualGrossIncome > 0
    ? (annualNetSalary / annualGrossIncome) * 100
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Hero summary */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide">
                Net Take-Home ({freqLabel})
              </p>
              <p className="text-3xl font-bold mt-1 tabular-nums">
                {formatCurrency(monthlyNetSalary)}
              </p>
            </div>
            <div className="rounded-xl bg-white/15 p-2.5">
              <Wallet className="size-5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-[10px] opacity-70 uppercase tracking-wide">Gross</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(regularMonthlyGrossIncome)}
              </p>
            </div>
            <div>
              <p className="text-[10px] opacity-70 uppercase tracking-wide">PAYE</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(incomeTax)}
              </p>
            </div>
            <div>
              <p className="text-[10px] opacity-70 uppercase tracking-wide">Eff. Rate</p>
              <p className="text-sm font-semibold">{formatPercent(effectiveTaxRate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed tabs */}
      <Tabs defaultValue="breakdown">
        <TabsList className="w-full">
          <TabsTrigger value="breakdown" className="flex-1">Breakdown</TabsTrigger>
          <TabsTrigger value="special" className="flex-1">Special Months</TabsTrigger>
          <TabsTrigger value="annual" className="flex-1">Annual</TabsTrigger>
          <TabsTrigger value="charts" className="flex-1">Charts</TabsTrigger>
        </TabsList>

        {/* Breakdown tab */}
        <TabsContent value="breakdown">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BadgeDollarSign className="size-4 text-primary" />
                Pay Statement
              </CardTitle>
              <CardDescription>
                {PAYMENT_FREQUENCIES[paymentFrequency].label} — calculated{" "}
                {PAYMENT_FREQUENCIES[paymentFrequency].periodLabel}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Income */}
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Gross Income
              </p>
              <StatRow label="Basic Salary" value={results.basicSalary} />
              {results.taxableAllowances > 0 && (
                <StatRow label="Taxable Allowances" value={results.taxableAllowances} />
              )}
              {nonTaxableAllowances > 0 && (
                <StatRow label="Non-Taxable Allowances" value={nonTaxableAllowances} />
              )}
              {results.overtimeIncome > 0 && (
                <StatRow label="Overtime" value={results.overtimeIncome} />
              )}
              {results.secondJobIncome > 0 && (
                <StatRow label="Second Job" value={results.secondJobIncome} />
              )}
              <StatRow
                label="Total Gross"
                value={regularMonthlyGrossIncome}
                variant="total"
              />

              <Separator className="my-3" />

              {/* Tax deductions */}
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Tax Deductions
              </p>
              {(overtimeAllowance > 0 || secondJobAllowance > 0) && (
                <StatRow
                  label="Statutory OT/2nd-Job Allowance"
                  value={-(overtimeAllowance + secondJobAllowance)}
                  variant="deduction"
                />
              )}
              <StatRow
                label="Personal Allowance"
                value={-personalAllowance}
                variant="deduction"
              />
              {nisContribution > 0 && (
                <StatRow
                  label="NIS (5.6%)"
                  value={-nisContribution}
                  variant="deduction"
                />
              )}
              {childAllowance > 0 && (
                <StatRow
                  label={`Child Allowance (×${results.childCount})`}
                  value={-childAllowance}
                  variant="deduction"
                />
              )}
              {actualInsuranceDeduction > 0 && (
                <StatRow
                  label="Insurance Deduction"
                  value={-actualInsuranceDeduction}
                  variant="deduction"
                />
              )}
              <StatRow
                label="Chargeable Income"
                value={taxableIncome}
                variant="total"
              />
              <StatRow
                label="Income Tax (PAYE)"
                value={-incomeTax}
                variant="deduction"
              />

              {(loanPayment > 0 || creditUnionDeduction > 0) && (
                <>
                  <Separator className="my-3" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Other Deductions
                  </p>
                  {loanPayment > 0 && (
                    <StatRow label="Loan Payment" value={-loanPayment} variant="deduction" />
                  )}
                  {creditUnionDeduction > 0 && (
                    <StatRow
                      label="Credit Union"
                      value={-creditUnionDeduction}
                      variant="deduction"
                    />
                  )}
                </>
              )}

              <Separator className="my-3" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">Net Take-Home</span>
                <span className="text-xl font-bold text-primary tabular-nums">
                  <AnimatedCurrency value={monthlyNetSalary} />
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="new" className="text-[10px]">
                  {formatPercent(takeHomeRate)} take-home
                </Badge>
                {monthlyGratuityAccrual > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{formatCurrency(monthlyGratuityAccrual)}/mo gratuity accrual
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special months tab */}
        <TabsContent value="special">
          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  Month 6 — Gratuity Payment
                </CardTitle>
                <CardDescription>Semi-annual gratuity disbursement</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <StatRow label="Monthly Net Salary" value={monthlyNetSalary} />
                <StatRow label="6-Month Gratuity" value={sixMonthGratuity} />
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">Total Month 6</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    <AnimatedCurrency value={monthSixTotal} />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Month 12 — Year-End Package
                </CardTitle>
                <CardDescription>
                  Gratuity + vacation allowance disbursement
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <StatRow label="Monthly Net Salary" value={monthlyNetSalary} />
                <StatRow label="6-Month Gratuity" value={sixMonthGratuity} />
                {vacationAllowance > 0 && (
                  <StatRow label="Vacation Allowance" value={vacationAllowance} />
                )}
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">Total Month 12</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    <AnimatedCurrency value={monthTwelveTotal} />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Annual tab */}
        <TabsContent value="annual">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                Annual Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <StatRow label="Annual Gross" value={annualGrossIncome} />
              <StatRow label="Annual NIS" value={-annualNisContribution} variant="deduction" />
              <StatRow label="Annual Income Tax" value={-annualTaxPayable} variant="deduction" />
              <StatRow label="Annual Net Salary" value={annualNetSalary} variant="total" />
              {annualGratuityTotal > 0 && (
                <StatRow label="Annual Gratuity (×2)" value={annualGratuityTotal} />
              )}
              {vacationAllowance > 0 && (
                <StatRow label="Vacation Allowance" value={vacationAllowance} />
              )}
              <Separator className="my-3" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">Total Annual Package</span>
                <span className="text-xl font-bold text-primary tabular-nums">
                  <AnimatedCurrency value={annualTotal} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Effective Tax Rate</p>
                  <p className="text-lg font-bold text-primary mt-0.5">
                    {formatPercent(effectiveTaxRate)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Take-Home Rate</p>
                  <p className="text-lg font-bold text-primary mt-0.5">
                    {formatPercent(takeHomeRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts tab */}
        <TabsContent value="charts">
          <div className="space-y-4">
            <TaxBreakdownChart results={results} />
            <AnnualCashflowChart results={results} />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
