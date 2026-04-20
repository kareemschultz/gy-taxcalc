"use client"

import * as React from "react"
import { Briefcase, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Hint } from "@/components/ui/hint"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Section } from "@/components/calculator/Section"
import { cn } from "@/lib/utils"
import {
  convertFromMonthly,
  getInsurancePremiumMonthly,
  getQualificationAllowance,
  PAYMENT_FREQUENCIES,
  POSITION_PRESETS,
} from "@/lib/tax/constants"
import type {
  CalculatorInputs as TCalcInputs,
  InsuranceType,
  PaymentFrequency,
  QualificationType,
} from "@/lib/tax/types"

type AllowanceMode = "simple" | "detailed"

type DetailedTaxableAllowances = {
  duty: number
  acting: number
  housing: number
  uniform: number
  meal: number
  savingScheme: number
  other: number
}

type DetailedNonTaxableAllowances = {
  travel: number
  station: number
  subsistence: number
  vacation: number
  entertainment: number
  phone: number
  laundry: number
  other: number
}

function sum(values: Record<string, number>) {
  return Object.values(values).reduce((total, current) => total + (current || 0), 0)
}

function toNum(value: string) {
  return Number.parseFloat(value) || 0
}

function toInt(value: string) {
  return Number.parseInt(value, 10) || 0
}

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
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
        {hint ? <div className="shrink-0">{hint}</div> : null}
      </div>
      {children}
    </div>
  )
}

const DEFAULT_INPUTS: TCalcInputs = {
  position: "custom",
  paymentFrequency: "monthly",
  frequencyConfig: PAYMENT_FREQUENCIES.monthly,
  basicSalary: 0,
  taxableAllowances: 0,
  nonTaxableAllowances: 0,
  vacationAllowance: 0,
  qualificationType: "none",
  qualificationAllowance: 0,
  overtimeIncome: 0,
  secondJobIncome: 0,
  childCount: 0,
  loanPayment: 0,
  creditUnionDeduction: 0,
  insuranceType: "none",
  insurancePremium: 0,
  gratuityRate: 22.5,
  gratuityPeriod: 6,
}

const DEFAULT_DETAILED_TAXABLE: DetailedTaxableAllowances = {
  duty: 0,
  acting: 0,
  housing: 0,
  uniform: 0,
  meal: 0,
  savingScheme: 0,
  other: 0,
}

const DEFAULT_DETAILED_NON_TAXABLE: DetailedNonTaxableAllowances = {
  travel: 0,
  station: 0,
  subsistence: 0,
  vacation: 0,
  entertainment: 0,
  phone: 0,
  laundry: 0,
  other: 0,
}

interface CalculatorInputsProps {
  onChange: (inputs: TCalcInputs) => void
}

