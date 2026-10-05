import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Guyana PAYE & Salary Calculator 2026",
  description:
    "Estimate your 2026 Guyana PAYE, NIS and take-home pay, including allowances, overtime and gratuity.",
  path: "/dashboard/",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
