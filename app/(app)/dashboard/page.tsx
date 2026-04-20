"use client"

import * as React from "react"
import { CalculatorInputs } from "@/components/calculator/CalculatorInputs"
import { ResultsPanel } from "@/components/calculator/ResultsPanel"
import { SalaryIncreaseSection } from "@/components/calculator/SalaryIncreaseSection"
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

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4 xl:gap-6 max-w-7xl mx-auto">
        {/* Left: Inputs */}
        <div className="space-y-0">
          <CalculatorInputs onChange={handleInputChange} />
          {inputs && <SalaryIncreaseSection baseInputs={inputs} />}
        </div>

        {/* Right: Results */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <ResultsPanel results={results} />
        </div>
      </div>
    </div>
  )
}
