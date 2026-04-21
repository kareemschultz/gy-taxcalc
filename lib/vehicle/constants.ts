import type { FuelType } from "./types"

export const DEFAULT_EXCHANGE_RATE = 218
export const MAX_IMPORTABLE_AGE = 8

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
  { min: 1501, max: 2000, type: "formula", addon: 8200, rate: 0.30 },
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

export const FUEL_TYPE_TABLE: Record<Exclude<FuelType, "electric">, "gasoline" | "diesel" | "gasoline"> = {
  gasoline: "gasoline",
  diesel: "diesel",
  hybrid: "gasoline",
}
