"use client"

import { cn } from "@/lib/utils"

interface DotPatternProps {
  className?: string
}

export function DotPattern({ className }: DotPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(circle,hsl(152_56%_26%/0.18)_1px,transparent_1px)]",
        "[background-size:20px_20px]",
        "dark:bg-[radial-gradient(circle,hsl(152_50%_42%/0.13)_1px,transparent_1px)]",
        "[mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)]",
        className
      )}
    />
  )
}
