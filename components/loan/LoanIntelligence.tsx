"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"
import { ArrowUpRight, BadgeCheck, CircleHelp, Gauge, RotateCcw, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils"
import { buildLoanStrategySummary } from "@/lib/loan/calculator"
import type { LoanInputs, LoanResults, LoanScenarioInsight } from "@/lib/loan/types"

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-4)"]

function CurrencyTooltip({ active, payload, label }: TooltipProps<number, string>) {
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

function MonthsTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-1 space-y-1 text-sm">
        {payload.map((entry) => (
          <div key={entry.dataKey?.toString()} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{entry.name || entry.dataKey}</span>
            <span className="tabular-nums">{Number(entry.value || 0).toFixed(0)} months</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RingCard({ scenario, baselineMonths }: { scenario: LoanScenarioInsight; baselineMonths: number }) {
  const savingsPct = baselineMonths > 0 ? Math.min(100, (scenario.monthsSaved / baselineMonths) * 100) : 0
  const chartData = [
    { name: "Saved", value: Math.max(0, scenario.monthsSaved) },
    { name: "Remaining", value: Math.max(0, baselineMonths - scenario.monthsSaved) },
  ]

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="grid gap-4 pt-5 md:grid-cols-[180px_1fr] md:items-center">
        <div className="relative mx-auto h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={76}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Term cut</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{savingsPct.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">of the payment plan</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold">Best value scenario</p>
            <span className="rounded-full border border-primary/20 bg-background px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
              Recommended
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            A <strong>{formatCurrency(scenario.lumpSum)}</strong> lump sum saves{" "}
            <strong>{scenario.monthsSaved} months</strong> and cuts the payoff date to{" "}
            <strong>{scenario.payoffDate}</strong>.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Months left</p>
              <p className="mt-1 text-sm font-semibold">{scenario.monthsLeft}</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Interest saved</p>
              <p className="mt-1 text-sm font-semibold">{formatCurrency(scenario.interestSaved)}</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Efficiency</p>
              <p className="mt-1 text-sm font-semibold">
                {scenario.efficiencyScore > 0 ? `${(scenario.efficiencyScore * 1_000_000).toFixed(1)} mo / $1M` : "—"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ScenarioRow({
  scenario,
  selected,
  onSelect,
}: {
  scenario: LoanScenarioInsight
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "grid w-full grid-cols-2 gap-3 border-b px-4 py-3 text-left transition-colors sm:grid-cols-[1fr_1fr_1fr_1fr_1fr]",
        selected ? "bg-primary/5" : "hover:bg-muted/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold tabular-nums">{formatCurrency(scenario.lumpSum)}</span>
        {scenario.recommended ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Best value
          </span>
        ) : null}
        {scenario.tiedWith ? (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
            Same payoff as {formatCurrency(scenario.tiedWith)}
          </span>
        ) : null}
      </div>
      <div className="tabular-nums text-sm sm:text-right">{scenario.monthsLeft} mo</div>
      <div className="tabular-nums text-sm sm:text-right">-{scenario.monthsSaved} mo</div>
      <div className="tabular-nums text-sm sm:text-right">{formatCurrency(scenario.interestSaved)}</div>
      <div className="text-sm text-muted-foreground sm:text-right">
        {selected ? "Selected for preview" : scenario.payoffDate}
      </div>
    </button>
  )
}

export function LoanIntelligence({
  inputs,
  result,
}: {
  inputs: LoanInputs
  result: LoanResults
}) {
  const summary = React.useMemo(
    () =>
      buildLoanStrategySummary(inputs, {
        frequencyMonths:
          inputs.periodicLumpFrequency === "custom"
            ? 6
            : inputs.periodicLumpFrequency,
        startMonth: inputs.periodicLumpStartMonth || 2,
      }),
    [inputs]
  )
  const [selectedLumpSum, setSelectedLumpSum] = React.useState<number | null>(summary.selectedScenario?.lumpSum ?? null)

  React.useEffect(() => {
    setSelectedLumpSum(summary.selectedScenario?.lumpSum ?? null)
  }, [summary.selectedScenario?.lumpSum, inputs.loanType, inputs.termMonths, inputs.annualRatePct, inputs.principalGYD])

  const activeScenario =
    summary.scenarios.find((scenario) => scenario.lumpSum === selectedLumpSum) ??
    summary.selectedScenario ??
    summary.scenarios[0]

  const savingsChartData = summary.scenarios.map((scenario) => ({
    label: formatCurrencyCompact(scenario.lumpSum),
    saved: scenario.interestSaved,
  }))

  const timelineChartData = summary.scenarios.map((scenario) => ({
    label: formatCurrencyCompact(scenario.lumpSum),
    monthsLeft: scenario.monthsLeft,
  }))

  const bestValue = summary.selectedScenario
  const hasTie = summary.scenarios.some((scenario) => scenario.tiedWith)

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Gauge className="size-4 text-primary" />
            Loan Intelligence
          </CardTitle>
          <CardDescription>
            Compare lump-sum strategies, see which amount gives the best value, and spot when a larger payment does
            not buy you a shorter payoff.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1">
              <BadgeCheck className="size-3.5 text-primary" />
              Monthly strategy view
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1">
              <RotateCcw className="size-3.5 text-muted-foreground" />
              Scenario analysis uses a recurring lump sum
            </span>
            {hasTie ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-600">
                <CircleHelp className="size-3.5" />
                At least one amount ties on payoff date
              </span>
            ) : null}
          </div>
          {bestValue ? <RingCard scenario={activeScenario} baselineMonths={summary.baselineMonths} /> : null}
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Baseline term</p>
              <p className="mt-1 text-sm font-semibold">{summary.baselineMonths} months</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Baseline interest</p>
              <p className="mt-1 text-sm font-semibold">{formatCurrency(summary.baselineInterest)}</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Best value</p>
              <p className="mt-1 text-sm font-semibold">
                {bestValue ? formatCurrency(bestValue.lumpSum) : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">What-if lump sum matrix</CardTitle>
          <CardDescription>
            Compare a recurring lump sum every{" "}
            {inputs.periodicLumpFrequency === "custom" ? `${inputs.periodicLumpCustomInterval}` : `${inputs.periodicLumpFrequency}`}{" "}
            months starting at month {inputs.periodicLumpStartMonth || 2}.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-xl border bg-background p-0">
          <div className="grid grid-cols-2 gap-3 border-b bg-muted/30 px-4 py-3 text-[10px] uppercase tracking-wide text-muted-foreground sm:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
            <div>Lump Sum</div>
            <div className="text-right">Months Left</div>
            <div className="text-right">Time Saved</div>
            <div className="text-right">Interest Saved</div>
            <div className="text-right">Payoff Date</div>
          </div>
          <div className="divide-y">
            {summary.scenarios.map((scenario) => (
              <ScenarioRow
                key={scenario.lumpSum}
                scenario={scenario}
                selected={scenario.lumpSum === activeScenario.lumpSum}
                onSelect={() => setSelectedLumpSum(scenario.lumpSum)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="bg-muted/20 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Interest Saved by Scenario</CardTitle>
              <CardDescription>Higher bars show stronger savings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={56} />
                    <Tooltip content={<CurrencyTooltip />} />
                    <Bar dataKey="saved" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="bg-muted/20 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Payoff Timeline</CardTitle>
              <CardDescription>Shorter bars mean a quicker finish.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineChartData} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis dataKey="label" type="category" tick={{ fontSize: 10 }} width={64} />
                    <Tooltip content={<MonthsTooltip />} />
                    <Bar dataKey="monthsLeft" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUpRight className="size-4 text-primary" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {bestValue ? (
            <p className="text-sm text-muted-foreground">
              The strongest value in this view is <strong>{formatCurrency(bestValue.lumpSum)}</strong>. It saves{" "}
              <strong>{bestValue.monthsSaved} months</strong> and reduces interest by{" "}
              <strong>{formatCurrency(bestValue.interestSaved)}</strong>.
            </p>
          ) : null}
          {activeScenario.tiedWith ? (
            <p className="text-sm text-amber-600">
              This scenario ties with <strong>{formatCurrency(activeScenario.tiedWith)}</strong> on payoff timing.
              If you want the same finish date for less cash outlay, use the smaller amount.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              The selected scenario does not tie with a cheaper option at the same payoff date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
