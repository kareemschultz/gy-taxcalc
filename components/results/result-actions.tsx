"use client"

import * as React from "react"
import { Download, Share2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

type PrintRow = {
  label: string
  value: string
}

type PrintSection = {
  title: string
  rows: PrintRow[]
  note?: string
}

interface ResultActionsProps {
  fileName: string
  title: string
  lines: string[]
  subtitle?: string
  summary?: PrintRow[]
  sections?: PrintSection[]
}

function copyText(text: string) {
  if (typeof navigator === "undefined") return
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text)
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildRows(lines: string[]) {
  return lines.map((line) => {
    const [label, ...rest] = line.split(":")
    return { label: label || "Item", value: rest.join(":").trim() || line }
  })
}

export function ResultActions({ fileName, title, lines, subtitle, summary, sections }: ResultActionsProps) {
  const reportText = React.useMemo(() => {
    const parts = [title, ""]
    if (subtitle) parts.push(subtitle, "")
    if (summary?.length) {
      parts.push("Summary")
      summary.forEach((row) => parts.push(`${row.label}: ${row.value}`))
      parts.push("")
    }
    if (sections?.length) {
      sections.forEach((section) => {
        parts.push(section.title)
        section.rows.forEach((row) => parts.push(`${row.label}: ${row.value}`))
        if (section.note) parts.push(section.note)
        parts.push("")
      })
    }
    parts.push(...lines)
    return parts.join("\n")
  }, [title, subtitle, summary, sections, lines])

  const safeSummary = React.useMemo(
    () =>
      (summary ?? lines.slice(0, 4).map((line) => {
        const [label, ...rest] = line.split(":")
        return { label: label || "Item", value: rest.join(":").trim() || line }
      })).map((item) => ({
        label: escapeHtml(item.label),
        value: escapeHtml(item.value),
      })),
    [summary, lines]
  )

  const safeSections = React.useMemo(
    () =>
      (sections ?? [
        {
          title: "Details",
          rows: buildRows(lines),
        },
      ]).map((section) => ({
        title: escapeHtml(section.title),
        note: section.note ? escapeHtml(section.note) : undefined,
        rows: section.rows.map((row) => ({
          label: escapeHtml(row.label),
          value: escapeHtml(row.value),
        })),
      })),
    [sections, lines]
  )

  const save = () => {
    if (typeof window === "undefined") return
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const share = async () => {
    if (typeof navigator === "undefined") return
    const shareData = { title, text: reportText }
    const html = buildReportHtml(title, subtitle, safeSummary, safeSections)
    const shareName = fileName.replace(/\.[^.]+$/, ".html")

    try {
      if (navigator.share && typeof File !== "undefined") {
        const htmlFile = new File([html], shareName, { type: "text/html" })
        if (typeof navigator.canShare !== "function" || navigator.canShare({ files: [htmlFile] })) {
          await navigator.share({ title, text: reportText, files: [htmlFile] })
          return
        }
        await navigator.share(shareData)
        return
      }
      copyText(reportText)
    } catch {
      copyText(reportText)
    }
  }

  const print = () => {
    if (typeof window === "undefined") return
    const html = buildReportHtml(title, subtitle, safeSummary, safeSections)

    const iframe = document.createElement("iframe")
    iframe.setAttribute("aria-hidden", "true")
    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"
    iframe.style.visibility = "hidden"
    iframe.srcdoc = html
    document.body.appendChild(iframe)

    const cleanup = () => {
      window.setTimeout(() => {
        iframe.remove()
      }, 250)
    }

    iframe.addEventListener("load", () => {
      const win = iframe.contentWindow
      if (!win) {
        cleanup()
        return
      }

      win.addEventListener("afterprint", cleanup, { once: true })
      win.focus()
      window.setTimeout(() => {
        win.print()
      }, 300)
    })
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button type="button" size="sm" variant="outline" onClick={save}>
        <Download className="size-3.5" />
        Save
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={share}>
        <Share2 className="size-3.5" />
        Share
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={print}>
        <Printer className="size-3.5" />
        Print
      </Button>
    </div>
  )
}

function buildReportHtml(
  title: string,
  subtitle: string | undefined,
  safeSummary: Array<{ label: string; value: string }>,
  safeSections: Array<{ title: string; note?: string; rows: Array<{ label: string; value: string }> }>
) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f3f7fb;
        --panel: #ffffff;
        --panel-soft: #f8fafc;
        --text: #0f172a;
        --muted: #64748b;
        --border: rgba(15, 23, 42, 0.1);
        --shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
        --emerald: #16a34a;
        --sky: #0284c7;
        --lime: #65a30d;
        --amber: #d97706;
        --accent-soft: rgba(22, 163, 74, 0.12);
      }
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(22, 163, 74, 0.14), transparent 28%),
          radial-gradient(circle at top right, rgba(2, 132, 199, 0.12), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f9 100%);
      }
      @page {
        size: A4 portrait;
        margin: 12mm;
      }
      .page {
        max-width: 1120px;
        margin: 0 auto;
        padding: 24px;
      }
      .hero {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 28px;
        color: white;
        padding: 28px;
        background:
          radial-gradient(circle at top left, rgba(34, 197, 94, 0.25), transparent 30%),
          radial-gradient(circle at top right, rgba(14, 165, 233, 0.22), transparent 30%),
          linear-gradient(135deg, #0f172a 0%, #111827 48%, #0f172a 100%);
        box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .hero::after {
        content: "";
        position: absolute;
        right: -6rem;
        bottom: -7rem;
        width: 18rem;
        height: 18rem;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(132, 204, 22, 0.26), transparent 68%);
        filter: blur(18px);
        pointer-events: none;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .eyebrow::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--emerald);
        box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.14);
      }
      h1 {
        margin: 16px 0 8px;
        font-size: 34px;
        line-height: 1.05;
        letter-spacing: -0.03em;
      }
      .subtitle {
        margin: 0;
        max-width: 70ch;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.55;
        font-size: 15px;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 20px;
        position: relative;
        z-index: 1;
      }
      .summary-card,
      .section-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        background: var(--panel);
        padding: 16px;
      }
      .summary-card {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.05)),
          rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.16);
        color: white;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
      }
      .summary-card:nth-child(1) { border-top: 3px solid var(--emerald); }
      .summary-card:nth-child(2) { border-top: 3px solid var(--sky); }
      .summary-card:nth-child(3) { border-top: 3px solid var(--lime); }
      .summary-card:nth-child(4) { border-top: 3px solid var(--amber); }
      .summary-label,
      .section-title {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .summary-card .summary-label { color: rgba(255, 255, 255, 0.72); }
      .summary-value {
        margin-top: 8px;
        font-size: 21px;
        font-weight: 800;
        line-height: 1.12;
        word-break: break-word;
      }
      .sections {
        display: grid;
        gap: 14px;
        margin-top: 18px;
      }
      .section-card {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98)),
          var(--panel);
        box-shadow: var(--shadow);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .section-grid {
        display: grid;
        gap: 10px;
        margin-top: 10px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .row:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
      .row-label {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }
      .row-value {
        font-weight: 600;
        text-align: right;
        line-height: 1.45;
        word-break: break-word;
      }
      .note {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--accent-soft);
        color: #166534;
        font-size: 13px;
      }
      .footer {
        margin-top: 20px;
        color: var(--muted);
        font-size: 12px;
        text-align: center;
      }
      .page-break {
        break-before: page;
        page-break-before: always;
      }
      @media print {
        body {
          background: white;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .page { padding: 0; }
        .hero { box-shadow: none; }
        .summary-card,
        .section-card {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
      @media (max-width: 900px) {
        .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 640px) {
        .page { padding: 0; }
        .hero { padding: 22px; border-radius: 22px; }
        h1 { font-size: 28px; }
        .summary { grid-template-columns: 1fr; }
        .row { flex-direction: column; gap: 6px; }
        .row-value { text-align: left; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section class="hero">
        <span class="eyebrow">GY TaxCalc Report</span>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
        <div class="summary">
          ${safeSummary
            .map(
              (item) => `
                <div class="summary-card">
                  <div class="summary-label">${item.label}</div>
                  <div class="summary-value">${item.value}</div>
                </div>`
            )
            .join("")}
        </div>
      </section>

      <section class="sections page-break">
        ${safeSections
          .map(
            (section) => `
              <div class="section-card">
                <div class="section-title">${section.title}</div>
                <div class="section-grid">
                  ${section.rows
                    .map(
                      (row) => `
                        <div class="row">
                          <div class="row-label">${row.label}</div>
                          <div class="row-value">${row.value}</div>
                        </div>`
                    )
                    .join("")}
                </div>
                ${section.note ? `<div class="note">${section.note}</div>` : ""}
              </div>`
          )
          .join("")}
      </section>

      <div class="footer">Generated by GY TaxCalc. Save this page as PDF from the print dialog.</div>
    </div>
  </body>
</html>`
  }
