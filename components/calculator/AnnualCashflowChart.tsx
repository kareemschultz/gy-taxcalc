"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrencyCompact } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"

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

  return (
    <Card className="bg-muted/30">
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
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrencyCompact(value),
                  name === "salary" ? "Net Salary" : "Bonus",
                ]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "11px",
                }}
              />
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
      </CardContent>
    </Card>
  )
}
