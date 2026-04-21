"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { CalculatorInputs } from "@/components/calculator/CalculatorInputs"
import { ResultsPanel } from "@/components/calculator/ResultsPanel"
import { Button } from "@/components/ui/button"
import { performCalculations } from "@/lib/tax/calculator"
import type { CalculatorInputs as TCalcInputs, CalculationResults } from "@/lib/tax/types"
import { DotPattern } from "@/components/dot-pattern"

export default function DashboardPage() {
  const [inputs, setInputs] = React.useState<TCalcInputs | null>(null)
  const [results, setResults] = React.useState<CalculationResults | null>(null)

  const handleInputChange = React.useCallback((newInputs: TCalcInputs) => {
    setInputs(newInputs)
    if (newInputs.basicSalary > 0) {
      setResults(performCalculations(newInputs))
    } else {
      setResults(null)
    }
  }, [])

  return (
    <div className="relative min-h-full">
      <DotPattern className="absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 pb-28 lg:grid-cols-[420px_1fr] lg:pb-0 xl:gap-6">
        {/* Left: Inputs */}
        <div className="space-y-0">
          <CalculatorInputs onChange={handleInputChange} />
        </div>

        {/* Right: Results */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <ResultsPanel results={results} baseInputs={inputs} />
        </div>
      </div>

      {results && inputs ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Take-Home</p>
                <p className="font-semibold">{results.monthlyNetSalary.toLocaleString("en-US")}</p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Gross</p>
                <p className="font-semibold">{results.regularMonthlyGrossIncome.toLocaleString("en-US")}</p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">PAYE</p>
                <p className="font-semibold">{results.incomeTax.toLocaleString("en-US")}</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById("salary-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <ArrowDown className="size-4" />
              Details
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
