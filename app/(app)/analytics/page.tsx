import Link from "next/link"
import { Activity, ArrowRight, BarChart3, Car, Landmark, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const analyticsCards = [
  {
    title: "Salary analytics",
    icon: TrendingUp,
    summary: "Charts, breakdowns, take-home rate, and gratuity tracking.",
    href: "/dashboard",
  },
  {
    title: "Vehicle analytics",
    icon: Car,
    summary: "Tax bands, exemption paths, and landed-cost comparison.",
    href: "/vehicle",
  },
  {
    title: "Loan analytics",
    icon: Landmark,
    summary: "Amortization, lender comparison, payoff timing, and strategy views.",
    href: "/loan",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <Badge variant="new" className="w-fit">
              Analytics
            </Badge>
            <CardTitle className="text-3xl">Trend-focused dashboards and summaries</CardTitle>
            <CardDescription>
              This page is for the visual side of the toolkit: patterns, comparisons, and at-a-glance trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/compare">
                Open Compare Scenarios
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/loan">Open Loan Charts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">What this page emphasizes</CardTitle>
            <CardDescription>Use it when the numbers themselves matter less than the trend they create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Charts are meant to show direction, not just the exact final amount.</p>
            <p>Decision cards call out the best lender, best payoff path, or best import route.</p>
            <p>Each section links back to the calculator so you can adjust the source inputs.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {analyticsCards.map((card) => (
          <Card key={card.title} className="bg-muted/20 transition-transform hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <card.icon className="size-4 text-primary" />
                {card.title}
              </CardTitle>
              <CardDescription>{card.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={card.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="size-4 text-primary" />
            Visual snapshots
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Salary trend</p>
            <p className="mt-1 text-sm font-semibold">Breakdown + charts + simulator</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Vehicle trend</p>
            <p className="mt-1 text-sm font-semibold">CC, age, duty, excise, VAT</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Loan trend</p>
            <p className="mt-1 text-sm font-semibold">Months saved, interest saved, payoff path</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Policy trend</p>
            <p className="mt-1 text-sm font-semibold">Guide, FAQ, changelog, and updates</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <PieChart className="size-4 text-primary" />
            Analytics shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/dashboard">Salary Charts</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/vehicle">Vehicle Breakdown</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/loan">Loan Intelligence</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="size-3.5" />
        Analytics is intentionally broad: the detailed math still lives inside each calculator page.
      </p>
    </div>
  )
}
