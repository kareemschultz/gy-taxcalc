"use client"

import * as React from "react"
import { ChangelogEntryCard } from "./ChangelogEntry"
import type { ChangelogEntry } from "@/lib/changelog"

export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="relative">
      {entries.map((entry, i) => (
        <ChangelogEntryCard
          key={entry.version}
          entry={entry}
          index={i}
          isLatest={i === 0}
        />
      ))}
    </div>
  )
}
