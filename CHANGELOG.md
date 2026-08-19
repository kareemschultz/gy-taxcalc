# Changelog

All notable changes to GY TaxCalc are documented here.

---

## [2.6.0] — 2026-08-19

### Fact-Checked Against Live GRA/NIS Sources

Every rate, threshold and bracket in the calculator was cross-checked against
the Guyana Revenue Authority's and National Insurance Scheme's own current
published pages (not just re-derived from the prior audit document). This
surfaced bugs the original audit's finding #21 and #7 had correctly diagnosed
the *symptom* of but not the *statutorily correct target value* for, plus one
entirely new finding.

- **Finding #21 resolved (was previously only diagnosed, not fixed):** the Daily, Weekly and Fortnightly payment frequencies' `personalAllowance`/`taxThreshold`/`nisCeiling` were derived from an internal approximate month-fraction (`factor`, e.g. weekly = monthly ÷ 4.33) that does not match GRA's own published per-period figures. **Daily was the worst case** — using a 21.67-workday-per-month divisor overstated the daily tax-free allowance by ~40% against GRA's actual calendar-day-based figure (app: $6,460 / GRA: $4,603), meaning Daily-frequency users were being systematically under-taxed relative to what GRA actually withholds. All three frequencies now use GRA's exact published figures, corroborated independently by NIS's own site for the weekly NIS ceiling. Source: [GRA — Revised Personal Allowance and Deductions for Income Tax 2026](https://gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2026/), [NIS — Information on Contributions](https://www.nis.org.gy/information_on_contributions).
- **Finding #7 corrected (the 2026-08-19 fix landed on the wrong formula):** the earlier fix recomputed the vehicle's own standard bracket excise rate on CIF alone once duty was waived for the Returning National concession. GRA's Table A-2-2 (Excise Tax Regulations, amended into Customs Act s.23(1)(c)) is actually a **completely separate, flat excise-on-CIF schedule** — 5% (≤1,800cc), 10% (1,801–2,000cc), 20% (2,001–3,000cc), 30% (>3,000cc) — that "applies to all imported motor vehicles, regardless of their age," replacing the vehicle's normal duty/excise/VAT entirely, not discounting it. The earlier fix's numeric answer for the audit's own worked example (2,000cc, 10%) happened to coincidentally match Table A-2-2's rate for that specific band; for every other engine size the two schedules diverge sharply (e.g. a 2,500cc 4+ year vehicle: 70% under the vehicle's own formula vs. the correct 20% under Table A-2-2). Also fixed: the 4+ year vehicle paths (flat and formula brackets) previously didn't apply *any* re-migrant excise override at all. Source: [GRA — Tax Exemption Policy For Qualifying Re-Migrants, Settlers and Returning Students](https://gra.gov.gy/tax-exemption-policy-for-qualifying-re-migrants-settlers-and-returning-students-2/).
- **New finding fixed:** the vehicle form warned "Too old to import. Guyana's maximum importable vehicle age is 8 years" for any vehicle over 8 years old. This restriction was **abolished 2020-10-01** — vehicles of any age may legally be imported into Guyana (taxed at the same 4+ year rate regardless of how old). The false "too old to import" warning and the now-meaningless `MAX_IMPORTABLE_AGE` constant have been removed. Source: [GRA — Vehicles 8 Years Old & Used Tyres](https://gra.gov.gy/vehicles-8-years-old-used-tyres/).
- **Verified correct, no change needed:** the 4+ year gasoline/diesel excise formula bands (fixed 2026-08-19 earlier today for findings #1/#4) were independently corroborated against a live third-party GRA-sourced calculator during this pass — exact match on every band. The standard under-4-year duty/excise/VAT bands, the 14% VAT rate, and the Budget 2026 VAT exemptions (vehicles <1,500cc, hybrids <2,000cc, both under 4 years) were also verified correct as-is.
- **Deliberately not resolved — genuine source conflict, not a guess to make:** finding #19 (whether a 2022-model vehicle counts as "under 4" or "4+" for a 2026 import, per Customs Regulation s.209's "48 months preceding January 1" language) was checked against a second independent source during this pass, which asserts the opposite classification from the audit's own GRA quote. Two credible readings genuinely disagree — this still needs a GRA/accountant confirmation, not a coin flip.
- 9 new/updated tests (17 total now passing) directly citing the GRA/NIS source URL and verification date for every asserted figure.

## [2.5.0] — 2026-08-19

### Calculation Correctness — 2026-08-19 Audit Fixes

Fixes from a full-app audit (`gy-taxcalc-bugs.md`, 41 findings). This release
covers the P0 findings (wrong money shown) plus the highest-impact P1 items;
remaining P1/P2/P3 findings are tracked for follow-up, and four items that
depend on statutory interpretation (NIS treatment of allowances/back pay/the
fortnightly ceiling, and the vehicle age boundary) are deferred pending
accountant sign-off rather than guessed at.

**Vehicle Import Calculator:**
- **Finding #1 fixed:** 4+ year excise formula add-ons (`bracket.addon`) are GRA figures denominated in **US dollars**, but were being applied directly against a **GYD** CIF base — understating excise by ~4.2x on a worked example (GY$1,548,950 shown vs. the correct GY$6,529,100). The formula now runs entirely in USD before converting to GYD.
- **Finding #4 fixed:** The 1501–2000cc gasoline 4+ year band was one merged bracket using a US$8,200 add-on found in no GRA table. Split back into GRA's actual two bands: 1501–1800cc @ US$6,000/30%, 1801–2000cc @ US$6,500/30%.
- **Finding #3 fixed:** Selecting "Electric" as the vehicle type force-set Fuel Type to "electric" and hid the selector, but switching back to a non-electric vehicle type never released the latch — the calculator kept computing on the (hidden) electric fuel type. Fixed to fall back to gasoline when leaving Electric.
- **Finding #6 fixed:** `findBracket` matched brackets on integer boundaries only; a non-integer or negative engine cc silently fell through to the top (most expensive) bracket instead of the correct one. cc is now rounded and clamped to zero before matching.
- **Finding #7 fixed:** The Returning National / re-migrant concession zeroed customs duty but left it baked into the already-computed excise base (excise formulas read `rate × (CIF + duty)`), overstating excise by GY$98,100 on a worked example. Excise is now recomputed on CIF alone once duty is waived.

**Salary/Tax Calculator:**
- **Finding #2/#9/#18 fixed:** The "Net Take-Home ({frequency})" hero figure and the detailed breakdown card's Net Take-Home line both displayed the **monthly**-converted net salary under a **per-period** label — e.g. a weekly-paid user saw "Net Take-Home (per week): $218,938.87" against a $60,000 weekly gross. Both now show the actual per-period value (`netSalaryForFrequency`).
- **Finding #28 fixed:** The insurance premium was deducted from taxable income (correctly lowering PAYE) but never actually subtracted from net take-home pay in any of the three calculation paths (base, salary-increase, retroactive) — the deduction disappeared rather than leaving the pocket. Fixed across all three paths.
- **Finding #8 fixed:** `TaxBracketChart.tsx` hardcoded the 25%/35% tax bracket split at a flat 280,000 (the monthly threshold), rendering weekly/fortnightly incomes as entirely in the 25% band even when the 35% bracket applied. Now reads the per-frequency threshold from `results.frequencyConfig`.

**Testing:**
- Added `vitest` (project's first automated test coverage). 8 tests covering findings #1, #4, #6, #7, and #28.

**Known follow-up (see `gy-taxcalc-bugs.md` for full detail):**
- Deferred pending accountant sign-off: findings #19 (vehicle age boundary), #31/#32 (NIS on allowances/back pay), #33 (fortnightly NIS ceiling basis).
- Not yet addressed: findings #5, #9 (remaining chart locations), #10–#17, #21–#27, #29–#30, #34–#41.
- Separately flagged (not bundled into this release): Next.js 15.3.1 and several transitive dependencies carry critical CVEs predating this work; upgrading is a larger, separately-scoped change.

---

## [2.4.0] — 2026-04-08

### Vehicle Import Calculator — 2026 Audit Fixes + New Features

**Bug fixes (verified against GRA gra.gov.gy/imports/motor-vehicle/):**
- **B1 Fixed:** Gasoline 4+ year 1501–1800cc and 1801–2000cc brackets merged into one bracket at addon=US$8,200, matching the GRA published worked example (was split $6,000/$6,500 — under-calculated excise)
- **B3 Fixed:** Dealer 1.5× CIF multiplier removed from 4+ year formula vehicles (GRA applies it only to under-4-year imports)
- **B4 Fixed:** Diesel under 4 years — 1801–2000cc bracket now explicit at 10% excise, matching GRA table structure
- **Info panel updated:** Gasoline 4+ years bracket display corrected to 1501–2000cc: (CIF+$8.2K)×30%+$8.2K
- **Sequencing fix:** `runVehicleCalculation()` now calls `updateVehicleAgeWarning()` before reading the age select, so model year auto-classification is reflected in the same calculation pass
- **FOB converter dark theme:** Card was using Bootstrap `bg-light` which rendered white in dark mode; switched to `info-mini-card` class (`var(--gray-100)` = `#334155`)

**New features:**
- **FOB → CIF Converter:** Collapsible helper above the CIF field. Enter FOB + freight + insurance, click "Use this CIF" to auto-populate the main CIF field. Typical freight estimates shown (Japan/USA ranges).
- **Model Year input:** Optional field; auto-sets the age bracket (under 4 / 4+ years) and shows colour-coded alerts — red if over 8 years (illegal to import), amber for 4–8 years, blue for under 4 years.
- **Importer Type select:** Replaces the old "Dealer Import" checkbox. Three modes — Private (straight CIF), Dealer (1.5× CIF excise base), Franchise/New Vehicle Trader (retail selling price as excise base per GRA Excise Tax Regulations). Retail price field shows/hides based on selection.
- **Returning National / Re-migrant concession:** Checkbox removes Customs Duty and VAT from the calculation. Conditions note shown: apply at Ministry of Foreign Affairs within 6 months of returning, hold period 3–5 years, 183 days/year residency requirement.
- **Outboard Engine Calculator:** New collapsible section. Budget 2026 fully exempts outboard engines ≤150 HP from all import taxes. Over 150 HP directs user to GRA/licensed customs broker.
- **Info panel updates:** All three importer types documented; Budget 2026 effective date (Feb 16, 2026) and 8-year maximum import age added.

---

### Loan Calculator — Enhancements + Bug Fixes

**New features:**
- **Down payment support:** Enter a purchase price and down payment amount or percentage; calculator auto-derives the loan principal and shows the financed amount separately.
- **Processing fee:** Optional one-time origination/processing fee field (flat amount or percentage); included in total cost comparisons.
- **Bi-weekly payment option:** Choose monthly or bi-weekly payment frequency; bi-weekly payments reduce interest faster and shorten the loan term.
- **Rate ranges:** Lender presets now show min/max rate ranges in the comparison table, not just a single rate.
- **Periodic lump sum payments:** Simulate recurring lump sum payments (e.g. annual gratuity or quarterly bonus) on top of regular payments. Enter amount and frequency; calculator recomputes the amortization schedule with the extra injections and shows interest saved.

**Bug fixes:**
- **GPSCCU rate corrected:** Rate stored as `12.0` (12% p.a. nominal, 1% per month on reducing balance) — was incorrectly stored as `1.0` which the engine interpreted as 1% p.a., massively underestimating payments. Full name corrected to "Guyana Public Service Co-operative Credit Union (GPSCCU)" (source: mygpsccu.com, verified April 2026).
- **Frequency-aware salary increase calculations:** `salary-increase.js` now extracts `frequencyConfig` from base results so NIS, tax, and allowance caps scale correctly per payment frequency (weekly/fortnightly/monthly) instead of hardcoding monthly constants. Annual totals use `freq.periodsPerYear` instead of hardcoded `× 12`.
- **Salary increase taxable routing fixed:** Non-taxable allowances now routed to `nonTaxableAllowances` instead of `basicSalary`.
- **Amortization table dark theme:** Table rows, borders, and headers now use CSS variables instead of hardcoded light colours. Chart labels compacted for mobile. Down payment row layout fixed on small screens.
- **Bank short names in comparison cards:** Comparison cards now use `bank.shortName` for cleaner display on mobile.

---

## [2.3.0] — 2026-04-01

### 🏦 New Feature — Loan Calculator

Third calculator tab added alongside Income & Salary and Vehicle Import.

**Amortization engine:**
- Standard amortization formula `M = P[r(1+r)^n]/[(1+r)^n-1]`
- Full monthly schedule: payment, principal portion, interest portion, remaining balance
- Extra payment simulator: additional fixed monthly payment + one-time lump sum at any month
- Shows months saved, interest saved, new payoff date, and new monthly payment when extra payments are enabled

**6 Guyanese lender presets** (rates verified April 2026):

| Lender | Rate Range | Notes |
|--------|-----------|-------|
| GPSCCU | ~1.0% flat | Government & Public Service Co-op |
| GBTI | 6.99%–10% | Confirmed via GBTI website |
| Republic Bank | 6%–12% | 6% promotional (Car Bonanza, 2026) |
| Bank of Baroda | 10%–14% | Prime lending rate 10% |
| Citizens Bank | 9.5%–13% | Confirmed for vehicle loans |
| Demerara Bank | 11%–14% | Varies by down payment % |

**GYD/USD dual currency:** enter principal in USD, auto-converts at editable exchange rate (default GY$218).

**4 interactive charts:** principal vs. interest doughnut, balance-over-time line, principal/interest stacked bar per period, bank comparison horizontal bar.

**Bank comparison section:** side-by-side monthly payment, total interest, and total cost across top 4 lenders for your loan amount and term.

**Monthly/yearly amortization table toggle:** yearly view aggregates months into annual rows for long-term loans and mortgages.

**Wiring:** `app-toggle.js` handles loan mode, `main.js` calls `initLoanCalculator()`, dark mode theme toggle re-renders loan charts via `refreshLoanCharts()`.

> ⚠️ Rate disclaimer: all lender rates are approximate reference figures. Contact your bank directly before making financial decisions.

### 🐛 Bug Fixes

- `loan-charts.js`: all chart tooltips and axis labels now use `formatLoanAmount()` instead of hardcoded `GY$` strings — USD mode now formats correctly throughout
- `css/styles.css`: added full loan component CSS (`result-card`, `savings-highlight-card`, `comparison-cards-grid`, `amortization-table-wrapper`, `loan-sticky`) — mobile layout was broken without these
- `.gitignore` added to repository

---

## [2.2.0] — 2026-03-31

### 🐛 Critical Fix — Income Tax Bracket Calculation

Two calculation errors identified and corrected against the official GRA Income Tax (Amendment) Act No. 3 of 2026.

**Bug 1 — Tax bracket threshold was 260,000 instead of 280,000**

The 25% rate incorrectly applied to only the first $260,000 of chargeable income. Per the Act, the 25% rate applies to the first **$280,000** of chargeable income; the 35% rate applies to the remainder above $280,000. All payment frequencies updated:

| Frequency | Old threshold | Correct threshold |
|-----------|--------------|-------------------|
| Daily | $8,548 | $12,922 |
| Weekly | $60,000 | $64,665 |
| Fortnightly | $120,000 | $128,986 |
| Monthly | $260,000 | **$280,000** |
| Yearly | $3,120,000 | $3,360,000 |

**Bug 2 — Personal allowance 1/3 was applied to total gross instead of Balance of Income**

Per the Act, the 1/3 personal allowance applies to *Balance of Income* (gross after statutory overtime and second-job allowances are removed), not total gross. For standard salaries with no overtime or second job, the result is identical. The fix matters for employees with significant overtime income.

Thanks to **Ganesh** for spotting both issues and cross-referencing the official GRA notice.

**Source:** [GRA Notice — Revised Personal Allowance & Deductions 2026](https://www.gra.gov.gy/notice-to-employers-employees-self-employed-persons-revised-personal-allowance-and-deductions-for-income-tax-2026/)

---

## [2.1.0] — 2026-02-17

### 📊 Enhanced Chart Visualizations (Major Upgrade)

**Upgraded Existing Charts:**
- Converted Income Breakdown and Tax Savings from basic pie charts to **doughnut charts** with center text totals, percentage datalabels, and zero-value filtering
- Enhanced Tax Bracket Analysis with compact currency datalabels and rounded bars
- Upgraded Annual Cash Flow with gradient fill, base salary reference line, monthly average line, and triangle markers on gratuity months (Jun/Dec)
- Improved Net vs. Gross with retention rate tooltips, compact datalabels on bars, and rounded corners

**6 New Chart Visualizations:**
- **Salary Composition** — horizontal stacked bar showing all income sources at a glance
- **Effective Tax Rate Gauge** — half-circle doughnut that color-codes your tax burden (green/yellow/orange/red)
- **Monthly Deductions Breakdown** — doughnut showing NIS, tax, loans, credit union, insurance proportions
- **Cumulative Annual Earnings** — stacked area chart tracking how your total package builds month by month
- **Gross-to-Net Waterfall** — horizontal floating bar showing exactly where every dollar goes from gross to net
- **Annual Summary Overview** — color-coded bar chart for annual gross, tax, NIS, gratuity, and net package

**Chart Infrastructure:**
- Added `chartjs-plugin-datalabels` for showing values/percentages directly on charts
- Custom center text plugin for doughnut charts
- Compact currency formatting ($260K, $1.2M) for axis labels
- Zero-value filtering across all pie/doughnut charts
- Unified color system with theme-aware palette (8 colors)

### 🎨 Chart Section Redesign
- Reorganized into 4 labeled groups: Income Analysis, Tax Analysis, Cash Flow, Summary
- Full-width layout for timeline charts (cash flow, cumulative, waterfall)
- Chart cards with colored top borders, hover lift effects, and subtle shadows
- Added descriptive subtitles under each chart title
- Increased chart heights (260px desktop, 300px wide, 220px mobile)

### 🔧 Bug Fixes
- Fixed Tax Savings chart that was coded in JS but had no canvas element in HTML (never rendered)
- Fixed theme toggle for charts — now properly re-renders all 11 charts on dark/light switch

### ✨ QoL Improvements
- Charts section auto-expands on first calculation (no more hunting for the accordion)
- Smooth 600ms easeOutQuart animations on all chart renders

---

## [2.0.2] — 2026-02-13

### ✨ New Positions
- Added **Senior ICT Engineer** position preset
  - Base Salary: GYD 613,000
  - Uniform Allowance: GYD 10,000 (taxable)
  - Telephone Allowance: GYD 5,000 (non-taxable)
  - Traveling Allowance: GYD 15,000 (non-taxable)
  - Total Package: GYD 643,000

---

## [2.0.1] — 2026-01-27

### 🧹 Usability
- Added "Clear Form" button to both Income & Salary and Vehicle Import calculators
- Styled as red rounded pill buttons with hover glow effect
- Salary clear fully resets all inputs, dropdowns, checkboxes, result values, charts, sticky bars, and salary increase section
- Vehicle clear fully resets CIF, CC, exchange rate (218), dropdowns, result breakdown, formula display, rate badges, notes, and sticky bars
- Complete fresh slate on both calculators

### 🔧 Fixes
- Fixed vehicle import info section not visible (was nested inside hidden results area)
- Moved version/changelog link below header badges

### 🔄 CI/CD
- Added GitHub Actions deploy workflow to replace legacy Pages build
- Reduced build notification emails

---

## [2.0.0] — 2026-01-27

### 🚗 Vehicle Import Tax Calculator (NEW)
- Full vehicle import tax calculator with all GRA-published formulas
- Gasoline and diesel rate tables for under 4 years and 4+ years
- Motorcycle rates (under 175cc and over 175cc)
- Electric vehicle support (0% all taxes)
- Government plate (G plate) flat rate calculation
- Dealer import mode (1.5× CIF for excise)
- Dual currency display (USD and GYD)
- Default exchange rate: GY$218 per US$1
- Auto-calculates on input change with 300ms debounce
- Conditional field visibility (CC hidden for electric, plate options per vehicle type)
- Comprehensive results breakdown table with duty, excise, VAT, total tax, and total landed cost

### 🆕 Budget 2026 Vehicle Rates (Applied by Default)
- Double-cab pickups: GY$2M flat (under 2,000cc), GY$3M flat (2,000-2,500cc), irrespective of age
- VAT removed on vehicles under 1,500cc, less than 4 years old
- VAT removed on hybrid motor vehicles below 2,000cc
- All import duties and taxes removed on ATVs for all categories

### 🔄 Project Rebrand
- Renamed from "Guyana Salary Calculator" to **GY TaxCalc**
- New subtitle: "Guyana's Tax Toolkit"
- Repository renamed to `gy-taxcalc`
- Pill-style toggle to switch between Income & Salary and Vehicle Import calculators
- Redesigned toggle with centered rounded pills, blue gradient active state
- Updated meta tags, footer, and all internal links

### 📊 Info & Reference Sections
- Added comprehensive "2026 Vehicle Import Tax Information" section with 8 info cards
- Gasoline and diesel rate tables (under 4 and 4+ years)
- Budget 2026 changes summary
- Electric and special categories reference
- Dealer import rules and GRA regulation notes
- Step-by-step formula breakdown

### 🔒 Privacy
- Removed employee name field to avoid data collection concerns

### 🎨 UI Fixes
- Fixed placeholder text visibility in dark mode
- Fixed helper text and subtitle visibility in dark mode
- Added ::placeholder CSS for dark theme

---

## [1.5.0] — 2026-01-27

### 🆕 2026 Tax Year Update
- Income tax threshold raised to **$140,000/month** (from $130,000)
- Tax rates: 25% up to $260,000/mo, 35% above
- Updated Assistant ICT Engineer III salary to G$308,540
- Removed light mode toggle (dark mode only)

---

## [1.4.0] — 2026-01-26

### 🎨 Complete UI/UX Redesign
- Progressive disclosure with collapsible sections
- Auto-calculate on input change (no submit button needed)
- Mobile-first responsive design
- Sticky results summary bar (desktop and mobile)
- Visual breakdown charts with Chart.js
- PDF export functionality

### 📋 Position Presets
- Added pre-loaded government positions:
  - IT Officer II, IT Officer III
  - ICT Technician I, II, III
  - Assistant ICT Engineer III
  - ICT Engineer III
  - Administrative Officer II
  - Accounts Clerk I
  - Primary School Teacher
  - Staff Nurse

---

## [1.3.0] — 2025-12-15

### 💼 Salary Increase Simulator
- Compare current vs proposed salary
- Retroactive pay calculation
- Special months (Month 6 and Month 12) with gratuity
- Gratuity month combined view

---

## [1.2.0] — 2025-11-20

### 📅 Payment Frequencies
- Added daily, weekly, fortnightly, monthly, and yearly calculations
- Dynamic labels update based on selected frequency
- All tax calculations adjust per frequency

---

## [1.1.0] — 2025-10-30

### 🧮 Expanded Tax Features
- Taxable and non-taxable allowance breakdowns
- Individual allowance fields (duty, acting, housing, travel, station, etc.)
- Overtime and second job income with $50,000 non-taxable allowance
- Qualification-based allowances (ACCA, Master's, PhD)
- Life insurance and mortgage interest deductions
- Child allowance ($10,000 per child)
- NIS contributions at 5.6% (ceiling $280,000)
- Gratuity calculation at 22.5% of basic salary

---

## [1.0.0] — 2025-10-15

### 🚀 Initial Release
- Basic salary to net pay calculator
- Income tax calculation with personal allowance
- NIS deduction
- Gratuity calculation for public servants
- Dark mode UI
- Mobile responsive design

---

**Data Sources:**
- [GRA Motor Vehicle Guide](https://www.gra.gov.gy/imports/motor-vehicle/)
- [Budget 2026 — Vehicle Tax Changes](https://demerarawaves.com/2026/01/26/new-tax-regime-for-vehicles-outboard-engines/)
- [Budget 2026 — Income Tax Threshold](https://www.stabroeknews.com/2026/01/26/news/guyana/budget-2026/)
