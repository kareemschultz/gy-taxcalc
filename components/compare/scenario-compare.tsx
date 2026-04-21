"use client"

import * as React from "react"
import { ArrowRight, CarFront, Calculator, Landmark } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { formatCurrency, formatPercent, safeNum } from "@/lib/utils"
import { PAYMENT_FREQUENCIES } from "@/lib/tax/constants"
import { performCalculations } from "@/lib/tax/calculator"
import { calculateVehicleTax } from "@/lib/vehicle/calculator"
import { calculateLoan } from "@/lib/loan/calculator"
import type { CalculatorInputs } from "@/lib/tax/types"
import type { VehicleInputs } from "@/lib/vehicle/types"
import type { LoanInputs } from "@/lib/loan/types"

const monthlyConfig = PAYMENT_FREQUENCIES.monthly

function salaryScenario(basicSalary: number, taxableAllowances: number, nonTaxableAllowances: number, childCount: number, loanPayment: number) {
  const inputs: CalculatorInputs = {
    position: "custom",
    paymentFrequency: "monthly",
    frequencyConfig: monthlyConfig,
    basicSalary,
    taxableAllowances,
    nonTaxableAllowances,
    vacationAllowance: 0,
    qualificationType: "none",
    qualificationAllowance: 0,
    overtimeIncome: 0,
    secondJobIncome: 0,
    childCount,
    loanPayment,
    creditUnionDeduction: 0,
    insuranceType: "none",
    insurancePremium: 0,
    gratuityRate: 22.5,
    gratuityPeriod: 6,
  }
  return performCalculations(inputs)
}

