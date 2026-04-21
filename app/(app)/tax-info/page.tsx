import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BadgeAccordion } from "@/components/changelog/BadgeAccordion"
import { TimelineItem } from "@/components/changelog/TimelineItem"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Policy Guide 2026 — GY TaxCalc",
  description: "Official-style 2026 policy guide and updates for GY TaxCalc.",
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
  {
    version: "2026.8",
    date: "2026-01-01",
    title: "Vehicle Import Quick Reference",
    sections: [
      {
        type: "new",
        items: [
          "Use CIF, engine size, vehicle age, plate type, and importer type to estimate duty and excise.",
          "Electric vehicles and ATVs are fully exempt in the current calculator rules.",
        ],
      },
      {
        type: "updates",
        items: [
          "Private under-1500cc imports may qualify for VAT relief in the Budget 2026 ruleset.",
          "Returning nationals and G-plates are surfaced as special concessions in the vehicle calculator.",
        ],
      },
    ],
  },
  {
    version: "2026.9",
    date: "2026-01-01",
    title: "Loan & Credit Quick Reference",
    sections: [
      {
        type: "new",
        items: [
          "Choose a lender preset, enter principal, rate, term, and payment frequency.",
          "Add extra payments to model faster payoff and interest savings.",
        ],
      },
      {
        type: "updates",
        items: [
          "Bi-weekly payment mode is available for borrowers who want a faster payoff path.",
          "Use the schedule and bank comparison views to compare the total cost of each option.",
        ],
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
            Policy Guide
          </Badge>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Policy Guide 2026
          </h2>
          <p className="text-muted-foreground text-xl">
            Official 2026 rates, allowances, and policy notes for GY TaxCalc.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8">
        <Card className="mx-auto max-w-4xl border-dashed bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Navigation</CardTitle>
            <CardDescription>
              Jump to the section you need without scrolling through the whole guide.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {taxInfoEntries.map((entry) => (
                <Button
                  key={entry.version}
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-auto whitespace-normal text-left"
                >
                  <a href={`#${entry.version.toLowerCase()}`}>{entry.title}</a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
          <div className="flex flex-col items-start">
            {taxInfoEntries.map((entry) => (
              <TimelineItem
                key={entry.version}
                version={`v ${entry.version}`}
                date={formatDate(entry.date)}
                id={entry.version.toLowerCase()}
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

      <section className="px-4 pb-10 md:px-8 md:pb-16">
        <Card className="mx-auto max-w-4xl bg-muted/20">
          <CardContent className="space-y-3 pt-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Use this guide as a reference, not advice.</p>
            <p>
              Based on 2026 Guyana tax regulations. Not affiliated with GRA. Consult a tax
              professional for official advice.
            </p>
            <Separator />
            <p>
              Built with care by Kareem Schultz. Check release notes for fixes, policy updates,
              and interface improvements.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
