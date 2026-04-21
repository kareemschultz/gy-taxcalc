"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Calculator,
  Car,
  Landmark,
  BookOpen,
  HelpCircle,
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
]

const updatesNav = [
  {
    title: "Policy Guide",
    url: "/tax-info",
    icon: BookOpen,
  },
  {
    title: "Help / FAQ",
    url: "/faq",
    icon: HelpCircle,
  },
  {
    title: "Release Notes",
    url: "/changelog",
    icon: ScrollText,
    badge: "History",
  },
]

type ResourceLink = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

type ResourceSection = {
  label: string
  items: ResourceLink[]
}

const resourceSections: ResourceSection[] = [
  {
    label: "App Resources",
    items: [
      { title: "Overview", url: "/overview", icon: LayoutDashboard },
      { title: "Tax Calculator", url: "/dashboard", icon: Calculator },
      { title: "Vehicle Import", url: "/vehicle", icon: Car },
      { title: "Loan Calculator", url: "/loan", icon: Landmark },
      { title: "Compare Scenarios", url: "/compare", icon: GitCompareArrows },
      { title: "Annual Planner", url: "/planner", icon: CalendarRange },
      { title: "Policy Guide", url: "/tax-info", icon: BookOpen },
      { title: "Help / FAQ", url: "/faq", icon: HelpCircle },
      { title: "Release Notes", url: "/changelog", icon: ScrollText },
    ],
  },
  {
    label: "Official Guyana",
    items: [
      { title: "GRA Home", url: "https://www.gra.gov.gy", icon: Globe, external: true },
      { title: "Motor Vehicle Duty / Tax Guide", url: "https://www.gra.gov.gy/imports/motor-vehicle/", icon: FileText, external: true },
      { title: "Motor Vehicle Registration", url: "https://www.gra.gov.gy/vehicles/register-your-motor-vehicle/", icon: Car, external: true },
      { title: "Vehicle Registration Simplified", url: "https://www.gra.gov.gy/simplified-procedures-for-registration-of-vehicles-expanded/", icon: FileText, external: true },
      { title: "Re-migrant Policy", url: "https://www.gra.gov.gy/tax-exemption-policy-for-qualifying-re-migrants-settlers-and-returning-students-2/", icon: Shield, external: true },
      { title: "Vehicle Exemptions", url: "https://www.gra.gov.gy/exemptions/", icon: Shield, external: true },
      { title: "Budget at a Glance 2026", url: "https://finance.gov.gy/budget-at-a-glance-2026/", icon: TrendingUp, external: true },
      { title: "VAT Fishing Policy", url: "https://www.gra.gov.gy/policy-17-vat-and-fishing-sector/", icon: FileText, external: true },
    ],
  },
  {
    label: "Loan & Finance",
    items: [
      { title: "GPSCCU Home", url: "https://mygpsccu.com/", icon: CircleDollarSign, external: true },
      { title: "GBTI Home", url: "https://www.gbtibank.com/", icon: Banknote, external: true },
      { title: "Bank of Baroda Vehicle Loan", url: "https://www.bankofbaroda.gy/products/financing-facilities/vehicle-loan", icon: Car, external: true },
      { title: "Bank of Baroda Personal Loan", url: "https://www.bankofbaroda.gy/products/financing-facilities/personal-loans", icon: Landmark, external: true },
      { title: "Republic Retail Loans", url: "https://www.republicguyana.com/personal/retail-loans", icon: Banknote, external: true },
      { title: "Citizens Loan Calculator", url: "https://www.citizensbankgy.com/calculators/", icon: Calculator, external: true },
      { title: "Demerara Credit Facilities", url: "https://demerarabank.com/credit-facilities/", icon: Landmark, external: true },
      { title: "Demerara Loan Calculator", url: "https://demerarabank.com/loan-repayment-calculator/", icon: Calculator, external: true },
    ],
  },
]

function ResourcesMenu() {
  return (
    <>
      {resourceSections.map((section, index) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenuSub>
            {section.items.map((item) => (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild>
                  {item.external ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <item.icon />
                      <span>{item.title}</span>
                      <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                    </a>
                  ) : (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
          {index < resourceSections.length - 1 ? <SidebarSeparator /> : null}
        </SidebarGroup>
      ))}
    </>
  )
}

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
        <ResourcesMenu />
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