function SalaryPanel({
  title,
  icon,
  salary,
  setSalary,
  taxable,
  setTaxable,
  nonTaxable,
  setNonTaxable,
  childCount,
  setChildCount,
  loan,
  setLoan,
}: {
  title: string
  icon: React.ReactNode
  salary: number
  setSalary: (value: number) => void
  taxable: number
  setTaxable: (value: number) => void
  nonTaxable: number
  setNonTaxable: (value: number) => void
  childCount: number
  setChildCount: (value: number) => void
  loan: number
  setLoan: (value: number) => void
}) {
  const result = React.useMemo(
    () => salaryScenario(salary, taxable, nonTaxable, childCount, loan),
    [salary, taxable, nonTaxable, childCount, loan]
  )

  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>Compare the live result against the other scenario.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Basic Salary</Label>
            <CurrencyInput prefix="GY$" min={0} value={salary || ""} onChange={(value) => setSalary(safeNum(value))} placeholder="250,000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Taxable Allowances</Label>
            <CurrencyInput prefix="GY$" min={0} value={taxable || ""} onChange={(value) => setTaxable(safeNum(value))} placeholder="50,000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Non-taxable Allowances</Label>
            <CurrencyInput prefix="GY$" min={0} value={nonTaxable || ""} onChange={(value) => setNonTaxable(safeNum(value))} placeholder="10,000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Children</Label>
            <Input type="number" min={0} max={10} value={childCount || ""} onChange={(e) => setChildCount(safeNum(e.target.value))} placeholder="0" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Loan / Credit Union Deductions</Label>
            <CurrencyInput prefix="GY$" min={0} value={loan || ""} onChange={(value) => setLoan(safeNum(value))} placeholder="0" />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border bg-background/60 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Monthly Net</p>
            <p className="mt-1 text-sm font-semibold text-primary">{formatCurrency(result.monthlyNetSalary)}</p>
          </div>
          <div className="rounded-lg border bg-background/60 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Annual Package</p>
            <p className="mt-1 text-sm font-semibold">{formatCurrency(result.annualTotal)}</p>
          </div>
          <div className="rounded-lg border bg-background/60 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tax Rate</p>
            <p className="mt-1 text-sm font-semibold">{formatPercent(result.annualGrossIncome > 0 ? (result.annualTaxPayable / result.annualGrossIncome) * 100 : 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ScenarioCompare() {
  const [salaryA, setSalaryA] = React.useState(250000)
  const [taxableA, setTaxableA] = React.useState(50000)
  const [nonTaxableA, setNonTaxableA] = React.useState(10000)
  const [childrenA, setChildrenA] = React.useState(0)
  const [loanA, setLoanA] = React.useState(0)

  const [salaryB, setSalaryB] = React.useState(300000)
  const [taxableB, setTaxableB] = React.useState(25000)
  const [nonTaxableB, setNonTaxableB] = React.useState(10000)
  const [childrenB, setChildrenB] = React.useState(1)
  const [loanB, setLoanB] = React.useState(0)

  const [vehicleA, setVehicleA] = React.useState<VehicleInputs>({
    cifUSD: 6700,
    exchangeRate: 218,
    vehicleType: "car",
    fuelType: "gasoline",
    vehicleAge: "under4",
    engineCC: 1500,
    modelYear: 2021,
    plateType: "private",
    importerType: "private",
    retailPriceUSD: 0,
    returningNational: false,
    fobUSD: 0,
    freightUSD: 0,
    insuranceUSD: 0,
    use2026Rates: true,
  })

  const [vehicleB, setVehicleB] = React.useState<VehicleInputs>({
    ...vehicleA,
    cifUSD: 12500,
    engineCC: 2000,
    vehicleAge: "4plus",
  })

  const [loanPrincipalA, setLoanPrincipalA] = React.useState(1000000)
  const [loanRateA, setLoanRateA] = React.useState(9.5)
  const [loanTermA, setLoanTermA] = React.useState(60)
  const [loanPrincipalB, setLoanPrincipalB] = React.useState(1200000)
  const [loanRateB, setLoanRateB] = React.useState(8.75)
  const [loanTermB, setLoanTermB] = React.useState(72)

  const compareLoan = (principal: number, annualRatePct: number, termMonths: number): LoanInputs =>
    ({
      loanType: "custom",
      bankPreset: "custom",
      principalGYD: principal,
      currencyMode: "gyd",
      exchangeRate: 218,
      annualRatePct,
      termMonths,
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
    })

  const salaryResultA = React.useMemo(() => salaryScenario(salaryA, taxableA, nonTaxableA, childrenA, loanA), [salaryA, taxableA, nonTaxableA, childrenA, loanA])
  const salaryResultB = React.useMemo(() => salaryScenario(salaryB, taxableB, nonTaxableB, childrenB, loanB), [salaryB, taxableB, nonTaxableB, childrenB, loanB])
  const vehicleResultA = React.useMemo(() => calculateVehicleTax(vehicleA), [vehicleA])
  const vehicleResultB = React.useMemo(() => calculateVehicleTax(vehicleB), [vehicleB])
  const loanResultA = React.useMemo(() => calculateLoan(compareLoan(loanPrincipalA, loanRateA, loanTermA)), [loanPrincipalA, loanRateA, loanTermA])
  const loanResultB = React.useMemo(() => calculateLoan(compareLoan(loanPrincipalB, loanRateB, loanTermB)), [loanPrincipalB, loanRateB, loanTermB])

  return (
    <Tabs defaultValue="salary" className="space-y-4">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="salary" className="min-w-[96px] flex-none sm:flex-1">Salary</TabsTrigger>
        <TabsTrigger value="vehicle" className="min-w-[96px] flex-none sm:flex-1">Vehicle</TabsTrigger>
        <TabsTrigger value="loan" className="min-w-[96px] flex-none sm:flex-1">Loan</TabsTrigger>
      </TabsList>

      <TabsContent value="salary" className="space-y-4">
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm"><Calculator className="size-4 text-primary" />Salary Comparison</CardTitle>
            <CardDescription>Compare two salary offers side-by-side using the current monthly tax rules.</CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          <SalaryPanel title="Scenario A" icon={<Calculator className="size-4 text-primary" />} salary={salaryA} setSalary={setSalaryA} taxable={taxableA} setTaxable={setTaxableA} nonTaxable={nonTaxableA} setNonTaxable={setNonTaxableA} childCount={childrenA} setChildCount={setChildrenA} loan={loanA} setLoan={setLoanA} />
          <SalaryPanel title="Scenario B" icon={<Calculator className="size-4 text-primary" />} salary={salaryB} setSalary={setSalaryB} taxable={taxableB} setTaxable={setTaxableB} nonTaxable={nonTaxableB} setNonTaxable={setNonTaxableB} childCount={childrenB} setChildCount={setChildrenB} loan={loanB} setLoan={setLoanB} />
        </div>
        <Card className="bg-muted/20">
          <CardContent className="grid gap-3 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Net difference</p>
              <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(salaryResultB.monthlyNetSalary - salaryResultA.monthlyNetSalary)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Annual package difference</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(salaryResultB.annualTotal - salaryResultA.annualTotal)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Take-home gap</p>
              <p className="mt-1 text-lg font-semibold">{formatPercent((salaryResultB.monthlyNetSalary / Math.max(1, salaryResultB.regularMonthlyGrossIncome)) * 100 - (salaryResultA.monthlyNetSalary / Math.max(1, salaryResultA.regularMonthlyGrossIncome)) * 100)}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vehicle" className="space-y-4">
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm"><CarFront className="size-4 text-primary" />Vehicle Comparison</CardTitle>
            <CardDescription>Compare two vehicle import scenarios without leaving the page.</CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scenario A</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">CIF (US$)</Label>
                  <CurrencyInput prefix="US$" min={0} value={vehicleA.cifUSD || ""} onChange={(value) => setVehicleA((prev) => ({ ...prev, cifUSD: safeNum(value) }))} placeholder="6,700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Engine CC</Label>
                  <Input type="number" min={0} step={100} value={vehicleA.engineCC || ""} onChange={(e) => setVehicleA((prev) => ({ ...prev, engineCC: safeNum(e.target.value) }))} placeholder="1,500" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tax</p>
                  <p className="mt-1 font-semibold text-primary">{formatCurrency(vehicleResultA.totalTax)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Landed</p>
                  <p className="mt-1 font-semibold">{formatCurrency(vehicleResultA.totalLandedCost)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Formula</p>
                  <p className="mt-1 font-semibold">{vehicleResultA.formulaUsed || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scenario B</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">CIF (US$)</Label>
                  <CurrencyInput prefix="US$" min={0} value={vehicleB.cifUSD || ""} onChange={(value) => setVehicleB((prev) => ({ ...prev, cifUSD: safeNum(value) }))} placeholder="12,500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Engine CC</Label>
                  <Input type="number" min={0} step={100} value={vehicleB.engineCC || ""} onChange={(e) => setVehicleB((prev) => ({ ...prev, engineCC: safeNum(e.target.value) }))} placeholder="2,000" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tax</p>
                  <p className="mt-1 font-semibold text-primary">{formatCurrency(vehicleResultB.totalTax)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Landed</p>
                  <p className="mt-1 font-semibold">{formatCurrency(vehicleResultB.totalLandedCost)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Formula</p>
                  <p className="mt-1 font-semibold">{vehicleResultB.formulaUsed || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-muted/20">
          <CardContent className="pt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tax difference</p>
              <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(vehicleResultB.totalTax - vehicleResultA.totalTax)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Landed cost difference</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(vehicleResultB.totalLandedCost - vehicleResultA.totalLandedCost)}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="loan" className="space-y-4">
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm"><Landmark className="size-4 text-primary" />Loan Comparison</CardTitle>
            <CardDescription>Compare two borrowing options with the same payoff timeline.</CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scenario A</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Principal</Label>
                  <CurrencyInput prefix="GY$" min={0} value={loanPrincipalA || ""} onChange={(value) => setLoanPrincipalA(safeNum(value))} placeholder="1,000,000" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Rate %</Label>
                  <Input type="number" min={0} step={0.01} value={loanRateA || ""} onChange={(e) => setLoanRateA(safeNum(e.target.value))} placeholder="9.5" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Term (months)</Label>
                  <Input type="number" min={1} step={1} value={loanTermA || ""} onChange={(e) => setLoanTermA(Math.trunc(safeNum(e.target.value)))} placeholder="60" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Monthly payment</p>
                  <p className="mt-1 font-semibold text-primary">{formatCurrency(loanResultA.monthlyPayment)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total interest</p>
                  <p className="mt-1 font-semibold">{formatCurrency(loanResultA.totalInterest)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payoff date</p>
                  <p className="mt-1 font-semibold">{loanResultA.payoffDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scenario B</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Principal</Label>
                  <CurrencyInput prefix="GY$" min={0} value={loanPrincipalB || ""} onChange={(value) => setLoanPrincipalB(safeNum(value))} placeholder="1,200,000" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Rate %</Label>
                  <Input type="number" min={0} step={0.01} value={loanRateB || ""} onChange={(e) => setLoanRateB(safeNum(e.target.value))} placeholder="8.75" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Term (months)</Label>
                  <Input type="number" min={1} step={1} value={loanTermB || ""} onChange={(e) => setLoanTermB(Math.trunc(safeNum(e.target.value)))} placeholder="72" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Monthly payment</p>
                  <p className="mt-1 font-semibold text-primary">{formatCurrency(loanResultB.monthlyPayment)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total interest</p>
                  <p className="mt-1 font-semibold">{formatCurrency(loanResultB.totalInterest)}</p>
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payoff date</p>
                  <p className="mt-1 font-semibold">{loanResultB.payoffDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-muted/20">
          <CardContent className="pt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payment difference</p>
              <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(loanResultB.monthlyPayment - loanResultA.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Interest difference</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(loanResultB.totalInterest - loanResultA.totalInterest)}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
