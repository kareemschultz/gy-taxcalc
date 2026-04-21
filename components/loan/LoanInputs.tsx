"use client"

import * as React from "react"
import {
  Landmark,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Hint } from "@/components/ui/hint"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Section } from "@/components/calculator/Section"
import { Switch } from "@/components/ui/switch"
import { cn, formatCurrency, safeNum } from "@/lib/utils"
import {
  LOAN_BANK_PRESETS,
  LOAN_DEFAULT_EXCHANGE_RATE,
  LOAN_TYPE_CONFIGS,
} from "@/lib/loan/constants"
import type {
  LoanInputs as TLoanInputs,
  LoanType,
  LumpSumFrequency,
  PaymentFrequency,
} from "@/lib/loan/types"

const DEFAULT_INPUTS: TLoanInputs = {
  loanType: "auto",
  bankPreset: LOAN_TYPE_CONFIGS.auto.defaultBank ?? "republic",
  purchasePrice: 0,
  downPaymentPct: 20,
  principalGYD: 0,
  currencyMode: "gyd",
  exchangeRate: LOAN_DEFAULT_EXCHANGE_RATE,
  annualRatePct: LOAN_BANK_PRESETS[LOAN_TYPE_CONFIGS.auto.defaultBank ?? "republic"]?.rate ?? 9,
  termMonths: LOAN_TYPE_CONFIGS.auto.defaultTerm,
  firstPaymentDate: "",
  processingFeePct: 0,
  paymentFrequency: "monthly",
  extraPaymentsEnabled: false,
  additionalMonthly: 0,
  lumpSumAmount: 0,
  lumpSumAtMonth: 1,
  periodicLumpAmount: 0,
  periodicLumpFrequency: 6,
  periodicLumpCustomInterval: 3,
  periodicLumpStartMonth: 1,
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

function PillToggle({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted"
      )}
    >
      {children}
    </button>
  )
}

function loanPrincipalFromPurchase(purchasePrice?: number, downPaymentPct?: number) {
  if (!purchasePrice || downPaymentPct === undefined) return 0
  return purchasePrice * (1 - downPaymentPct / 100)
}

interface LoanInputsProps {
  onChange: (inputs: TLoanInputs) => void
}

