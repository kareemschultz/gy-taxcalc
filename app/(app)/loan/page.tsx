"use client"

import { DotPattern } from "@/components/dot-pattern"

export default function LoanPage() {
  return (
    <div className="relative min-h-full">
      <DotPattern className="absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl rounded-2xl border bg-card/80 p-6 text-sm text-muted-foreground shadow-sm">
        Loan calculator route scaffold. The full loan UI will be added in the next step.
      </div>
    </div>
  )
}
