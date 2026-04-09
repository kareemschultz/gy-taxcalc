# Changelog

All notable changes to GY TaxCalc are documented here.

---

## [2.4.0] — 2026-04-08

### Vehicle Import Calculator — 2026 Audit Fixes + New Features

**Bug fixes (verified against GRA gra.gov.gy/imports/motor-vehicle/):**
- **B1 Fixed:** Gasoline 4+ year 1501–1800cc and 1801–2000cc brackets merged into one bracket at addon=US$8,200, matching the GRA published worked example (was split $6,000/$6,500 — under-calculated excise)
- **B3 Fixed:** Dealer 1.5× CIF multiplier removed from 4+ year formula vehicles (GRA applies it only to under-4-year imports)
- **B4 Fixed:** Diesel under 4 years — 1801–2000cc bracket now explicit at 10% excise, matching GRA table structure
- **Info panel updated:** Gasoline 4+ years bracket display corrected to 1501–2000cc: (CIF+$8.2K)×30%+$8.2K

**New features:**
- **FOB → CIF Converter:** Collapsible helper above the CIF field. Enter FOB + freight + insurance, click "Use this CIF" to auto-populate the main CIF field. Typical freight estimates shown (Japan/USA ranges).
- **Model Year input:** Optional field; auto-sets the age bracket (under 4 / 4+ years) and shows an alert if the vehicle exceeds the 8-year legal import maximum.
- **Importer Type select:** Replaces the old "Dealer Import" checkbox. Now supports three modes — Private, Dealer (1.5× CIF), and Franchise/New Vehicle Trader (retail selling price as excise base per GRA Excise Tax Regulations).
- **Returning National / Re-migrant concession:** Checkbox that removes Customs Duty and VAT from the result (one vehicle, qualifying returning nationals). Notes shown with conditions: apply at MFA within 6 months, hold period 3–5 years, 183 days/year residency.
- **Outboard Engine Calculator:** Separate section. Budget 2026 fully exempts outboard engines ≤150 HP. Over 150 HP directs user to GRA/customs broker.
- **Info panel updates:** Dealer section updated to document all three importer types; Budget 2026 effective date (Feb 16, 2026) and 8-year age cap added.

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
