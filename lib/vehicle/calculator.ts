import {
  DEFAULT_EXCHANGE_RATE,
  DIESEL_4PLUS,
  DIESEL_UNDER_4,
  GASOLINE_4PLUS,
  GASOLINE_UNDER_4,
  MAX_IMPORTABLE_AGE,
  MOTORCYCLE_RATES,
  type Vehicle4PlusBracket,
  type VehicleBracket,
} from "./constants"
import type {
  FuelType,
  ImporterType,
  PlateType,
  VehicleAge,
  VehicleAgeInfo,
  VehicleBreakdownRow,
  VehicleInputs,
  VehicleTaxResult,
  VehicleType,
} from "./types"

function formatUsd(amount: number) {
  return `US$${amount.toFixed(2)}`
}

function formatGyd(amount: number) {
  return `GY$${Math.round(amount).toLocaleString("en-US")}`
}

function toUsd(amountGyd: number, rate: number) {
  return rate > 0 ? amountGyd / rate : 0
}

function toGyd(amountUsd: number, rate: number) {
  return amountUsd * rate
}

function findBracket<T extends VehicleBracket | Vehicle4PlusBracket>(cc: number, table: T[]) {
  // Bracket tables are defined on integer cc boundaries; a non-integer or
  // negative cc previously matched nothing and silently fell through to the
  // most expensive bracket. See gy-taxcalc-bugs.md finding #6.
  const clampedCc = Math.max(0, Math.round(cc))
  for (const bracket of table) {
    if (clampedCc >= bracket.min && clampedCc <= bracket.max) return bracket
  }
  return table[table.length - 1]
}

function buildBreakdown(result: {
  cifUSD: number
  cifGYD: number
  importDuty: number
  importDutyRate: number
  exciseTax: number
  exciseTaxRate: string
  vat: number
  vatRate: number
  totalTax: number
  totalTaxUSD: number
  totalLandedCost: number
  totalLandedCostUSD: number
}): VehicleBreakdownRow[] {
  const rate = result.cifUSD > 0 ? result.cifGYD / result.cifUSD : 0

  return [
    { label: "CIF Value", gyd: result.cifGYD, usd: result.cifUSD },
    {
      label: "Import Duty",
      gyd: result.importDuty,
      usd: toUsd(result.importDuty, rate),
      rate: `${(result.importDutyRate * 100).toFixed(0)}%`,
    },
    {
      label: "Excise Tax",
      gyd: result.exciseTax,
      usd: toUsd(result.exciseTax, rate),
      rate: result.exciseTaxRate,
    },
    {
      label: "VAT",
      gyd: result.vat,
      usd: toUsd(result.vat, rate),
      rate: `${(result.vatRate * 100).toFixed(0)}%`,
    },
    { label: "Total Tax", gyd: result.totalTax, usd: result.totalTaxUSD },
    { label: "Total Landed Cost", gyd: result.totalLandedCost, usd: result.totalLandedCostUSD },
  ]
}

export function calculateFobToCif(fobUSD: number, freightUSD: number, insuranceUSD: number) {
  return {
    fobUSD,
    freightUSD,
    insuranceUSD,
    cifUSD: fobUSD + freightUSD + insuranceUSD,
  }
}

export function getVehicleAgeInfo(modelYear: number, importYear = new Date().getFullYear()): VehicleAgeInfo | null {
  if (!modelYear || modelYear < 1900) return null

  const ageYears = importYear - modelYear
  const autoBracket: VehicleAge = ageYears < 4 ? "under4" : "4plus"

  if (ageYears > MAX_IMPORTABLE_AGE) {
    return {
      modelYear,
      ageYears,
      warningType: "danger",
      message: `Too old to import. Guyana's maximum importable vehicle age is ${MAX_IMPORTABLE_AGE} years.`,
      autoBracket,
    }
  }

  if (ageYears >= 4) {
    return {
      modelYear,
      ageYears,
      warningType: "warning",
      message: `${modelYear} model = ${ageYears} years old. Classified as 4+ years.`,
      autoBracket,
    }
  }

  return {
    modelYear,
    ageYears,
    warningType: "info",
    message: `${modelYear} model = ${ageYears} years old. Under 4 years.`,
    autoBracket,
  }
}

