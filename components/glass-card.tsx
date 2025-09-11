import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div className={cn(
      "glass-panel",
      hover && "hover:scale-[1.02] hover:shadow-lg",
      "transition-all duration-200",
      className
    )}>
      {children}
    </div>
  )
}