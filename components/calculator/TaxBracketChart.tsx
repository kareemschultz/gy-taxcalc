"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts"
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

export function TaxBracketChart({ results }: { results: CalculationResults }) {
  const allowance = Math.max(0, results.personalAllowance)
  const nonTaxable = Math.max(0, results.overtimeAllowance + results.secondJobAllowance)
  const chargeable = Math.max(0, results.taxableIncome)
  // The 25%/35% split point is per-frequency, not a fixed 280,000 (that's
  // only the monthly threshold). See gy-taxcalc-bugs.md finding #8.
  const taxThreshold = results.frequencyConfig.taxThreshold
  const taxable25 = Math.min(chargeable, taxThreshold)
  const taxable35 = Math.max(0, chargeable - taxThreshold)

  const data = [
    { name: "Personal allowance", value: allowance, fill: "var(--color-chart-3)" },
    { name: "Non-taxable extras", value: nonTaxable, fill: "var(--color-chart-4)" },
    { name: "25% bracket", value: taxable25, fill: "var(--color-chart-1)" },
    { name: "35% bracket", value: taxable35, fill: "var(--color-chart-4)" },
  ].filter((item) => item.value > 0)

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const taxShare = total > 0 ? ((taxable25 + taxable35) / total) * 100 : 0

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
          <CardTitle className="text-sm">Tax Brackets</CardTitle>
          <CardDescription className="text-xs">How the current month splits across allowance and PAYE bands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Taxable share</p>
              <p className="mt-1 text-lg font-semibold text-primary">{taxShare.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-background/80">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Allowance share</p>
              <p className="mt-1 text-sm font-semibold">{formatCurrencyCompact(allowance + nonTaxable)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
