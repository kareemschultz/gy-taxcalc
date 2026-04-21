import Link from "next/link"
import { ArrowRight, Bot, CalendarRange, Car, Landmark, Radar, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const intelligenceCards = [
  {
    title: "Salary strategy",
    icon: Sparkles,
    description:
      "Use the simulator to compare offer increases, gratuity timing, and taxable versus non-taxable structures.",
    href: "/dashboard",
    cta: "Open Salary Simulator",
  },
  {
    title: "Vehicle decisioning",
    icon: Car,
    description:
      "Check CC presets, age brackets, and concession paths before you commit to an import.",
    href: "/vehicle",
    cta: "Open Vehicle Calculator",
  },
  {
    title: "Loan intelligence",
    icon: Landmark,
    description:
      "Review lump sum scenarios, tie notes, and the best-value recommendation before making an extra payment.",
    href: "/loan",
    cta: "Open Loan Intelligence",
  },
  {
    title: "Planning workflow",
    icon: CalendarRange,
    description:
      "Use the annual planner and compare page together when you want a forward-looking decision path.",
    href: "/planner",
    cta: "Open Annual Planner",
  },
]

export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <Badge variant="new" className="w-fit">
              Intelligence Hub
            </Badge>
            <CardTitle className="text-3xl">Decision tools and what-if shortcuts</CardTitle>
            <CardDescription>
              A faster route to the pages that help you decide, compare, and plan around the numbers.
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
              <Link href="/loan">Open Loan Intelligence</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">Designed for decisions</CardTitle>
            <CardDescription>
              Use this page when you want the app to help choose between options, not just calculate one result.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Compare salary offers, loan offers, and vehicle import paths side-by-side.</p>
            <p>Spot when a bigger lump sum does not improve the payoff date.</p>
            <p>Move directly into the workflow page that matches your next decision.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {intelligenceCards.map((card) => (
          <Card key={card.title} className="bg-muted/20 transition-transform hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <card.icon className="size-4 text-primary" />
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={card.href}>{card.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="size-4 text-primary" />
            Smart workflow shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/dashboard">Salary Increase Simulator</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/vehicle">Vehicle Reference Guide</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/tax-info">Policy Guide</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Radar className="size-3.5" />
        Intelligence pages surface judgment calls and shortcuts; they do not replace the calculator output.
      </p>
    </div>
  )
}
