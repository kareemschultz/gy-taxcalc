"use client"

import * as React from "react"
import { DotPattern } from "@/components/dot-pattern"
import { VehicleInputs } from "@/components/vehicle/VehicleInputs"
import { VehicleResults } from "@/components/vehicle/VehicleResults"
import { calculateVehicleTax } from "@/lib/vehicle/calculator"
import type { VehicleInputs as TVehicleInputs } from "@/lib/vehicle/types"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export default function VehiclePage() {
  const [inputs, setInputs] = React.useState<TVehicleInputs | null>(null)

  const result = React.useMemo(() => {
    if (!inputs || inputs.cifUSD <= 0) return null
    return calculateVehicleTax(inputs)
  }, [inputs])

  return (
    <div className="relative min-h-full">
      <DotPattern className="absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 pb-28 lg:grid-cols-[420px_1fr] lg:pb-0 xl:gap-6">
        <div className="space-y-0">
          <VehicleInputs onChange={setInputs} />
        </div>
        <div className="lg:sticky lg:top-0 lg:self-start">
          <VehicleResults inputs={inputs} result={result} />
        </div>
      </div>
      {result && inputs ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Tax</p>
                <p className="font-semibold">{result.totalTax.toLocaleString("en-US")}</p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">Cost</p>
                <p className="font-semibold">{result.totalLandedCost.toLocaleString("en-US")}</p>
              </div>
              <div className="rounded-lg bg-muted px-2 py-2">
                <p className="text-[10px] uppercase text-muted-foreground">CIF</p>
                <p className="font-semibold">
                  {inputs.cifUSD.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById("vehicle-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
