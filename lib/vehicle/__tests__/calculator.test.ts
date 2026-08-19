import { describe, expect, it } from "vitest"
import { calculateVehicleTax } from "../calculator"
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

describe("returning-national concession recomputes excise off waived duty (finding #7)", () => {
  it("matches the audit's worked example: 316,100 baked-in-duty excise becomes 218,000", () => {
    // Gasoline under-4, 2000cc, CIF US$10,000 @ 218.
    const result = calculateVehicleTax(
      baseInputs({ engineCC: 2000, vehicleAge: "under4", returningNational: true })
    )
    expect(result.exciseTax).toBeCloseTo(218_000, 0)
    expect(result.importDuty).toBe(0)
  })
})
