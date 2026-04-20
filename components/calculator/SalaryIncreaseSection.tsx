"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import { calculateSalaryIncrease, performCalculations } from "@/lib/tax/calculator"
import type { CalculatorInputs as TCalcInputs } from "@/lib/tax/types"
import type { SalaryIncreaseResults } from "@/lib/tax/types"
import { COMMON_SALARY_INCREASES } from "@/lib/tax/constants"

interface SalaryIncreaseSectionProps {
  baseInputs: TCalcInputs
}

function DeltaBadge({ value, label }: { value: number; label: string }) {
  const positive = value >= 0
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-xs font-medium flex items-center gap-1",
          positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
        )}
      >
        {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        {positive ? "+" : ""}
        {formatCurrency(value)}
      </span>
    </div>
  )
}

export function SalaryIncreaseSection({ baseInputs }: SalaryIncreaseSectionProps) {
  const [open, setOpen] = React.useState(false)
  const [pct, setPct] = React.useState(5)
  const [isTaxable, setIsTaxable] = React.useState(true)
  const [retroMonths, setRetroMonths] = React.useState(0)
  const [isGratuityMonth, setIsGratuityMonth] = React.useState(false)

  const results = React.useMemo<SalaryIncreaseResults | null>(() => {
    if (baseInputs.basicSalary === 0) return null
    const baseResults = performCalculations(baseInputs)
    return calculateSalaryIncrease(baseResults, { increasePercentage: pct, isTaxable, retroactiveMonths: retroMonths, isGratuityMonth })
  }, [baseInputs, pct, isTaxable, retroMonths, isGratuityMonth])

  if (baseInputs.basicSalary === 0) return null

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium bg-card hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          <TrendingUp className="size-3.5 text-primary" />
          Salary Increase Simulator
        </span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="sim"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="rounded-t-none border-t-0 bg-muted/20">
              <CardContent className="pt-4 space-y-4">
                {/* Quick percentage picks */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Increase %
                  </Label>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {COMMON_SALARY_INCREASES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setPct(item.value)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
                          pct === item.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted border-border"
                        )}
                      >
                        {item.value}%
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    step={0.5}
                    value={pct}
                    onChange={(e) => setPct(parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <p className="text-xs font-medium">Taxable</p>
                      <p className="text-[10px] text-muted-foreground">Affects PAYE</p>
                    </div>
                    <Switch checked={isTaxable} onCheckedChange={setIsTaxable} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <p className="text-xs font-medium">Gratuity Month</p>
                      <p className="text-[10px] text-muted-foreground">Include lump</p>
                    </div>
                    <Switch checked={isGratuityMonth} onCheckedChange={setIsGratuityMonth} />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    Retroactive Months
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    value={retroMonths || ""}
                    onChange={(e) => setRetroMonths(parseInt(e.target.value) || 0)}
                    placeholder="0 — no back-pay"
                    className="h-8 text-sm"
                  />
                </div>

                {results && (
                  <motion.div
                    key={`${pct}-${isTaxable}-${retroMonths}-${isGratuityMonth}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl bg-primary/8 border border-primary/20 p-3 space-y-1"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Impact Summary
                    </p>
                    <DeltaBadge value={results.basicSalaryDifference} label="Basic salary change" />
                    <DeltaBadge value={results.monthlyNetDifference} label="Monthly net change" />
                    <DeltaBadge value={results.monthlyGratuityDifference} label="Gratuity accrual change" />
                    <DeltaBadge value={results.annualNetDifference} label="Annual package change" />

                    {retroMonths > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-muted-foreground">Retroactive lump sum</span>
                          <Badge variant="outline" className="text-[10px]">
                            {formatCurrency(results.totalRetroactiveLumpSum)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-muted-foreground">Net pay (with back-pay)</span>
                          <span className="text-xs font-semibold text-primary">
                            {formatCurrency(results.netPayWithRetroactiveLumpSum)}
                          </span>
                        </div>
                      </>
                    )}

                    {isGratuityMonth && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-muted-foreground">Gratuity month total</span>
                          <span className="text-xs font-semibold text-primary">
                            {formatCurrency(results.gratuityMonthTotalPay)}
                          </span>
                        </div>
                      </>
                    )}

                    <Separator className="my-2" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{formatCurrency(baseInputs.basicSalary)}</span>
                      <ArrowRight className="size-3" />
                      <span className="tabular-nums font-semibold text-foreground">{formatCurrency(results.basicSalary)}</span>
                      <Badge variant="new" className="ml-auto text-[10px]">+{pct}%</Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