function applyRemigrantConcession(
  result: VehicleTaxResult,
  returningNational: boolean,
  exciseTaxWithoutDuty?: number
) {
  if (!returningNational) return result

  const rate = result.exchangeRate
  // The waived duty must not remain baked into the excise base -- excise
  // formulas that read `excise * (CIF + duty)` overstate the tax once duty
  // is zeroed below. See gy-taxcalc-bugs.md finding #7.
  if (exciseTaxWithoutDuty !== undefined) {
    result.exciseTax = exciseTaxWithoutDuty
  }
  result.importDuty = 0
  result.importDutyRate = 0
  result.vat = 0
  result.vatRate = 0
  result.totalTax = result.exciseTax
  result.totalTaxUSD = toUsd(result.exciseTax, rate)
  result.totalLandedCost = result.cifGYD + result.exciseTax
  result.totalLandedCostUSD = result.cifUSD + result.totalTaxUSD
  result.notes.unshift("Returning National concession applied: customs duty and VAT exempted.")
  result.notes.push(
    exciseTaxWithoutDuty !== undefined
      ? "Excise tax recalculated on CIF alone: the waived customs duty is no longer part of the excise base."
      : "Excise tax on re-migrant vehicles is conservatively retained in this calculator."
  )
  result.notes.push(
    "Conditions: apply within 6 months of returning and keep the vehicle for the required holding period."
  )
  result.breakdown = buildBreakdown(result)
  return result
}

function calculateMotorcycleTax(
  base: VehicleTaxResult,
  inputs: VehicleInputs,
  rate: number
): VehicleTaxResult {
  const bracket = findBracket(inputs.engineCC, MOTORCYCLE_RATES)
  const dealerMultiplier = inputs.importerType === "dealer" ? 1.5 : 1
  const effectiveCif = base.cifGYD * dealerMultiplier

  const importDuty = bracket.duty * base.cifGYD
  const exciseTax = bracket.excise * (effectiveCif + importDuty)
  const vat = bracket.vat * (base.cifGYD + importDuty + exciseTax)

  base.importDutyRate = bracket.duty
  base.exciseTaxRate = `${(bracket.excise * 100).toFixed(0)}%`
  base.vatRate = bracket.vat
  base.importDuty = importDuty
  base.exciseTax = exciseTax
  base.vat = vat
  base.totalTax = importDuty + exciseTax + vat
  base.totalTaxUSD = toUsd(base.totalTax, rate)
  base.totalLandedCost = base.cifGYD + base.totalTax
  base.totalLandedCostUSD = base.cifUSD + base.totalTaxUSD
  base.notes.push(
    inputs.engineCC <= 175
      ? "Motorcycle ≤175cc: 20% duty, 0% excise, 14% VAT."
      : "Motorcycle >175cc: 20% duty, 10% excise, 14% VAT."
  )
  if (inputs.importerType === "dealer") {
    base.notes.push("Dealer: excise calculated on 1.5× CIF + duty.")
  }
  base.formulaUsed = `Motorcycle ${inputs.engineCC}cc`
  base.breakdown = buildBreakdown(base)
  return applyRemigrantConcession(base, inputs.returningNational, bracket.excise * effectiveCif)
}

