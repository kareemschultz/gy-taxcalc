import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { PRODUCT, SITE_URL } from "@/lib/brand"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  applicationName: PRODUCT.name,
  title: {
    default: `Guyana Salary, Tax, Vehicle & Loan Calculators | ${PRODUCT.name}`,
    template: `%s | ${PRODUCT.name}`,
  },
  description: PRODUCT.description,
  openGraph: {
    type: "website",
    siteName: PRODUCT.name,
    locale: "en_GY",
    title: `${PRODUCT.name} — ${PRODUCT.tagline}`,
    description: PRODUCT.description,
  },
  twitter: {
    card: "summary",
    title: `${PRODUCT.name} — ${PRODUCT.tagline}`,
    description: PRODUCT.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
