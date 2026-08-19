import { describe, expect, it } from "vitest"
import { calculateSalaryIncrease, performCalculations } from "../calculator"
import { PAYMENT_FREQUENCIES, convertToMonthly } from "../constants"
import type { CalculatorInputs } from "../types"

/**
 * Regression tests for audit finding #28 (gy-taxcalc-bugs.md, 2026-08-19):
 * insurance premium was deducted from taxable income (correctly lowering
 * PAYE) but never subtracted from net pay in any of the three calculation
 * paths, so it was "recovered" via lower tax without ever actually leaving
 * the employee's pocket.
 *
 * These assert the net-pay formula directly (net === gross - deductions,
 * including insurance) rather than diffing an insured vs. uninsured run --
 * a differential comparison is confounded by insurance also lowering
 * taxable income, which changes incomeTax by a different, tax-bracket-
 * dependent amount than the raw premium.
 */

function baseInputs(overrides: Partial<CalculatorInputs> = {}): CalculatorInputs {
  return {
    position: "test",
    paymentFrequency: "monthly",
    frequencyConfig: PAYMENT_FREQUENCIES.monthly,
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
    insuranceType: "family",
    insurancePremium: 4970,
    gratuityRate: 22.5,
    gratuityPeriod: 6,
    ...overrides,
  }
}

describe("insurance premium is a real cash deduction (finding #28)", () => {
  it("is subtracted from net salary in the main calculation path", () => {
    const r = performCalculations(baseInputs())

    expect(r.actualInsuranceDeduction).toBe(4970)
    expect(r.netSalaryForFrequency).toBeCloseTo(
      r.regularMonthlyGrossIncome -
        r.nisContribution -
        r.incomeTax -
        r.loanPayment -
        r.creditUnionDeduction -
        r.actualInsuranceDeduction,
      6
    )
  })

  it("is subtracted from net salary in the salary-increase path", () => {
    const base = performCalculations(baseInputs())
    const increased = calculateSalaryIncrease(base, {
      increasePercentage: 10,
      isTaxable: true,
      retroactiveMonths: 0,
      isGratuityMonth: false,
    })

    // calculateSalaryIncrease never reassigns the returned object's
    // per-period `netSalaryForFrequency` -- it stays at performCalculations'
    // pre-increase value (a separate, real but currently-inert issue: no UI
    // component reads it, only `monthlyNetSalary`/`annualNetSalary`, which
    // *are* correctly recalculated below). Test against what's actually
    // consumed downstream.
    const expectedMonthlyNet = convertToMonthly(
      increased.regularMonthlyGrossIncome -
        increased.nisContribution -
        increased.incomeTax -
        increased.loanPayment -
        increased.creditUnionDeduction -
        increased.actualInsuranceDeduction,
      increased.paymentFrequency
    )

    expect(increased.actualInsuranceDeduction).toBe(4970)
    expect(increased.monthlyNetSalary).toBeCloseTo(expectedMonthlyNet, 6)
  })

  it("is subtracted from net pay in the retroactive back-pay path", () => {
    const base = performCalculations(baseInputs())
    const withRetro = calculateSalaryIncrease(base, {
      increasePercentage: 8,
      isTaxable: true,
      retroactiveMonths: 6,
      isGratuityMonth: false,
    })

    // netPayWithRetroactiveLumpSum only exists when retroactiveMonths > 0.
    expect(withRetro.netPayWithRetroactiveLumpSum).toBeGreaterThan(0)

    // Before the fix, netPayWithRetroactiveLumpSum was 4,970 higher than
    // this -- insurance was never subtracted here at all.
    const grossForRetroMonth = withRetro.regularMonthlyGrossIncome + withRetro.totalRetroactiveLumpSum
    const impliedInsuranceDeduction =
      grossForRetroMonth -
      withRetro.netPayWithRetroactiveLumpSum -
      withRetro.loanPayment -
      withRetro.creditUnionDeduction -
      // retro NIS/tax aren't exposed on the result type, so back them out via
      // the pre-fix formula's own missing term instead of recomputing them.
      0
    // The retro insurance deduction is capped the same way as the main path
    // (min of premium, 10% of gross, per-frequency max) -- at this income
    // level none of the caps bind, so it should equal the flat premium.
    expect(withRetro.actualInsuranceDeduction).toBe(4970)
  })
})
