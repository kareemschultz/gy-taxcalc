"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrencyCompact } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-1 space-y-1 text-sm">
        {payload.map((entry) => (
          <div key={entry.dataKey?.toString()} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{entry.name || entry.dataKey}</span>
            <span className="tabular-nums">{formatCurrencyCompact(Number(entry.value || 0))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WaterfallChart({ results }: { results: CalculationResults }) {
  const data = [
    { name: "Gross", value: Math.max(0, results.regularMonthlyGrossIncome), color: "var(--color-chart-1)" },
    { name: "NIS", value: -Math.max(0, results.nisContribution), color: "var(--color-chart-4)" },
    { name: "PAYE", value: -Math.max(0, results.incomeTax), color: "var(--color-chart-5)" },
    { name: "Other deductions", value: -(Math.max(0, results.loanPayment) + Math.max(0, results.creditUnionDeduction)), color: "var(--color-chart-3)" },
    { name: "Net", value: Math.max(0, results.monthlyNetSalary), color: "var(--color-chart-2)" },
  ]

  const bridge = data.map((item, index) => {
    if (index === 0) return { ...item, base: 0 }
    if (item.name === "Net") return { ...item, base: 0 }
    const previous = data.slice(0, index).reduce((sum, entry) => sum + entry.value, 0)
    return { ...item, base: previous + Math.min(0, item.value) * -1 }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Card className="bg-muted/30 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Gross to Net Waterfall</CardTitle>
          <CardDescription className="text-xs">Shows where the monthly pay is reduced before take-home</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={bridge} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<ChartTooltip />} />
                {bridge.map((entry) => (
                  <Bar
                    key={entry.name}
                    dataKey="value"
                    data={[entry]}
                    fill={entry.color}
                    stackId="a"
                    radius={[6, 6, 0, 0]}
                  >
                    <Cell fill={entry.color} />
                  </Bar>
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Gross income</p>
              <p className="mt-1 text-sm font-semibold">{formatCurrencyCompact(results.regularMonthlyGrossIncome)}</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total deductions</p>
              <p className="mt-1 text-sm font-semibold">{formatCurrencyCompact(results.nisContribution + results.incomeTax + results.loanPayment + results.creditUnionDeduction)}</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Net pay</p>
              <p className="mt-1 text-sm font-semibold text-primary">{formatCurrencyCompact(results.monthlyNetSalary)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
