import type { Metadata } from "next"
import { PRODUCT } from "@/lib/brand"

/**
 * Per-page metadata. `title` is the search-oriented page description; the root
 * layout's title template appends "| GYCalc". `path` is the route with a
 * trailing slash (the site uses `trailingSlash: true`).
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const fullTitle = `${title} | ${PRODUCT.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: PRODUCT.name,
      locale: "en_GY",
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  }
}
