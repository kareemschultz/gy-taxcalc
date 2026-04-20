import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "GY TaxCalc — Guyana Income Tax Calculator 2026",
  description:
    "Calculate your Guyana income tax, NIS, gratuity, and take-home pay for the 2026 tax year. Supports all GRA-approved deductions and allowances.",
  keywords: ["Guyana tax calculator", "GRA", "PAYE", "NIS", "income tax 2026"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="gy-taxcalc-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