function calculateStandardVehicleTax(
  base: VehicleTaxResult,
  inputs: VehicleInputs,
  rate: number
): VehicleTaxResult {
  const table = inputs.fuelType === "diesel" ? DIESEL_UNDER_4 : GASOLINE_UNDER_4
  const fourPlusTable = inputs.fuelType === "diesel" ? DIESEL_4PLUS : GASOLINE_4PLUS

  if (inputs.vehicleAge === "under4") {
    const bracket = findBracket(inputs.engineCC, table) as VehicleBracket
    const effectiveCif =
      inputs.importerType === "franchise" && (inputs.retailPriceUSD ?? 0) > 0
        ? toGyd(inputs.retailPriceUSD ?? 0, rate)
        : inputs.importerType === "dealer"
          ? base.cifGYD * 1.5
          : base.cifGYD

    const importDuty = bracket.duty * base.cifGYD
    const exciseTax = bracket.excise * (effectiveCif + importDuty)
    const vatRemoved2026 =
      (inputs.use2026Rates ?? true) &&
      (inputs.engineCC <= 1500 || (inputs.fuelType === "hybrid" && inputs.engineCC <= 2000))
    const vat = vatRemoved2026 ? 0 : bracket.vat * (base.cifGYD + importDuty + exciseTax)

    base.importDutyRate = bracket.duty
    base.exciseTaxRate = `${(bracket.excise * 100).toFixed(0)}%`
    base.vatRate = vatRemoved2026 ? 0 : bracket.vat
    base.importDuty = importDuty
    base.exciseTax = exciseTax
    base.vat = vat
    base.totalTax = importDuty + exciseTax + vat
    base.totalTaxUSD = toUsd(base.totalTax, rate)
    base.totalLandedCost = base.cifGYD + base.totalTax
    base.totalLandedCostUSD = base.cifUSD + base.totalTaxUSD

    if (inputs.importerType === "franchise" && (inputs.retailPriceUSD ?? 0) > 0) {
      base.notes.push(
        `Franchise dealer: excise calculated on retail selling price US$${(inputs.retailPriceUSD ?? 0).toLocaleString("en-US")}.`
      )
    } else if (inputs.importerType === "dealer") {
      base.notes.push("Dealer: excise calculated on 1.5× CIF + duty.")
    }

    if (vatRemoved2026) {
      if (inputs.engineCC <= 1500) {
        base.notes.push("Budget 2026: VAT removed on vehicles under 1500cc (under 4 years).")
      }
      if (inputs.fuelType === "hybrid" && inputs.engineCC <= 2000) {
        base.notes.push("Budget 2026: VAT removed on hybrid vehicles under 2000cc.")
      }
    }

    base.formulaUsed = `Under 4 years, ${inputs.fuelType}, ${inputs.engineCC}cc`
    base.breakdown = buildBreakdown(base)
    return applyRemigrantConcession(
      base,
      inputs.returningNational,
      bracket.excise * effectiveCif
    )
  }

  const bracket = findBracket(inputs.engineCC, fourPlusTable) as Vehicle4PlusBracket
  if (bracket.type === "flat_gyd") {
    const exciseTax = bracket.amount ?? 0
    base.importDuty = 0
    base.importDutyRate = 0
    base.exciseTax = exciseTax
    base.exciseTaxRate = "flat"
    base.vat = 0
    base.vatRate = 0
    base.totalTax = exciseTax
    base.totalTaxUSD = toUsd(exciseTax, rate)
    base.totalLandedCost = base.cifGYD + exciseTax
    base.totalLandedCostUSD = base.cifUSD + base.totalTaxUSD
    base.notes.push(`4+ years, ${inputs.engineCC}cc: flat excise ${formatGyd(exciseTax)}.`)
    base.notes.push("No duty, no VAT for 4+ year vehicles.")
    base.formulaUsed = `4+ years flat`
    base.breakdown = buildBreakdown(base)
    return applyRemigrantConcession(base, inputs.returningNational)
  }

  // GRA's 4+ year formula bands are denominated entirely in USD --
  // "(CIF + US$addon) x rate + US$addon" -- and must be computed in USD
  // before converting to GYD. Applying the USD addon constant directly to
  // a GYD CIF value understated every affected band by ~1/rate (previously
  // GY$4.98M low on a US$10,000/2500cc gasoline example -- see
  // gy-taxcalc-bugs.md finding #1).
  const addonUsd = bracket.addon ?? 0
  const exciseTaxUsd = (base.cifUSD + addonUsd) * (bracket.rate ?? 0) + addonUsd
  const exciseTax = toGyd(exciseTaxUsd, rate)
  base.importDuty = 0
  base.importDutyRate = 0
  base.exciseTax = exciseTax
  base.exciseTaxRate = `${((bracket.rate ?? 0) * 100).toFixed(0)}%`
  base.vat = 0
  base.vatRate = 0
  base.totalTax = exciseTax
  base.totalTaxUSD = toUsd(exciseTax, rate)
  base.totalLandedCost = base.cifGYD + exciseTax
  base.totalLandedCostUSD = base.cifUSD + base.totalTaxUSD
  base.notes.push(`4+ years, ${inputs.fuelType}, ${inputs.engineCC}cc: formula-based excise.`)
  base.notes.push("No duty, no VAT for 4+ year vehicles.")
  base.formulaUsed = `4+ years formula`
  base.breakdown = buildBreakdown(base)
  return applyRemigrantConcession(base, inputs.returningNational)
}

