# 🇬🇾 GY TaxCalc

**Guyana's Tax Toolkit** — Free, open-source tax calculators built for Guyanese, by Guyanese.

🔗 **Live:** [kareemschultz.github.io/gy-taxcalc](https://kareemschultz.github.io/gy-taxcalc/)

---

## What is GY TaxCalc?

GY TaxCalc is a suite of tax calculators covering the most common tax questions in Guyana. No sign-up, no ads, no nonsense — just accurate calculations based on the latest GRA-published formulas and Budget 2026 regulations.

### 💰 Income & Salary Calculator

Calculate your take-home pay with full tax breakdowns.

**Features:**
- Gross-to-net salary calculation across all payment frequencies (daily, weekly, fortnightly, monthly, yearly)
- 2026 income tax rates: 25% (up to $260,000/mo) and 35% (above)
- Income tax threshold: $140,000/month
- NIS contributions at 5.6% (ceiling $280,000)
- 22.5% gratuity calculation for public servants
- Taxable and non-taxable allowance breakdowns (duty, acting, housing, travel, station, etc.)
- Overtime and second job income with $50,000 non-taxable allowance
- Qualification-based allowances (ACCA, Master's, PhD)
- Life insurance and mortgage interest deductions
- Child allowance ($10,000 per child)
- Salary increase and retroactive pay simulator
- Pre-loaded government job positions (ICT, Admin, Teaching, Nursing, Police)
- Visual breakdown charts
- PDF export with employee name

### 🚗 Vehicle Import Tax Calculator

Calculate customs duty, excise tax, and VAT on vehicle imports.

**Features:**
- All GRA-published formulas for gasoline, diesel, electric, and hybrid vehicles
- Under 4 years and 4+ years calculations with correct bracket rates
- Engine CC-based tax brackets (gasoline: 0-1000, 1001-1500, 1501-1800, 1801-2000, 2001-3000, 3000+)
- Diesel-specific brackets (under 1500, 1501-2000, 2001-2500, 2501-3000, 3000+)
- Motorcycle rates (under 175cc and over 175cc)
- Electric vehicles: 0% across all categories
- Vehicle types: Car, SUV, Van, Bus, Single Cab, Double Cab, Motorcycle, ATV
- Government plate (G plate) flat rate support
- Dealer import mode (1.5x CIF for excise calculation)
- Dual currency display (USD and GYD)
- Default exchange rate: GY$218 per US$1 (editable)
- Budget 2026 rates applied by default:
  - Double-cab pickups: GY$2M flat (under 2000cc), GY$3M flat (2000-2500cc)
  - VAT removed on vehicles under 1500cc, less than 4 years old
  - VAT removed on hybrid vehicles under 2000cc
  - All taxes and duties removed on ATVs
- GRA rate reference guide included
- Auto-calculates on input change

---

## Tax Formulas

### Income Tax (2026)

| Bracket | Rate |
|---------|------|
| First $140,000/month | Exempt (personal allowance) |
| Next $120,000 ($140,001 - $260,000) | 25% |
| Above $260,000 | 35% |

### Vehicle Import — Under 4 Years (Gasoline)

| CC Range | Duty | Excise | VAT |
|----------|------|--------|-----|
| 0 - 1000cc | 35% | 0% | 14% |
| 1001 - 1500cc | 35% | 0% | 0% (2026) |
| 1501 - 1800cc | 45% | 10% | 14% |
| 1801 - 2000cc | 45% | 10% | 14% |
| 2001 - 3000cc | 45% | 110% | 14% |
| 3000cc+ | 45% | 140% | 14% |

**Formula:** Duty = rate × CIF → Excise = rate × (CIF + Duty) → VAT = 14% × (CIF + Duty + Excise)

### Vehicle Import — 4 Years & Older (Gasoline)

| CC Range | Excise (flat/formula) |
|----------|----------------------|
| 0 - 1500cc | GY$800,000 flat |
| 1501 - 1800cc | (CIF + US$6,000) × 30% + US$6,000 |
| 1801 - 2000cc | (CIF + US$6,500) × 30% + US$6,500 |
| 2001 - 3000cc | (CIF + US$13,500) × 70% + US$13,500 |
| 3000cc+ | (CIF + US$14,500) × 100% + US$14,500 |

No duty. No VAT. Excise only.

### Electric Vehicles

0% duty, 0% excise, 0% VAT — all power ratings, any age.

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks, no build step)
- Bootstrap 5.3 for layout
- Chart.js for visual breakdowns
- Font Awesome icons
- Hosted on GitHub Pages

---

## Data Sources

- [GRA Motor Vehicle Duty/Tax Calculation Guide](https://www.gra.gov.gy/imports/motor-vehicle/)
- [GRA Income Tax Rates & Calculations](https://www.gra.gov.gy/)
- [Budget 2026 Speech](https://demerarawaves.com/2026/01/26/new-tax-regime-for-vehicles-outboard-engines/) — Vehicle tax changes
- [Budget 2026 Income Tax](https://www.stabroeknews.com/2026/01/26/news/guyana/budget-2026/) — $140,000 threshold

---

## Disclaimer

This tool is **not affiliated** with the Guyana Revenue Authority (GRA). It is an independent calculator using publicly available formulas. Always consult a licensed customs broker or tax professional for official advice.

---

## Contributing

Found a bug or have a suggestion? [Open an issue](https://github.com/kareemschultz/gy-taxcalc/issues) or submit a PR.

---

## License

MIT

---

Built with ❤️ by **Kareem Schultz** | [KareTech Solutions](https://karetech.gy)
