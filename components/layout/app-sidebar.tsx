"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Calculator,
  Car,
  Landmark,
  BookOpen,
  ScrollText,
  TrendingUp,
  Info,
  ExternalLink,
  GitCompareArrows,
  CalendarRange,
  Globe,
  FileText,
  Banknote,
  Shield,
  CircleDollarSign,
  Radar,
  Activity,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/layout/nav-main"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"

const mainNav = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Tax Calculator",
    url: "/dashboard",
    icon: Calculator,
  },
  {
    title: "Vehicle Import",
    url: "/vehicle",
    icon: Car,
  },
  {
    title: "Loan Calculator",
    url: "/loan",
    icon: Landmark,
  },
  {
    title: "Compare Scenarios",
    url: "/compare",
    icon: GitCompareArrows,
  },
  {
    title: "Annual Planner",
    url: "/planner",
    icon: CalendarRange,
  },
  {
    title: "Insights",
    url: "/insights",
    icon: Radar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: Activity,
  },
]

const updatesNav = [
  {
    title: "Policy Guide",
    url: "/tax-info",
    icon: BookOpen,
  },
  {
    title: "Release Notes",
    url: "/changelog",
    icon: ScrollText,
    badge: "History",
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
        <NavMain label="Updates" items={updatesNav} />
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Official Guyana</SidebarGroupLabel>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a href="https://www.gra.gov.gy" title="GRA Home" target="_blank" rel="noopener noreferrer">
                  <Globe />
                  <span>GRA Home</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/imports/motor-vehicle/"
                  title="Vehicle Tax Guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText />
                  <span>Vehicle Tax Guide</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/vehicles/register-your-motor-vehicle/"
                  title="Vehicle Registration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Car />
                  <span>Vehicle Registration</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/simplified-procedures-for-registration-of-vehicles-expanded/"
                  title="Registration Guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText />
                  <span>Registration Guide</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/tax-exemption-policy-for-qualifying-re-migrants-settlers-and-returning-students-2/"
                  title="Re-migrant Policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield />
                  <span>Re-migrant Policy</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/exemptions/"
                  title="Vehicle Exemptions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield />
                  <span>Vehicle Exemptions</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a href="https://finance.gov.gy/budget-at-a-glance-2026/" title="Budget 2026" target="_blank" rel="noopener noreferrer">
                  <TrendingUp />
                  <span>Budget 2026</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.gra.gov.gy/policy-17-vat-and-fishing-sector/"
                  title="VAT Fishing Policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText />
                  <span>VAT Fishing Policy</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Loan &amp; Finance</SidebarGroupLabel>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a href="https://mygpsccu.com/" title="GPSCCU Home" target="_blank" rel="noopener noreferrer">
                  <CircleDollarSign />
                  <span>GPSCCU Home</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a href="https://www.gbtibank.com/" title="GBTI Home" target="_blank" rel="noopener noreferrer">
                  <Banknote />
                  <span>GBTI Home</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.bankofbaroda.gy/products/financing-facilities/vehicle-loan"
                  title="BoB Vehicle Loan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Car />
                  <span>BoB Vehicle Loan</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.bankofbaroda.gy/products/financing-facilities/personal-loans"
                  title="BoB Personal Loan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Landmark />
                  <span>BoB Personal Loan</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.republicguyana.com/personal/retail-loans"
                  title="Republic Retail"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Banknote />
                  <span>Republic Retail</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://www.citizensbankgy.com/calculators/"
                  title="Citizens Calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calculator />
                  <span>Citizens Calculator</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://demerarabank.com/credit-facilities/"
                  title="Demerara Credit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Landmark />
                  <span>Demerara Credit</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild className="items-start py-2 text-left [&>span]:whitespace-normal [&>span]:leading-tight">
                <a
                  href="https://demerarabank.com/loan-repayment-calculator/"
                  title="Demerara Calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calculator />
                  <span>Demerara Calculator</span>
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarGroup>
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
