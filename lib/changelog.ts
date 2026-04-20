import fs from "fs"
import path from "path"

export interface ChangelogSection {
  title: string
  items: string[]
}

export interface ChangelogEntry {
  version: string
  date: string
  rawDate: Date
  sections: ChangelogSection[]
  rawContent: string
}

export function parseChangelog(): ChangelogEntry[] {
  const filePath = path.join(process.cwd(), "CHANGELOG.md")
  const raw = fs.readFileSync(filePath, "utf-8")

  const entries: ChangelogEntry[] = []
  // Split on version headers: ## [x.y.z] — YYYY-MM-DD
  const versionSplit = raw.split(/\n(?=## \[)/)

  for (const block of versionSplit) {
    const headerMatch = block.match(/^## \[(\d+\.\d+\.\d+)\] — (\d{4}-\d{2}-\d{2})/)
    if (!headerMatch) continue

    const version = headerMatch[1]
    const dateStr = headerMatch[2]
    const rawDate = new Date(dateStr)

    // Everything after the header line
    const body = block.slice(block.indexOf("\n") + 1).trim()

    // Split body into ### sections
    const sections: ChangelogSection[] = []
    const sectionBlocks = body.split(/\n(?=### )/)

    for (const sectionBlock of sectionBlocks) {
      const sectionHeaderMatch = sectionBlock.match(/^### (.+)/)
      if (!sectionHeaderMatch) {
        // Text before first section — treat as general notes
        const lines = sectionBlock
          .split("\n")
          .map((l) => l.replace(/^[-*]\s+/, "").trim())
          .filter(Boolean)
        if (lines.length) {
          sections.push({ title: "Notes", items: lines })
        }
        continue
      }

      const sectionTitle = sectionHeaderMatch[1].replace(/^[🐛✨📊🔧🆕🚗🏦💼📅🔒🎨🔄🚀]/u, "").trim()
      const sectionBody = sectionBlock.slice(sectionBlock.indexOf("\n") + 1).trim()

      const items: string[] = []
      for (const line of sectionBody.split("\n")) {
        const clean = line.replace(/^[-*]\s+/, "").trim()
        // Skip table separators and blank lines
        if (!clean || clean.startsWith("|---") || clean === "---") continue
        items.push(clean)
      }

      if (items.length) {
        sections.push({ title: sectionTitle, items })
      }
    }

    entries.push({ version, date: dateStr, rawDate, sections, rawContent: body })
  }

  return entries
}
