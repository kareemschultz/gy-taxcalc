import { LOAN_BANK_PRESETS, LOAN_COMPARISON_BANKS, LOAN_DEFAULT_EXCHANGE_RATE } from "./constants"
import type {
  AmortizationRow,
  BankComparison,
  LoanInputs,
  LoanResults,
  LoanScenarioInsight,
  LoanStrategySummary,
  YearlyRow,
} from "./types"

export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number) {
  if (termMonths <= 0) return 0
  if (annualRate === 0) return principal / termMonths
  const r = annualRate / 100 / 12
  const n = termMonths
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function buildAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayments?: {
    additionalMonthly?: number
    lumpSumAmount?: number
    lumpSumAtMonth?: number
    periodicLumpAmount?: number
    periodicLumpFrequency?: number
    periodicLumpStartMonth?: number
  }
): AmortizationRow[] {
  const monthlyRate = annualRate / 100 / 12
  const basePayment = calculateMonthlyPayment(principal, annualRate, termMonths)
  const schedule: AmortizationRow[] = []
  let balance = principal

  for (let period = 1; period <= termMonths; period += 1) {
    const interest = balance * monthlyRate
    const scheduledPrincipal = basePayment - interest
    let extra = extraPayments?.additionalMonthly ?? 0

    if (
      extraPayments?.lumpSumAmount &&
      extraPayments.lumpSumAtMonth &&
      period === extraPayments.lumpSumAtMonth
    ) {
      extra += extraPayments.lumpSumAmount
    }

    if (extraPayments?.periodicLumpAmount && extraPayments.periodicLumpFrequency) {
      const start = extraPayments.periodicLumpStartMonth || extraPayments.periodicLumpFrequency
      if (period >= start && (period - start) % extraPayments.periodicLumpFrequency === 0) {
        extra += extraPayments.periodicLumpAmount
      }
    }

    const principalPaid = Math.min(scheduledPrincipal + extra, balance)
    const payment = principalPaid + interest
    balance = Math.max(0, balance - principalPaid)

    schedule.push({ period, payment, principal: principalPaid, interest, balance, extra })

    if (balance <= 0) break
  }

  return schedule
}

export function aggregateYearly(schedule: AmortizationRow[]): YearlyRow[] {
  const years: Record<number, YearlyRow> = {}

  schedule.forEach((row) => {
    const year = Math.ceil(row.period / 12)
    if (!years[year]) {
      years[year] = {
        year,
        totalPayment: 0,
        totalPrincipal: 0,
        totalInterest: 0,
        endBalance: 0,
      }
    }
    years[year].totalPayment += row.payment
    years[year].totalPrincipal += row.principal
    years[year].totalInterest += row.interest
    years[year].endBalance = row.balance
  })

  return Object.values(years)
}

export function compareBanks(principal: number, termMonths: number): BankComparison[] {
  return LOAN_COMPARISON_BANKS.map((bankId) => {
    const bank = LOAN_BANK_PRESETS[bankId]
    const minRate = bank.minRate ?? bank.rate ?? 0
    const maxRate = bank.maxRate ?? bank.rate ?? 0
    const minPayment = calculateMonthlyPayment(principal, minRate, termMonths)
    const maxPayment = calculateMonthlyPayment(principal, maxRate, termMonths)
    const minTotalInterest = minPayment * termMonths - principal
    const maxTotalInterest = maxPayment * termMonths - principal

    return {
      name: bank.name,
      shortName: bank.shortName,
      minRate,
      maxRate,
      monthlyPaymentMin: minPayment,
      monthlyPaymentMax: maxPayment,
      totalInterestMin: minTotalInterest,
      totalInterestMax: maxTotalInterest,
    }
  })
}

export interface BiweeklyResult {
  payment: number
  schedule: AmortizationRow[]
  totalInterest: number
  totalPaid: number
  months: number
}

