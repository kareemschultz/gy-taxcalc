import type { FrequencyConfig, PaymentFrequency, QualificationType, InsuranceType, PositionPreset } from "./types"

export const TAX_RATE_1 = 0.25
export const TAX_RATE_2 = 0.35
export const TAX_THRESHOLD = 280000
export const INCOME_TAX_THRESHOLD = 140000
export const CHILD_ALLOWANCE = 10000
export const OVERTIME_ALLOWANCE_MAX = 50000
export const SECOND_JOB_ALLOWANCE_MAX = 50000
export const NIS_RATE = 0.056
export const NIS_CEILING = 280000
export const GRATUITY_RATE_DEFAULT = 22.5

export const INSURANCE_PREMIUMS: Record<InsuranceType, number | string> = {
  none: 0,
  employee: 1469,
  "employee-one": 3182,
  family: 4970,
  custom: "custom",
}

export const PAYMENT_FREQUENCIES: Record<PaymentFrequency, FrequencyConfig> = {
  daily: {
    label: "Daily",
    factor: 1 / 21.67,
    personalAllowance: 6460,
    taxThreshold: 12922,
    nisRate: 0.056,
    nisCeiling: 12923,
    childAllowance: 462,
    overtimeMax: 2308,
    secondJobMax: 2308,
    insuranceMaxMonthly: 2308,
    periodLabel: "per day",
    periodsPerYear: 260,
  },
  weekly: {
    label: "Weekly",
    factor: 1 / 4.33,
    personalAllowance: 32333,
    taxThreshold: 64665,
    nisRate: 0.056,
    nisCeiling: 64615,
    childAllowance: 2308,
    overtimeMax: 11538,
    secondJobMax: 11538,
    insuranceMaxMonthly: 11538,
    periodLabel: "per week",
    periodsPerYear: 52,
  },
  fortnightly: {
    label: "Fortnightly",
    factor: 1 / 2.17,
    personalAllowance: 64516,
    taxThreshold: 128986,
    nisRate: 0.056,
    nisCeiling: 129231,
    childAllowance: 4615,
    overtimeMax: 23077,
    secondJobMax: 23077,
    insuranceMaxMonthly: 23077,
    periodLabel: "per fortnight",
    periodsPerYear: 26,
  },
  monthly: {
    label: "Monthly",
    factor: 1,
    personalAllowance: 140000,
    taxThreshold: 280000,
    nisRate: 0.056,
    nisCeiling: 280000,
    childAllowance: 10000,
    overtimeMax: 50000,
    secondJobMax: 50000,
    insuranceMaxMonthly: 50000,
    periodLabel: "per month",
    periodsPerYear: 12,
  },
  yearly: {
    label: "Yearly",
    factor: 12,
    personalAllowance: 1680000,
    taxThreshold: 3360000,
    nisRate: 0.056,
    nisCeiling: 3360000,
    childAllowance: 120000,
    overtimeMax: 600000,
    secondJobMax: 600000,
    insuranceMaxMonthly: 600000,
    periodLabel: "per year",
    periodsPerYear: 1,
  },
}

export const QUALIFICATION_ALLOWANCES_BY_FREQUENCY: Record<
  PaymentFrequency,
  Record<QualificationType, number>
> = {
  daily:       { none: 0, acca: 692,   masters: 1015,  phd: 1477  },
  weekly:      { none: 0, acca: 3462,  masters: 5077,  phd: 7385  },
  fortnightly: { none: 0, acca: 6923,  masters: 10154, phd: 14769 },
  monthly:     { none: 0, acca: 15000, masters: 22000, phd: 32000 },
  yearly:      { none: 0, acca: 180000,masters: 264000,phd: 384000},
}

