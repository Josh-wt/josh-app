"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { createClient } from "@/lib/supabase/client"
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
  const [dashboardData, setDashboardData] = useState({
    tasks: { count: 0, completed: 0 },
    habits: { active: 0, streak: 0 },
    subscriptions: { total: 0, monthly: 0, active: 0 },
    notes: { count: 0, recent: 0 },
    writing: { words: 0, entries: 0 },
    mood: { average: 0, entries: 0 },
    learning: { hours: 0, sessions: 0 }
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // Fetch habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)

      // Fetch subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Fetch writing entries
      const { data: writing } = await supabase
        .from('writing_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // Fetch mood entries
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Fetch learning sessions
      const { data: learning } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Calculate data
      const activeSubscriptions = subscriptions?.filter(sub => sub.status === 'active') || []
      const totalMonthly = activeSubscriptions.reduce((sum, sub) => sum + (sub.cost || 0), 0)
      
      const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
      const totalTasks = tasks?.length || 0
      
      const activeHabits = habits?.filter(habit => habit.status === 'active').length || 0
      const maxStreak = habits?.reduce((max, habit) => Math.max(max, habit.current_streak || 0), 0) || 0
      
      const totalWords = writing?.reduce((sum, entry) => sum + (entry.word_count || 0), 0) || 0
      const totalEntries = writing?.length || 0
      
      const averageMood = moodEntries?.length > 0 
        ? moodEntries.reduce((sum, entry) => sum + (entry.mood_score || 0), 0) / moodEntries.length 
        : 0
      
      const totalLearningHours = learning?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0
      const totalSessions = learning?.length || 0

      setDashboardData({
        tasks: { count: totalTasks, completed: completedTasks },
        habits: { active: activeHabits, streak: maxStreak },
        subscriptions: { total: subscriptions?.length || 0, monthly: totalMonthly, active: activeSubscriptions.length },
        notes: { count: notes?.length || 0, recent: notes?.length || 0 },
        writing: { words: totalWords, entries: totalEntries },
        mood: { average: averageMood, entries: moodEntries?.length || 0 },
        learning: { hours: totalLearningHours, sessions: totalSessions }
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const widgets: DashboardWidget[] = [
    {
      id: "tasks",
      title: "Tasks Today",
      value: dashboardData.tasks.count,
      change: `${dashboardData.tasks.completed} completed`,
      changeType: dashboardData.tasks.completed > 0 ? "positive" : "neutral",
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
      href: "/tasks"
    },
    {
      id: "habits",
      title: "Active Habits",
      value: dashboardData.habits.active,
      change: `${dashboardData.habits.streak} day streak`,
      changeType: dashboardData.habits.streak > 0 ? "positive" : "neutral",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      href: "/habits"
    },
    {
      id: "subscriptions",
      title: "Monthly Subscriptions",
      value: formatCurrency(dashboardData.subscriptions.monthly),
      change: `${dashboardData.subscriptions.active} active`,
      changeType: "neutral",
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
      href: "/subscriptions"
    },
    {
      id: "learning",
      title: "Study Hours",
      value: `${dashboardData.learning.hours.toFixed(1)}h`,
      change: `${dashboardData.learning.sessions} sessions`,
      changeType: dashboardData.learning.sessions > 0 ? "positive" : "neutral",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
      href: "/learning"
    },
    {
      id: "notes",
      title: "Notes This Week",
      value: dashboardData.notes.count,
      change: "Recent activity",
      changeType: dashboardData.notes.count > 0 ? "positive" : "neutral",
      icon: StickyNote,
      color: "from-pink-500 to-rose-500",
      href: "/notes"
    },
    {
      id: "writing",
      title: "Words Today",
      value: dashboardData.writing.words.toLocaleString(),
      change: `${dashboardData.writing.entries} entries`,
      changeType: dashboardData.writing.words > 0 ? "positive" : "neutral",
      icon: PenTool,
      color: "from-teal-500 to-cyan-500",
      href: "/writing"
    },
    {
      id: "mood",
      title: "Mood Score",
      value: dashboardData.mood.average > 0 ? `${dashboardData.mood.average.toFixed(1)}/10` : "No data",
      change: `${dashboardData.mood.entries} entries`,
      changeType: dashboardData.mood.average > 7 ? "positive" : dashboardData.mood.average > 4 ? "neutral" : "negative",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      href: "/mood"
    },
    {
      id: "overview",
      title: "Total Subscriptions",
      value: dashboardData.subscriptions.total,
      change: `${dashboardData.subscriptions.active} active`,
      changeType: "neutral",
      icon: Activity,
      color: "from-indigo-500 to-purple-500",
      href: "/subscriptions"
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