"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calculator,
  ScrollText,
  TrendingUp,
  Info,
  ExternalLink,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/layout/nav-main"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"

const mainNav = [
  {
    title: "Tax Calculator",
    url: "/dashboard",
    icon: Calculator,
  },
  {
    title: "Changelog",
    url: "/changelog",
    icon: ScrollText,
    badge: "v2.4",
  },
]

const resourcesNav = [
  {
    title: "GRA Tax Info",
    url: "https://www.gra.gov.gy",
    icon: ExternalLink,
  },
  {
    title: "Budget 2026",
    url: "https://www.finance.gov.gy",
    icon: TrendingUp,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  GY
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">GY TaxCalc</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Guyana&apos;s Tax Toolkit
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain label="Tools" items={mainNav} />
        <SidebarSeparator />
        <NavMain label="Resources" items={resourcesNav} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5">
            <Info className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              2026 Tax Year
            </span>
            <Badge variant="new" className="text-[10px] py-0">
              GRA
            </Badge>
          </div>
          <ModeToggle variant="ghost" />
        </div>
        {/* Collapsed state — just the toggle */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center pb-1">
          <ModeToggle variant="ghost" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