export const POSITION_PRESETS: PositionPreset[] = [
  {
    id: "it-officer-2",
    title: "IT Officer II",
    baseSalary: 247451,
    taxableAllowances: { duty: 15000, uniform: 5000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 20000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "it-officer-3",
    title: "IT Officer III",
    baseSalary: 266000,
    taxableAllowances: { duty: 15000, uniform: 5000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 20000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "ict-tech-1",
    title: "ICT Technician I",
    baseSalary: 222804,
    taxableAllowances: { duty: 0, uniform: 5000 },
    nonTaxableAllowances: { travel: 5000, telecom: 5000 },
    totalTaxableAllowances: 5000,
    totalNonTaxableAllowances: 10000,
  },
  {
    id: "ict-tech-2",
    title: "ICT Technician II",
    baseSalary: 176564,
    taxableAllowances: { duty: 12000, uniform: 5000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 17000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "ict-tech-3",
    title: "ICT Technician III",
    baseSalary: 148051,
    taxableAllowances: { duty: 10000, uniform: 5000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 15000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "assist-ict-eng-3",
    title: "Assistant ICT Engineer III",
    baseSalary: 308540,
    taxableAllowances: { duty: 0, uniform: 0 },
    nonTaxableAllowances: { station: 5000, travel: 5000, telecom: 5000 },
    totalTaxableAllowances: 0,
    totalNonTaxableAllowances: 15000,
  },
  {
    id: "ict-eng-3",
    title: "ICT Engineer III",
    baseSalary: 393301,
    taxableAllowances: { uniform: 5000 },
    nonTaxableAllowances: { travel: 10000, telecom: 5000 },
    totalTaxableAllowances: 5000,
    totalNonTaxableAllowances: 15000,
  },
  {
    id: "senior-ict-eng",
    title: "Senior ICT Engineer",
    baseSalary: 613000,
    taxableAllowances: { uniform: 10000 },
    nonTaxableAllowances: { travel: 15000, telecom: 5000 },
    totalTaxableAllowances: 10000,
    totalNonTaxableAllowances: 20000,
  },
  {
    id: "admin-officer-2",
    title: "Administrative Officer II",
    baseSalary: 180000,
    taxableAllowances: { duty: 10000, uniform: 3000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 13000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "accounts-clerk-1",
    title: "Accounts Clerk I",
    baseSalary: 150000,
    taxableAllowances: { duty: 8000, uniform: 3000 },
    nonTaxableAllowances: { travel: 0, telecom: 0 },
    totalTaxableAllowances: 11000,
    totalNonTaxableAllowances: 0,
  },
  {
    id: "teacher-primary",
    title: "Primary School Teacher",
    baseSalary: 185000,
    taxableAllowances: { duty: 0, uniform: 0 },
    nonTaxableAllowances: { travel: 15000, station: 5000 },
    totalTaxableAllowances: 0,
    totalNonTaxableAllowances: 20000,
  },
  {
    id: "nurse-staff",
    title: "Staff Nurse",
    baseSalary: 220000,
    taxableAllowances: { duty: 20000, uniform: 5000 },
    nonTaxableAllowances: { travel: 8000, station: 5000 },
    totalTaxableAllowances: 25000,
    totalNonTaxableAllowances: 13000,
  },
]

export const COMMON_SALARY_INCREASES = [
  { value: 6,  label: "6% — Standard Government" },
  { value: 8,  label: "8% — July 2026 Increase" },
  { value: 10, label: "10% — Performance Based" },
  { value: 12, label: "12% — Promotion" },
  { value: 15, label: "15% — Significant Promotion" },
]

export function convertFromMonthly(monthlyAmount: number, frequency: PaymentFrequency): number {
  return monthlyAmount * PAYMENT_FREQUENCIES[frequency].factor
}

export function convertToMonthly(amount: number, frequency: PaymentFrequency): number {
  return amount / PAYMENT_FREQUENCIES[frequency].factor
}

export function getQualificationAllowance(
  qualificationType: QualificationType,
  frequency: PaymentFrequency
): number {
  return QUALIFICATION_ALLOWANCES_BY_FREQUENCY[frequency][qualificationType] ?? 0
}

export function getInsurancePremiumMonthly(type: InsuranceType): number {
  const val = INSURANCE_PREMIUMS[type]
  return typeof val === "number" ? val : 0
}
