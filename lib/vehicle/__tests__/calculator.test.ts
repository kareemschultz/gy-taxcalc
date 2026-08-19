import { describe, expect, it } from "vitest"
import { calculateVehicleTax, getVehicleAgeInfo } from "../calculator"
import type { VehicleInputs } from "../types"

function baseInputs(overrides: Partial<VehicleInputs> = {}): VehicleInputs {
  return {
    cifUSD: 10000,
    exchangeRate: 218,
    vehicleType: "car",
    fuelType: "gasoline",
    vehicleAge: "4plus",
    engineCC: 2500,
    plateType: "private",
    importerType: "private",
    returningNational: false,
    fobUSD: 10000,
    freightUSD: 0,
    insuranceUSD: 0,
    ...overrides,
  }
}

describe("4+ year excise formula bands (finding #1)", () => {
  it("computes the USD addon+rate formula in USD before converting to GYD", () => {
    // Audit's own worked example: gasoline, 4+ years, 2500cc, CIF US$10,000
    // @ 218. GRA: (10,000 + 13,500) x 70% + 13,500 = US$29,950 = GY$6,529,100.
    // Pre-fix this returned GY$1,548,950 (the US$13,500 addon applied
    // directly to a GYD CIF) -- understated by ~4.2x.
    const result = calculateVehicleTax(baseInputs())
    expect(result.exciseTax).toBeCloseTo(6_529_100, 0)
  })

  it("splits the 1501-2000cc gasoline band per GRA instead of one merged band (finding #4)", () => {
    // 1501-1800cc -> US$6,000 @ 30%. Previously merged with 1801-2000cc into
    // one band using a fabricated addon of 8,200 (in no GRA table).
    const lowBand = calculateVehicleTax(baseInputs({ engineCC: 1600, cifUSD: 10000 }))
    const expectedLow = (10000 + 6000) * 0.3 + 6000 // USD
    expect(result_gyd(expectedLow)).toBeCloseTo(lowBand.exciseTax, 0)

    // 1801-2000cc -> US$6,500 @ 30%.
    const highBand = calculateVehicleTax(baseInputs({ engineCC: 1900, cifUSD: 10000 }))
    const expectedHigh = (10000 + 6500) * 0.3 + 6500 // USD
    expect(result_gyd(expectedHigh)).toBeCloseTo(highBand.exciseTax, 0)

    function result_gyd(usd: number) {
      return usd * 218
    }
  })
})

describe("findBracket clamps out-of-grid cc instead of falling through (finding #6)", () => {
  it("rounds a fractional cc into its nearest integer band instead of the top band", () => {
    // Pre-fix: 1000.5 matched no integer band and fell through to the
    // 3001cc+ band (45% duty / 140% excise) instead of the 1001-1500 band.
    const fractional = calculateVehicleTax(
      baseInputs({ engineCC: 1000.5, vehicleAge: "under4" })
    )
    const wholeCc = calculateVehicleTax(baseInputs({ engineCC: 1001, vehicleAge: "under4" }))
    expect(fractional.importDutyRate).toBeCloseTo(wholeCc.importDutyRate, 5)
    expect(fractional.exciseTax).toBeCloseTo(wholeCc.exciseTax, 0)
  })

  it("clamps a negative cc to the bottom band instead of the top band", () => {
    const negative = calculateVehicleTax(baseInputs({ engineCC: -1, vehicleAge: "under4" }))
    const zero = calculateVehicleTax(baseInputs({ engineCC: 0, vehicleAge: "under4" }))
    expect(negative.importDutyRate).toBeCloseTo(zero.importDutyRate, 5)
  })
})

describe("returning-national concession uses GRA Table A-2-2, not the vehicle's own bracket rate (finding #7)", () => {
  // Source: GRA "Tax Exemption Policy For Qualifying Re-Migrants, Settlers
  // and Returning Students" -- Table A-2-2 is a standalone excise-on-CIF
  // schedule that "applies to all imported motor vehicles, regardless of
  // their age," replacing the vehicle's normal duty/excise/VAT entirely:
  // <=1800cc 5%, 1801-2000cc 10%, 2001-3000cc 20%, >3000cc 30%.
  // https://gra.gov.gy/tax-exemption-policy-for-qualifying-re-migrants-settlers-and-returning-students-2/
  // (verified 2026-08-19).
  const cifGYD = 10000 * 218 // US$10,000 @ 218 = GY$2,180,000

  it("1800cc and under: 5% of CIF regardless of age or fuel type", () => {
    const result = calculateVehicleTax(
      baseInputs({ engineCC: 1800, vehicleAge: "under4", returningNational: true })
    )
    expect(result.exciseTax).toBeCloseTo(cifGYD * 0.05, 0)
    expect(result.importDuty).toBe(0)
    expect(result.vat).toBe(0)
  })

  it("1801-2000cc: 10% of CIF (matches the audit's original 2000cc worked example by coincidence)", () => {
    const result = calculateVehicleTax(
      baseInputs({ engineCC: 2000, vehicleAge: "under4", returningNational: true })
    )
    expect(result.exciseTax).toBeCloseTo(cifGYD * 0.10, 0)
  })

  it("2001-3000cc, 4+ years: 20% of CIF -- NOT the vehicle's own 70% formula-band rate", () => {
    // This is the case that exposes the old (incorrect) fix: applying the
    // vehicle's own bracket excise rate here would give 70%, not 20%.
    const result = calculateVehicleTax(
      baseInputs({ engineCC: 2500, vehicleAge: "4plus", returningNational: true })
    )
    expect(result.exciseTax).toBeCloseTo(cifGYD * 0.20, 0)
  })

  it("over 3000cc: 30% of CIF", () => {
    const result = calculateVehicleTax(
      baseInputs({ engineCC: 3500, vehicleAge: "4plus", returningNational: true })
    )
    expect(result.exciseTax).toBeCloseTo(cifGYD * 0.30, 0)
  })
})

describe("no maximum importable vehicle age (previously finding: false 8-year ban)", () => {
  it("does not warn that a 15-year-old vehicle is too old to import", () => {
    // Guyana removed the 8-year age restriction effective 2020-10-01.
    // https://gra.gov.gy/vehicles-8-years-old-used-tyres/ (verified 2026-08-19).
    const info = getVehicleAgeInfo(2011, 2026)
    expect(info?.warningType).not.toBe("danger")
    expect(info?.message.toLowerCase()).not.toContain("too old")
  })
})
