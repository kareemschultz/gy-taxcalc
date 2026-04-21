"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
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

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const data = item.payload as { name: string; value: number }

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{data.name}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{formatCurrency(data.value)}</p>
    </div>
  )
}

export function TaxBreakdownChart({ results }: { results: CalculationResults }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const data = [
    { name: "Net Take-Home", value: Math.max(0, results.monthlyNetSalary) },
    { name: "Income Tax (PAYE)", value: results.incomeTax },
    { name: "NIS", value: results.nisContribution },
    ...(results.loanPayment + results.creditUnionDeduction > 0
      ? [{ name: "Deductions", value: results.loanPayment + results.creditUnionDeduction }]
      : []),
  ].filter((d) => d.value > 0)
  const grossMonthly = Math.max(0, results.annualGrossIncome / 12)
  const takeHomeRate = grossMonthly > 0 ? (results.monthlyNetSalary / grossMonthly) * 100 : 0
  const largestDeduction = [...data]
    .filter((item) => item.name !== "Net Take-Home")
    .sort((a, b) => b.value - a.value)[0]

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
          <CardTitle className="text-sm">Monthly Mix</CardTitle>
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
                  activeIndex={activeIndex}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(0)}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="transparent"
                      opacity={activeIndex === index ? 1 : 0.75}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Take-home share</p>
              <p className="mt-1 text-lg font-semibold text-primary">{takeHomeRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Largest deduction</p>
              <p className="mt-1 text-sm font-semibold">{largestDeduction?.name ?? "None"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
