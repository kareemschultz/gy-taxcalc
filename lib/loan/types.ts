export type LoanType = "auto" | "personal" | "mortgage" | "custom"
export type PaymentFrequency = "monthly" | "biweekly"
export type LumpSumFrequency = 3 | 6 | 12 | "custom"

export interface LoanInputs {
  loanType: LoanType
  bankPreset: string
  purchasePrice?: number
  downPaymentPct?: number
  principalGYD: number
  currencyMode: "gyd" | "usd"
  exchangeRate: number
  annualRatePct: number
  termMonths: number
  firstPaymentDate?: string
  processingFeePct: number
  paymentFrequency: PaymentFrequency
  extraPaymentsEnabled: boolean
  additionalMonthly: number
  lumpSumAmount: number
  lumpSumAtMonth: number
  periodicLumpAmount: number
  periodicLumpFrequency: LumpSumFrequency
  periodicLumpCustomInterval: number
  periodicLumpStartMonth: number
}

export interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
  extra?: number
}

export interface YearlyRow {
  year: number
  totalPayment: number
  totalPrincipal: number
  totalInterest: number
  endBalance: number
}

export interface LoanResults {
  monthlyPayment: number
  biweeklyPayment?: number
  totalInterest: number
  totalPaid: number
  payoffDate: string
  processingFee: number
  termMonths: number
  effectiveRate: number
  amortizationSchedule: AmortizationRow[]
  yearlySchedule: YearlyRow[]
  baseSchedule: AmortizationRow[]
  extraSchedule?: AmortizationRow[]
  monthsSaved?: number
  interestSaved?: number
  newPayoffDate?: string
  biweeklyMonthsSaved?: number
  biweeklyInterestSaved?: number
}

export interface BankComparison {
  name: string
  shortName: string
  minRate: number
  maxRate: number
  monthlyPaymentMin: number
  monthlyPaymentMax: number
  totalInterestMin: number
  totalInterestMax: number
}

export interface LoanTypeConfig {
  label: string
  defaultTerm: number
  hasPurchasePrice: boolean
  defaultPrincipal?: number
  defaultBank?: string
}
