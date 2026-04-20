"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface HintProps {
  label: string
  tip: React.ReactNode
  className?: string
}

export function Hint({ label, tip, className }: HintProps) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
            className
          )}
        >
          <span>{label}</span>
          <HelpCircle className="size-3.5 text-muted-foreground/70" />
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-64 text-xs leading-relaxed">
          {tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
