"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, RotateCcw, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  POSITION_PRESETS,
  PAYMENT_FREQUENCIES,
  COMMON_SALARY_INCREASES,
  convertFromMonthly,
  getQualificationAllowance,
  getInsurancePremiumMonthly,
  INSURANCE_PREMIUMS,
} from "@/lib/tax/constants"
import type {
  CalculatorInputs as TCalcInputs,
  PaymentFrequency,
  QualificationType,
  InsuranceType,
} from "@/lib/tax/types"

/* ── section accordion ────────────────────────────────── */
function Section({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="px-4 py-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── field row ────────────────────────────────────────── */
function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

/* ── default inputs ───────────────────────────────────── */
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

/* ── component ─────────────────────────────────────────── */
interface CalculatorInputsProps {
  onChange: (inputs: TCalcInputs) => void
}

export function CalculatorInputs({ onChange }: CalculatorInputsProps) {
  const [inputs, setInputs] = React.useState<TCalcInputs>(DEFAULT_INPUTS)

  const update = React.useCallback(
    (patch: Partial<TCalcInputs>) => {
      setInputs((prev) => {
        const next = { ...prev, ...patch }
        // Keep frequencyConfig in sync
        next.frequencyConfig = PAYMENT_FREQUENCIES[next.paymentFrequency]
        // Sync qualification allowance
        next.qualificationAllowance = getQualificationAllowance(
          next.qualificationType,
          next.paymentFrequency
        )
        // Sync insurance premium if not custom
        if (next.insuranceType !== "custom") {
          const monthly = getInsurancePremiumMonthly(next.insuranceType)
          next.insurancePremium = convertFromMonthly(monthly, next.paymentFrequency)
        }
        return next
      })
    },
    []
  )

  // Notify parent on every change
  React.useEffect(() => {
    onChange(inputs)
  }, [inputs, onChange])

  const handlePreset = (presetId: string) => {
    if (presetId === "custom") {
      update({ position: "custom" })
      return
    }
    const preset = POSITION_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const freq = inputs.paymentFrequency
    update({
      position: presetId,
      basicSalary: Math.round(convertFromMonthly(preset.baseSalary, freq)),
      taxableAllowances: Math.round(
        convertFromMonthly(preset.totalTaxableAllowances, freq)
      ),
      nonTaxableAllowances: Math.round(
        convertFromMonthly(preset.totalNonTaxableAllowances, freq)
      ),
      vacationAllowance:
        preset.baseSalary +
        preset.totalTaxableAllowances +
        preset.totalNonTaxableAllowances,
    })
  }

  const reset = () => setInputs(DEFAULT_INPUTS)

  const num = (val: string) => parseFloat(val) || 0
  const int = (val: string) => parseInt(val) || 0
  const { paymentFrequency: freq } = inputs

  return (
    <div className="space-y-3">
      {/* Quick Start */}
      <Section title="Quick Start" defaultOpen icon={<Briefcase className="size-3.5 text-muted-foreground" />}>
        <Field label="Position Preset">
          <Select value={inputs.position} onValueChange={handlePreset}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select position…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom / Enter manually</SelectItem>
              {POSITION_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Payment Frequency">
          <div className="grid grid-cols-5 gap-1">
            {(Object.keys(PAYMENT_FREQUENCIES) as PaymentFrequency[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => update({ paymentFrequency: f })}
                className={cn(
                  "rounded-lg border py-1.5 text-xs font-medium transition-all",
                  f === freq
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                {PAYMENT_FREQUENCIES[f].label.slice(0, 3)}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Income */}
      <Section title="Income" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Basic Salary (${PAYMENT_FREQUENCIES[freq].periodLabel})`}>
            <Input
              type="number"
              min={0}
              value={inputs.basicSalary || ""}
              onChange={(e) => update({ basicSalary: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Taxable Allowances">
            <Input
              type="number"
              min={0}
              value={inputs.taxableAllowances || ""}
              onChange={(e) => update({ taxableAllowances: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Non-Taxable Allowances" hint="Travel, telecom, station, etc.">
            <Input
              type="number"
              min={0}
              value={inputs.nonTaxableAllowances || ""}
              onChange={(e) =>
                update({ nonTaxableAllowances: num(e.target.value) })
              }
              placeholder="0"
            />
          </Field>
          <Field label="Vacation Allowance" hint="Annual lump sum">
            <Input
              type="number"
              min={0}
              value={inputs.vacationAllowance || ""}
              onChange={(e) => update({ vacationAllowance: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
        </div>
      </Section>

      {/* Additional Income */}
      <Section title="Additional Income" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Overtime" hint={`Max non-taxable: $${PAYMENT_FREQUENCIES[freq].overtimeMax.toLocaleString()}`}>
            <Input
              type="number"
              min={0}
              value={inputs.overtimeIncome || ""}
              onChange={(e) => update({ overtimeIncome: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Second Job" hint={`Max non-taxable: $${PAYMENT_FREQUENCIES[freq].secondJobMax.toLocaleString()}`}>
            <Input
              type="number"
              min={0}
              value={inputs.secondJobIncome || ""}
              onChange={(e) => update({ secondJobIncome: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
        </div>
      </Section>

      {/* Deductions & Benefits */}
      <Section title="Deductions & Benefits" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Children" hint="$10,000 allowance each">
            <Input
              type="number"
              min={0}
              max={10}
              value={inputs.childCount || ""}
              onChange={(e) => update({ childCount: int(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Loan Payment">
            <Input
              type="number"
              min={0}
              value={inputs.loanPayment || ""}
              onChange={(e) => update({ loanPayment: num(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Credit Union">
            <Input
              type="number"
              min={0}
              value={inputs.creditUnionDeduction || ""}
              onChange={(e) =>
                update({ creditUnionDeduction: num(e.target.value) })
              }
              placeholder="0"
            />
          </Field>
          <Field label="Health Insurance">
            <Select
              value={inputs.insuranceType}
              onValueChange={(v) => update({ insuranceType: v as InsuranceType })}
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
            {inputs.insuranceType === "custom" && (
              <Input
                type="number"
                min={0}
                className="mt-2"
                value={inputs.insurancePremium || ""}
                onChange={(e) =>
                  update({ insurancePremium: num(e.target.value) })
                }
                placeholder="Custom premium"
              />
            )}
          </Field>
        </div>
      </Section>

      {/* Qualification Allowance */}
      <Section title="Qualification Allowance" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {(["none", "acca", "masters", "phd"] as QualificationType[]).map((q) => {
            const labels = {
              none: "None",
              acca: "ACCA",
              masters: "Master's",
              phd: "PhD",
            }
            return (
              <button
                key={q}
                type="button"
                onClick={() => update({ qualificationType: q })}
                className={cn(
                  "rounded-lg border py-2 px-3 text-xs font-medium text-left transition-all",
                  q === inputs.qualificationType
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                <span className="block font-semibold">{labels[q]}</span>
                {q !== "none" && (
                  <span className="block text-[10px] opacity-75 mt-0.5">
                    $
                    {getQualificationAllowance(q, freq).toLocaleString()}
                    /
                    {PAYMENT_FREQUENCIES[freq].periodLabel.split(" ")[1] || "mo"}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Section>

      {/* Gratuity & Advanced */}
      <Section title="Gratuity & Advanced" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gratuity Rate (%)" hint="Default: 22.5% of basic salary">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={inputs.gratuityRate}
              onChange={(e) => update({ gratuityRate: num(e.target.value) })}
            />
          </Field>
          <Field label="Gratuity Period (months)" hint="Payment interval">
            <Select
              value={String(inputs.gratuityPeriod)}
              onValueChange={(v) => update({ gratuityPeriod: int(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Every 3 months</SelectItem>
                <SelectItem value="6">Every 6 months</SelectItem>
                <SelectItem value="12">Annual</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      {/* Reset */}
      <Button
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
