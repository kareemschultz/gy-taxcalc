"use client"

import * as React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { CalculationResults } from "@/lib/tax/types"

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-5)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
]

export function TaxBreakdownChart({ results }: { results: CalculationResults }) {
  const data = [
    { name: "Net Take-Home", value: Math.max(0, results.monthlyNetSalary) },
    { name: "Income Tax (PAYE)", value: results.incomeTax },
    { name: "NIS", value: results.nisContribution },
    ...(results.loanPayment + results.creditUnionDeduction > 0
      ? [{ name: "Deductions", value: results.loanPayment + results.creditUnionDeduction }]
      : []),
  ].filter((d) => d.value > 0)

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Gross Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
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
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
