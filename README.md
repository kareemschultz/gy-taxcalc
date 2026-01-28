# 🇬🇾 GY TaxCalc

<div align="center">

![Guyana Tax Calculator](https://img.shields.io/badge/🇬🇾-Guyana%20Tax%20Calculator-009739?style=for-the-badge)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=flat-square&logo=github)](https://kareemschultz.github.io/gy-taxcalc/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Budget 2026](https://img.shields.io/badge/Budget-2026%20Updated-blue?style=flat-square)](https://demerarawaves.com/2026/01/26/new-tax-regime-for-vehicles-outboard-engines/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Made in Guyana](https://img.shields.io/badge/Made%20in-Guyana%20🇬🇾-009739?style=flat-square)]()

**Guyana's Tax Toolkit** — Free, open-source tax calculators built for Guyanese, by Guyanese.

🔗 **[Launch Calculator →](https://kareemschultz.github.io/gy-taxcalc/)**

[Features](#-features) • [Tax Formulas](#-tax-formulas) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

GY TaxCalc is a suite of tax calculators covering the most common tax questions in Guyana. No sign-up, no ads, no nonsense — just accurate calculations based on the latest GRA-published formulas and **Budget 2026** regulations.

```
┌─────────────────────────────────────────────────────────────────┐
│                        GY TaxCalc Suite                         │
├─────────────────────────────┬───────────────────────────────────┤
│   💰 Income & Salary        │      🚗 Vehicle Import Tax        │
│   Calculator                │      Calculator                   │
├─────────────────────────────┼───────────────────────────────────┤
│ • Gross-to-net conversion   │ • Gasoline/Diesel/Electric/Hybrid │
│ • NIS deductions            │ • Under 4 years & 4+ years        │
│ • Income tax (25%/35%)      │ • Duty + Excise + VAT             │
│ • Allowances & gratuity     │ • G-Plate & Dealer modes          │
│ • PDF export                │ • USD/GYD dual currency           │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## ✨ Features

### 💰 Income & Salary Calculator

<details>
<summary><b>Click to expand full feature list</b></summary>

| Feature | Description |
|---------|-------------|
| 📊 **Salary Calculation** | Gross-to-net across all frequencies (daily, weekly, fortnightly, monthly, yearly) |
| 📈 **2026 Tax Rates** | 25% (up to $260,000/mo) and 35% (above threshold) |
| 🏦 **Tax Threshold** | $140,000/month personal allowance |
| 🛡️ **NIS Contributions** | 5.6% rate with $280,000 ceiling |
| 🎖️ **Gratuity** | 22.5% calculation for public servants |
| 💼 **Allowances** | Duty, acting, housing, travel, station (taxable/non-taxable) |
| ⏰ **Overtime** | Second job income with $50,000 non-taxable allowance |
| 🎓 **Qualifications** | ACCA, Master's, PhD allowance support |
| 🏠 **Deductions** | Life insurance & mortgage interest |
| 👶 **Child Allowance** | $10,000 per child |
| 📈 **Salary Simulator** | Increase and retroactive pay calculations |
| 👔 **Job Presets** | Pre-loaded government positions (ICT, Admin, Teaching, Nursing, Police) |
| 📊 **Visual Charts** | Breakdown pie charts |
| 📄 **PDF Export** | Professional reports with employee name |

</details>

### 🚗 Vehicle Import Tax Calculator

<details>
<summary><b>Click to expand full feature list</b></summary>

| Feature | Description |
|---------|-------------|
| ⛽ **Fuel Types** | Gasoline, Diesel, Electric, Hybrid |
| 📅 **Age Brackets** | Under 4 years & 4+ years old |
| 🔧 **Engine CC** | Full bracket support (0-1000, 1001-1500, 1501-1800, 1801-2000, 2001-3000, 3000+) |
| 🚙 **Vehicle Types** | Car, SUV, Van, Bus, Single/Double Cab, Motorcycle, ATV |
| 🏛️ **G-Plate** | Government plate flat rate support |
| 🏪 **Dealer Mode** | 1.5x CIF for excise calculation |
| 💱 **Dual Currency** | USD and GYD with editable exchange rate (default: GY$218) |
| ⚡ **Auto-Calculate** | Real-time calculation on input change |
| 📖 **Rate Guide** | GRA reference rates included |

</details>

#### Budget 2026 Updates ✅

| Change | Details |
|--------|---------|
| 🛻 Double-cab pickups | GY$2M flat (under 2000cc), GY$3M flat (2000-2500cc) |
| 🚗 VAT removed | Vehicles under 1500cc, less than 4 years old |
| 🔋 Hybrid VAT removed | Hybrid vehicles under 2000cc |
| 🏍️ ATV tax-free | All taxes and duties removed on ATVs |

---

## 📐 Tax Formulas

### Income Tax (2026)

```
                    Monthly Taxable Income
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
     ≤ $140,000      $140,001-$260,000   > $260,000
         │                  │               │
         ▼                  ▼               ▼
      EXEMPT              25%             35%
   (Personal            (on this        (on excess
   Allowance)           bracket)         amount)
```

| Bracket | Rate | Notes |
|---------|------|-------|
| First $140,000/month | **0%** | Personal allowance (exempt) |
| $140,001 – $260,000 | **25%** | First taxable bracket |
| Above $260,000 | **35%** | Higher rate bracket |

### Vehicle Import Tax Calculation Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   CIF    │───►│  + Duty  │───►│ + Excise │───►│  + VAT   │
│  Value   │    │  (rate%) │    │  (rate%) │    │  (14%)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                    │               │               │
                    ▼               ▼               ▼
              CIF × rate    (CIF+Duty) × rate  (CIF+Duty+Excise) × 14%
```

### Under 4 Years — Gasoline

| CC Range | 🏛️ Duty | 📊 Excise | 💰 VAT |
|----------|---------|----------|--------|
| 0 – 1000cc | 35% | 0% | 14% |
| 1001 – 1500cc | 35% | 0% | **0%** ✨ |
| 1501 – 1800cc | 45% | 10% | 14% |
| 1801 – 2000cc | 45% | 10% | 14% |
| 2001 – 3000cc | 45% | 110% | 14% |
| 3000cc+ | 45% | 140% | 14% |

### 4 Years & Older — Gasoline

| CC Range | Excise Formula |
|----------|---------------|
| 0 – 1500cc | **GY$800,000 flat** |
| 1501 – 1800cc | (CIF + US$6,000) × 30% + US$6,000 |
| 1801 – 2000cc | (CIF + US$6,500) × 30% + US$6,500 |
| 2001 – 3000cc | (CIF + US$13,500) × 70% + US$13,500 |
| 3000cc+ | (CIF + US$14,500) × 100% + US$14,500 |

> ⚠️ **Note:** No duty, no VAT — excise only for 4+ year vehicles.

### ⚡ Electric Vehicles

```
╔═══════════════════════════════════════════╗
║   ELECTRIC VEHICLES — ALL CATEGORIES      ║
║                                           ║
║   🏛️ Duty:    0%                          ║
║   📊 Excise:  0%                          ║
║   💰 VAT:     0%                          ║
║                                           ║
║   Any power rating • Any age              ║
╚═══════════════════════════════════════════╝
```

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Structure |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Styling |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Logic |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap_5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white) | Layout |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) | Visualizations |
| ![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white) | Icons |
| ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white) | Hosting |

