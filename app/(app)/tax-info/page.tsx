import { Badge } from "@/components/ui/badge"
import { BadgeAccordion } from "@/components/changelog/BadgeAccordion"
import { TimelineItem } from "@/components/changelog/TimelineItem"

export const metadata = {
  title: "Tax Guide 2026 — GY TaxCalc",
  description: "Official-style 2026 tax guide and updates for GY TaxCalc.",
}

type TaxInfoEntry = {
  version: string
  date: string
  title: string
  sections: Array<{
    type: "new" | "updates" | "bugfixes"
    items: string[]
  }>
}

const taxInfoEntries: TaxInfoEntry[] = [
  {
    version: "2026.1",
    date: "2026-01-01",
    title: "Budget 2026 Highlights",
    sections: [
      {
        type: "new",
        items: ["2026 calculator rates, thresholds, and vehicle rules are now available."],
      },
      {
        type: "updates",
        items: ["Tooling updated to surface GRA-style summaries inside the app."],
      },
    ],
  },
  {
    version: "2026.2",
    date: "2026-01-01",
    title: "Income Tax Rates & Brackets",
    sections: [
      {
        type: "new",
        items: ["25% on chargeable income up to GYD $280,000 per month."],
      },
      {
        type: "updates",
        items: [
          "35% on income above GYD $280,000 (reduced from 40%).",
          "Personal allowance: GYD $140,000/month or 1/3 of income, whichever is greater.",
        ],
      },
    ],
  },
  {
    version: "2026.3",
    date: "2026-01-01",
    title: "Allowances & Exemptions",
    sections: [
      {
        type: "new",
        items: [
          "Overtime and second-job income keep the first GYD $50,000 non-taxable.",
        ],
      },
      {
        type: "updates",
        items: [
          "Child allowance remains GYD $10,000 per child each month.",
          "Insurance deductions stay capped at 10% of gross or GYD $50,000 monthly.",
        ],
      },
    ],
  },
  {
    version: "2026.4",
    date: "2026-01-01",
    title: "NIS Contributions",
    sections: [
      {
        type: "new",
        items: ["NIS is calculated at 5.6% up to the ceiling of GYD $280,000."],
      },
      {
        type: "updates",
        items: [
          "Ceiling and contribution handling are aligned with the 2026 salary calculator.",
        ],
      },
    ],
  },
  {
    version: "2026.5",
    date: "2026-01-01",
    title: "Vehicle Import Taxes 2026",
    sections: [
      {
        type: "new",
        items: [
          "Electric vehicles and ATVs remain fully exempt under the current toolkit rules.",
        ],
      },
      {
        type: "updates",
        items: [
          "Double-cab pickups use the 2026 flat-tax treatment by engine bracket.",
          "Returning nationals and G-plate handling are surfaced in the vehicle calculator.",
        ],
      },
    ],
  },
  {
    version: "2026.6",
    date: "2026-01-01",
    title: "Qualification Allowances (New)",
    sections: [
      {
        type: "new",
        items: [
          "ACCA allowance: GYD $15,000 per month.",
          "Master's allowance: GYD $22,000 per month.",
          "PhD allowance: GYD $32,000 per month.",
        ],
      },
    ],
  },
  {
    version: "2026.7",
    date: "2026-01-01",
    title: "Loan & Credit Guidelines",
    sections: [
      {
        type: "new",
        items: ["Loan comparison cards now surface the main bank presets and ranges."],
      },
      {
        type: "updates",
        items: ["Bi-weekly and extra-payment scenarios remain supported in the loan calculator."],
      },
    ],
  },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function TaxInfoPage() {
  return (
    <>
      <section id="home" className="-mt-6 pt-6">
        <div className="space-y-4 px-4 py-8 text-center md:px-8 md:py-16">
          <Badge className="text-sm font-normal" variant="outline">
            Tax Guide
          </Badge>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Tax Guide 2026
          </h2>
          <p className="text-muted-foreground text-xl">
            Official GRA rates and allowances for the 2026 tax year.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
          <div className="flex flex-col items-start">
            {taxInfoEntries.map((entry) => (
              <TimelineItem
                key={entry.version}
                version={`v ${entry.version}`}
                date={formatDate(entry.date)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase tracking-wide">
                      {entry.title}
                    </Badge>
                  </div>
                  <BadgeAccordion data={entry.sections} />
                </div>
              </TimelineItem>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
