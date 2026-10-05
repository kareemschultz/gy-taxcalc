import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Guyana Vehicle Import Tax Calculator",
  description:
    "Estimate Guyana duty, excise and VAT on an imported vehicle, plus your total landed cost, using 2026 GRA rules.",
  path: "/vehicle/",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
