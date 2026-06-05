"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
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

// Pop-out active shape — expands the hovered slice + adds a halo ring
function ActiveSlice(props: unknown) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props as {
      cx: number; cy: number; innerRadius: number; outerRadius: number
      startAngle: number; endAngle: number; fill: string
    }
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={(outerRadius as number) + 10}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={(outerRadius as number) + 13}
        outerRadius={(outerRadius as number) + 17}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        opacity={0.35}
      />
    </g>
  )
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as { name: string; value: number; pct: number }
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{d.name}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{formatCurrency(d.value)}</p>
      <p className="text-[11px] text-muted-foreground">{d.pct.toFixed(1)}%</p>
    </div>
  )
}

function LegendRow({
  name, value, pct, color, delay,
}: { name: string; value: number; pct: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="space-y-1"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
          <span className="text-[11px] truncate text-muted-foreground">{name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] tabular-nums text-foreground">{formatCurrency(value)}</span>
          <span className="text-[11px] font-bold tabular-nums w-10 text-right" style={{ color }}>
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.15, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  )
}

export function TaxBreakdownChart({ results }: { results: CalculationResults }) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

  const raw = [
    { name: "Net Take-Home", value: Math.max(0, results.monthlyNetSalary) },
    { name: "Income Tax (PAYE)", value: results.incomeTax },
    { name: "NIS", value: results.nisContribution },
    ...(results.loanPayment + results.creditUnionDeduction > 0
      ? [{ name: "Deductions", value: results.loanPayment + results.creditUnionDeduction }]
      : []),
  ].filter((d) => d.value > 0)

  const total = raw.reduce((s, d) => s + d.value, 0)
  const data = raw.map((d) => ({ ...d, pct: total > 0 ? (d.value / total) * 100 : 0 }))

  const grossMonthly = Math.max(0, results.annualGrossIncome / 12)
  const takeHomeRate = grossMonthly > 0 ? (results.monthlyNetSalary / grossMonthly) * 100 : 0
  const largestDeduction = [...data]
    .filter((d) => d.name !== "Net Take-Home")
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
          {/* Pie chart */}
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={ActiveSlice}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={650}
                  animationEasing="ease-out"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="transparent"
                      style={{
                        opacity: activeIndex === undefined || activeIndex === index ? 1 : 0.5,
                        transition: "opacity 0.15s",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Animated progress-bar legend */}
          <div className="mt-4 space-y-3">
            {data.map((item, i) => (
              <LegendRow
                key={item.name}
                name={item.name}
                value={item.value}
                pct={item.pct}
                color={COLORS[i % COLORS.length]}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
