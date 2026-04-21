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

export function ResultActions({ fileName, title, lines, subtitle, summary, sections }: ResultActionsProps) {
  const text = React.useMemo(() => [title, "", ...lines].join("\n"), [title, lines])

  const save = () => {
    if (typeof window === "undefined") return
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const share = async () => {
    if (typeof navigator === "undefined") return
    const shareData = { title, text }
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }
    copyText(text)
  }

  const print = () => {
    if (typeof window === "undefined") return
    const safeSummary = (summary ?? lines.slice(0, 4).map((line) => {
      const [label, ...rest] = line.split(":")
      return { label: label || "Item", value: rest.join(":").trim() || line }
    })).map((item) => ({
      label: escapeHtml(item.label),
      value: escapeHtml(item.value),
    }))

    const safeSections = (sections ?? [
      {
        title: "Details",
        rows: lines.map((line) => {
          const [label, ...rest] = line.split(":")
          return { label: label || "Item", value: rest.join(":").trim() || line }
        }),
      },
    ]).map((section) => ({
      title: escapeHtml(section.title),
      note: section.note ? escapeHtml(section.note) : undefined,
      rows: section.rows.map((row) => ({
        label: escapeHtml(row.label),
        value: escapeHtml(row.value),
      })),
    }))

    const html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(title)}</title>
          <style>
            :root {
              color-scheme: light;
              --bg: #f8fafc;
              --panel: #ffffff;
              --text: #0f172a;
              --muted: #64748b;
              --border: rgba(15, 23, 42, 0.12);
              --accent: #16a34a;
              --accent-soft: rgba(22, 163, 74, 0.12);
            }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background:
                radial-gradient(circle at top left, rgba(22, 163, 74, 0.16), transparent 28%),
                radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 30%),
                var(--bg);
              color: var(--text);
            }
            .page {
              max-width: 1100px;
              margin: 0 auto;
              padding: 28px;
            }
            .hero {
              border: 1px solid var(--border);
              border-radius: 24px;
              background: linear-gradient(135deg, #0f172a 0%, #111827 48%, #0f172a 100%);
              color: white;
              padding: 28px;
              box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
            }
            .eyebrow {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              border-radius: 999px;
              padding: 6px 12px;
              background: rgba(255,255,255,0.12);
              color: rgba(255,255,255,0.88);
              font-size: 12px;
              letter-spacing: .08em;
              text-transform: uppercase;
            }
            h1 {
              margin: 16px 0 8px;
              font-size: 32px;
              line-height: 1.1;
            }
            .subtitle {
              margin: 0;
              color: rgba(255,255,255,0.78);
              max-width: 72ch;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 12px;
              margin-top: 20px;
            }
            .summary-card, .section-card {
              border: 1px solid var(--border);
              border-radius: 18px;
              background: var(--panel);
              padding: 16px;
            }
            .summary-card {
              background: rgba(255,255,255,0.08);
              border-color: rgba(255,255,255,0.14);
              color: white;
            }
            .summary-label, .section-title {
              font-size: 11px;
              letter-spacing: .08em;
              text-transform: uppercase;
              color: var(--muted);
            }
            .summary-card .summary-label { color: rgba(255,255,255,0.7); }
            .summary-value {
              margin-top: 8px;
              font-size: 20px;
              font-weight: 700;
              line-height: 1.15;
            }
            .sections {
              display: grid;
              gap: 14px;
              margin-top: 18px;
            }
            .section-grid {
              display: grid;
              gap: 10px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              padding: 10px 0;
              border-bottom: 1px solid var(--border);
            }
            .row:last-child {
              border-bottom: 0;
              padding-bottom: 0;
            }
            .row-label {
              color: var(--muted);
              font-size: 14px;
            }
            .row-value {
              font-weight: 600;
              text-align: right;
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
              margin-top: 18px;
              color: var(--muted);
              font-size: 12px;
              text-align: center;
            }
            @media print {
              body { background: white; }
              .page { padding: 0; }
              .hero { box-shadow: none; }
            }
            @media (max-width: 900px) {
              .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <section class="hero">
              <span class="eyebrow">GY TaxCalc</span>
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
            <section class="sections">
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
