"use client"

import * as React from "react"
import {
  AlertTriangle,
  Bike,
  CarFront,
  CircleDollarSign,
  Leaf,
  RotateCcw,
  Shield,
  Truck,
  BusFront,
  Wrench,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Hint } from "@/components/ui/hint"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Section } from "@/components/calculator/Section"
import { calculateFobToCif, getVehicleAgeInfo } from "@/lib/vehicle/calculator"
import { DEFAULT_EXCHANGE_RATE } from "@/lib/vehicle/constants"
import type {
  FuelType,
  ImporterType,
  PlateType,
  VehicleAge,
  VehicleInputs as TVehicleInputs,
  VehicleType,
} from "@/lib/vehicle/types"
import { cn, formatCurrency, safeNum } from "@/lib/utils"

const DEFAULT_INPUTS: TVehicleInputs = {
  cifUSD: 0,
  exchangeRate: DEFAULT_EXCHANGE_RATE,
  vehicleType: "car",
  fuelType: "gasoline",
  vehicleAge: "under4",
  engineCC: 0,
  modelYear: undefined,
  plateType: "private",
  importerType: "private",
  retailPriceUSD: 0,
  returningNational: false,
  fobUSD: 0,
  freightUSD: 0,
  insuranceUSD: 0,
  use2026Rates: true,
}

const VEHICLE_TYPE_OPTIONS: Array<{
  value: VehicleType
  label: string
  icon: React.ReactNode
}> = [
  { value: "car", label: "Car", icon: <CarFront className="size-4" /> },
  { value: "suv", label: "SUV", icon: <CarFront className="size-4" /> },
  { value: "van", label: "Van", icon: <Truck className="size-4" /> },
  { value: "bus", label: "Bus", icon: <BusFront className="size-4" /> },
  { value: "single_cab", label: "Single Cab", icon: <Truck className="size-4" /> },
  { value: "double_cab", label: "Double Cab", icon: <Truck className="size-4" /> },
  { value: "motorcycle", label: "Motorcycle", icon: <Bike className="size-4" /> },
  { value: "atv", label: "ATV", icon: <Wrench className="size-4" /> },
  { value: "electric", label: "Electric", icon: <Leaf className="size-4" /> },
]

const FUEL_OPTIONS: Array<{ value: FuelType; label: string }> = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
]

const ENGINE_PRESETS = [
  { value: "1000", label: "1,000 cc" },
  { value: "1500", label: "1,500 cc" },
  { value: "1800", label: "1,800 cc" },
  { value: "2000", label: "2,000 cc" },
  { value: "2500", label: "2,500 cc" },
  { value: "3000", label: "3,000 cc" },
  { value: "custom", label: "Custom" },
]

function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground leading-tight">
          {label}
        </Label>
        {hint ? <div className="text-[11px] leading-snug text-muted-foreground">{hint}</div> : null}
      </div>
      {children}
    </div>
  )
}

function StepperField({
  value,
  min = 0,
  max = 999999,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        -
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        value={value || ""}
        onChange={(event) => onChange(Math.min(max, Math.max(min, safeNum(event.target.value))))}
        className="text-center"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </Button>
    </div>
  )
}

interface VehicleInputsProps {
  onChange: (inputs: TVehicleInputs) => void
}