export function calculateBiweekly(principal: number, annualRate: number, termMonths: number): BiweeklyResult {
  const ratePerPeriod = annualRate / 100 / 26
  const periods = Math.round((termMonths * 26) / 12)
  const payment =
    annualRate === 0
      ? principal / periods
      : principal * (ratePerPeriod * Math.pow(1 + ratePerPeriod, periods)) / (Math.pow(1 + ratePerPeriod, periods) - 1)

  const schedule: AmortizationRow[] = []
  let balance = principal

  for (let period = 1; period <= periods; period += 1) {
    const interest = balance * ratePerPeriod
    const principalPaid = period === periods ? balance : payment - interest
    const actualPayment = principalPaid + interest
    balance = Math.max(0, balance - principalPaid)
    schedule.push({ period, payment: actualPayment, principal: principalPaid, interest, balance })
    if (balance <= 0) break
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0)
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)
  const months = Math.round((schedule.length * 12) / 26)

  return { payment, schedule, totalInterest, totalPaid, months }
}

function calculatePayoffDate(startDate: Date, months: number) {
  const d = new Date(startDate)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

export function resolveLoanPrincipal(inputs: LoanInputs) {
  const exchangeRate = inputs.exchangeRate || LOAN_DEFAULT_EXCHANGE_RATE
  const principalFromCurrency =
    inputs.currencyMode === "usd" ? inputs.principalGYD * exchangeRate : inputs.principalGYD

  if (principalFromCurrency > 0) {
    return principalFromCurrency
  }

  if (inputs.purchasePrice && inputs.downPaymentPct !== undefined) {
    return inputs.purchasePrice * (1 - inputs.downPaymentPct / 100)
  }

  return 0
}

export function calculateLoan(inputs: LoanInputs): LoanResults {
  const exchangeRate = inputs.exchangeRate || LOAN_DEFAULT_EXCHANGE_RATE
  const principal = resolveLoanPrincipal(inputs)
  const annualRate = inputs.annualRatePct
  const startDate = inputs.firstPaymentDate ? new Date(inputs.firstPaymentDate) : new Date()

  const baseSchedule =
    inputs.paymentFrequency === "biweekly"
      ? calculateBiweekly(principal, annualRate, inputs.termMonths).schedule
      : buildAmortizationSchedule(principal, annualRate, inputs.termMonths)

  const monthlyBaseSchedule = buildAmortizationSchedule(principal, annualRate, inputs.termMonths)
  const biweekly = calculateBiweekly(principal, annualRate, inputs.termMonths)
  let activeSchedule = baseSchedule

  const totalPaid = activeSchedule.reduce((sum, row) => sum + row.payment, 0)
  const totalInterest = activeSchedule.reduce((sum, row) => sum + row.interest, 0)
  const effectiveRate = principal > 0 ? (totalInterest / principal) * 100 : 0
  const processingFee = principal * (inputs.processingFeePct / 100)
  const payoffMonths = inputs.paymentFrequency === "biweekly" ? biweekly.months : activeSchedule.length

  const result: LoanResults = {
    monthlyPayment: calculateMonthlyPayment(principal, annualRate, inputs.termMonths),
    biweeklyPayment: biweekly.payment,
    totalInterest,
    totalPaid: totalPaid + processingFee,
    payoffDate: calculatePayoffDate(startDate, payoffMonths),
    processingFee,
    termMonths: inputs.termMonths,
    effectiveRate,
    amortizationSchedule: activeSchedule,
    yearlySchedule: aggregateYearly(activeSchedule),
    baseSchedule: monthlyBaseSchedule,
  }

  if (inputs.extraPaymentsEnabled && (inputs.additionalMonthly > 0 || inputs.lumpSumAmount > 0 || inputs.periodicLumpAmount > 0)) {
    const extraSchedule = buildAmortizationSchedule(principal, annualRate, inputs.termMonths, {
      additionalMonthly: inputs.additionalMonthly,
      lumpSumAmount: inputs.lumpSumAmount,
      lumpSumAtMonth: inputs.lumpSumAtMonth,
      periodicLumpAmount: inputs.periodicLumpAmount,
      periodicLumpFrequency:
        inputs.periodicLumpFrequency === "custom"
          ? inputs.periodicLumpCustomInterval
          : inputs.periodicLumpFrequency,
      periodicLumpStartMonth: inputs.periodicLumpStartMonth,
    })

    const monthsSaved = activeSchedule.length - extraSchedule.length
    const extraInterest = extraSchedule.reduce((sum, row) => sum + row.interest, 0)

    result.extraSchedule = extraSchedule
    result.monthsSaved = monthsSaved > 0 ? monthsSaved : 0
    result.interestSaved = totalInterest - extraInterest
    result.newPayoffDate = calculatePayoffDate(startDate, extraSchedule.length)
    if (inputs.paymentFrequency === "monthly") {
      activeSchedule = extraSchedule
    }
  }

  if (inputs.paymentFrequency === "biweekly") {
    const monthlySummary = calculateLoan({ ...inputs, paymentFrequency: "monthly" })
    result.biweeklyMonthsSaved = Math.max(
      0,
      monthlySummary.amortizationSchedule.length - result.amortizationSchedule.length
    )
    result.biweeklyInterestSaved = monthlySummary.totalInterest - result.totalInterest
  }

  result.amortizationSchedule = activeSchedule
  result.yearlySchedule = aggregateYearly(activeSchedule)

  return result
}

function formatPayoffDateFromMonths(startDate: Date, months: number) {
  const d = new Date(startDate)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

export function buildLoanStrategySummary(
  inputs: LoanInputs,
  options?: {
    scenarioAmounts?: number[]
    frequencyMonths?: 3 | 6 | 12
    startMonth?: number
  }
): LoanStrategySummary {
  const scenarioAmounts = options?.scenarioAmounts ?? [200_000, 350_000, 500_000, 600_000, 750_000, 1_000_000, 1_500_000]
  const frequencyMonths =
    options?.frequencyMonths ??
    (inputs.periodicLumpFrequency === "custom"
      ? 6
      : inputs.periodicLumpFrequency)
  const startMonth = options?.startMonth ?? inputs.periodicLumpStartMonth ?? 2
  const baseInputs: LoanInputs = {
    ...inputs,
    paymentFrequency: "monthly",
    extraPaymentsEnabled: false,
    additionalMonthly: 0,
    lumpSumAmount: 0,
    lumpSumAtMonth: 1,
    periodicLumpAmount: 0,
    periodicLumpFrequency: frequencyMonths,
    periodicLumpCustomInterval: frequencyMonths,
    periodicLumpStartMonth: startMonth,
  }

  const baseline = calculateLoan(baseInputs)
  const startDate = inputs.firstPaymentDate ? new Date(inputs.firstPaymentDate) : new Date()

  const scenarios: LoanScenarioInsight[] = scenarioAmounts.map((amount) => {
    const scenario = calculateLoan({
      ...baseInputs,
      extraPaymentsEnabled: true,
      periodicLumpAmount: amount,
    })

    const monthsLeft = scenario.amortizationSchedule.length
    const monthsSaved = Math.max(0, baseline.amortizationSchedule.length - monthsLeft)
    const interestSaved = Math.max(0, baseline.totalInterest - scenario.totalInterest)
    const efficiencyScore = amount > 0 ? monthsSaved / amount : 0

    return {
      lumpSum: amount,
      monthsLeft,
      monthsSaved,
      interestSaved,
      payoffDate: formatPayoffDateFromMonths(startDate, monthsLeft),
      efficiencyScore,
    }
  })

  const bestByMonths = new Map<number, LoanScenarioInsight>()
  for (const scenario of scenarios) {
    const current = bestByMonths.get(scenario.monthsLeft)
    if (!current || scenario.lumpSum < current.lumpSum) {
      bestByMonths.set(scenario.monthsLeft, scenario)
    }
  }

  for (const scenario of scenarios) {
    const best = bestByMonths.get(scenario.monthsLeft)
    if (best && best.lumpSum !== scenario.lumpSum) {
      scenario.tiedWith = best.lumpSum
    }
  }

  const selectedScenario =
    scenarios
      .slice()
      .sort((a, b) => {
        if (b.monthsSaved !== a.monthsSaved) return b.monthsSaved - a.monthsSaved
        if (b.efficiencyScore !== a.efficiencyScore) return b.efficiencyScore - a.efficiencyScore
        return a.lumpSum - b.lumpSum
      })[0] ?? null

  if (selectedScenario) {
    selectedScenario.recommended = true
  }

  return {
    baselineMonths: baseline.amortizationSchedule.length,
    baselineInterest: baseline.totalInterest,
    selectedScenario,
    scenarios,
  }
}
