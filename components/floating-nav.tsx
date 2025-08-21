"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface FloatingNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function FloatingNav({ tabs, activeTab, onTabChange }: FloatingNavProps) {
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-panel p-2 flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "glass-button p-3 rounded-xl transition-all duration-300 group relative",
                isActive && "glass-active",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? "text-cyan-600" : "text-slate-600 group-hover:text-slate-800",
                )}
              />

              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur-sm -z-10" />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="glass-panel px-2 py-1 text-xs text-slate-700 whitespace-nowrap">{tab.label}</div>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
