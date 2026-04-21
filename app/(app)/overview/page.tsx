import Link from "next/link"
import { ArrowRight, BookOpen, Calculator, Car, GitCompareArrows, Landmark, ScrollText, CalendarRange } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const quickLinks = [
  { title: "Tax Calculator", href: "/dashboard", icon: Calculator, description: "Calculate salary, PAYE, NIS, gratuity, and deductions." },
  { title: "Vehicle Import", href: "/vehicle", icon: Car, description: "Estimate duty, excise, VAT, and landed cost." },
  { title: "Loan Calculator", href: "/loan", icon: Landmark, description: "Model monthly payments, savings, and lender comparisons." },
  { title: "Compare Scenarios", href: "/compare", icon: GitCompareArrows, description: "Compare offers side-by-side before you commit." },
  { title: "Annual Planner", href: "/planner", icon: CalendarRange, description: "Track gratuity, bonuses, and key planning moments." },
  { title: "Policy Guide", href: "/tax-info", icon: BookOpen, description: "Read the 2026 rules and quick references." },
]

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/20">
          <CardHeader>
            <Badge variant="secondary" className="w-fit bg-white/15 text-primary-foreground">
              Start here
            </Badge>
            <CardTitle className="text-3xl">GY TaxCalc Overview</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              A single place to calculate pay, imports, loans, compare options, and learn the 2026 rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard">
                Open Tax Calculator
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/10 text-primary-foreground hover:bg-white/15">
              <Link href="/compare">Compare Scenarios</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">What&apos;s inside</CardTitle>
            <CardDescription>Three calculators, policy guidance, and planning tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Salary tools for PAYE, gratuity, and allowances.</p>
            <p>Vehicle import rules with 2026 budget adjustments.</p>
            <p>Loan and comparison views for easier decisions.</p>
            <p>Policy notes and release history for quick reference.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((item) => (
          <Card key={item.title} className="bg-muted/20 transition-transform hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <item.icon className="size-4 text-primary" />
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={item.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
