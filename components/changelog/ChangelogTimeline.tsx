import { TimelineItem } from "./TimelineItem"
import { BadgeAccordion } from "./BadgeAccordion"
import type { ChangelogEntry } from "@/lib/changelog"

function sectionType(title: string): "new" | "updates" | "bugfixes" {
  const t = title.toLowerCase()
  if (t.includes("fix") || t.includes("bug")) return "bugfixes"
  if (t.includes("new") || t.includes("feature") || t.includes("add")) return "new"
  return "updates"
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

interface ChangelogTimelineProps {
  entries: ChangelogEntry[]
}

export function ChangelogTimeline({ entries }: ChangelogTimelineProps) {
  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
        <div className="flex flex-col items-start">
          {entries.map((entry) => {
            const accordionData = entry.sections.map((s) => ({
              type: sectionType(s.title),
              items: s.items,
            }))

            return (
              <TimelineItem
                key={entry.version}
                version={`v ${entry.version}`}
                date={formatDate(entry.date)}
              >
                <div className="space-y-4">
                  <BadgeAccordion data={accordionData} />
                </div>
              </TimelineItem>
            )
          })}
        </div>
      </div>
    </section>
  )
}
