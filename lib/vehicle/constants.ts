import type { FuelType } from "./types"

export const DEFAULT_EXCHANGE_RATE = 218

export interface VehicleBracket {
  min: number
  max: number
  duty: number
  excise: number
  vat: number
}

export interface Vehicle4PlusBracket {
  min: number
  max: number
  type: "flat_gyd" | "formula"
  amount?: number
  addon?: number
  rate?: number
}

export const GASOLINE_UNDER_4: VehicleBracket[] = [
  { min: 0, max: 1000, duty: 0.35, excise: 0, vat: 0.14 },
  { min: 1001, max: 1500, duty: 0.35, excise: 0, vat: 0.14 },
  { min: 1501, max: 1800, duty: 0.45, excise: 0.10, vat: 0.14 },
  { min: 1801, max: 2000, duty: 0.45, excise: 0.10, vat: 0.14 },
  { min: 2001, max: 3000, duty: 0.45, excise: 1.10, vat: 0.14 },
  { min: 3001, max: Number.POSITIVE_INFINITY, duty: 0.45, excise: 1.40, vat: 0.14 },
]

export const DIESEL_UNDER_4: VehicleBracket[] = [
  { min: 0, max: 1500, duty: 0.35, excise: 0, vat: 0.14 },
  { min: 1501, max: 1800, duty: 0.45, excise: 0.10, vat: 0.14 },
  { min: 1801, max: 2000, duty: 0.45, excise: 0.10, vat: 0.14 },
  { min: 2001, max: 2500, duty: 0.45, excise: 1.10, vat: 0.14 },
  { min: 2501, max: Number.POSITIVE_INFINITY, duty: 0.45, excise: 1.10, vat: 0.14 },
]

export const GASOLINE_4PLUS: Vehicle4PlusBracket[] = [
  { min: 0, max: 1000, type: "flat_gyd", amount: 800000 },
  { min: 1001, max: 1500, type: "flat_gyd", amount: 800000 },
  // GRA splits 1501-2000cc into two bands (US$6,000 / US$6,500); the merged
  // 8,200 addon here was a figure in no GRA table -- see gy-taxcalc-bugs.md
  // finding #4.
  { min: 1501, max: 1800, type: "formula", addon: 6000, rate: 0.30 },
  { min: 1801, max: 2000, type: "formula", addon: 6500, rate: 0.30 },
  { min: 2001, max: 3000, type: "formula", addon: 13500, rate: 0.70 },
  { min: 3001, max: Number.POSITIVE_INFINITY, type: "formula", addon: 14500, rate: 1.00 },
]

export const DIESEL_4PLUS: Vehicle4PlusBracket[] = [
  { min: 0, max: 1500, type: "flat_gyd", amount: 800000 },
  { min: 1501, max: 2000, type: "formula", addon: 15400, rate: 0.30 },
  { min: 2001, max: 2500, type: "formula", addon: 15400, rate: 0.70 },
  { min: 2501, max: 3000, type: "formula", addon: 15500, rate: 0.70 },
  { min: 3001, max: Number.POSITIVE_INFINITY, type: "formula", addon: 17200, rate: 1.00 },
]

export const MOTORCYCLE_RATES: VehicleBracket[] = [
  { min: 0, max: 175, duty: 0.20, excise: 0, vat: 0.14 },
  { min: 176, max: Number.POSITIVE_INFINITY, duty: 0.20, excise: 0.10, vat: 0.14 },
]

export interface RemigrantExciseBand {
  min: number
  max: number
  rate: number
}

// GRA Table A-2-2 (Excise Tax Regulations), amended into Customs Act s.23(1)(c),
// effective 2023-09-01: "applies to all imported motor vehicles, regardless of
// their age." This is a standalone excise-on-CIF schedule -- it replaces the
// vehicle's normal duty/excise/VAT calculation entirely for a qualifying
// re-migrant/settler/returning student; it is not a discount on top of the
// standard formula. Source: https://gra.gov.gy/tax-exemption-policy-for-qualifying-re-migrants-settlers-and-returning-students-2/
// (verified 2026-08-19). See gy-taxcalc-bugs.md finding #7.
export const REMIGRANT_EXCISE_BANDS: RemigrantExciseBand[] = [
  { min: 0, max: 1800, rate: 0.05 },
  { min: 1801, max: 2000, rate: 0.10 },
  { min: 2001, max: 3000, rate: 0.20 },
  { min: 3001, max: Number.POSITIVE_INFINITY, rate: 0.30 },
]

export const FUEL_TYPE_TABLE: Record<Exclude<FuelType, "electric">, "gasoline" | "diesel" | "gasoline"> = {
  gasoline: "gasoline",
  diesel: "diesel",
  hybrid: "gasoline",
}
