"use client"

import { useState } from "react"
import { QuickNotes } from "@/components/quick-notes"
import { SuperNotes } from "@/components/super-notes"
import { StickyNote, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "super-notes">("notes")

  return (
    <div className="mobile-space-y">
      {/* Tab Navigation */}
      <div className="glass-panel p-1 rounded-lg w-full">
        <div className="mobile-flex-row">
          <button
            onClick={() => setActiveTab("notes")}
            className={cn(
              "mobile-flex-row flex-1 glass-button rounded-md transition-all touch-target text-center justify-center",
              activeTab === "notes"
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-600 hover:text-slate-800"
            )}
          >
            <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="mobile-text font-medium">Regular</span>
          </button>
          <button
            onClick={() => setActiveTab("super-notes")}
            className={cn(
              "mobile-flex-row flex-1 glass-button rounded-md transition-all touch-target text-center justify-center",
              activeTab === "super-notes"
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-600 hover:text-slate-800"
            )}
          >
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="mobile-text font-medium">Super</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && <QuickNotes />}
      {activeTab === "super-notes" && <SuperNotes />}
    </div>
  )
}