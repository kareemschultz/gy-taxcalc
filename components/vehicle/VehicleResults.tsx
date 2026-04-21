"use client"

import * as React from "react"
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

function HeroCard({
  title,
  gyd,
  usd,
  accent = false,
}: {
  title: string
  gyd: number
  usd: number
  accent?: boolean
}) {
  return (
    <Card className={accent ? "border-primary/30 bg-primary/5" : "bg-muted/20"}>
      <CardContent className="pt-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-bold">
            <Money amount={gyd} />
          </p>
          <p className="text-sm text-muted-foreground">
            <Money amount={usd} prefix="US$" />
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RateCard({
  title,
  children,
  icon,
}: {
  title: string
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">{children}</CardContent>
    </Card>
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
      <div className="grid gap-3 md:grid-cols-2">
        <HeroCard title="Total Import Tax" gyd={result.totalTax} usd={result.totalTaxUSD} accent />
        <HeroCard title="Total Landed Cost" gyd={result.totalLandedCost} usd={result.totalLandedCostUSD} />
      </div>

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
            <RateCard title="Gasoline under 4 years" icon={<Landmark className="size-4 text-primary" />}>
              <p>Duty and excise vary by engine size band.</p>
              <p>VAT is 14% unless a 2026 exemption applies.</p>
              <p>Under 1500cc under 4 years: VAT removed for private imports.</p>
            </RateCard>
            <RateCard title="Gasoline 4+ years" icon={<Landmark className="size-4 text-primary" />}>
              <p>0-1500cc uses a flat GY$800,000 excise.</p>
              <p>Larger engines use formula-based excise by band.</p>
              <p>No duty, no VAT for 4+ year units.</p>
            </RateCard>
            <RateCard title="Diesel under 4 years" icon={<Landmark className="size-4 text-primary" />}>
              <p>Duty and excise are banded by displacement.</p>
              <p>VAT is 14% unless removed by 2026 policy.</p>
              <p>Hybrid and smaller private imports may qualify for VAT relief.</p>
            </RateCard>
            <RateCard title="Diesel 4+ years" icon={<Landmark className="size-4 text-primary" />}>
              <p>0-1500cc uses a flat GY$800,000 excise.</p>
              <p>Larger engines use formula-based excise by band.</p>
              <p>No duty, no VAT for 4+ year units.</p>
            </RateCard>
            <RateCard title="2026 rules highlights" icon={<ShieldCheck className="size-4 text-primary" />}>
              <p>Double-cab pickups have flat GY$2M or GY$3M total tax bands.</p>
              <p>ATVs and electric vehicles are fully exempt.</p>
              <p>Government plates use a flat US$2,000 excise-only rule.</p>
            </RateCard>
            <RateCard title="Dealer and franchise" icon={<BookOpen className="size-4 text-primary" />}>
              <p>Dealer imports use 1.5x CIF as excise base.</p>
              <p>Franchise imports may use retail selling price as excise base.</p>
              <p>Returning nationals can remove duty and VAT under concession rules.</p>
            </RateCard>
            <RateCard title="Electric, ATV, and motorcycle rules" icon={<ShieldAlert className="size-4 text-primary" />}>
              <p>Electric vehicles are fully exempt.</p>
              <p>ATVs are fully exempt under Budget 2026.</p>
              <p>Motorcycles follow a separate 20% duty rule and HP exemption guidance.</p>
            </RateCard>
            <RateCard title="How to use this" icon={<Tags className="size-4 text-primary" />}>
              <p>Vehicle age is auto-classified from model year when provided.</p>
              <p>Use the FOB converter to derive CIF before calculating tax.</p>
              <p>Results update live when inputs change.</p>
            </RateCard>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
