"use client"

import * as React from "react"
import { CalculatorInputs } from "@/components/calculator/CalculatorInputs"
import { ResultsPanel } from "@/components/calculator/ResultsPanel"
import { performCalculations } from "@/lib/tax/calculator"
import type { CalculatorInputs as TCalcInputs, CalculationResults } from "@/lib/tax/types"
import { DotPattern } from "@/components/dot-pattern"
import { StickyResultsBar } from "@/components/calculator/StickyResultsBar"

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
        <StickyResultsBar
          items={[
            { label: "Take-Home", value: results.monthlyNetSalary.toLocaleString("en-US") },
            { label: "Gross", value: results.regularMonthlyGrossIncome.toLocaleString("en-US") },
            { label: "PAYE", value: results.incomeTax.toLocaleString("en-US") },
          ]}
          onDetails={() =>
            document.getElementById("salary-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      ) : null}
    </div>
  )
}
