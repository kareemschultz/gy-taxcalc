"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calculator,
  Calendar,
  BadgeDollarSign,
  ScrollText,
  BookOpen,
  Coins,
  Gift,
  PackageOpen,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { formatCurrency, formatPercent } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"
import { PAYMENT_FREQUENCIES } from "@/lib/tax/constants"
import { TaxBreakdownChart } from "./TaxBreakdownChart"
import { AnnualCashflowChart } from "./AnnualCashflowChart"
import { TaxBracketChart } from "./TaxBracketChart"
import { WaterfallChart } from "./WaterfallChart"
import type { CalculatorInputs as TCalcInputs } from "@/lib/tax/types"
import { SalaryIncreaseSection } from "./SalaryIncreaseSection"
import { ResultActions } from "@/components/results/result-actions"
import { InfoCard } from "./InfoCard"
import { SummaryCard } from "./SummaryCard"

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
  baseInputs?: TCalcInputs | null
}

export function ResultsPanel({ results, baseInputs }: ResultsPanelProps) {
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
    vacationAllowance,
    annualGrossIncome,
    annualTaxPayable,
    annualNisContribution,
    annualNetSalary,
    annualGratuityTotal,
    paymentFrequency,
    overtimeAllowance,
    secondJobAllowance,
    nonTaxableAllowances,
  } = results

  const freqLabel = PAYMENT_FREQUENCIES[paymentFrequency].periodLabel
  const resolvedVacationAllowance = baseInputs?.vacationAllowance ?? vacationAllowance
  const resolvedMonthTwelveTotal = monthlyNetSalary + sixMonthGratuity + resolvedVacationAllowance
  const resolvedAnnualTotal = annualNetSalary + annualGratuityTotal + resolvedVacationAllowance
  const effectiveTaxRate = annualGrossIncome > 0
    ? (annualTaxPayable / annualGrossIncome) * 100
    : 0
  const takeHomeRate = annualGrossIncome > 0
    ? (annualNetSalary / annualGrossIncome) * 100
    : 0
  const nisRate = annualGrossIncome > 0
    ? (annualNisContribution / annualGrossIncome) * 100
    : 0

    return (
      <motion.div
      id="salary-results"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Hero summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/25 overflow-hidden relative">
          {/* subtle glow orb */}
          <div className="pointer-events-none absolute -top-8 -right-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <CardContent className="pt-6 pb-5 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold opacity-75 uppercase tracking-widest">
                  Net Take-Home ({freqLabel})
                </p>
                <p className="text-4xl font-bold mt-1.5 tabular-nums">
                  {formatCurrency(monthlyNetSalary)}
                </p>
              </div>
              <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
                <Wallet className="size-5" />
              </div>
            </div>
            {/* Take-home progress bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] opacity-60 uppercase tracking-wide">Take-home rate</span>
                <span className="text-[11px] font-semibold opacity-90">{formatPercent(takeHomeRate)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, takeHomeRate)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/20">
              <div>
                <p className="text-[9px] opacity-60 uppercase tracking-wide">Gross</p>
                <p className="text-xs font-semibold tabular-nums mt-0.5">
                  {formatCurrency(regularMonthlyGrossIncome)}
                </p>
              </div>
              <div>
                <p className="text-[9px] opacity-60 uppercase tracking-wide">NIS</p>
                <p className="text-xs font-semibold tabular-nums mt-0.5">
                  {formatCurrency(nisContribution)}
                </p>
              </div>
              <div>
                <p className="text-[9px] opacity-60 uppercase tracking-wide">PAYE</p>
                <p className="text-xs font-semibold tabular-nums mt-0.5">
                  {formatCurrency(incomeTax)}
                </p>
              </div>
              <div>
                <p className="text-[9px] opacity-60 uppercase tracking-wide">Eff. Rate</p>
                <p className="text-xs font-semibold mt-0.5">{formatPercent(effectiveTaxRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ResultActions
        fileName="salary-summary.txt"
        title="Salary Summary"
        subtitle="A clean export of the current salary, deductions, and package estimate."
        summary={[
          { label: "Monthly Net", value: formatCurrency(monthlyNetSalary) },
          { label: "Gross Income", value: formatCurrency(regularMonthlyGrossIncome) },
          { label: "PAYE", value: formatCurrency(incomeTax) },
          { label: "Annual Package", value: formatCurrency(resolvedAnnualTotal) },
        ]}
        sections={[
          {
            title: "Monthly Breakdown",
            rows: [
              { label: "Basic Salary", value: formatCurrency(results.basicSalary), positive: true },
              ...(results.taxableAllowances > 0 ? [{ label: "Taxable Allowances", value: formatCurrency(results.taxableAllowances), positive: true }] : []),
              ...(nonTaxableAllowances > 0 ? [{ label: "Non-Taxable Allowances", value: formatCurrency(nonTaxableAllowances), positive: true }] : []),
              ...(results.qualificationAllowance > 0 ? [{ label: "Qualification Allowance", value: formatCurrency(results.qualificationAllowance), positive: true }] : []),
              ...(results.overtimeIncome > 0 ? [{ label: "Overtime Income", value: formatCurrency(results.overtimeIncome), positive: true }] : []),
              ...(results.secondJobIncome > 0 ? [{ label: "Second Job Income", value: formatCurrency(results.secondJobIncome), positive: true }] : []),
              { label: "Gross Income", value: formatCurrency(regularMonthlyGrossIncome), total: true },
              { label: "Personal Allowance (Free Pay)", value: `−${formatCurrency(personalAllowance)}`, negative: true },
              { label: "NIS Contribution (5.6%)", value: `−${formatCurrency(nisContribution)}`, negative: true },
              ...(results.childAllowance > 0 ? [{ label: `Child Allowance (×${results.childCount})`, value: `−${formatCurrency(results.childAllowance)}`, negative: true }] : []),
              ...(results.actualInsuranceDeduction > 0 ? [{ label: "Insurance Premium", value: `−${formatCurrency(results.actualInsuranceDeduction)}`, negative: true }] : []),
              ...(results.overtimeAllowance > 0 ? [{ label: "Overtime Allowance", value: `−${formatCurrency(results.overtimeAllowance)}`, negative: true }] : []),
              { label: "Chargeable Income", value: formatCurrency(results.taxableIncome) },
              { label: "Income Tax (PAYE)", value: `−${formatCurrency(incomeTax)}`, negative: true },
              ...(results.creditUnionDeduction > 0 ? [{ label: "Credit Union Deduction", value: `−${formatCurrency(results.creditUnionDeduction)}`, negative: true }] : []),
              ...(results.loanPayment > 0 ? [{ label: "Loan Payment", value: `−${formatCurrency(results.loanPayment)}`, negative: true }] : []),
              { label: "Monthly Net Take-Home", value: formatCurrency(monthlyNetSalary), total: true },
            ],
          },
          {
            title: "Annual Package",
            rows: [
              { label: "Annual Gross", value: formatCurrency(annualGrossIncome), positive: true },
              { label: "Annual NIS", value: `−${formatCurrency(annualNisContribution)}`, negative: true },
              { label: "Annual PAYE", value: `−${formatCurrency(annualTaxPayable)}`, negative: true },
              { label: "Annual Net Salary", value: formatCurrency(annualNetSalary) },
              { label: "Gratuity (2 × 6-month)", value: formatCurrency(annualGratuityTotal), positive: true },
              ...(resolvedVacationAllowance > 0 ? [{ label: "Vacation Allowance", value: formatCurrency(resolvedVacationAllowance), positive: true }] : []),
              { label: "Total Annual Package", value: formatCurrency(resolvedAnnualTotal), total: true },
            ],
          },
          {
            title: "Special Months",
            rows: [
              { label: "Month 6 — Net Pay", value: formatCurrency(monthlyNetSalary) },
              { label: "Month 6 — Gratuity Payment", value: formatCurrency(sixMonthGratuity), positive: true },
              { label: "Month 6 — Total", value: formatCurrency(monthSixTotal), total: true },
              { label: "Month 12 — Net Pay", value: formatCurrency(monthlyNetSalary) },
              { label: "Month 12 — Gratuity Payment", value: formatCurrency(sixMonthGratuity), positive: true },
              ...(resolvedVacationAllowance > 0 ? [{ label: "Month 12 — Vacation Allowance", value: formatCurrency(resolvedVacationAllowance), positive: true }] : []),
              { label: "Month 12 — Total", value: formatCurrency(resolvedMonthTwelveTotal), total: true },
            ],
          },
        ]}
        lines={[
          `Net take-home: ${formatCurrency(monthlyNetSalary)}`,
          `Gross income: ${formatCurrency(regularMonthlyGrossIncome)}`,
          `PAYE: ${formatCurrency(incomeTax)}`,
          `Annual package: ${formatCurrency(resolvedAnnualTotal)}`,
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Annual Package"
          value={formatCurrency(resolvedAnnualTotal)}
          icon={<PackageOpen className="size-3.5" />}
          variant="blue"
          breakdown={[
            { label: "Net salary", value: formatCurrency(annualNetSalary) },
            { label: "Gratuity", value: formatCurrency(annualGratuityTotal) },
            { label: "Vacation", value: resolvedVacationAllowance > 0 ? formatCurrency(resolvedVacationAllowance) : "—" },
          ]}
        />
        <SummaryCard
          label="Month 6 Total"
          value={formatCurrency(monthSixTotal)}
          icon={<Coins className="size-3.5" />}
          variant="teal"
          breakdown={[
            { label: "Net pay", value: formatCurrency(monthlyNetSalary) },
            { label: "Gratuity", value: formatCurrency(sixMonthGratuity), highlight: true },
          ]}
        />
        <SummaryCard
          label="Month 12 Total"
          value={formatCurrency(resolvedMonthTwelveTotal)}
          icon={<Gift className="size-3.5" />}
          variant="violet"
          breakdown={[
            { label: "Net pay", value: formatCurrency(monthlyNetSalary) },
            { label: "Gratuity", value: formatCurrency(sixMonthGratuity) },
            { label: "Vacation", value: resolvedVacationAllowance > 0 ? formatCurrency(resolvedVacationAllowance) : "—", highlight: resolvedVacationAllowance > 0 },
          ]}
        />
        <SummaryCard
          label="Monthly Gratuity"
          value={formatCurrency(monthlyGratuityAccrual)}
          icon={<TrendingUp className="size-3.5" />}
          variant="amber"
          breakdown={[
            { label: "Rate", value: `${results.gratuityRate}%` },
            { label: "Annual total", value: formatCurrency(annualGratuityTotal) },
          ]}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card className="border-dashed bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="size-4 text-primary" />
            Policy Guide &amp; Updates
          </CardTitle>
          <CardDescription>
            Keep up with 2026 rates, allowances, and release notes as the rules change.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  2026 Rates
                </Badge>
                <Badge variant="new" className="text-[10px] uppercase tracking-wide">
                  Track
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  GRA Updates
                </Badge>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>25% PAYE on taxable income up to GYD 280,000 per month.</li>
                <li>35% PAYE above the GYD 280,000 threshold.</li>
                <li>Personal allowance remains GYD 140,000 monthly or one-third of balance.</li>
                <li>Qualification allowances now include ACCA, Master&apos;s, and PhD.</li>
              </ul>
            </div>
            <div className="rounded-xl border bg-background/70 p-3">
              <div className="flex items-center gap-2">
                <ScrollText className="size-4 text-primary" />
                <p className="text-sm font-semibold">Latest release notes</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow the changelog for fixes, policy updates, and UI improvements we add as
                the government publishes new guidance.
              </p>
              <Button asChild size="sm" variant="secondary" className="mt-4 w-full">
                <Link href="/tax-info">Open Policy Guide</Link>
              </Button>
            </div>
          </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed tabs */}
      <Tabs defaultValue="breakdown">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="breakdown" className="min-w-[92px] flex-none sm:flex-1">Breakdown</TabsTrigger>
          <TabsTrigger value="special" className="min-w-[92px] flex-none sm:flex-1">Special Months</TabsTrigger>
          <TabsTrigger value="annual" className="min-w-[92px] flex-none sm:flex-1">Annual</TabsTrigger>
          <TabsTrigger value="charts" className="min-w-[92px] flex-none sm:flex-1">Charts</TabsTrigger>
          <TabsTrigger value="simulator" className="min-w-[92px] flex-none sm:flex-1">Simulator</TabsTrigger>
          <TabsTrigger value="info" className="min-w-[92px] flex-none sm:flex-1">Quick Facts</TabsTrigger>
        </TabsList>
        <SwipeHint />

        {/* Breakdown tab */}
        <TabsContent value="breakdown">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BadgeDollarSign className="size-4 text-primary" />
                Salary Breakdown
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
                <StatRow
                  label="Monthly Non-Taxable Allowances"
                  value={nonTaxableAllowances}
                />
              )}
              {vacationAllowance > 0 && (
                <StatRow
                  label="Vacation Allowance (Annual)"
                  value={vacationAllowance}
                />
              )}
              {results.overtimeIncome > 0 && (
                <StatRow label="Overtime" value={results.overtimeIncome} />
              )}
              {results.secondJobIncome > 0 && (
                <StatRow label="Second Job" value={results.secondJobIncome} />
              )}
              <StatRow
                label="Gross Income Total"
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
                  label="Overtime / Second Job Exemption"
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
                label="Taxable Income"
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
                {resolvedVacationAllowance > 0 ? (
                  <StatRow label="Vacation Allowance" value={resolvedVacationAllowance} />
                ) : (
                  <p className="text-[11px] text-muted-foreground/60 italic py-1">
                    No vacation allowance set — use the <span className="font-medium text-primary">Auto</span> button in Income to fill it
                  </p>
                )}
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">Total Month 12</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    <AnimatedCurrency value={resolvedMonthTwelveTotal} />
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
                Yearly Summary
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
              {resolvedVacationAllowance > 0 && (
                <StatRow label="Vacation Allowance" value={resolvedVacationAllowance} />
              )}
              <Separator className="my-3" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">Total Annual Package</span>
                <span className="text-xl font-bold text-primary tabular-nums">
                  <AnimatedCurrency value={resolvedAnnualTotal} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Tax Rate</p>
                  <p className="text-lg font-bold text-primary mt-0.5">
                    {formatPercent(effectiveTaxRate)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Net Pay Rate</p>
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
            <TaxBracketChart results={results} />
            <WaterfallChart results={results} />
          </div>
        </TabsContent>

        <TabsContent value="simulator">
          {baseInputs ? (
            <SalaryIncreaseSection baseInputs={baseInputs} />
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Enter a basic salary above to use the salary increase simulator.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard title="Tax Rates">
              <p>25% up to GY$280,000 of taxable income.</p>
              <p>35% above GY$280,000.</p>
              <p>2026 reduced rates replaced the previous 28% / 40% bands.</p>
            </InfoCard>

            <InfoCard title="Allowances">
              <p>Personal allowance: GY$140,000 monthly or one-third of balance of income.</p>
              <p>Child allowance: GY$10,000 per child.</p>
              <p>Overtime and second job: first GY$50,000 each is non-taxable.</p>
            </InfoCard>

            <InfoCard title="Deductions">
              <p>NIS: 5.6% capped at GY$280,000 of monthly income.</p>
              <p>Insurance: up to 10% of gross, capped at GY$50,000 monthly.</p>
              <p>Gratuity: default 22.5% of basic salary accrued monthly.</p>
            </InfoCard>

            <InfoCard title="New for 2026" variant="success">
              <p>ACCA allowance: GY$15,000 monthly.</p>
              <p>Master&apos;s allowance: GY$22,000 monthly.</p>
              <p>PhD allowance: GY$32,000 monthly.</p>
            </InfoCard>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
