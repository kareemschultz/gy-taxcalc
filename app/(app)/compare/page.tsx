import { pageMetadata } from "@/lib/metadata"
import { ScenarioCompare } from "@/components/compare/scenario-compare"

export const metadata = pageMetadata({
  title: "Compare Salary, Loan & Vehicle Scenarios in Guyana",
  description:
    "Put two Guyana salary, loan or vehicle import scenarios side by side and see the difference in GYD.",
  path: "/compare/",
})

export default function ComparePage() {
  return <ScenarioCompare />
}
