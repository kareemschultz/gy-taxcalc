import type { LoanTypeConfig } from "./types"

export const LOAN_DEFAULT_EXCHANGE_RATE = 218
export const LOAN_RATES_VERIFIED_DATE = "April 2026"

export interface LoanBankPreset {
  name: string
  shortName: string
  minRate: number
  maxRate: number
  rate?: number
  maxTerm?: number
  type?: "credit_union" | "bank" | "custom"
  note?: string
}

export const LOAN_BANK_PRESETS: Record<string, LoanBankPreset> = {
  gpsccu: {
    name: "Guyana Public Service Co-operative Credit Union (GPSCCU)",
    shortName: "GPSCCU",
    rate: 12.0,
    minRate: 12.0,
    maxRate: 12.0,
    maxTerm: 84,
    type: "credit_union",
    note: "1% per month on reducing balance (12% p.a. nominal).",
  },
  gbti: {
    name: "Guyana Bank for Trade and Industry",
    shortName: "GBTI",
    minRate: 6.99,
    maxRate: 10.0,
    rate: 8.5,
    maxTerm: 84,
    type: "bank",
    note: "6.99% to 10% p.a. depending on vehicle type and age.",
  },
  republic: {
    name: "Republic Bank",
    shortName: "Republic",
    minRate: 6.0,
    maxRate: 12.0,
    rate: 9.0,
    maxTerm: 72,
    type: "bank",
    note: "Rates from 6% promotional to 12% p.a.",
  },
  "bank-of-baroda": {
    name: "Bank of Baroda",
    shortName: "Baroda",
    minRate: 10.0,
    maxRate: 14.0,
    rate: 11.0,
    maxTerm: 60,
    type: "bank",
    note: "Prime lending rate around 10% p.a.",
  },
  citizens: {
    name: "Citizens Bank",
    shortName: "Citizens",
    minRate: 9.5,
    maxRate: 13.0,
    rate: 11.25,
    maxTerm: 72,
    type: "bank",
    note: "Vehicle loan rates vary by age and type.",
  },
  demerara: {
    name: "Demerara Bank",
    shortName: "Demerara",
    minRate: 11.0,
    maxRate: 14.0,
    rate: 12.5,
    maxTerm: 60,
    type: "bank",
    note: "Rates depend on down payment contribution percentage.",
  },
  custom: {
    name: "Custom / Other",
    shortName: "Custom",
    minRate: 0,
    maxRate: 0,
    maxTerm: 360,
    type: "custom",
    note: "Enter your own interest rate and terms.",
  },
}

export const LOAN_TYPE_CONFIGS: Record<string, LoanTypeConfig> = {
  auto: {
    label: "Auto Loan",
    defaultTerm: 60,
    hasPurchasePrice: true,
    defaultPrincipal: 2500000,
    defaultBank: "republic",
  },
  personal: {
    label: "Personal Loan",
    defaultTerm: 36,
    hasPurchasePrice: false,
    defaultPrincipal: 500000,
    defaultBank: "gbti",
  },
  mortgage: {
    label: "Mortgage",
    defaultTerm: 240,
    hasPurchasePrice: true,
    defaultPrincipal: 15000000,
    defaultBank: "republic",
  },
  custom: {
    label: "Custom",
    defaultTerm: 60,
    hasPurchasePrice: false,
    defaultPrincipal: 1000000,
    defaultBank: "custom",
  },
}

export const LOAN_COMPARISON_BANKS = ["gpsccu", "gbti", "republic", "bank-of-baroda", "citizens", "demerara"]
