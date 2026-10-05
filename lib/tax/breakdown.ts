import type { CalculationResults } from "./types"

/**
 * One pay period's money flow, every figure at the selected pay frequency.
 * Charts, exports and summary bars read this instead of mixing per-period
 * gross/PAYE/NIS with the monthly take-home (finding B6).
 */
export interface PayBreakdown {
  gross: number
  nis: number
  paye: number
  insurance: number
  loan: number
  creditUnion: number
  otherDeductions: number
  totalDeductions: number
  net: number
}

export function buildPayBreakdown(r: CalculationResults): PayBreakdown {
  const otherDeductions = r.actualInsuranceDeduction + r.loanPayment + r.creditUnionDeduction
  return {
    gross: r.regularMonthlyGrossIncome,
    nis: r.nisContribution,
    paye: r.incomeTax,
    insurance: r.actualInsuranceDeduction,
    loan: r.loanPayment,
    creditUnion: r.creditUnionDeduction,
    otherDeductions,
    totalDeductions: r.nisContribution + r.incomeTax + otherDeductions,
    net: r.netSalaryForFrequency,
  }
}
