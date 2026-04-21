"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Breakdown = { label: string; value: string; highlight?: boolean }

type SummaryCardVariant = "emerald" | "blue" | "violet" | "amber" | "teal"

const variants: Record<
  SummaryCardVariant,
  { card: string; icon: string; label: string; value: string; pill: string; pillText: string }
> = {
  emerald: {
    card: "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    label: "text-emerald-700/80 dark:text-emerald-400/70",
    value: "text-emerald-700 dark:text-emerald-300",
    pill: "bg-emerald-500/10",
    pillText: "text-emerald-700 dark:text-emerald-300",
  },
  blue: {
    card: "border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent",
    icon: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    label: "text-blue-700/80 dark:text-blue-400/70",
    value: "text-blue-700 dark:text-blue-300",
    pill: "bg-blue-500/10",
    pillText: "text-blue-700 dark:text-blue-300",
  },
  violet: {
    card: "border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent",
    icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    label: "text-violet-700/80 dark:text-violet-400/70",
    value: "text-violet-700 dark:text-violet-300",
    pill: "bg-violet-500/10",
    pillText: "text-violet-700 dark:text-violet-300",
  },
  amber: {
    card: "border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    label: "text-amber-700/80 dark:text-amber-400/70",
    value: "text-amber-700 dark:text-amber-300",
    pill: "bg-amber-500/10",
    pillText: "text-amber-700 dark:text-amber-300",
  },
  teal: {
    card: "border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent",
    icon: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
    label: "text-teal-700/80 dark:text-teal-400/70",
    value: "text-teal-700 dark:text-teal-300",
    pill: "bg-teal-500/10",
    pillText: "text-teal-700 dark:text-teal-300",
  },
}

interface SummaryCardProps {
  label: string
  value: React.ReactNode
  icon: React.ReactNode
  variant?: SummaryCardVariant
  breakdown?: Breakdown[]
  badge?: string
  className?: string
}

export function SummaryCard({
  label,
  value,
  icon,
  variant = "blue",
  breakdown,
  badge,
  className,
}: SummaryCardProps) {
  const v = variants[variant]

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md", v.card, className)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={cn("text-[10px] font-semibold uppercase tracking-widest leading-tight", v.label)}>
          {label}
        </p>
        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", v.icon)}>
          {icon}
        </div>
      </div>

      {/* Main value */}
      <div className={cn("text-2xl font-bold tabular-nums leading-none mb-3", v.value)}>
        {value}
      </div>

      {/* Breakdown pills */}
      {breakdown && breakdown.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1 border-t border-current/10">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className={cn("rounded-md px-2 py-1 flex flex-col gap-0", v.pill)}
            >
              <span className={cn("text-[9px] uppercase tracking-wide opacity-60", v.pillText)}>
                {item.label}
              </span>
              <span className={cn("text-[11px] font-semibold tabular-nums leading-tight", item.highlight ? v.value : v.pillText)}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {badge && (
        <div className={cn("mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", v.pill, v.pillText)}>
          {badge}
        </div>
      )}
    </motion.div>
  )
}
