"use client"

import * as React from "react"
import { Download, Share2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

type PrintRow = {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
  total?: boolean
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
          positive: row.positive,
          negative: row.negative,
          total: row.total,
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
  safeSections: Array<{ title: string; note?: string; rows: Array<{ label: string; value: string; positive?: boolean; negative?: boolean; total?: boolean }> }>
) {
  const date = new Date().toLocaleDateString("en-GY", { year: "numeric", month: "long", day: "numeric" })
  const accentColors = ["#16a34a", "#0284c7", "#7c3aed", "#d97706"]

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; }
      body {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        color: #f1f5f9;
        background: #0f172a;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page { size: A4 portrait; margin: 10mm 12mm; }

      /* ── page wrapper ── */
      .page { max-width: 900px; margin: 0 auto; padding: 20px; }

      /* ── hero card ── */
      .hero {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        padding: 28px;
        background: linear-gradient(135deg, #0f172a 0%, #111827 50%, #0f1a2e 100%);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .hero::before {
        content: "";
        position: absolute;
        top: -80px; left: -80px;
        width: 280px; height: 280px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(22,163,74,0.22), transparent 70%);
        pointer-events: none;
      }
      .hero::after {
        content: "";
        position: absolute;
        bottom: -60px; right: -60px;
        width: 220px; height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(2,132,199,0.18), transparent 70%);
        pointer-events: none;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border-radius: 999px;
        padding: 5px 12px;
        background: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.85);
        font-size: 11px;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        font-weight: 600;
        border: 1px solid rgba(255,255,255,0.12);
      }
      .eyebrow-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
        flex-shrink: 0;
      }
      .hero-date {
        float: right;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        margin-top: 2px;
      }
      h1 {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: -0.025em;
        color: #fff;
        margin: 14px 0 6px;
        position: relative; z-index: 1;
      }
      .subtitle {
        font-size: 14px;
        color: rgba(255,255,255,0.65);
        line-height: 1.5;
        position: relative; z-index: 1;
        margin-bottom: 20px;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        position: relative; z-index: 1;
      }
      .summary-card {
        border-radius: 14px;
        padding: 14px 16px;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(8px);
      }
      .summary-card:nth-child(1) { border-top: 2.5px solid #16a34a; }
      .summary-card:nth-child(2) { border-top: 2.5px solid #0284c7; }
      .summary-card:nth-child(3) { border-top: 2.5px solid #84cc16; }
      .summary-card:nth-child(4) { border-top: 2.5px solid #d97706; }
      .sc-label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.55);
        margin-bottom: 6px;
      }
      .sc-value {
        font-size: 18px;
        font-weight: 800;
        color: #fff;
        line-height: 1.1;
        word-break: break-word;
      }

      /* ── sections ── */
      .sections { margin-top: 14px; display: grid; gap: 12px; }

      .section-card {
        border-radius: 16px;
        overflow: hidden;
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.07);
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .section-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 13px 18px;
        background: rgba(255,255,255,0.04);
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }
      .section-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .section-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.75);
      }
      .section-rows { padding: 6px 0; }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 9px 18px;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .row:last-child { border-bottom: none; }
      .row-label {
        font-size: 13px;
        color: rgba(255,255,255,0.6);
        line-height: 1.4;
        flex: 1;
      }
      .row-value {
        font-size: 13px;
        font-weight: 600;
        text-align: right;
        color: #e2e8f0;
        flex-shrink: 0;
        word-break: break-word;
      }
      .row-value.pos { color: #4ade80; }
      .row-value.neg { color: #f87171; }
      .row.total-row {
        background: rgba(22,163,74,0.12);
        border-top: 1px solid rgba(22,163,74,0.25);
        border-bottom: 1px solid rgba(22,163,74,0.25);
        margin: 4px 0;
      }
      .row.total-row .row-label {
        font-weight: 700;
        color: #bbf7d0;
        font-size: 13.5px;
      }
      .row.total-row .row-value {
        font-weight: 800;
        color: #4ade80;
        font-size: 14px;
      }
      .note {
        margin: 6px 18px 12px;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(22,163,74,0.1);
        color: #86efac;
        font-size: 12px;
        border: 1px solid rgba(22,163,74,0.2);
      }

      /* ── footer ── */
      .footer {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: rgba(255,255,255,0.35);
      }
      .footer-logo { font-weight: 700; color: rgba(255,255,255,0.55); }

      /* ── page break between sections ── */
      .break-before { break-before: page; page-break-before: always; }

      @media print {
        body { background: #0f172a !important; }
        .page { padding: 0; }
        .hero { box-shadow: none; }
      }
      @media (max-width: 640px) {
        .summary-grid { grid-template-columns: repeat(2, 1fr); }
        h1 { font-size: 24px; }
        .sc-value { font-size: 15px; }
      }
    </style>
  </head>
  <body>
    <div class="page">

      <!-- ── Hero ── -->
      <section class="hero">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span>GY TaxCalc Report</span>
          <span class="hero-date">${date}</span>
        </div>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
        <div class="summary-grid">
          ${safeSummary
            .map(
              (item) => `
              <div class="summary-card">
                <div class="sc-label">${item.label}</div>
                <div class="sc-value">${item.value}</div>
              </div>`
            )
            .join("")}
        </div>
      </section>

      <!-- ── Sections ── -->
      <div class="sections">
        ${safeSections
          .map(
            (section, i) => `
            <div class="section-card${i > 0 ? " break-before" : ""}">
              <div class="section-header">
                <span class="section-dot" style="background:${accentColors[i % accentColors.length]}"></span>
                <span class="section-title">${section.title}</span>
              </div>
              <div class="section-rows">
                ${section.rows
                  .map(
                    (row) => `
                  <div class="row${row.total ? " total-row" : ""}">
                    <span class="row-label">${row.label}</span>
                    <span class="row-value${row.positive ? " pos" : row.negative ? " neg" : ""}">${row.value}</span>
                  </div>`
                  )
                  .join("")}
              </div>
              ${section.note ? `<div class="note">${section.note}</div>` : ""}
            </div>`
          )
          .join("")}
      </div>

      <!-- ── Footer ── -->
      <div class="footer">
        <span class="footer-logo">GY TaxCalc</span>
        <span>kareemschultz.github.io/gy-taxcalc &bull; GRA 2026 formulas</span>
      </div>

    </div>
  </body>
</html>`
}