export function VehicleInputs({ onChange }: VehicleInputsProps) {
  const [inputs, setInputs] = React.useState<TVehicleInputs>(DEFAULT_INPUTS)
  const [outboardHp, setOutboardHp] = React.useState(0)
  const [enginePreset, setEnginePreset] = React.useState("custom")

  const update = React.useCallback((patch: Partial<TVehicleInputs>) => {
    setInputs((prev) => {
      const next = { ...prev, ...patch }

      if (next.vehicleType === "electric") {
        next.fuelType = "electric"
      } else if (prev.vehicleType === "electric" && next.fuelType === "electric") {
        // Leaving Electric: fuelType was force-set above and the Fuel Type
        // select stays hidden while it's "electric" (see hideFuel below), so
        // without this reset a user can never see or undo it -- every
        // subsequent calculation silently exempts them from all vehicle tax.
        // See gy-taxcalc-bugs.md finding #3.
        next.fuelType = "gasoline"
      }

      if (next.modelYear) {
        const ageInfo = getVehicleAgeInfo(next.modelYear)
        if (ageInfo) next.vehicleAge = ageInfo.autoBracket
      }

      return next
    })
  }, [])

  React.useEffect(() => {
    onChange(inputs)
  }, [inputs, onChange])

  const fobToCif = calculateFobToCif(inputs.fobUSD, inputs.freightUSD, inputs.insuranceUSD)
  const ageInfo = inputs.modelYear ? getVehicleAgeInfo(inputs.modelYear) : null
  const hideFuel =
    inputs.vehicleType === "motorcycle" ||
    inputs.vehicleType === "atv" ||
    inputs.vehicleType === "electric"

  const reset = () => {
    setInputs(DEFAULT_INPUTS)
    setOutboardHp(0)
    setEnginePreset("custom")
  }

  return (
    <div className="space-y-3">
      <Section
        title="FOB to CIF Converter"
        defaultOpen
        icon={<CircleDollarSign className="size-3.5 text-muted-foreground" />}
        description="Start with the purchase price, freight, and insurance to estimate CIF."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="FOB (US$)">
            <CurrencyInput
              prefix="US$"
              min={0}
              value={inputs.fobUSD || ""}
              onChange={(value) => update({ fobUSD: safeNum(value) })}
              placeholder="5,000"
            />
          </Field>
          <Field
            label="Freight (US$)"
            hint={<Hint tip="Japan often lands around US$1,200-2,000. USA shipments are often US$800-1,500." />}
          >
            <CurrencyInput
              prefix="US$"
              min={0}
              value={inputs.freightUSD || ""}
              onChange={(value) => update({ freightUSD: safeNum(value) })}
              placeholder="1,500"
            />
          </Field>
          <Field label="Insurance (US$)">
            <CurrencyInput
              prefix="US$"
              min={0}
              value={inputs.insuranceUSD || ""}
              onChange={(value) => update({ insuranceUSD: safeNum(value) })}
              placeholder="200"
            />
          </Field>
        </div>

        <div className="rounded-lg border bg-muted/30 px-3 py-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Computed CIF
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(fobToCif.cifUSD).replace("$", "US$")}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => update({ cifUSD: fobToCif.cifUSD })}
            >
              Use this CIF
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Vehicle Details"
        defaultOpen
        icon={<CarFront className="size-3.5 text-muted-foreground" />}
        description="Choose vehicle type, age, engine size, plate type, and importer type."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={
              <span className="inline-flex items-center gap-2">
                CIF Value
                <Hint tip="Cost, Insurance and Freight at port of entry." />
              </span>
            }
          >
            <CurrencyInput
              prefix="US$"
              min={0}
              value={inputs.cifUSD || ""}
              onChange={(value) => update({ cifUSD: safeNum(value) })}
              placeholder="6,700"
            />
          </Field>
          <Field label="Exchange Rate">
              <Input
                type="number"
                min={0}
                step={0.01}
                value={inputs.exchangeRate || ""}
                onChange={(event) =>
                  update({ exchangeRate: safeNum(event.target.value, DEFAULT_EXCHANGE_RATE) })
                }
                placeholder="218"
              />
          </Field>

          <Field label="Vehicle Type">
            <Select
              value={inputs.vehicleType}
              onValueChange={(value) => update({ vehicleType: value as VehicleType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {!hideFuel ? (
            <Field label="Fuel Type">
              <Select
                value={inputs.fuelType}
                onValueChange={(value) => update({ fuelType: value as FuelType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : (
            <Field label="Fuel Type">
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                Electric vehicles, motorcycles, and ATVs use fixed fuel rules.
              </div>
            </Field>
          )}

          <Field label="Vehicle Age">
            <div className="grid grid-cols-2 gap-2">
              {(["under4", "4plus"] as VehicleAge[]).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => update({ vehicleAge: age })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                    inputs.vehicleAge === age
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  {age === "under4" ? "Under 4 Years" : "4+ Years"}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Engine Size (CC)"
            hint={<Hint tip="Choose a common displacement preset or enter a custom size." />}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Select
                value={enginePreset}
                onValueChange={(value) => {
                  setEnginePreset(value)
                  if (value === "custom") return
                  update({ engineCC: Number(value) })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENGINE_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {enginePreset === "custom" ? (
                <Input
                  type="number"
                  min={0}
                  step={100}
                  value={inputs.engineCC || ""}
                  onChange={(event) => update({ engineCC: safeNum(event.target.value) })}
                  placeholder="1,750"
                />
              ) : null}
            </div>
          </Field>

          <Field label="Model Year">
              <Input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={inputs.modelYear || ""}
                onChange={(event) =>
                  update({
                    modelYear: event.target.value ? Math.trunc(safeNum(event.target.value)) : undefined,
                  })
                }
                placeholder="2021"
              />
          </Field>

          <Field label="Plate Type">
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "private", label: "Private (P)" },
                { value: "government", label: "Government (G)" },
              ].map((plate) => (
                <button
                  key={plate.value}
                  type="button"
                  onClick={() => update({ plateType: plate.value as PlateType })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                    inputs.plateType === plate.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  {plate.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Importer Type">
            <Select
              value={inputs.importerType}
              onValueChange={(value) => update({ importerType: value as ImporterType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Importer</SelectItem>
                <SelectItem value="dealer">Dealer</SelectItem>
                <SelectItem value="franchise">Franchise / New Vehicle Trader</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {inputs.importerType === "franchise" ? (
            <Field
              label={
                <span className="inline-flex items-center gap-2">
                  Retail Selling Price
                  <Hint tip="Used as the excise base for franchise imports." />
                </span>
              }
            >
              <CurrencyInput
                prefix="US$"
                min={0}
                value={inputs.retailPriceUSD || ""}
                onChange={(value) => update({ retailPriceUSD: safeNum(value) })}
                placeholder="18,000"
              />
            </Field>
          ) : (
            <Field label="Retail Selling Price">
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                Shown only for franchise imports.
              </div>
            </Field>
          )}

          <div className="md:col-span-2">
            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
              <Switch
                checked={inputs.returningNational}
                onCheckedChange={(checked) => update({ returningNational: checked })}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Returning National / Re-migrant</Label>
                  <Hint tip="Eligible returning nationals may qualify for duty and VAT concessions." />
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle this if the vehicle is being imported under a concession.
                </p>
              </div>
            </div>
          </div>

          {ageInfo ? (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <p className="text-sm">{ageInfo.message}</p>
                <Badge
                  variant={
                    ageInfo.warningType === "danger"
                      ? "destructive"
                      : ageInfo.warningType === "warning"
                        ? "warning"
                        : "outline"
                  }
                  className="ml-auto"
                >
                  {ageInfo.warningType === "danger"
                    ? "Over 8 years"
                    : ageInfo.warningType === "warning"
                      ? "4+ years"
                      : "Under 4 years"}
                </Badge>
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      <Section
        title="Outboard Engine Import"
        defaultOpen={false}
        icon={<Shield className="size-3.5 text-muted-foreground" />}
        description="Quick check for the 150 HP exemption rule."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Engine HP">
            <StepperField value={outboardHp} min={0} max={1000} onChange={setOutboardHp} />
          </Field>
          <Field label="Result">
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              {outboardHp <= 150
                ? "≤150 HP: fully exempt under Budget 2026."
                : "Over 150 HP: contact GRA for guidance."}
            </div>
          </Field>
        </div>
      </Section>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={reset}
        className="w-full text-muted-foreground"
      >
        <RotateCcw className="size-3.5" />
        Clear Form
      </Button>
    </div>
  )
}
