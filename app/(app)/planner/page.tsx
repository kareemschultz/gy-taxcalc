import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const quarters = [
  {
    title: "Q1: Set your baseline",
    items: ["Review salary, allowances, and deductions.", "Check if your position preset still matches your real pay.", "Use the comparison tool for offers and options."],
  },
  {
    title: "Q2: Prepare for gratuity",
    items: ["Track month 6 package timing.", "Review loan prepayment options if you plan to reduce interest.", "Check vehicle import timing against the current rules."],
  },
  {
    title: "Q3: Reassess allowances",
    items: ["Update children, insurance, or loan deductions.", "Use the salary increase simulator if your pay changes.", "Compare net pay against the last review point."],
  },
  {
    title: "Q4: Plan year-end",
    items: ["Review month 12 package and vacation allowance.", "Save or print your final year estimate.", "Check the Policy Guide for any year-end updates."],
  },
]

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/20">
        <CardHeader>
          <Badge variant="outline" className="w-fit">Planning</Badge>
          <CardTitle className="text-2xl">Annual Planner</CardTitle>
          <CardDescription>
            A simple year-round checklist for salary, gratuity, vehicles, and loans.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {quarters.map((quarter) => (
          <Card key={quarter.title} className="bg-muted/20">
            <CardHeader>
              <CardTitle className="text-sm">{quarter.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {quarter.items.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-sm">Quick reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Use the salary calculator when your basic pay or allowances change.</p>
          <p>Use the vehicle calculator before buying, shipping, or registering a vehicle.</p>
          <p>Use the loan calculator before signing or refinancing a repayment plan.</p>
          <Separator className="my-3" />
          <p>The planner is a guide, not a substitute for official advice or lender confirmation.</p>
        </CardContent>
      </Card>
    </div>
  )
}