export function calculateVehicleTax(inputs: VehicleInputs): VehicleTaxResult {
  const rate = inputs.exchangeRate || DEFAULT_EXCHANGE_RATE
  const cifUSD = inputs.cifUSD
  const cifGYD = cifUSD * rate

  const base: VehicleTaxResult = {
    cifUSD,
    cifGYD,
    exchangeRate: rate,
    importDuty: 0,
    importDutyRate: 0,
    exciseTax: 0,
    exciseTaxRate: "0%",
    vat: 0,
    vatRate: 0,
    totalTax: 0,
    totalTaxUSD: 0,
    totalLandedCost: cifGYD,
    totalLandedCostUSD: cifUSD,
    formulaUsed: "",
    notes: [],
    breakdown: [],
  }

  if (inputs.fuelType === "electric" || inputs.vehicleType === "electric") {
    base.formulaUsed = "Electric vehicle - all taxes exempt"
    base.notes.push("Electric vehicles: 0% duty, 0% excise, 0% VAT.")
    base.breakdown = buildBreakdown(base)
    return base
  }

  if ((inputs.use2026Rates ?? true) && inputs.vehicleType === "atv") {
    base.formulaUsed = "2026 Budget - ATV exempt"
    base.notes.push("Budget 2026: all taxes removed on ATVs.")
    base.breakdown = buildBreakdown(base)
    return base
  }

  if (inputs.plateType === "government") {
    base.exciseTax = toGyd(2000, rate)
    base.exciseTaxRate = "flat"
    base.totalTax = base.exciseTax
    base.totalTaxUSD = toUsd(base.exciseTax, rate)
    base.totalLandedCost = cifGYD + base.totalTax
    base.totalLandedCostUSD = cifUSD + base.totalTaxUSD
    base.notes.push("Government plate: flat excise US$2,000, no duty, no VAT.")
    base.formulaUsed = "G-Plate: flat excise US$2,000"
    base.breakdown = buildBreakdown(base)
    return base
  }

  if ((inputs.use2026Rates ?? true) && inputs.vehicleType === "double_cab") {
    if (inputs.engineCC <= 2000) {
      base.exciseTax = 2_000_000
      base.totalTax = 2_000_000
      base.totalTaxUSD = toUsd(2_000_000, rate)
      base.totalLandedCost = cifGYD + 2_000_000
      base.totalLandedCostUSD = cifUSD + base.totalTaxUSD
      base.notes.push("Budget 2026: double-cab under 2000cc flat GY$2,000,000.")
      base.formulaUsed = "2026 Budget: double-cab flat rate GY$2M"
      base.breakdown = buildBreakdown(base)
      return base
    }
    if (inputs.engineCC <= 2500) {
      base.exciseTax = 3_000_000
      base.totalTax = 3_000_000
      base.totalTaxUSD = toUsd(3_000_000, rate)
      base.totalLandedCost = cifGYD + 3_000_000
      base.totalLandedCostUSD = cifUSD + base.totalTaxUSD
      base.notes.push("Budget 2026: double-cab 2000-2500cc flat GY$3,000,000.")
      base.formulaUsed = "2026 Budget: double-cab flat rate GY$3M"
      base.breakdown = buildBreakdown(base)
      return base
    }
    base.notes.push("Double-cab over 2500cc: standard rates apply.")
  }

  if (inputs.vehicleType === "motorcycle") {
    return calculateMotorcycleTax(base, inputs, rate)
  }

  return calculateStandardVehicleTax(base, inputs, rate)
}

export function resolveVehicleImporterType(importerType: ImporterType) {
  return {
    isDealer: importerType === "dealer",
    isNewVehicleTrader: importerType === "franchise",
  }
}
