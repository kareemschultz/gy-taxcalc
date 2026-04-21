import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "$0.00"
  return (
    "$" +
    amount
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  )
}

export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return "$" + (amount / 1_000_000).toFixed(2) + "M"
  }
  if (Math.abs(amount) >= 1_000) {
    return "$" + (amount / 1_000).toFixed(1) + "K"
  }
  return formatCurrency(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + "%"
}

export function safeNum(value: string | number | undefined | null, fallback = 0): number {
  const n = typeof value === "string" ? parseFloat(value) : value
  return n !== undefined && n !== null && !isNaN(n as number) ? (n as number) : fallback
}
