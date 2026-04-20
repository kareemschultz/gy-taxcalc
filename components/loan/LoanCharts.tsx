"use client"

import * as React from "react"
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
    <Card className="bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="h-56">{children}</div>
      </CardContent>
    </Card>
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

  return (
    <div className="grid gap-4">
      <ChartCard title="Principal vs. Interest" description="How your payments are split across the loan">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={principalInterestData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {principalInterestData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "11px",
              }}
            />
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
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "11px",
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
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
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "11px",
              }}
            />
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
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="interest" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
