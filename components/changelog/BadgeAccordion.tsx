"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

type AccordionEntry = {
  type: "new" | "updates" | "bugfixes"
  items: string[]
}

interface BadgeAccordionProps {
  data: AccordionEntry[]
  defaultOpen?: string[]
}

function getBadgeProps(type: string) {
  switch (type) {
    case "new":
      return {
        className:
          "border-none h-6 rounded-sm bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400",
        label: "New",
      }
    case "updates":
      return {
        className:
          "border-none h-6 rounded-sm bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400",
        label: "Updates",
      }
    case "bugfixes":
      return {
        className:
          "border-none h-6 rounded-sm bg-amber-600/10 text-amber-600 dark:bg-orange-400/10 dark:text-orange-400",
        label: "Bug Fixes",
      }
    default:
      return {
        className:
          "border-none h-6 rounded-sm bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400",
        label: "Updates",
      }
  }
}

export function BadgeAccordion({ data, defaultOpen }: BadgeAccordionProps) {
  const defaultValue = defaultOpen ?? data.map((_, i) => `item-${i}`)

  return (
    <Accordion type="multiple" className="-mt-4 mb-0 w-full" defaultValue={defaultValue}>
      {data.map((item, index) => {
        const badge = getBadgeProps(item.type)
        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline [&>svg]:size-6">
              <Badge className={badge.className}>{badge.label}</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="text-muted-foreground list-inside list-disc space-y-3 text-sm">
                {item.items.map((listItem, li) => (
                  <li key={li} dangerouslySetInnerHTML={{ __html: listItem.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