</div>

**No frameworks. No build step. No dependencies.** Just clean, maintainable vanilla code.

---

## 📚 Data Sources

| Source | Description |
|--------|-------------|
| 📋 [GRA Motor Vehicle Guide](https://www.gra.gov.gy/imports/motor-vehicle/) | Official duty/tax calculation reference |
| 📊 [GRA Income Tax Rates](https://www.gra.gov.gy/) | Official income tax brackets |
| 📰 [Budget 2026 — Vehicles](https://demerarawaves.com/2026/01/26/new-tax-regime-for-vehicles-outboard-engines/) | Vehicle tax changes |
| 📰 [Budget 2026 — Income Tax](https://www.stabroeknews.com/2026/01/26/news/guyana/budget-2026/) | $140,000 threshold announcement |

---

## ⚠️ Disclaimer

> This tool is **not affiliated** with the Guyana Revenue Authority (GRA). It is an independent calculator using publicly available formulas. Always consult a licensed customs broker or tax professional for official advice.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Found a bug?** [Open an issue](https://github.com/kareemschultz/gy-taxcalc/issues)
2. 💡 **Have a suggestion?** [Start a discussion](https://github.com/kareemschultz/gy-taxcalc/issues)
3. 🔧 **Want to contribute?** Fork the repo and submit a PR

```bash
# Clone the repository
git clone https://github.com/kareemschultz/gy-taxcalc.git

# Open in browser (no build needed!)
open index.html
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **[Kareem Schultz](https://github.com/kareemschultz)** | **[KareTech Solutions](https://karetech.gy)**

[![GitHub](https://img.shields.io/badge/GitHub-kareemschultz-181717?style=flat-square&logo=github)](https://github.com/kareemschultz)
[![Website](https://img.shields.io/badge/Website-karetech.gy-009739?style=flat-square&logo=google-chrome&logoColor=white)](https://karetech.gy)

**🇬🇾 Made in Guyana**

</div>
