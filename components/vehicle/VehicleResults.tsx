"use client"

import { motion } from "framer-motion"
import {
  BadgeDollarSign,
  BookOpen,
  CircleDollarSign,
  Landmark,
  ShieldCheck,
  ShieldAlert,
  Tags,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import type { VehicleInputs, VehicleTaxResult } from "@/lib/vehicle/types"
import { ResultActions } from "@/components/results/result-actions"

function Money({ amount, prefix = "GY$" }: { amount: number; prefix?: string }) {
  return <span className="tabular-nums">{formatCurrency(amount).replace("$", prefix)}</span>
}

function EmptyState() {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <CircleDollarSign className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Enter a CIF value to see vehicle tax results</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tax, duty, excise, and landed cost update live.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  gyd,
  usd,
  highlight = false,
}: {
  label: string
  gyd: number
  usd: number
  highlight?: boolean
}) {
  return (
    <div className={highlight ? "rounded-lg bg-primary/5 p-4" : "rounded-lg p-4"}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">
        <Money amount={gyd} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        <Money amount={usd} prefix="US$" />
      </p>
    </div>
  )
}

export function VehicleResults({
  inputs,
  result,
}: {
  inputs: VehicleInputs | null
  result: VehicleTaxResult | null
}) {
  if (!result || !inputs || inputs.cifUSD <= 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      id="vehicle-results"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-4"
    >
      <div className="rounded-xl border bg-muted/10 p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <Metric label="Total Import Tax" gyd={result.totalTax} usd={result.totalTaxUSD} highlight />
          <div className="hidden h-16 w-px bg-border md:block" />
          <Metric label="Total Landed Cost" gyd={result.totalLandedCost} usd={result.totalLandedCostUSD} />
        </div>
        <div className="mt-4 grid gap-3 border-t pt-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Import Duty</p>
            <p className="mt-1 text-sm font-medium tabular-nums">
              <Money amount={result.importDuty} />
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Excise / VAT</p>
            <p className="mt-1 text-sm font-medium tabular-nums">
              <Money amount={result.exciseTax} /> / <Money amount={result.vat} />
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Formula</p>
            <p className="mt-1 text-sm font-medium">{result.formulaUsed}</p>
          </div>
        </div>
      </div>

      <ResultActions
        fileName="vehicle-summary.txt"
        title="Vehicle Summary"
        subtitle="A clean export of the import tax result and the key calculation notes."
        summary={[
          { label: "Total Tax", value: formatCurrency(result.totalTax).replace("$", "GY$") },
          { label: "Landed Cost", value: formatCurrency(result.totalLandedCost).replace("$", "GY$") },
          { label: "Import Duty", value: formatCurrency(result.importDuty).replace("$", "GY$") },
          { label: "Excise / VAT", value: `${formatCurrency(result.exciseTax).replace("$", "GY$")} / ${formatCurrency(result.vat).replace("$", "GY$")}` },
        ]}
        sections={[
          {
            title: "How it was calculated",
            rows: result.breakdown.map((row) => ({
              label: row.label,
              value: `${row.rate ? `${row.rate} • ` : ""}${formatCurrency(row.gyd).replace("$", "GY$")}`,
            })),
          },
          {
            title: "What this means",
            rows: result.notes.map((note, index) => ({ label: `Note ${index + 1}`, value: note })),
          },
        ]}
        lines={[
          `Formula used: ${result.formulaUsed}`,
          `Total tax: ${formatCurrency(result.totalTax).replace("$", "GY$")}`,
          `Total landed cost: ${formatCurrency(result.totalLandedCost).replace("$", "GY$")}`,
          `CIF: ${formatCurrency(result.cifGYD).replace("$", "GY$")}`,
        ]}
      />

      <Tabs defaultValue="breakdown" className="space-y-3">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="breakdown" className="min-w-[100px] flex-none sm:flex-1">
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="rates" className="min-w-[100px] flex-none sm:flex-1">
            Quick Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BadgeDollarSign className="size-4 text-primary" />
                How it was calculated
              </CardTitle>
              <CardDescription>
                {result.formulaUsed} This is the rule path used for your selected vehicle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <Badge variant="outline" className="w-fit">
                {inputs.vehicleType.replace("_", " ")} •{" "}
                {inputs.vehicleAge === "under4" ? "Under 4 years" : "4+ years"}
              </Badge>

              <div className="overflow-hidden rounded-lg border bg-background">
                <div className="grid grid-cols-[1.5fr_.6fr_.8fr_.8fr] border-b bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Component</span>
                  <span>Rate</span>
                  <span>US$</span>
                  <span>GY$</span>
                </div>
                <div className="divide-y">
                  {result.breakdown.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1.5fr_.6fr_.8fr_.8fr] items-center px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{row.label}</span>
                      <span className="text-muted-foreground">{row.rate || "—"}</span>
                      <span className="tabular-nums">
                        <Money amount={row.usd} prefix="US$" />
                      </span>
                      <span className="tabular-nums">
                        <Money amount={row.gyd} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {result.notes.length > 0 ? (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      What this means
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {result.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-primary" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                title: "Gasoline under 4 years",
                icon: <Landmark className="size-4 text-primary" />,
                lines: [
                  "Duty and excise vary by engine size band.",
                  "VAT is 14% unless a 2026 exemption applies.",
                  "Under 1500cc under 4 years: VAT removed for private imports.",
                ],
              },
              {
                title: "Gasoline 4+ years",
                icon: <Landmark className="size-4 text-primary" />,
                lines: [
                  "0-1500cc uses a flat GY$800,000 excise.",
                  "Larger engines use formula-based excise by band.",
                  "No duty, no VAT for 4+ year units.",
                ],
              },
              {
                title: "Diesel under 4 years",
                icon: <Landmark className="size-4 text-primary" />,
                lines: [
                  "Duty and excise are banded by displacement.",
                  "VAT is 14% unless removed by 2026 policy.",
                  "Hybrid and smaller private imports may qualify for VAT relief.",
                ],
              },
              {
                title: "Diesel 4+ years",
                icon: <Landmark className="size-4 text-primary" />,
                lines: [
                  "0-1500cc uses a flat GY$800,000 excise.",
                  "Larger engines use formula-based excise by band.",
                  "No duty, no VAT for 4+ year units.",
                ],
              },
              {
                title: "2026 rules highlights",
                icon: <ShieldCheck className="size-4 text-primary" />,
                lines: [
                  "Double-cab pickups have flat GY$2M or GY$3M total tax bands.",
                  "ATVs and electric vehicles are fully exempt.",
                  "Government plates use a flat US$2,000 excise-only rule.",
                ],
              },
              {
                title: "Dealer and franchise",
                icon: <BookOpen className="size-4 text-primary" />,
                lines: [
                  "Dealer imports use 1.5x CIF as excise base.",
                  "Franchise imports may use retail selling price as excise base.",
                  "Returning nationals can remove duty and VAT under concession rules.",
                ],
              },
              {
                title: "Electric, ATV, and motorcycle rules",
                icon: <ShieldAlert className="size-4 text-primary" />,
                lines: [
                  "Electric vehicles are fully exempt.",
                  "ATVs are fully exempt under Budget 2026.",
                  "Motorcycles follow a separate 20% duty rule and HP exemption guidance.",
                ],
              },
              {
                title: "How to use this",
                icon: <Tags className="size-4 text-primary" />,
                lines: [
                  "Vehicle age is auto-classified from model year when provided.",
                  "Use the FOB converter to derive CIF before calculating tax.",
                  "Results update live when inputs change.",
                ],
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-muted/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {item.lines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
