"use client"

import { useState } from "react"
import { QuickNotes } from "@/components/quick-notes"
import { SuperNotes } from "@/components/super-notes"
import { StickyNote, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "super-notes">("notes")

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 glass-button rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("notes")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
            activeTab === "notes"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          <StickyNote className="w-4 h-4" />
          Regular Notes
        </button>
        <button
          onClick={() => setActiveTab("super-notes")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
            activeTab === "super-notes"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          <Layers className="w-4 h-4" />
          Super Notes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && <QuickNotes />}
      {activeTab === "super-notes" && <SuperNotes />}
    </div>
  )
}
