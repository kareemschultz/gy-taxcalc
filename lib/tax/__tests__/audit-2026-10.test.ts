import { describe, expect, it } from "vitest"
import { calculateSalaryIncrease, performCalculations } from "../calculator"
import { PAYMENT_FREQUENCIES } from "../constants"
import { buildPayBreakdown } from "../breakdown"
import type { CalculatorInputs, PaymentFrequency } from "../types"

/**
 * Regression tests for the 2026-10-05 repo-sweep findings (B1, B3, B6).
 * See CHANGELOG 2.8.0.
 */

function inputs(overrides: Partial<CalculatorInputs> = {}): CalculatorInputs {
  const paymentFrequency: PaymentFrequency = overrides.paymentFrequency ?? "monthly"
  return {
    position: "test",
    paymentFrequency,
    frequencyConfig: PAYMENT_FREQUENCIES[paymentFrequency],
    basicSalary: 250000,
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
    ...overrides,
  }
}

describe("B1: back pay is computed in one unit for every pay frequency", () => {
  const frequencies: PaymentFrequency[] = ["weekly", "fortnightly", "monthly"]

  for (const paymentFrequency of frequencies) {
    it(`adds a positive amount, never more than the gross back pay (${paymentFrequency})`, () => {
      const basicSalary = { weekly: 60000, fortnightly: 120000, monthly: 260000 }[paymentFrequency as "weekly"]
      const base = performCalculations(inputs({ paymentFrequency, basicSalary }))
      const withRetro = calculateSalaryIncrease(base, {
        increasePercentage: 8,
        isTaxable: true,
        retroactiveMonths: 6,
        isGratuityMonth: true,
      })
      const noRetro = calculateSalaryIncrease(base, {
        increasePercentage: 8,
        isTaxable: true,
        retroactiveMonths: 0,
        isGratuityMonth: true,
      })

      const annualBackPayEffect = withRetro.annualTotal - noRetro.annualTotal
      const grossBackPay = withRetro.totalRetroactiveLumpSum + withRetro.retroGratuityDifferential

      expect(withRetro.totalRetroactiveLumpSum).toBeGreaterThan(0)
      expect(annualBackPayEffect).toBeGreaterThan(0)
      expect(annualBackPayEffect).toBeLessThanOrEqual(grossBackPay + 1e-6)

      const gratuityMonthEffect = withRetro.gratuityMonthTotalPay - noRetro.gratuityMonthTotalPay
      expect(gratuityMonthEffect).toBeCloseTo(annualBackPayEffect, 6)
    })
  }
})

describe("B3: the gratuity payout follows the chosen gratuity period", () => {
  for (const gratuityPeriod of [3, 6, 9, 12]) {
    it(`pays monthly accrual x ${gratuityPeriod} per payout and accrues 12 months a year`, () => {
      const r = performCalculations(inputs({ gratuityPeriod }))

      expect(r.gratuityPeriodMonths).toBe(gratuityPeriod)
      expect(r.gratuityPayout).toBeCloseTo(r.monthlyGratuityAccrual * gratuityPeriod, 6)
      expect(r.annualGratuityTotal).toBeCloseTo(r.monthlyGratuityAccrual * 12, 6)
      expect(r.gratuityPayoutMonths).toEqual(
        Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => m % gratuityPeriod === 0)
      )
      expect(r.gratuityMonthTotal).toBeCloseTo(r.monthlyNetSalary + r.gratuityPayout, 6)
    })
  }

  it("only adds a gratuity payout to month 12 when one falls due in December", () => {
    const quarterly = performCalculations(inputs({ gratuityPeriod: 3, vacationAllowance: 50000 }))
    expect(quarterly.monthTwelveTotal).toBeCloseTo(
      quarterly.monthlyNetSalary + quarterly.gratuityPayout + 50000,
      6
    )

    const nineMonthly = performCalculations(inputs({ gratuityPeriod: 9, vacationAllowance: 50000 }))
    expect(nineMonthly.monthTwelveTotal).toBeCloseTo(nineMonthly.monthlyNetSalary + 50000, 6)
  })

  it("keeps the gratuity period in the salary-increase path", () => {
    const base = performCalculations(inputs({ gratuityPeriod: 3 }))
    const r = calculateSalaryIncrease(base, {
      increasePercentage: 10,
      isTaxable: true,
      retroactiveMonths: 0,
      isGratuityMonth: true,
    })
    expect(r.gratuityPayout).toBeCloseTo(r.monthlyGratuityAccrual * 3, 6)
    expect(r.gratuityMonthTotalPay).toBeCloseTo(r.monthlyNetSalary + r.gratuityPayout, 6)
  })
})

describe("B6: one pay breakdown, all in the selected pay period", () => {
  for (const paymentFrequency of ["daily", "weekly", "fortnightly", "monthly", "yearly"] as const) {
    it(`deductions add up to take-home in the same unit (${paymentFrequency})`, () => {
      const basicSalary = { daily: 12000, weekly: 60000, fortnightly: 120000, monthly: 260000, yearly: 3120000 }[
        paymentFrequency
      ]
      const r = performCalculations(
        inputs({
          paymentFrequency,
          basicSalary,
          insuranceType: "custom",
          insurancePremium: basicSalary * 0.02,
          loanPayment: basicSalary * 0.05,
          creditUnionDeduction: basicSalary * 0.01,
        })
      )
      const b = buildPayBreakdown(r)

      expect(b.gross).toBe(r.regularMonthlyGrossIncome)
      expect(b.net).toBe(r.netSalaryForFrequency)
      expect(b.gross - b.nis - b.paye - b.insurance - b.loan - b.creditUnion).toBeCloseTo(b.net, 6)
      expect(b.insurance).toBe(r.actualInsuranceDeduction)
      expect(b.otherDeductions).toBeCloseTo(b.insurance + b.loan + b.creditUnion, 6)
      expect(b.totalDeductions).toBeCloseTo(b.gross - b.net, 6)
    })
  }
})
