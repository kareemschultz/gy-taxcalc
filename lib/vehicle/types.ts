export type VehicleType =
  | "car"
  | "suv"
  | "van"
  | "bus"
  | "single_cab"
  | "double_cab"
  | "motorcycle"
  | "atv"
  | "electric"

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid"
export type VehicleAge = "under4" | "4plus"
export type ImporterType = "private" | "dealer" | "franchise"
export type PlateType = "private" | "government"

export interface VehicleInputs {
  cifUSD: number
  exchangeRate: number
  vehicleType: VehicleType
  fuelType: FuelType
  vehicleAge: VehicleAge
  engineCC: number
  modelYear?: number
  plateType: PlateType
  importerType: ImporterType
  retailPriceUSD?: number
  returningNational: boolean
  fobUSD: number
  freightUSD: number
  insuranceUSD: number
  use2026Rates?: boolean
}

export interface VehicleBreakdownRow {
  label: string
  gyd: number
  usd: number
  rate?: string
}

export interface VehicleTaxResult {
  cifUSD: number
  cifGYD: number
  exchangeRate: number
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
  formulaUsed: string
  notes: string[]
  breakdown: VehicleBreakdownRow[]
}

export interface VehicleAgeInfo {
  modelYear: number
  ageYears: number
  warningType: "none" | "info" | "warning" | "danger"
  message: string
  autoBracket: VehicleAge
}
