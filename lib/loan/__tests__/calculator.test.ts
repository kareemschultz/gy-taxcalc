import { describe, expect, it } from "vitest"
import { aggregateYearly, buildAmortizationSchedule, calculateLoan, calculateMonthlyPayment } from "../calculator"
import type { LoanInputs } from "../types"

/**
 * The loan module had no tests before the 2026-10-05 repo sweep. These cover
 * the core amortisation maths plus findings B7, B8, B9 and the term = 0
 * Infinity crash. See CHANGELOG 2.8.0.
 */

function inputs(overrides: Partial<LoanInputs> = {}): LoanInputs {
  return {
    loanType: "custom",
    bankPreset: "custom",
    principalGYD: 1_000_000,
    currencyMode: "gyd",
    exchangeRate: 218,
    annualRatePct: 9,
    termMonths: 60,
    firstPaymentDate: "2026-01-15",
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
    ...overrides,
  }
}

describe("core amortisation", () => {
  it("matches the standard annuity formula", () => {
    // 1,000,000 at 9% over 60 months = 20,758.36 per month
    expect(calculateMonthlyPayment(1_000_000, 9, 60)).toBeCloseTo(20758.36, 2)
  })

  it("handles a 0% rate as straight-line repayment", () => {
    expect(calculateMonthlyPayment(1_200_000, 0, 12)).toBe(100_000)
  })

  it("pays the balance down to zero over the term", () => {
    const schedule = buildAmortizationSchedule(1_000_000, 9, 60)
    expect(schedule).toHaveLength(60)
    expect(schedule.at(-1)!.balance).toBeCloseTo(0, 2)
    const principalPaid = schedule.reduce((s, r) => s + r.principal, 0)
    expect(principalPaid).toBeCloseTo(1_000_000, 2)
  })

  it("groups a monthly schedule into years of 12 payments", () => {
    const years = aggregateYearly(buildAmortizationSchedule(1_000_000, 9, 60))
    expect(years).toHaveLength(5)
  })
})

describe("term or principal of zero never produces Infinity or NaN", () => {
  for (const paymentFrequency of ["monthly", "biweekly"] as const) {
    it(`term 0 (${paymentFrequency})`, () => {
      const r = calculateLoan(inputs({ termMonths: 0, paymentFrequency }))
      for (const value of [r.monthlyPayment, r.biweeklyPayment ?? 0, r.totalInterest, r.totalPaid, r.interestCostPct]) {
        expect(Number.isFinite(value)).toBe(true)
      }
      expect(r.monthlyPayment).toBe(0)
      expect(r.biweeklyPayment ?? 0).toBe(0)
      expect(r.amortizationSchedule).toHaveLength(0)
    })
  }

  it("an extreme interest rate still gives a finite payment", () => {
    const payment = calculateMonthlyPayment(1_000_000, 10_000, 360)
    expect(Number.isFinite(payment)).toBe(true)
    // At very high rates the payment approaches interest-only.
    expect(payment).toBeCloseTo(1_000_000 * (10_000 / 100 / 12), 0)
  })
})

describe("B7: the loan rate is the rate, interest cost is labelled separately", () => {
  it("reports total interest as a percentage of the loan, not as a rate", () => {
    const r = calculateLoan(inputs())
    expect(r.annualRatePct).toBe(9)
    expect(r.interestCostPct).toBeCloseTo((r.totalInterest / 1_000_000) * 100, 6)
  })
})

describe("B8: bi-weekly schedules use bi-weekly periods, not months", () => {
  it("groups 26 bi-weekly payments into a year", () => {
    const r = calculateLoan(inputs({ paymentFrequency: "biweekly" }))
    expect(r.periodsPerYear).toBe(26)
    expect(r.yearlySchedule).toHaveLength(5)
  })

  it("reports months saved in months for extra payments on a bi-weekly loan", () => {
    const base = calculateLoan(inputs({ paymentFrequency: "biweekly" }))
    const r = calculateLoan(
      inputs({ paymentFrequency: "biweekly", extraPaymentsEnabled: true, additionalMonthly: 10_000 })
    )
    expect(r.monthsSaved).toBeGreaterThan(0)
    expect(r.monthsSaved).toBeLessThan(60)
    expect(r.monthsSaved).toBe(base.payoffMonths - r.payoffMonths)
    expect(r.newPayoffDate).toBe(r.payoffDate)
  })

  it("compares bi-weekly against monthly in months", () => {
    const monthly = calculateLoan(inputs())
    const biweekly = calculateLoan(inputs({ paymentFrequency: "biweekly" }))
    expect(biweekly.biweeklyMonthsSaved).toBe(Math.max(0, monthly.payoffMonths - biweekly.payoffMonths))
  })
})

describe("B9: the new regular payment excludes one-off lump sums", () => {
  it("is the scheduled payment plus the additional monthly amount (monthly)", () => {
    const r = calculateLoan(
      inputs({
        extraPaymentsEnabled: true,
        additionalMonthly: 5_000,
        lumpSumAmount: 200_000,
        lumpSumAtMonth: 1,
        periodicLumpAmount: 50_000,
        periodicLumpStartMonth: 1,
      })
    )
    expect(r.paymentWithExtras).toBeCloseTo(r.monthlyPayment + 5_000, 6)
  })

  it("converts the additional monthly amount to a bi-weekly amount (bi-weekly)", () => {
    const r = calculateLoan(
      inputs({ paymentFrequency: "biweekly", extraPaymentsEnabled: true, additionalMonthly: 2_600, lumpSumAmount: 100_000 })
    )
    expect(r.paymentWithExtras).toBeCloseTo((r.biweeklyPayment ?? 0) + 1_200, 6)
  })
})
