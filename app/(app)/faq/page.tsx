import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
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

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/20">
        <CardHeader>
          <Badge variant="outline" className="w-fit">Help</Badge>
          <CardTitle className="text-2xl">Help / FAQ</CardTitle>
          <CardDescription>
            Short answers to the questions people ask most often.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
