"use client"

import * as React from "react"
import { DotPattern } from "@/components/dot-pattern"
import { LoanInputs } from "@/components/loan/LoanInputs"
import { LoanResults } from "@/components/loan/LoanResults"
import { calculateLoan } from "@/lib/loan/calculator"
import type { LoanInputs as TLoanInputs, LoanResults as TLoanResults } from "@/lib/loan/types"
import { StickyResultsBar } from "@/components/calculator/StickyResultsBar"

export default function LoanPage() {
  const [inputs, setInputs] = React.useState<TLoanInputs | null>(null)

  const result = React.useMemo<TLoanResults | null>(() => {
    if (!inputs) return null
    if (inputs.principalGYD <= 0 && !inputs.purchasePrice) return null
    return calculateLoan(inputs)
  }, [inputs])

  return (
    <div className="relative min-h-full">
      <DotPattern className="absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 pb-28 lg:grid-cols-[420px_1fr] lg:pb-0 xl:gap-6">
        <div className="space-y-0">
          <LoanInputs onChange={setInputs} />
        </div>
        <div className="lg:sticky lg:top-0 lg:self-start">
          <LoanResults inputs={inputs} result={result} />
        </div>
      </div>

      {result && inputs ? (
        <StickyResultsBar
          items={[
            {
              label: "Payment",
              value: (inputs.paymentFrequency === "biweekly" && result.biweeklyPayment
                ? result.biweeklyPayment
                : result.monthlyPayment
              ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
            },
            { label: "Interest", value: result.totalInterest.toLocaleString("en-US", { maximumFractionDigits: 0 }) },
            { label: "Payoff", value: result.payoffDate },
          ]}
          onDetails={() =>
            document.getElementById("loan-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      ) : null}
    </div>
  )
}
