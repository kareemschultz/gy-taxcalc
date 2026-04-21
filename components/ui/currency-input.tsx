"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> & {
  value?: string | number
  prefix?: string
  onChange?: (value: string) => void
}

function stripCurrency(value: string) {
  return value.replace(/[^\d.-]/g, "")
}

function formatCurrencyValue(value: string, prefix: string) {
  if (!value) return ""
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return value
  return `${prefix}${numeric.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value, prefix = "GY$", onChange, onFocus, onBlur, className, ...props },
    ref
  ) {
    const [focused, setFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(() =>
      value === undefined || value === null ? "" : String(value)
    )

    React.useEffect(() => {
      if (focused) return
      setInternalValue(value === undefined || value === null ? "" : String(value))
    }, [value, focused])

    const displayValue = focused
      ? stripCurrency(internalValue)
      : formatCurrencyValue(stripCurrency(internalValue), prefix)

    return (
      <Input
        ref={ref}
        inputMode="decimal"
        value={displayValue}
        onFocus={(event) => {
          setFocused(true)
          setInternalValue(stripCurrency(displayValue))
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          const raw = stripCurrency((event.target as HTMLInputElement).value)
          setInternalValue(raw)
          onChange?.(raw)
          onBlur?.(event)
        }}
        onChange={(event) => {
          const raw = stripCurrency(event.target.value)
          setInternalValue(raw)
          onChange?.(raw)
        }}
        className={cn(className)}
        {...props}
      />
    )
  }
)
