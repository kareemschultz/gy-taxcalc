"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Bug,
  Wrench,
  Zap,
  BookOpen,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ChangelogEntry as TChangelogEntry } from "@/lib/changelog"

/* ── Section icon mapping ─────────────────────────────── */
function SectionIcon({ title }: { title: string }) {
  const lower = title.toLowerCase()
  if (lower.includes("fix") || lower.includes("bug")) return <Bug className="size-3" />
  if (lower.includes("new") || lower.includes("feature") || lower.includes("add")) return <Sparkles className="size-3" />
  if (lower.includes("improve") || lower.includes("enhance")) return <Zap className="size-3" />
  if (lower.includes("note") || lower.includes("doc")) return <BookOpen className="size-3" />
  return <Wrench className="size-3" />
}

function sectionColor(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes("fix") || lower.includes("bug")) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
  if (lower.includes("new") || lower.includes("feature") || lower.includes("add")) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
  if (lower.includes("improve") || lower.includes("enhance")) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
  return "text-muted-foreground bg-muted/60"
}

/* ── Single entry card ────────────────────────────────── */
interface EntryProps {
  entry: TChangelogEntry
  index: number
  isLatest?: boolean
}

export function ChangelogEntryCard({ entry, index, isLatest }: EntryProps) {
  const date = new Date(entry.date + "T00:00:00")
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" aria-hidden />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-[-5px] top-1.5 size-2.5 rounded-full border-2 border-background",
          isLatest ? "bg-primary shadow-[0_0_8px_2px_hsl(var(--primary)/0.4)]" : "bg-muted-foreground/50"
        )}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-bold text-foreground">
            v{entry.version}
          </span>
          {isLatest && (
            <Badge variant="new" className="text-[10px] py-0 flex items-center gap-1">
              <Star className="size-2.5" />
              Latest
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-0.5">{formatted}</span>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {entry.sections.map((section, si) => (
          <div key={si}>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold mb-2",
                sectionColor(section.title)
              )}
            >
              <SectionIcon title={section.title} />
              {section.title}
            </div>
            <ul className="space-y-1.5 ml-1">
              {section.items.map((item, ii) => (
                <li key={ii} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                  <span className="mt-1.5 size-1 rounded-full bg-border shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
