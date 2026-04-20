import { parseChangelog } from "@/lib/changelog"
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline"
import { Badge } from "@/components/ui/badge"
import { ScrollText } from "lucide-react"
import { DotPattern } from "@/components/dot-pattern"

export const metadata = {
  title: "Changelog — GY TaxCalc",
  description: "Release history and updates for GY TaxCalc.",
}

export default function ChangelogPage() {
  const entries = parseChangelog()
  const latest = entries[0]

  return (
    <div className="relative max-w-3xl mx-auto">
      <DotPattern className="fixed inset-0 -z-10 opacity-30 pointer-events-none" />

      {/* Page header */}
      <div className="mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <ScrollText className="size-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Changelog</h1>
          {latest && (
            <Badge variant="outline" className="ml-2 font-mono">
              v{latest.version}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground max-w-prose">
          All notable changes to GY TaxCalc are documented here. Built for Guyana&apos;s
          2026 tax year — tracking every fix, feature, and calculation improvement.
        </p>
      </div>

      {/* Timeline */}
      <ChangelogTimeline entries={entries} />
    </div>
  )
}
