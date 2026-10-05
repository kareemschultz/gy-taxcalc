import {
  TAX_RATE_1,
  TAX_RATE_2,
  convertToMonthly,
  convertFromMonthly,
  getInsurancePremiumMonthly,
} from "./constants"
import type {
  CalculatorInputs,
  CalculationResults,
  SalaryIncreaseInputs,
  SalaryIncreaseResults,
} from "./types"

/**
 * Gratuity accrues every month and is paid out every `periodMonths` months,
 * with the cycle counted from January. A period that does not divide 12
 * (e.g. 9) has no payout in some calendar years; the annual figure is the
 * 12 months accrued.
 */
function gratuitySchedule(monthlyAccrual: number, periodMonths: number) {
  const period = periodMonths > 0 ? periodMonths : 6
  const payout = monthlyAccrual * period
  const payoutMonths = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => m % period === 0)
  return {
    periodMonths: period,
    payout,
    payoutMonths,
    decemberPayout: payoutMonths.includes(12) ? payout : 0,
    /** True when the first payout of the year is in December (an annual gratuity). */
    firstPayoutInDecember: (payoutMonths[0] ?? period) === 12,
    annualAccrual: monthlyAccrual * 12,
  }
}

export function performCalculations(inputs: CalculatorInputs): CalculationResults {
  const {
    paymentFrequency,
    basicSalary,
    taxableAllowances,
    nonTaxableAllowances,
    vacationAllowance,
    qualificationType,
    qualificationAllowance,
    overtimeIncome,
    secondJobIncome,
    childCount,
    loanPayment,
    creditUnionDeduction,
    insuranceType,
    insurancePremium,
    gratuityRate,
    gratuityPeriod,
  } = inputs

  const frequencyConfig = inputs.frequencyConfig

  // Monthly basic salary for gratuity (always monthly-based)
  const monthlyBasicSalary = convertToMonthly(basicSalary, paymentFrequency)

  // Gratuity accrual
  const monthlyGratuityAccrual = monthlyBasicSalary * (gratuityRate / 100)
  const gratuity = gratuitySchedule(monthlyGratuityAccrual, gratuityPeriod)

  // Gross income at selected frequency
  const regularMonthlyGrossIncome =
    basicSalary +
    taxableAllowances +
    qualificationAllowance +
    nonTaxableAllowances +
    overtimeIncome +
    secondJobIncome

  // NIS
  const nisContribution = Math.min(
    regularMonthlyGrossIncome * frequencyConfig.nisRate,
    frequencyConfig.nisCeiling * frequencyConfig.nisRate
  )

  // Child allowance
  const childAllowance = childCount * frequencyConfig.childAllowance

  // Overtime and second-job statutory non-taxable portions
  const overtimeAllowance = Math.min(overtimeIncome, frequencyConfig.overtimeMax)
  const secondJobAllowance = Math.min(secondJobIncome, frequencyConfig.secondJobMax)

  // Insurance deduction cap: min(actual premium, 10% of gross, frequency max)
  let resolvedInsurancePremium = insurancePremium
  if (insuranceType !== "custom") {
    const monthlyPremium = getInsurancePremiumMonthly(insuranceType)
    resolvedInsurancePremium = convertFromMonthly(monthlyPremium, paymentFrequency)
  }
  const actualInsuranceDeduction = Math.min(
    resolvedInsurancePremium,
    regularMonthlyGrossIncome * 0.1,
    frequencyConfig.insuranceMaxMonthly
  )

  // Balance of Income — gross minus non-taxable and statutory OT/second-job portions
  // Per GRA: personal allowance 1/3 applies to Balance of Income, not total gross
  const grossIncomeForTaxableCalculation =
    regularMonthlyGrossIncome - nonTaxableAllowances - overtimeAllowance - secondJobAllowance

  // Personal allowance: GYD 140,000 (frequency-scaled) OR 1/3 of BoI — whichever is greater
  const personalAllowance = Math.max(
    frequencyConfig.personalAllowance,
    grossIncomeForTaxableCalculation / 3
  )

  // Chargeable income
  const taxableIncome = Math.max(
    0,
    grossIncomeForTaxableCalculation -
      personalAllowance -
      nisContribution -
      childAllowance -
      actualInsuranceDeduction
  )

  // Income tax (2-bracket)
  let incomeTax: number
  if (taxableIncome <= frequencyConfig.taxThreshold) {
    incomeTax = taxableIncome * TAX_RATE_1
  } else {
    incomeTax =
      frequencyConfig.taxThreshold * TAX_RATE_1 +
      (taxableIncome - frequencyConfig.taxThreshold) * TAX_RATE_2
  }

  // Net salary — insurance is a real cash deduction, not just a PAYE reduction
  const netSalaryForFrequency =
    regularMonthlyGrossIncome -
    nisContribution -
    incomeTax -
    loanPayment -
    creditUnionDeduction -
    actualInsuranceDeduction

  // Monthly equivalents
  const monthlyGrossIncome = convertToMonthly(regularMonthlyGrossIncome, paymentFrequency)
  const monthlyNetSalary = convertToMonthly(netSalaryForFrequency, paymentFrequency)

  // Special months (always monthly). December gets a payout only when one falls due then.
  // An annual gratuity is paid in December, alongside the vacation allowance.
  const gratuityMonthTotal =
    monthlyNetSalary + gratuity.payout + (gratuity.firstPayoutInDecember ? vacationAllowance : 0)
  const monthTwelveTotal = monthlyNetSalary + gratuity.decemberPayout + vacationAllowance

  // Annual
  const annualGrossIncome = regularMonthlyGrossIncome * frequencyConfig.periodsPerYear
  const annualNisContribution = nisContribution * frequencyConfig.periodsPerYear
  const annualTaxPayable = incomeTax * frequencyConfig.periodsPerYear
  const annualNetSalary = netSalaryForFrequency * frequencyConfig.periodsPerYear
  const annualGratuityTotal = gratuity.annualAccrual
  const annualTotal = annualNetSalary + annualGratuityTotal + vacationAllowance

  return {
    paymentFrequency,
    frequencyConfig,
    basicSalary,
    monthlyBasicSalary,
    taxableAllowances,
    nonTaxableAllowances,
    vacationAllowance,
    qualificationType,
    qualificationAllowance,
    overtimeIncome,
    secondJobIncome,
    childCount,
    loanPayment,
    creditUnionDeduction,
    insurancePremium: resolvedInsurancePremium,
    actualInsuranceDeduction,
    gratuityRate,
    regularMonthlyGrossIncome,
    grossIncomeForTaxableCalculation,
    personalAllowance,
    nisContribution,
    childAllowance,
    overtimeAllowance,
    secondJobAllowance,
    taxableIncome,
    incomeTax,
    netSalaryForFrequency,
    monthlyGrossIncome,
    monthlyNetSalary,
    monthlyGratuityAccrual,
    gratuityPeriodMonths: gratuity.periodMonths,
    gratuityPayout: gratuity.payout,
    gratuityPayoutMonths: gratuity.payoutMonths,
    gratuityMonthTotal,
    monthTwelveTotal,
    annualGrossIncome,
    annualNisContribution,
    annualTaxPayable,
    annualNetSalary,
    annualGratuityTotal,
    annualTotal,
  }
}

