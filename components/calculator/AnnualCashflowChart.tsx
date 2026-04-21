"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrencyCompact } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const salary = payload.find((entry) => entry.dataKey === "salary")?.value as number | undefined
  const bonus = payload.find((entry) => entry.dataKey === "bonus")?.value as number | undefined
  const total = (salary || 0) + (bonus || 0)

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-1 space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Net salary</span>
          <span className="tabular-nums">{formatCurrencyCompact(salary || 0)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Bonus / gratuity</span>
          <span className="tabular-nums">{formatCurrencyCompact(bonus || 0)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t pt-1">
          <span className="font-medium">Month total</span>
          <span className="font-semibold tabular-nums">{formatCurrencyCompact(total)}</span>
        </div>
      </div>
    </div>
  )
}

export function AnnualCashflowChart({ results }: { results: CalculationResults }) {
  const data = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const isGratuityMonth = month === 6 || month === 12
    const isYearEnd = month === 12

    let total = results.monthlyNetSalary
    let extra = 0
    if (isGratuityMonth) extra += results.sixMonthGratuity
    if (isYearEnd && results.vacationAllowance) extra += results.vacationAllowance

    return {
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      salary: Math.round(total),
      bonus: Math.round(extra),
    }
  })
  const peakMonth = data.reduce((best, item) => {
    const total = item.salary + item.bonus
    return total > best.total ? { month: item.month, total } : best
  }, { month: data[0]?.month ?? "Jan", total: 0 })

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
          <CardTitle className="text-sm">Annual Cash Flow</CardTitle>
          <CardDescription className="text-xs">
            Month-by-month take-home including gratuity peaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatCurrencyCompact}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="salary"
                  stackId="a"
                  fill="var(--color-chart-1)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="bonus"
                  stackId="a"
                  fill="var(--color-chart-4)"
                  radius={[4, 4, 0, 0]}
                />
                <ReferenceLine
                  y={results.monthlyNetSalary}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Peak month</p>
              <p className="mt-1 text-sm font-semibold">{peakMonth.month}</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Why it spikes</p>
              <p className="mt-1 text-sm font-semibold">Gratuity in June and December</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
