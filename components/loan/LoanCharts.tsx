"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils"
import { compareBanks, resolveLoanPrincipal } from "@/lib/loan/calculator"
import type { LoanInputs, LoanResults } from "@/lib/loan/types"

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
]

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Card className="bg-muted/20 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <div className="h-56">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-1 space-y-1 text-sm">
        {payload.map((entry) => (
          <div key={entry.dataKey?.toString()} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{entry.name || entry.dataKey}</span>
            <span className="tabular-nums">{formatCurrency(Number(entry.value || 0))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoanCharts({
  inputs,
  result,
}: {
  inputs: LoanInputs
  result: LoanResults
}) {
  const principal = resolveLoanPrincipal(inputs)
  const bankData = compareBanks(principal, inputs.termMonths).map((bank) => {
    const totalInterest =
      bank.minRate === bank.maxRate
        ? bank.totalInterestMin
        : (bank.totalInterestMin + bank.totalInterestMax) / 2
    return {
      name: bank.shortName,
      interest: Math.max(0, totalInterest),
    }
  })

  const principalInterestData = [
    { name: "Principal", value: result.amortizationSchedule.reduce((sum, row) => sum + row.principal, 0) },
    { name: "Interest", value: result.amortizationSchedule.reduce((sum, row) => sum + row.interest, 0) },
  ]

  const balanceData = result.amortizationSchedule.map((row) => ({
    period: row.period,
    balance: Math.round(row.balance),
  }))

  const annualData = result.yearlySchedule.map((row) => ({
    year: `Y${row.year}`,
    principal: Math.round(row.totalPrincipal),
    interest: Math.round(row.totalInterest),
  }))
  const topBank = bankData.slice().sort((a, b) => a.interest - b.interest)[0]
  const totalInterestPct =
    result.totalPaid > 0 ? (result.totalInterest / result.totalPaid) * 100 : 0

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Best lender in view</p>
          <p className="mt-1 text-sm font-semibold">{topBank?.name ?? "N/A"}</p>
        </div>
        <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Interest share</p>
          <p className="mt-1 text-sm font-semibold">{totalInterestPct.toFixed(1)}% of total paid</p>
        </div>
        <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payoff style</p>
          <p className="mt-1 text-sm font-semibold">
            {inputs.paymentFrequency === "biweekly" ? "Faster with bi-weekly pay" : "Standard monthly"}
          </p>
        </div>
      </div>

      <ChartCard title="Principal vs. Interest" description="How your payments are split across the loan">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={principalInterestData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {principalInterestData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Balance Over Time" description="Outstanding balance by period">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={balanceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={formatCurrencyCompact}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Principal vs. Interest Per Year" description="Annual amortization mix">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={annualData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={formatCurrencyCompact}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="principal" stackId="a" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interest" stackId="a" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Total Interest by Lender" description="Estimated interest across lender presets">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bankData}
            layout="vertical"
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="interest" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
