import { parseChangelog } from "@/lib/changelog"
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Changelog — GY TaxCalc",
  description: "Release history and updates for GY TaxCalc.",
}

export default function ChangelogPage() {
  const entries = parseChangelog()

  return (
    <>
      {/* Hero — matches Track template style */}
      <section id="home" className="-mt-6 pt-6">
        <div className="space-y-4 px-4 py-8 text-center md:px-8 md:py-16">
          <Badge className="text-sm font-normal" variant="outline">
            Updates
          </Badge>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">Changelog</h2>
          <p className="text-muted-foreground text-xl">
            See what&apos;s new, changed, fixed, and improved in GY TaxCalc.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <ChangelogTimeline entries={entries} />
    </>
  )
}
