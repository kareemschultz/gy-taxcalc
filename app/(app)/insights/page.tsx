import Link from "next/link"
import { ArrowRight, BookOpen, Car, Landmark, Radar, ScrollText, ShieldCheck, Wallet } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const insightCards = [
  {
    title: "Salary signals",
    icon: Wallet,
    points: [
      "Use the detailed allowance mode when you need to separate taxable and non-taxable items.",
      "Watch the effective tax rate and take-home rate together to avoid overestimating net pay.",
      "The salary increase simulator is best for comparing offer changes, not just percentage raises.",
    ],
    href: "/dashboard",
    cta: "Open Tax Calculator",
  },
  {
    title: "Vehicle signals",
    icon: Car,
    points: [
      "Model year matters because it changes the age bracket and the exemption path.",
      "Use the CC preset dropdown first, then switch to custom only if the vehicle falls outside the standard bands.",
      "Returning national concessions and plate type can change the final landed cost more than engine size alone.",
    ],
    href: "/vehicle",
    cta: "Open Vehicle Import",
  },
  {
    title: "Loan signals",
    icon: Landmark,
    points: [
      "The loan intelligence view highlights which lump sum gives the same payoff date for less cash.",
      "Rate comparisons are a guide only; lender policies can change the actual payment structure.",
      "Bi-weekly payments only help if the lender applies them in a way that reduces principal quickly.",
    ],
    href: "/loan",
    cta: "Open Loan Calculator",
  },
]

const faqItems = [
  {
    q: "What is the difference between taxable and non-taxable allowances?",
    a: "Taxable allowances increase PAYE exposure. Non-taxable allowances are included in gross pay for take-home calculations but are treated differently under the calculator rules.",
  },
  {
    q: "How does gratuity work?",
    a: "The calculator accrues gratuity monthly from the basic salary using the selected gratuity rate, then shows the 6-month and 12-month package effects.",
  },
  {
    q: "Why does the vehicle tool ask for engine size, age, and plate type?",
    a: "Those inputs determine the duty, excise, VAT, and any special 2026 concession path for the vehicle.",
  },
  {
    q: "How do bi-weekly loan payments compare to monthly payments?",
    a: "Bi-weekly payments typically reduce interest and shorten the payoff period because the schedule pays more often over the year.",
  },
  {
    q: "Can I print or save my result?",
    a: "Yes. The calculators include Save, Share, and Print actions on the results panels for a quick export of the current scenario.",
  },
  {
    q: "Where should I look for policy updates?",
    a: "Use the Policy Guide for the rules and the Release Notes for interface or logic updates that were added later.",
  },
]

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <Badge variant="new" className="w-fit">
              Insights Hub
            </Badge>
            <CardTitle className="text-3xl">Quick reference for the main calculators</CardTitle>
            <CardDescription>
              A compact place to review the most useful things to notice before you enter numbers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/dashboard">
                Open Salary Tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tax-info">Read Policy Guide</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">What this page is for</CardTitle>
            <CardDescription>Fast signals, not long-form explanations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Salary users can quickly check taxable vs non-taxable items.</p>
            <p>Vehicle users can spot age, CC, and concession impacts.</p>
            <p>Loan users can compare payoff strategies without rerunning the whole form.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {insightCards.map((card) => (
          <Card key={card.title} className="bg-muted/20 transition-transform hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <card.icon className="size-4 text-primary" />
                {card.title}
              </CardTitle>
              <CardDescription>Top things to notice before calculating.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
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
            <BookOpen className="size-4 text-primary" />
            Reference shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/compare">Compare Scenarios</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/planner">Annual Planner</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/tax-info">Policy Guide</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start border">
            <Link href="/changelog">Release Notes</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ScrollText className="size-4 text-primary" />
            Quick answers
          </CardTitle>
          <CardDescription>Fast answers to the questions that overlap with FAQ.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ScrollText className="size-3.5" />
        The insights hub stays high-level on purpose. Use the calculator pages for the actual calculations.
      </p>
    </div>
  )
}
