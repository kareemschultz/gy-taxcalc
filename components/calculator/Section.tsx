"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SectionProps {
  title: string
  icon?: React.ReactNode
  description?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function Section({
  title,
  icon,
  description,
  defaultOpen = true,
  children,
  className,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/40"
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2">
            {icon}
            <span className="truncate">{title}</span>
          </span>
          {description ? (
            <span className="text-xs font-normal leading-snug text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="space-y-4 px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
