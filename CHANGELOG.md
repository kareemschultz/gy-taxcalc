# Changelog

All notable changes to GY TaxCalc are documented here.

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
