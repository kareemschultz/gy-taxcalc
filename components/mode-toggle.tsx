"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function ModeToggle({ variant = "outline" }: { variant?: "outline" | "ghost" }) {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    if (theme === "dark") setIsDark(true)
    else if (theme === "light") setIsDark(false)
    else
      setIsDark(
        typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      )
  }, [theme])

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="size-4 transition-transform duration-300" />
      ) : (
        <Moon className="size-4 transition-transform duration-300" />
      )}
    </Button>
  )
}
