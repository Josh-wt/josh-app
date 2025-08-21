"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { FloatingNav } from "@/components/floating-nav"
import { DashboardGrid } from "@/components/dashboard-grid"
import { SmartTodoManager } from "@/components/smart-todo-manager"
import { PersonalAiHub } from "@/components/personal-ai-hub"
import { MoodTracker } from "@/components/mood-tracker"
import { HabitTracker } from "@/components/habit-tracker"
import { FinanceWatch } from "@/components/finance-watch"
import { LearningCorner } from "@/components/learning-corner"
import { QuickNotes } from "@/components/quick-notes"
import { CalendarView } from "@/components/calendar-view"
import { WritingStudio } from "@/components/writing-studio"
import {
  Brain,
  CheckSquare,
  Heart,
  Target,
  DollarSign,
  BookOpen,
  StickyNote,
  Calendar,
  Zap,
  PenTool,
} from "lucide-react"

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Zap },
  { id: "ai", label: "AI Hub", icon: Brain },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "mood", label: "Mood", icon: Heart },
  { id: "habits", label: "Habits", icon: Target },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "writing", label: "Writing", icon: PenTool },
]

export default function JoshApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Main content */}
      <div className="relative z-10 pb-24">
        {/* Header */}
        <header className="p-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Josh App
                </h1>
                <p className="text-slate-600 mt-1">Your personal productivity & creativity hub</p>
              </div>
              <div className="glass-button p-3 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-slate-700">J</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </header>

        {/* Tab content */}
        <main className="px-6">
          {activeTab === "dashboard" && <DashboardGrid />}
          {activeTab === "tasks" && <SmartTodoManager />}
          {activeTab === "ai" && <PersonalAiHub />}
          {activeTab === "mood" && <MoodTracker />}
          {activeTab === "habits" && <HabitTracker />}
          {activeTab === "finance" && <FinanceWatch />}
          {activeTab === "learning" && <LearningCorner />}
          {activeTab === "notes" && <QuickNotes />}
          {activeTab === "calendar" && <CalendarView />}
          {activeTab === "writing" && <WritingStudio />}
        </main>
      </div>

      {/* Floating Navigation */}
      <FloatingNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
