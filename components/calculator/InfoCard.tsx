"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type InfoCardProps = {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  variant?: "default" | "warning" | "success"
}

const variantClasses: Record<NonNullable<InfoCardProps["variant"]>, string> = {
  default: "bg-muted/20",
  warning: "border-amber-500/20 bg-amber-500/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
}

export function InfoCard({ title, icon, children, variant = "default" }: InfoCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
      <Card className={cn("shadow-sm transition-shadow duration-200 hover:shadow-md", variantClasses[variant])}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