export function LoanInputs({ onChange }: LoanInputsProps) {
  const [inputs, setInputs] = React.useState<TLoanInputs>(DEFAULT_INPUTS)

  const update = React.useCallback((patch: Partial<TLoanInputs>) => {
    setInputs((prev) => {
      const next = { ...prev, ...patch }

      if (patch.loanType && patch.loanType !== prev.loanType) {
        const config = LOAN_TYPE_CONFIGS[patch.loanType]
        next.termMonths = config.defaultTerm
        if (config.defaultBank) {
          next.bankPreset = config.defaultBank
          const bank = LOAN_BANK_PRESETS[config.defaultBank]
          if (bank?.rate) next.annualRatePct = bank.rate
        }
      }

      if (patch.bankPreset && patch.bankPreset !== prev.bankPreset) {
        const bank = LOAN_BANK_PRESETS[patch.bankPreset]
        if (bank?.rate && patch.bankPreset !== "custom") {
          next.annualRatePct = bank.rate
        }
      }

      if (patch.currencyMode && patch.currencyMode !== prev.currencyMode) {
        const rate = prev.exchangeRate || LOAN_DEFAULT_EXCHANGE_RATE
        if (patch.currencyMode === "usd" && prev.currencyMode === "gyd") {
          next.principalGYD = rate > 0 ? prev.principalGYD / rate : prev.principalGYD
        } else if (patch.currencyMode === "gyd" && prev.currencyMode === "usd") {
          next.principalGYD = prev.principalGYD * rate
        }
      }

      return next
    })
  }, [])

  React.useEffect(() => {
    onChange(inputs)
  }, [inputs, onChange])

  const financedAmount = loanPrincipalFromPurchase(inputs.purchasePrice, inputs.downPaymentPct)
  const selectedBank = LOAN_BANK_PRESETS[inputs.bankPreset] ?? LOAN_BANK_PRESETS.republic
  const hasPurchasePrice = LOAN_TYPE_CONFIGS[inputs.loanType].hasPurchasePrice

  const reset = () => setInputs(DEFAULT_INPUTS)

  return (
    <div className="space-y-3">
      <Section title="Loan Setup" defaultOpen icon={<Landmark className="size-3.5 text-muted-foreground" />}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Loan Type">
            <Select
              value={inputs.loanType}
              onValueChange={(value) => update({ loanType: value as LoanType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOAN_TYPE_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Bank / Lender" hint={<Hint tip="Select a lender preset, then edit the rate if needed." />}>
            <Select
              value={inputs.bankPreset}
              onValueChange={(value) => update({ bankPreset: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOAN_BANK_PRESETS).map(([key, bank]) => (
                  <SelectItem key={key} value={key}>
                    {bank.shortName} ({bank.minRate}%-{bank.maxRate}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {selectedBank.name}
              {selectedBank.note ? ` • ${selectedBank.note}` : ""}
            </p>
          </Field>

          {hasPurchasePrice ? (
            <div className="md:col-span-2 grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
              <Field label="Purchase Price (GYD)">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.purchasePrice || ""}
                  onChange={(value) => update({ purchasePrice: safeNum(value) })}
                  placeholder="0"
                />
              </Field>
              <Field label="Down Payment (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={inputs.downPaymentPct || ""}
                  onChange={(event) => update({ downPaymentPct: safeNum(event.target.value) })}
                  placeholder="20"
                />
              </Field>
              <div className="md:col-span-2 rounded-lg border bg-background px-3 py-3 text-sm">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Financed Amount
                </p>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(financedAmount).replace("$", "GY$")}</p>
              </div>
            </div>
          ) : null}

          <div className="md:col-span-2 grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
            <Field
              label={
                <span className="inline-flex items-center gap-2">
                  Principal Amount ({inputs.currencyMode === "usd" ? "USD" : "GYD"})
                  <Hint tip="This is the amount you are financing after down payment or direct borrowing." />
                </span>
              }
            >
              <CurrencyInput
                prefix={inputs.currencyMode === "usd" ? "US$" : "GY$"}
                min={0}
                value={inputs.principalGYD || ""}
                onChange={(value) => update({ principalGYD: safeNum(value) })}
                placeholder="0"
              />
            </Field>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Currency Mode
              </Label>
              <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
                <Switch
                  checked={inputs.currencyMode === "usd"}
                  onCheckedChange={(checked) => update({ currencyMode: checked ? "usd" : "gyd" })}
                />
                <span className="text-sm">
                  {inputs.currencyMode === "usd" ? "USD entered, convert using exchange rate" : "GYD entered directly"}
                </span>
              </div>
            </div>

            {inputs.currencyMode === "usd" ? (
              <Field label="Exchange Rate">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={inputs.exchangeRate || ""}
                  onChange={(event) => update({ exchangeRate: safeNum(event.target.value, LOAN_DEFAULT_EXCHANGE_RATE) })}
                  placeholder={String(LOAN_DEFAULT_EXCHANGE_RATE)}
                />
              </Field>
            ) : (
              <div className="md:col-span-2 text-xs text-muted-foreground">
                USD mode lets you enter the principal in US dollars and converts it at the current exchange rate.
              </div>
            )}
          </div>

          <Field label="Annual Interest Rate (%)">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={inputs.annualRatePct || ""}
              onChange={(event) => update({ annualRatePct: safeNum(event.target.value) })}
              placeholder="0"
            />
          </Field>

          <Field label="Loan Term (months)">
            <Input
              type="number"
              min={1}
              max={360}
              step={1}
              value={inputs.termMonths || ""}
              onChange={(event) => update({ termMonths: Math.trunc(safeNum(event.target.value)) })}
              placeholder="60"
            />
            <p className="text-[11px] text-muted-foreground">
              {Math.round(inputs.termMonths / 12)} years
            </p>
          </Field>

          <Field label="First Payment Date">
            <Input
              type="date"
              value={inputs.firstPaymentDate || ""}
              onChange={(event) => update({ firstPaymentDate: event.target.value })}
            />
          </Field>

          <Field label="Processing Fee (%)" hint={<Hint tip="One-time origination or processing fee." />}>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.processingFeePct || ""}
              onChange={(event) => update({ processingFeePct: safeNum(event.target.value) })}
              placeholder="0"
            />
          </Field>

          <div className="md:col-span-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Payment Frequency
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(["monthly", "biweekly"] as PaymentFrequency[]).map((frequency) => (
                  <PillToggle
                    key={frequency}
                    active={inputs.paymentFrequency === frequency}
                    onClick={() => update({ paymentFrequency: frequency })}
                  >
                    {frequency === "biweekly" ? "Bi-weekly" : "Monthly"}
                  </PillToggle>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Extra Payments"
        defaultOpen={false}
        icon={<SlidersHorizontal className="size-3.5 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
            <Switch
              checked={inputs.extraPaymentsEnabled}
              onCheckedChange={(checked) => update({ extraPaymentsEnabled: checked })}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Enable extra payment analysis</Label>
                <Hint tip="Simulate extra monthly payments, lump sums, and recurring injections." />
              </div>
              <p className="text-xs text-muted-foreground">
                Useful for bonuses, gratuity, or one-time principal injections.
              </p>
            </div>
          </div>

          {inputs.extraPaymentsEnabled ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Additional Monthly Payment">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.additionalMonthly || ""}
                  onChange={(value) => update({ additionalMonthly: safeNum(value) })}
                  placeholder="0"
                />
              </Field>

              <Field label="One-Time Lump Sum">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.lumpSumAmount || ""}
                  onChange={(value) => update({ lumpSumAmount: safeNum(value) })}
                  placeholder="0"
                />
              </Field>

              <Field label="Apply Lump Sum at Month">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={inputs.lumpSumAtMonth || ""}
                  onChange={(event) => update({ lumpSumAtMonth: Math.trunc(safeNum(event.target.value)) })}
                  placeholder="1"
                />
              </Field>

              <Field label="Periodic Lump Amount">
                <CurrencyInput
                  prefix="GY$"
                  min={0}
                  value={inputs.periodicLumpAmount || ""}
                  onChange={(value) => update({ periodicLumpAmount: safeNum(value) })}
                  placeholder="0"
                />
              </Field>

              <Field label="Every">
                <Select
                  value={String(inputs.periodicLumpFrequency)}
                  onValueChange={(value) =>
                    update({
                      periodicLumpFrequency:
                        value === "custom" ? "custom" : (Number(value) as 3 | 6 | 12),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Every 3 months</SelectItem>
                    <SelectItem value="6">Every 6 months</SelectItem>
                    <SelectItem value="12">Every 12 months</SelectItem>
                    <SelectItem value="custom">Custom interval</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {inputs.periodicLumpFrequency === "custom" ? (
                <Field label="Custom Interval (months)">
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={inputs.periodicLumpCustomInterval || ""}
                    onChange={(event) =>
                      update({ periodicLumpCustomInterval: Math.trunc(safeNum(event.target.value)) })
                    }
                    placeholder="3"
                  />
                </Field>
              ) : null}

              <Field label="Starting at Month">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={inputs.periodicLumpStartMonth || ""}
                  onChange={(event) =>
                    update({ periodicLumpStartMonth: Math.trunc(safeNum(event.target.value)) })
                  }
                  placeholder="1"
                />
              </Field>
            </div>
          ) : null}
        </div>
      </Section>

      <Button type="button" variant="outline" size="sm" onClick={reset} className="w-full text-muted-foreground">
        <RotateCcw className="size-3.5" />
        Clear Form
      </Button>
    </div>
  )
}
