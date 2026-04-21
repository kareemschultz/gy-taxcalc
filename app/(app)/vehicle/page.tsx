"use client"

import * as React from "react"
import { DotPattern } from "@/components/dot-pattern"
import { VehicleInputs } from "@/components/vehicle/VehicleInputs"
import { VehicleResults } from "@/components/vehicle/VehicleResults"
import { calculateVehicleTax } from "@/lib/vehicle/calculator"
import type { VehicleInputs as TVehicleInputs } from "@/lib/vehicle/types"
import { StickyResultsBar } from "@/components/calculator/StickyResultsBar"

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
        <StickyResultsBar
          items={[
            { label: "Tax", value: result.totalTax.toLocaleString("en-US") },
            { label: "Cost", value: result.totalLandedCost.toLocaleString("en-US") },
            { label: "CIF", value: inputs.cifUSD.toLocaleString("en-US", { maximumFractionDigits: 2 }) },
          ]}
          onDetails={() =>
            document.getElementById("vehicle-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      ) : null}
    </div>
  )
}
