"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"

const breadcrumbMap: Record<string, { label: string; description: string }> = {
  "/overview": {
    label: "Overview",
    description: "Quick launch and tool guide",
  },
  "/dashboard": {
    label: "Tax Calculator",
    description: "Guyana 2026 income tax & payroll calculator",
  },
  "/vehicle": {
    label: "Vehicle Import",
    description: "Guyana 2026 import tax calculator",
  },
  "/loan": {
    label: "Loan Calculator",
    description: "Amortization, extra payments & lender comparison",
  },
  "/compare": {
    label: "Compare Scenarios",
    description: "Side-by-side comparisons across the toolkit",
  },
  "/planner": {
    label: "Annual Planner",
    description: "Year-round payroll and policy reminders",
  },
  "/faq": {
    label: "Help / FAQ",
    description: "Common questions and guidance",
  },
  "/changelog": {
    label: "Changelog",
    description: "Release history & updates",
  },
}

export function AppHeader() {
  const pathname = usePathname()
  const current = breadcrumbMap[pathname] ?? { label: "GY TaxCalc", description: "" }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{current.label}</h1>
          {current.description && (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {current.description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:hidden">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          GY
        </span>
        <div className="text-center">
          <h1 className="text-sm font-semibold leading-none">{current.label}</h1>
          <p className="text-[11px] text-muted-foreground">Guyana&apos;s Tax Toolkit</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <div className="md:hidden">
          <ModeToggle variant="ghost" />
        </div>
        <Badge variant="outline" className="hidden sm:inline-flex text-xs">
          2026 Rates
        </Badge>
        <Badge variant="new" className="hidden sm:inline-flex text-xs">
          v2.4.0
        </Badge>
        <Link
          href="https://github.com/kareemschultz/gy-taxcalc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden md:block"
        >
          GitHub
        </Link>
      </div>
    </header>
  )
}
