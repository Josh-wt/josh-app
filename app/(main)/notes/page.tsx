"use client"

import { useState } from "react"
import { QuickNotes } from "@/components/quick-notes"
import { SuperNotes } from "@/components/super-notes"
import { StickyNote, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "super-notes">("notes")

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 glass-button rounded-lg w-full sm:w-fit">
        <button
          onClick={() => setActiveTab("notes")}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none text-center justify-center",
            activeTab === "notes"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          <StickyNote className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Regular</span>
        </button>
        <button
          onClick={() => setActiveTab("super-notes")}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none text-center justify-center",
            activeTab === "super-notes"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Super</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && <QuickNotes />}
      {activeTab === "super-notes" && <SuperNotes />}
    </div>
  )
}
