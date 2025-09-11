"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckSquare, 
  Target, 
  DollarSign, 
  BookOpen, 
  StickyNote, 
  PenTool, 
  Heart, 
  Megaphone,
  Brain,
  Zap,
  Clock,
  Star,
  Activity
} from "lucide-react"

interface DashboardWidget {
  id: string
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: any
  color: string
  href?: string
}

export function DashboardGrid() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const widgets: DashboardWidget[] = [
    {
      id: "tasks",
      title: "Tasks Today",
      value: 12,
      change: "+3 from yesterday",
      changeType: "positive",
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
      href: "/tasks"
    },
    {
      id: "habits",
      title: "Habits Streak",
      value: "7 days",
      change: "Personal best!",
      changeType: "positive",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      href: "/habits"
    },
    {
      id: "finance",
      title: "Monthly Budget",
      value: "$2,450",
      change: "-$150 remaining",
      changeType: "negative",
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
      href: "/finance"
    },
    {
      id: "learning",
      title: "Study Hours",
      value: "24h",
      change: "+2h this week",
      changeType: "positive",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
      href: "/learning"
    },
    {
      id: "notes",
      title: "Notes Created",
      value: 8,
      change: "This week",
      changeType: "neutral",
      icon: StickyNote,
      color: "from-pink-500 to-rose-500",
      href: "/notes"
    },
    {
      id: "writing",
      title: "Words Written",
      value: "2,847",
      change: "+450 today",
      changeType: "positive",
      icon: PenTool,
      color: "from-teal-500 to-cyan-500",
      href: "/writing"
    },
    {
      id: "mood",
      title: "Mood Score",
      value: "8.5/10",
      change: "Great day!",
      changeType: "positive",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      href: "/mood"
    },
    {
      id: "marketing",
      title: "Campaign Views",
      value: "1.2K",
      change: "+15% this week",
      changeType: "positive",
      icon: Megaphone,
      color: "from-indigo-500 to-purple-500",
      href: "/marketing"
    }
  ]

  if (loading) {
    return (
      <div className="mobile-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <GlassCard key={i} className="mobile-card">
            <div className="animate-pulse">
              <div className="mobile-flex-row items-center mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 ml-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="mobile-grid">
      {widgets.map((widget) => {
        const Icon = widget.icon
        const isPositive = widget.changeType === "positive"
        const isNegative = widget.changeType === "negative"
        
        return (
          <GlassCard 
            key={widget.id} 
            className="mobile-card hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <div className="mobile-flex-row items-start justify-between mb-3">
              <div className="mobile-flex-row items-center flex-1 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${widget.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <h3 className="mobile-text font-medium text-slate-800 truncate">{widget.title}</h3>
                  {widget.change && (
                    <p className={`mobile-text-xs ${
                      isPositive ? "text-green-600" : 
                      isNegative ? "text-red-600" : 
                      "text-slate-500"
                    }`}>
                      {widget.change}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mobile-heading text-slate-800 group-hover:text-slate-900 transition-colors">
              {widget.value}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}