"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const breadcrumbMap: Record<string, { label: string; description: string }> = {
  "/dashboard": {
    label: "Tax Calculator",
    description: "Guyana 2026 income tax & payroll calculator",
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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />

      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold truncate">{current.label}</h1>
          {current.description && (
            <p className="text-xs text-muted-foreground hidden sm:block truncate">
              {current.description}
            </p>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
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