export function calculateSalaryIncrease(
  baseResults: CalculationResults,
  increase: SalaryIncreaseInputs
): SalaryIncreaseResults {
  const { increasePercentage, isTaxable, retroactiveMonths, isGratuityMonth } = increase
  const freq = baseResults.frequencyConfig

  const increasedBasicSalaryForFrequency = baseResults.basicSalary * (1 + increasePercentage / 100)
  const monthlyBasicIncreaseAmount =
    convertToMonthly(increasedBasicSalaryForFrequency, baseResults.paymentFrequency) -
    baseResults.monthlyBasicSalary
  const increaseAmountForFrequency = increasedBasicSalaryForFrequency - baseResults.basicSalary

  // Deep copy and apply increase
  const newResults = { ...baseResults }

  if (isTaxable) {
    newResults.basicSalary = increasedBasicSalaryForFrequency
  } else {
    newResults.nonTaxableAllowances = baseResults.nonTaxableAllowances + increaseAmountForFrequency
  }

  // Recalculate gratuity
  newResults.monthlyBasicSalary = convertToMonthly(newResults.basicSalary, baseResults.paymentFrequency)
  newResults.monthlyGratuityAccrual = newResults.monthlyBasicSalary * (newResults.gratuityRate / 100)
  const gratuity = gratuitySchedule(newResults.monthlyGratuityAccrual, baseResults.gratuityPeriodMonths)
  newResults.gratuityPayout = gratuity.payout

  // New gross
  newResults.regularMonthlyGrossIncome =
    newResults.basicSalary +
    newResults.taxableAllowances +
    newResults.qualificationAllowance +
    newResults.nonTaxableAllowances +
    newResults.overtimeIncome +
    newResults.secondJobIncome

  // NIS
  newResults.nisContribution = Math.min(
    newResults.regularMonthlyGrossIncome * freq.nisRate,
    freq.nisCeiling * freq.nisRate
  )

  // Insurance
  const newActualInsuranceDeduction = Math.min(
    newResults.insurancePremium,
    newResults.regularMonthlyGrossIncome * 0.1,
    freq.insuranceMaxMonthly
  )
  newResults.actualInsuranceDeduction = newActualInsuranceDeduction

  // OT/second-job allowances
  newResults.overtimeAllowance = Math.min(newResults.overtimeIncome, freq.overtimeMax)
  newResults.secondJobAllowance = Math.min(newResults.secondJobIncome, freq.secondJobMax)

  // Balance of Income
  const grossIncomeForTaxable =
    newResults.regularMonthlyGrossIncome -
    newResults.nonTaxableAllowances -
    newResults.overtimeAllowance -
    newResults.secondJobAllowance
  newResults.grossIncomeForTaxableCalculation = grossIncomeForTaxable

  // Personal allowance
  newResults.personalAllowance = Math.max(freq.personalAllowance, grossIncomeForTaxable / 3)

  // Chargeable income
  newResults.taxableIncome = Math.max(
    0,
    grossIncomeForTaxable -
      newResults.personalAllowance -
      newResults.nisContribution -
      newResults.childAllowance -
      newActualInsuranceDeduction
  )

  // Income tax
  if (newResults.taxableIncome <= freq.taxThreshold) {
    newResults.incomeTax = newResults.taxableIncome * TAX_RATE_1
  } else {
    newResults.incomeTax =
      freq.taxThreshold * TAX_RATE_1 +
      (newResults.taxableIncome - freq.taxThreshold) * TAX_RATE_2
  }

  // Net at selected frequency, then convert to true monthly (mirrors performCalculations)
  const newNetSalaryForFrequency =
    newResults.regularMonthlyGrossIncome -
    newResults.nisContribution -
    newResults.incomeTax -
    newResults.loanPayment -
    newResults.creditUnionDeduction -
    newActualInsuranceDeduction
  newResults.netSalaryForFrequency = newNetSalaryForFrequency
  newResults.monthlyGrossIncome = convertToMonthly(newResults.regularMonthlyGrossIncome, baseResults.paymentFrequency)
  newResults.monthlyNetSalary = convertToMonthly(newNetSalaryForFrequency, baseResults.paymentFrequency)
  newResults.annualNetSalary = newNetSalaryForFrequency * freq.periodsPerYear

  // Retroactive calculations
  let retroactiveMonthlyIncrease = 0
  let totalRetroactiveLumpSum = 0
  let retroGratuityDifferential = 0
  let retroVacationAllowance = 0
  let totalRetroGross = 0
  let netPayWithRetroactiveLumpSum = 0
  let netEffectOfBackpay = 0

  if (retroactiveMonths > 0) {
    retroactiveMonthlyIncrease = monthlyBasicIncreaseAmount
    totalRetroactiveLumpSum = monthlyBasicIncreaseAmount * retroactiveMonths

    const oldMonthlyGratuity = baseResults.monthlyBasicSalary * (baseResults.gratuityRate / 100)
    const newMonthlyGratuity = newResults.monthlyBasicSalary * (newResults.gratuityRate / 100)
    retroGratuityDifferential = (newMonthlyGratuity - oldMonthlyGratuity) * retroactiveMonths

    totalRetroGross = totalRetroactiveLumpSum + retroGratuityDifferential

    const grossForRetroMonth = newResults.regularMonthlyGrossIncome + totalRetroactiveLumpSum
    const retroGrossForTaxable =
      grossForRetroMonth -
      newResults.nonTaxableAllowances -
      newResults.overtimeAllowance -
      newResults.secondJobAllowance

    const retroPersonalAllowance = Math.max(freq.personalAllowance, retroGrossForTaxable / 3)
    const retroNisContribution = Math.min(grossForRetroMonth * freq.nisRate, freq.nisCeiling * freq.nisRate)
    const retroActualInsuranceDeduction = Math.min(
      newResults.insurancePremium,
      grossForRetroMonth * 0.1,
      freq.insuranceMaxMonthly
    )

    const retroTaxableIncome = Math.max(
      0,
      retroGrossForTaxable -
        retroPersonalAllowance -
        retroNisContribution -
        newResults.childAllowance -
        retroActualInsuranceDeduction
    )

    let retroIncomeTax: number
    if (retroTaxableIncome <= freq.taxThreshold) {
      retroIncomeTax = retroTaxableIncome * TAX_RATE_1
    } else {
      retroIncomeTax =
        freq.taxThreshold * TAX_RATE_1 + (retroTaxableIncome - freq.taxThreshold) * TAX_RATE_2
    }

    netPayWithRetroactiveLumpSum =
      grossForRetroMonth -
      retroNisContribution -
      retroIncomeTax -
      newResults.loanPayment -
      newResults.creditUnionDeduction -
      retroActualInsuranceDeduction

    // The back pay is paid in one pay period, so its net effect is that period's
    // net minus a normal period's net -- both at the selected frequency.
    netEffectOfBackpay = netPayWithRetroactiveLumpSum - newNetSalaryForFrequency
  }

  // Gratuity month calculation
  let gratuityMonthNetPay = 0
  let gratuityMonthTotalPay = 0

  if (isGratuityMonth) {
    let calculatedTotal = newResults.monthlyNetSalary
    calculatedTotal += newResults.gratuityPayout

    if (retroactiveMonths > 0) {
      calculatedTotal += netEffectOfBackpay
      calculatedTotal += retroGratuityDifferential
    }

    gratuityMonthNetPay = newResults.monthlyNetSalary
    gratuityMonthTotalPay = calculatedTotal
  }

  // Annual figures
  newResults.annualGrossIncome = newResults.regularMonthlyGrossIncome * freq.periodsPerYear
  newResults.annualNisContribution = newResults.nisContribution * freq.periodsPerYear
  newResults.annualTaxPayable = newResults.incomeTax * freq.periodsPerYear
  newResults.annualGratuityTotal = gratuity.annualAccrual
  newResults.annualTotal =
    newResults.annualNetSalary +
    newResults.annualGratuityTotal +
    (newResults.vacationAllowance || 0)

  if (retroactiveMonths > 0) {
    newResults.annualTotal += netEffectOfBackpay + retroGratuityDifferential
  }

  newResults.gratuityMonthTotal =
    newResults.monthlyNetSalary +
    newResults.gratuityPayout +
    (gratuity.firstPayoutInDecember ? newResults.vacationAllowance || 0 : 0)
  newResults.monthTwelveTotal =
    newResults.monthlyNetSalary +
    gratuity.decemberPayout +
    (newResults.vacationAllowance || 0)

  return {
    ...newResults,
    retroactiveMonthlyIncrease,
    totalRetroactiveLumpSum,
    retroGratuityDifferential,
    retroVacationAllowance,
    totalRetroGross,
    netPayWithRetroactiveLumpSum,
    gratuityMonthNetPay,
    gratuityMonthTotalPay,
    isGratuityMonth,
    basicSalaryDifference: newResults.basicSalary - baseResults.basicSalary,
    monthlyNetDifference: newResults.monthlyNetSalary - baseResults.monthlyNetSalary,
    monthlyGratuityDifference: newResults.monthlyGratuityAccrual - baseResults.monthlyGratuityAccrual,
    annualNetDifference: newResults.annualTotal - baseResults.annualTotal,
  }
}
