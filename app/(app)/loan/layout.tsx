import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Guyana Loan Calculator",
  description:
    "See your Guyana loan payment, total interest, payoff date and how extra payments shorten the loan.",
  path: "/loan/",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
