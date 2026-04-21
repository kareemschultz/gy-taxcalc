"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

type ResultCardProps = {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  variant?: "primary" | "danger" | "success" | "muted"
  trend?: number
}

const variantClasses: Record<NonNullable<ResultCardProps["variant"]>, string> = {
  primary: "border-primary/20 bg-primary/5",
  danger: "border-destructive/20 bg-destructive/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  muted: "bg-muted/20",
}

export function ResultCard({ label, value, sub, variant = "muted", trend }: ResultCardProps) {
  const trendPositive = trend !== undefined ? trend >= 0 : undefined

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
      <Card className={cn("shadow-sm transition-shadow duration-200 hover:shadow-md", variantClasses[variant])}>
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
              <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
              {sub ? <p className="mt-1 text-sm text-muted-foreground">{sub}</p> : null}
            </div>
            {trend !== undefined ? (
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                  trendPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                )}
              >
                {trendPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {trendPositive ? "+" : ""}
                {typeof trend === "number" ? formatCurrency(trend) : trend}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