export function CalculatorInputs({ onChange }: CalculatorInputsProps) {
  const [inputs, setInputs] = React.useState<TCalcInputs>(DEFAULT_INPUTS)
  const [allowanceMode, setAllowanceMode] = React.useState<AllowanceMode>("simple")
  const [detailedTaxable, setDetailedTaxable] = React.useState<DetailedTaxableAllowances>(
    DEFAULT_DETAILED_TAXABLE
  )
  const [detailedNonTaxable, setDetailedNonTaxable] = React.useState<DetailedNonTaxableAllowances>(
    DEFAULT_DETAILED_NON_TAXABLE
  )

  const syncComputedFields = React.useCallback(
    (next: TCalcInputs) => {
      const resolved = { ...next }
      resolved.frequencyConfig = PAYMENT_FREQUENCIES[resolved.paymentFrequency]
      resolved.qualificationAllowance = getQualificationAllowance(
        resolved.qualificationType,
        resolved.paymentFrequency
      )
      if (resolved.insuranceType !== "custom") {
        const monthly = getInsurancePremiumMonthly(resolved.insuranceType)
        resolved.insurancePremium = convertFromMonthly(monthly, resolved.paymentFrequency)
      }
      return resolved
    },
    []
  )

  const update = React.useCallback(
    (patch: Partial<TCalcInputs>) => {
      setInputs((prev) => syncComputedFields({ ...prev, ...patch }))
    },
    [syncComputedFields]
  )

  React.useEffect(() => {
    onChange(inputs)
  }, [inputs, onChange])

  const applyPresetBreakdown = React.useCallback(
    (presetId: string) => {
      if (presetId === "custom") {
        update({ position: "custom" })
        return
      }

      const preset = POSITION_PRESETS.find((item) => item.id === presetId)
      if (!preset) return

      const freq = inputs.paymentFrequency
      const taxable = Math.round(convertFromMonthly(preset.totalTaxableAllowances, freq))
      const nonTaxable = Math.round(convertFromMonthly(preset.totalNonTaxableAllowances, freq))

      update({
        position: presetId,
        basicSalary: Math.round(convertFromMonthly(preset.baseSalary, freq)),
        taxableAllowances: taxable,
        nonTaxableAllowances: nonTaxable,
        vacationAllowance: 0,
      })

      setDetailedTaxable((prev) => ({
        ...prev,
        other: taxable,
      }))
      setDetailedNonTaxable((prev) => ({
        ...prev,
        other: nonTaxable,
      }))
    },
    [inputs.paymentFrequency, update]
  )

  const reset = () => {
    setInputs(DEFAULT_INPUTS)
    setAllowanceMode("simple")
    setDetailedTaxable(DEFAULT_DETAILED_TAXABLE)
    setDetailedNonTaxable(DEFAULT_DETAILED_NON_TAXABLE)
  }

  const freq = inputs.paymentFrequency
  const childOptions = Array.from({ length: 11 }, (_, index) => index)
  const taxableTotal = sum(detailedTaxable)
  const nonTaxableTotal = sum(detailedNonTaxable)

  const toggleDetailedMode = (mode: AllowanceMode) => {
    if (mode === allowanceMode) return
    if (mode === "detailed") {
      setDetailedTaxable((prev) =>
        sum(prev) > 0 || inputs.taxableAllowances === 0
          ? prev
          : { ...DEFAULT_DETAILED_TAXABLE, other: inputs.taxableAllowances }
      )
      setDetailedNonTaxable((prev) =>
        sum(prev) > 0 || (inputs.nonTaxableAllowances === 0 && inputs.vacationAllowance === 0)
          ? prev
          : {
              ...DEFAULT_DETAILED_NON_TAXABLE,
              other: inputs.nonTaxableAllowances,
              vacation: inputs.vacationAllowance,
            }
      )
    } else {
      update({
        taxableAllowances: taxableTotal,
        nonTaxableAllowances: nonTaxableTotal,
      })
    }
    setAllowanceMode(mode)
  }

  const updateDetailedTaxable = (field: keyof DetailedTaxableAllowances, value: number) => {
    setDetailedTaxable((prev) => {
      const next = { ...prev, [field]: value }
      update({ taxableAllowances: sum(next) })
      return next
    })
  }

  const updateDetailedNonTaxable = (field: keyof DetailedNonTaxableAllowances, value: number) => {
    setDetailedNonTaxable((prev) => {
      const next = { ...prev, [field]: value }
      update({ nonTaxableAllowances: sum(next), vacationAllowance: next.vacation })
      return next
    })
  }

  return (
    <div className="space-y-3">
      <Section title="Quick Start" defaultOpen icon={<Briefcase className="size-3.5 text-muted-foreground" />}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Position Preset">
            <Select value={inputs.position} onValueChange={applyPresetBreakdown}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom / Enter manually</SelectItem>
                {POSITION_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Payment Frequency">
            <div className="grid grid-cols-5 gap-1">
              {(Object.keys(PAYMENT_FREQUENCIES) as PaymentFrequency[]).map((paymentFrequency) => (
                <button
                  key={paymentFrequency}
                  type="button"
                  onClick={() => update({ paymentFrequency })}
                  className={cn(
                    "rounded-lg border py-1.5 text-xs font-medium transition-all",
                    paymentFrequency === freq
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  {PAYMENT_FREQUENCIES[paymentFrequency].label.slice(0, 3)}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Income" defaultOpen>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label={
                <span className="inline-flex items-center gap-1">
                  Basic Salary ({PAYMENT_FREQUENCIES[freq].periodLabel})
                  <Hint tip="Your base pay before any allowances or deductions." />
                </span>
              }
            >
              <CurrencyInput
                prefix="GY$"
                min={0}
                value={inputs.basicSalary || ""}
                onChange={(value) => update({ basicSalary: toNum(value) })}
                placeholder="0"
              />
            </Field>

            <Field label="Allowance Mode">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={allowanceMode === "simple" ? "default" : "outline"}
                  onClick={() => toggleDetailedMode("simple")}
                >
                  Simple
                </Button>
                <Button
                  type="button"
                  variant={allowanceMode === "detailed" ? "default" : "outline"}
                  onClick={() => toggleDetailedMode("detailed")}
                >
                  Detailed
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Switch to detailed mode to enter duty, travel, uniform, and related allowances.
              </p>
            </Field>
          </div>

          {allowanceMode === "simple" ? (
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Taxable Allowances">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.taxableAllowances || ""}
                  onChange={(value) => update({ taxableAllowances: toNum(value) })}
                  placeholder="0"
                />
              </Field>
              <Field label="Non-Taxable Allowances" hint="Travel, telecom, station, etc.">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.nonTaxableAllowances || ""}
                  onChange={(value) => update({ nonTaxableAllowances: toNum(value) })}
                  placeholder="0"
                />
              </Field>
              <Field label="Vacation Allowance" hint="Annual lump sum">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.vacationAllowance || ""}
                  onChange={(value) => update({ vacationAllowance: toNum(value) })}
                  placeholder="0"
                />
              </Field>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Detailed Taxable Allowances
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Total: {taxableTotal.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Duty Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.duty || ""}
                      onChange={(value) => updateDetailedTaxable("duty", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Acting Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.acting || ""}
                      onChange={(value) => updateDetailedTaxable("acting", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Housing Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.housing || ""}
                      onChange={(value) => updateDetailedTaxable("housing", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Uniform Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.uniform || ""}
                      onChange={(value) => updateDetailedTaxable("uniform", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Meal Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.meal || ""}
                      onChange={(value) => updateDetailedTaxable("meal", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Saving Scheme">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.savingScheme || ""}
                      onChange={(value) => updateDetailedTaxable("savingScheme", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Other Taxable">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedTaxable.other || ""}
                      onChange={(value) => updateDetailedTaxable("other", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Detailed Non-Taxable Allowances
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Total: {nonTaxableTotal.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Travel Allowance" hint="Not subject to PAYE">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.travel || ""}
                      onChange={(value) => updateDetailedNonTaxable("travel", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Station Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.station || ""}
                      onChange={(value) => updateDetailedNonTaxable("station", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Subsistence">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.subsistence || ""}
                      onChange={(value) => updateDetailedNonTaxable("subsistence", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Vacation Allowance">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.vacation || ""}
                      onChange={(value) => updateDetailedNonTaxable("vacation", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Entertainment">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.entertainment || ""}
                      onChange={(value) => updateDetailedNonTaxable("entertainment", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Phone & Internet">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.phone || ""}
                      onChange={(value) => updateDetailedNonTaxable("phone", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Laundry">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.laundry || ""}
                      onChange={(value) => updateDetailedNonTaxable("laundry", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Other Non-Taxable">
                    <CurrencyInput
                      prefix="GY$"
                      min={0}
                      value={detailedNonTaxable.other || ""}
                      onChange={(value) => updateDetailedNonTaxable("other", toNum(value))}
                      placeholder="0"
                    />
                  </Field>
                </div>
              </div>

              <div className="rounded-lg border bg-background px-3 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Totals Sent to Calculator
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      update({
                        taxableAllowances: taxableTotal,
                        nonTaxableAllowances: nonTaxableTotal,
                      })
                    }
                  >
                    Refresh totals
                  </Button>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Taxable Allowances
                    </p>
                    <p className="mt-1 font-semibold">{taxableTotal.toLocaleString("en-US")}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Non-Taxable Allowances
                    </p>
                    <p className="mt-1 font-semibold">{nonTaxableTotal.toLocaleString("en-US")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Additional Income" defaultOpen={false}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Overtime" hint={`Max non-taxable: $${PAYMENT_FREQUENCIES[freq].overtimeMax.toLocaleString()}`}>
            <CurrencyInput
              prefix="GY$"
              min={0}
              value={inputs.overtimeIncome || ""}
              onChange={(value) => update({ overtimeIncome: toNum(value) })}
              placeholder="0"
            />
          </Field>
          <Field
            label="Second Job"
            hint={`Max non-taxable: $${PAYMENT_FREQUENCIES[freq].secondJobMax.toLocaleString()}`}
          >
            <CurrencyInput
              prefix="GY$"
              min={0}
              value={inputs.secondJobIncome || ""}
              onChange={(value) => update({ secondJobIncome: toNum(value) })}
              placeholder="0"
            />
          </Field>
        </div>
      </Section>

      <Section title="Deductions & Benefits" defaultOpen={false}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Children" hint="$10,000 allowance each">
            <Select value={String(inputs.childCount)} onValueChange={(value) => update({ childCount: toInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {childOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Loan Payment">
            <CurrencyInput
              prefix="GY$"
              min={0}
              value={inputs.loanPayment || ""}
              onChange={(value) => update({ loanPayment: toNum(value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Credit Union">
            <CurrencyInput
              prefix="GY$"
              min={0}
              value={inputs.creditUnionDeduction || ""}
              onChange={(value) => update({ creditUnionDeduction: toNum(value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Health Insurance">
            <Select
              value={inputs.insuranceType}
              onValueChange={(value) => update({ insuranceType: value as InsuranceType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="employee">Employee ($1,469/mo)</SelectItem>
                <SelectItem value="employee-one">Employee + 1 ($3,182/mo)</SelectItem>
                <SelectItem value="family">Family ($4,970/mo)</SelectItem>
                <SelectItem value="custom">Custom amount</SelectItem>
              </SelectContent>
            </Select>
            {inputs.insuranceType === "custom" ? (
              <CurrencyInput
                prefix="GY$"
                min={0}
                className="mt-2"
                value={inputs.insurancePremium || ""}
                onChange={(value) => update({ insurancePremium: toNum(value) })}
                placeholder="Custom premium"
              />
            ) : null}
          </Field>
        </div>
      </Section>

      <Section title="Qualification Allowance" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {(["none", "acca", "masters", "phd"] as QualificationType[]).map((qualificationType) => {
            const labels = {
              none: "None",
              acca: "ACCA",
              masters: "Master's",
              phd: "PhD",
            }
            return (
              <button
                key={qualificationType}
                type="button"
                onClick={() => update({ qualificationType })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all",
                  qualificationType === inputs.qualificationType
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <span className="block font-semibold">{labels[qualificationType]}</span>
                {qualificationType !== "none" ? (
                  <span className="mt-0.5 block text-[10px] opacity-75">
                    {getQualificationAllowance(qualificationType, freq).toLocaleString("en-US")} / period
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Gratuity & Advanced" defaultOpen={false}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Gratuity Rate (%)" hint="Default: 22.5% of basic salary">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={inputs.gratuityRate}
              onChange={(event) => update({ gratuityRate: toNum(event.target.value) })}
            />
          </Field>
          <Field label="Gratuity Period (months)" hint="Payment interval">
            <Select
              value={String(inputs.gratuityPeriod)}
              onValueChange={(value) => update({ gratuityPeriod: toInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Every 3 months</SelectItem>
                <SelectItem value="6">Every 6 months</SelectItem>
                <SelectItem value="9">Every 9 months</SelectItem>
                <SelectItem value="12">Annual</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Button variant="outline" size="sm" onClick={reset} className="w-full text-muted-foreground">
        <RotateCcw className="size-3.5" />
        Clear Form
      </Button>
    </div>
  )
}
