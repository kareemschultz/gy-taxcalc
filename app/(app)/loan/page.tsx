"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { DotPattern } from "@/components/dot-pattern"
import { Button } from "@/components/ui/button"
import { LoanInputs } from "@/components/loan/LoanInputs"
import { LoanResults } from "@/components/loan/LoanResults"
import { calculateLoan } from "@/lib/loan/calculator"
import type { LoanInputs as TLoanInputs, LoanResults as TLoanResults } from "@/lib/loan/types"

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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Payment</p>
                <p className="font-semibold">
                  {(inputs.paymentFrequency === "biweekly" && result.biweeklyPayment
                    ? result.biweeklyPayment
                    : result.monthlyPayment
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Interest</p>
                <p className="font-semibold">{result.totalInterest.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Payoff</p>
                <p className="font-semibold">{result.payoffDate}</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById("loan-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
