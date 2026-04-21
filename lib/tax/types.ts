export type PaymentFrequency = "daily" | "weekly" | "fortnightly" | "monthly" | "yearly"
export type QualificationType = "none" | "acca" | "masters" | "phd"
export type InsuranceType = "none" | "employee" | "employee-one" | "family" | "custom"

export interface FrequencyConfig {
  label: string
  factor: number
  personalAllowance: number
  taxThreshold: number
  nisRate: number
  nisCeiling: number
  childAllowance: number
  overtimeMax: number
  secondJobMax: number
  insuranceMaxMonthly: number
  periodLabel: string
  periodsPerYear: number
}

export interface PositionPreset {
  id: string
  title: string
  baseSalary: number
  taxableAllowances: Record<string, number>
  nonTaxableAllowances: Record<string, number>
  totalTaxableAllowances: number
  totalNonTaxableAllowances: number
}

export interface CalculatorInputs {
  position: string
  paymentFrequency: PaymentFrequency
  frequencyConfig: FrequencyConfig
  basicSalary: number
  taxableAllowances: number
  nonTaxableAllowances: number
  vacationAllowance: number
  qualificationType: QualificationType
  qualificationAllowance: number
  overtimeIncome: number
  secondJobIncome: number
  childCount: number
  loanPayment: number
  creditUnionDeduction: number
  insuranceType: InsuranceType
  insurancePremium: number
  gratuityRate: number
  gratuityPeriod: number
}

export interface CalculationResults {
  // Input echo
  paymentFrequency: PaymentFrequency
  frequencyConfig: FrequencyConfig
  basicSalary: number
  monthlyBasicSalary: number
  taxableAllowances: number
  nonTaxableAllowances: number
  vacationAllowance: number
  qualificationType: QualificationType
  qualificationAllowance: number
  overtimeIncome: number
  secondJobIncome: number
  childCount: number
  loanPayment: number
  creditUnionDeduction: number
  insurancePremium: number
  actualInsuranceDeduction: number
  gratuityRate: number

  // Frequency-specific
  regularMonthlyGrossIncome: number
  grossIncomeForTaxableCalculation: number
  personalAllowance: number
  nisContribution: number
  childAllowance: number
  overtimeAllowance: number
  secondJobAllowance: number
  taxableIncome: number
  incomeTax: number
  netSalaryForFrequency: number

  // Monthly equivalents
  monthlyGrossIncome: number
  monthlyNetSalary: number
  monthlyGratuityAccrual: number

  // Special months
  sixMonthGratuity: number
  monthSixTotal: number
  monthTwelveTotal: number

  // Annual
  annualGrossIncome: number
  annualNisContribution: number
  annualTaxPayable: number
  annualNetSalary: number
  annualGratuityTotal: number
  annualTotal: number
}

export interface SalaryIncreaseInputs {
  increasePercentage: number
  isTaxable: boolean
  retroactiveMonths: number
  isGratuityMonth: boolean
}

export interface SalaryIncreaseResults extends CalculationResults {
  retroactiveMonthlyIncrease: number
  totalRetroactiveLumpSum: number
  retroGratuityDifferential: number
  retroVacationAllowance: number
  totalRetroGross: number
  netPayWithRetroactiveLumpSum: number
  gratuityMonthNetPay: number
  gratuityMonthTotalPay: number
  isGratuityMonth: boolean
  basicSalaryDifference: number
  monthlyNetDifference: number
  monthlyGratuityDifference: number
  annualNetDifference: number
}
