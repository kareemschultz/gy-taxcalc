"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type StickyItem = {
  label: string
  value: string
}

type StickyResultsBarProps = {
  items: StickyItem[]
  buttonLabel?: string
  onDetails: () => void
  className?: string
}

export function StickyResultsBar({
  items,
  buttonLabel = "Details",
  onDetails,
  className,
}: StickyResultsBarProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-sm md:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted px-2 py-2">
              <p className="text-[10px] uppercase text-muted-foreground">{item.label}</p>
              <p className="font-semibold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={onDetails}>
          <ArrowDown className="size-4" />
          {buttonLabel}
        </Button>
      </div>
    </motion.div>
  )
}
