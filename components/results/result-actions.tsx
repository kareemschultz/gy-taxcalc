"use client"

import * as React from "react"
import { Download, Share2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultActionsProps {
  fileName: string
  title: string
  lines: string[]
}

function copyText(text: string) {
  if (typeof navigator === "undefined") return
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text)
  }
}

export function ResultActions({ fileName, title, lines }: ResultActionsProps) {
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
    window.print()
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
