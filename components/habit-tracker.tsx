"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import {
  Target,
  Plus,
  Flame,
  TrendingUp,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Award,
  Zap,
  Star,
  Eye,
  EyeOff,
  Timer,
  BookOpen,
  Heart,
  Brain,
  Briefcase,
  Home,
  Coffee,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Activity,
  LayoutGrid,
  List,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Archive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Habit {
  id: string
  name: string
  description?: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  current_streak: number
  best_streak: number
  total_completions: number
  target_frequency: number
  target_days: string[] // ['monday', 'tuesday', etc.]
  reminder_time?: string
  color: string
  icon: string
  is_quantity_based: boolean
  target_quantity?: number
  unit?: string
  created_at: string
  updated_at: string
  user_id: string
  is_archived: boolean
  notes?: string
}

interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  quantity?: number
  notes?: string
  completion_time?: string
  mood_after?: number
  user_id: string
  created_at: string
}

interface HabitStats {
  totalDays: number
  completionRate: number
  averageStreak: number
  longestStreak: number
  currentStreak: number
  weeklyProgress: number[]
  monthlyProgress: number[]
  bestDay: string
  totalQuantity?: number
}

const categoryConfig = {
  health: {
    color: "from-green-400/20 to-green-500/20 border-green-300/30",
    icon: Heart,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  fitness: {
    color: "from-orange-400/20 to-orange-500/20 border-orange-300/30",
    icon: Zap,
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  productivity: {
    color: "from-blue-400/20 to-blue-500/20 border-blue-300/30",
    icon: Briefcase,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  learning: {
    color: "from-purple-400/20 to-purple-500/20 border-purple-300/30",
    icon: BookOpen,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  mindfulness: {
    color: "from-indigo-400/20 to-indigo-500/20 border-indigo-300/30",
    icon: Brain,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  personal: {
    color: "from-pink-400/20 to-pink-500/20 border-pink-300/30",
    icon: Home,
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  social: {
    color: "from-cyan-400/20 to-cyan-500/20 border-cyan-300/30",
    icon: Coffee,
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
  },
}

const difficultyConfig = {
  easy: { color: "text-green-600", bg: "bg-green-100", label: "Easy" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-100", label: "Medium" },
  hard: { color: "text-red-600", bg: "bg-red-100", label: "Hard" },
}

const achievementLevels = [
  { days: 1, icon: Sparkles, title: "First Step", color: "text-green-500" },
  { days: 3, icon: Star, title: "Getting Started", color: "text-blue-500" },
  { days: 7, icon: Award, title: "Week Warrior", color: "text-purple-500" },
  { days: 14, icon: Medal, title: "Fortnight Fighter", color: "text-orange-500" },
  { days: 30, icon: Trophy, title: "Month Master", color: "text-red-500" },
  { days: 60, icon: Crown, title: "Habit Hero", color: "text-indigo-500" },
  { days: 100, icon: Gem, title: "Century Champion", color: "text-pink-500" },
]

export function HabitTracker() {
  const [user, setUser] = useState<any>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [editingCompletion, setEditingCompletion] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
  const [habitStats, setHabitStats] = useState<Record<string, HabitStats>>({})

  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "health",
    difficulty: "medium" as const,
    target_frequency: 1,
    target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    reminder_time: "",
    color: "#10b981",
    icon: "target",
    is_quantity_based: false,
    target_quantity: 1,
    unit: "",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await Promise.all([fetchHabits(user), fetchHabitCompletions(user)])
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (habits.length > 0 && habitCompletions.length >= 0) {
      calculateHabitStats()
    }
  }, [habits, habitCompletions])

  useEffect(() => {
    const interval = setInterval(() => {
      if (habits.length > 0 && habitCompletions.length >= 0) {
        calculateHabitStats()
      }
    }, 60000) // Check every minute for date changes

    return () => clearInterval(interval)
  }, [habits, habitCompletions])

  const fetchHabits = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("is_archived", showArchived)
        .order("created_at", { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error("Error fetching habits:", error)
    }
  }

  const fetchHabitCompletions = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("completed_date", { ascending: false })

      if (error) throw error
      setHabitCompletions(data || [])
      console.log("[v0] Fetched habit completions:", data?.length || 0)
    } catch (error) {
      console.error("Error fetching habit completions:", error)
    }
  }

  const calculateHabitStats = () => {
    console.log(
      "[v0] Calculating habit stats for",
      habits.length,
      "habits with",
      habitCompletions.length,
      "completions",
    )
    const stats: Record<string, HabitStats> = {}

    habits.forEach((habit) => {
      const completions = habitCompletions.filter((c) => c.habit_id === habit.id)
      console.log("[v0] Habit", habit.name, "has", completions.length, "completions")

      const createdDate = new Date(habit.created_at)
      const today = new Date()
      const daysSinceCreated = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      // Calculate total days completed
      const totalDays = completions.length

      // Calculate completion rate
      const completionRate = daysSinceCreated > 0 ? (totalDays / daysSinceCreated) * 100 : 0

      const sortedCompletions = completions
        .map((c) => c.completed_date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

      let currentStreak = 0
      let longestStreak = 0

      // Calculate current streak
      const todayStr = today.toISOString().split("T")[0]
      const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split("T")[0]

      // Check if completed today or yesterday to start streak
      if (sortedCompletions.includes(todayStr)) {
        currentStreak = 1
        let checkDate = new Date(today.getTime() - 86400000)

        while (sortedCompletions.includes(checkDate.toISOString().split("T")[0])) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 86400000)
        }
      } else if (sortedCompletions.includes(yesterdayStr)) {
        let checkDate = new Date(today.getTime() - 86400000)

        while (sortedCompletions.includes(checkDate.toISOString().split("T")[0])) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 86400000)
        }
      }

      // Calculate longest streak
      const allDates = sortedCompletions.sort()
      let tempStreak = 0

      for (let i = 0; i < allDates.length; i++) {
        tempStreak = 1
        for (let j = i + 1; j < allDates.length; j++) {
          const prevDate = new Date(allDates[j - 1])
          const currDate = new Date(allDates[j])
          const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

          if (diffDays === 1) {
            tempStreak++
          } else {
            break
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak)
      }

      // Weekly progress (last 7 days)
      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today.getTime() - i * 86400000).toISOString().split("T")[0]
        return sortedCompletions.includes(date) ? 1 : 0
      }).reverse()

      // Monthly progress (last 30 days)
      const monthlyProgress = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today.getTime() - i * 86400000).toISOString().split("T")[0]
        return sortedCompletions.includes(date) ? 1 : 0
      }).reverse()

      // Find best day of week
      const dayCompletions = completions.reduce(
        (acc, completion) => {
          const dayOfWeek = new Date(completion.completed_date).toLocaleDateString("en-US", { weekday: "long" })
          acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const bestDay = Object.entries(dayCompletions).reduce(
        (a, b) => (dayCompletions[a[0]] > dayCompletions[b[0]] ? a : b),
        ["Monday", 0],
      )[0]

      // Total quantity for quantity-based habits
      const totalQuantity = habit.is_quantity_based
        ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0)
        : undefined

      stats[habit.id] = {
        totalDays,
        completionRate: Math.min(completionRate, 100),
        averageStreak: longestStreak,
        longestStreak,
        currentStreak,
        weeklyProgress,
        monthlyProgress,
        bestDay,
        totalQuantity,
      }

      console.log("[v0] Stats for", habit.name, ":", stats[habit.id])
    })

    setHabitStats(stats)
  }

  const addHabit = async () => {
    if (!newHabit.name.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("habits")
        .insert([
          {
            name: newHabit.name.trim(),
            description: newHabit.description.trim(),
            category: newHabit.category,
            difficulty: newHabit.difficulty,
            target_frequency: newHabit.target_frequency,
            target_days: newHabit.target_days,
            reminder_time: newHabit.reminder_time || null,
            color: newHabit.color,
            icon: newHabit.icon,
            is_quantity_based: newHabit.is_quantity_based,
            target_quantity: newHabit.is_quantity_based ? newHabit.target_quantity : null,
            unit: newHabit.is_quantity_based ? newHabit.unit : null,
            current_streak: 0,
            best_streak: 0,
            total_completions: 0,
            is_archived: false,
            notes: newHabit.notes.trim(),
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setHabits((prev) => [data, ...prev])
      setNewHabit({
        name: "",
        description: "",
        category: "health",
        difficulty: "medium",
        target_frequency: 1,
        target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        reminder_time: "",
        color: "#10b981",
        icon: "target",
        is_quantity_based: false,
        target_quantity: 1,
        unit: "",
        notes: "",
      })
      setShowAddHabit(false)
    } catch (error) {
      console.error("Error adding habit:", error)
    }
  }

  const toggleHabitCompletion = async (habitId: string, date?: Date) => {
    if (!user) return

    const targetDate = date || new Date()
    const dateString = targetDate.toISOString().split("T")[0]

    console.log("[v0] Toggling habit completion for date:", dateString)

    try {
      setLoading(true)

      // Check if already completed on this date
      const existingCompletion = habitCompletions.find(
        (completion) => completion.habit_id === habitId && completion.completed_date === dateString,
      )

      if (existingCompletion) {
        // Remove completion
        const { error } = await supabase.from("habit_completions").delete().eq("id", existingCompletion.id)

        if (error) throw error

        // Update local state
        setHabitCompletions((prev) => prev.filter((c) => c.id !== existingCompletion.id))
      } else {
        // Add completion
        const now = new Date()
        const timeString = now.toTimeString().split(" ")[0] // Gets HH:MM:SS format

        const newCompletion = {
          habit_id: habitId,
          completed_date: dateString,
          quantity: 1,
          notes: "",
          completion_time: timeString,
          user_id: user.id,
        }

        const { data, error } = await supabase.from("habit_completions").insert([newCompletion]).select()

        if (error) throw error
        if (data) {
          setHabitCompletions((prev) => [...prev, data[0]])
        }
      }

      // Recalculate stats
      calculateHabitStats()
    } catch (error) {
      console.error("[v0] Error toggling habit completion:", error)
    } finally {
      setLoading(false)
    }
  }

  const archiveHabit = async (habitId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: true })
        .eq("id", habitId)
        .eq("user_id", user.id)

      if (error) throw error

      setHabits((prev) => prev.map((habit) => (habit.id === habitId ? { ...habit, is_archived: true } : habit)))
    } catch (error) {
      console.error("Error archiving habit:", error)
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("habits").delete().eq("id", habitId).eq("user_id", user.id)

      if (error) throw error

      setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
      setHabitCompletions((prev) => prev.filter((completion) => completion.habit_id !== habitId))
    } catch (error) {
      console.error("Error deleting habit:", error)
    }
  }

  const getAchievementLevel = (streak: number) => {
    return (
      achievementLevels
        .slice()
        .reverse()
        .find((level) => streak >= level.days) || achievementLevels[0]
    )
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    if (rate >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const getCompletionForDate = (habitId: string, date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return habitCompletions.find(
      (completion) => completion.habit_id === habitId && completion.completed_date === dateString,
    )
  }

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    if (!showArchived && habit.is_archived) return false
    if (showArchived && !habit.is_archived) return false
    if (filterCategory !== "all" && habit.category !== filterCategory) return false
    return true
  })

  // Calculate overall stats
  const totalActiveHabits = habits.filter((h) => !h.is_archived).length
  const today = new Date().toISOString().split("T")[0]
  const completedToday = habitCompletions.filter((completion) => completion.completed_date === today).length
  const overallCompletionRate =
    totalActiveHabits > 0
      ? Object.values(habitStats).reduce((sum, stats) => sum + stats.completionRate, 0) / totalActiveHabits
      : 0
  const totalLifetimeCompletions = habits.reduce((sum, habit) => sum + habit.total_completions, 0)

  if (!user) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 text-center">
          <div className="text-lg font-medium text-slate-600 mb-2">Please sign in</div>
          <p className="text-slate-500">You need to be authenticated to track your habits.</p>
        </GlassCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header & Controls */}
      <GlassCard className="p-6 bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Habit Mastery
              </h2>
              <p className="text-slate-600 font-medium">Build consistency, track progress, achieve greatness</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Enhanced View Mode Toggle */}
            <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-white/30">
              {(["grid", "list", "calendar"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                    viewMode === mode
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105"
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/50",
                  )}
                >
                  {mode === "grid" && <LayoutGrid className="w-4 h-4 mr-1 inline" />}
                  {mode === "list" && <List className="w-4 h-4 mr-1 inline" />}
                  {mode === "calendar" && <Calendar className="w-4 h-4 mr-1 inline" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddHabit(!showAddHabit)}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-slate-800 font-medium shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.keys(categoryConfig).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm",
              showArchived
                ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg"
                : "bg-white/60 backdrop-blur-sm border border-white/30 text-slate-600 hover:text-slate-800 hover:bg-white/80",
            )}
          >
            {showArchived ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showArchived ? "Hide Archived" : "Show Archived"}
          </button>

          {viewMode === "calendar" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                className="bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg hover:bg-white/80 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="font-semibold text-slate-800 min-w-[120px] text-center">
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                className="bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg hover:bg-white/80 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Add Habit Form */}
        {showAddHabit && (
          <div className="space-y-6 p-6 glass-button rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Habit Name *</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Exercise, Read for 30 minutes"
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                >
                  {Object.keys(categoryConfig).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your habit and why it's important to you..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500 h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Difficulty</label>
                <select
                  value={newHabit.difficulty}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Target Frequency</label>
                <input
                  type="number"
                  value={newHabit.target_frequency}
                  onChange={(e) =>
                    setNewHabit((prev) => ({ ...prev, target_frequency: Number.parseInt(e.target.value) }))
                  }
                  min="1"
                  max="7"
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Reminder Time</label>
                <input
                  type="time"
                  value={newHabit.reminder_time}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, reminder_time: e.target.value }))}
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Quantity-based habit toggle */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newHabit.is_quantity_based}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, is_quantity_based: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">Quantity-based habit</span>
              </label>

              {newHabit.is_quantity_based && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newHabit.target_quantity}
                    onChange={(e) =>
                      setNewHabit((prev) => ({ ...prev, target_quantity: Number.parseInt(e.target.value) }))
                    }
                    min="1"
                    className="w-20 glass-button p-2 rounded-lg bg-transparent border-none outline-none text-slate-800"
                  />
                  <input
                    type="text"
                    value={newHabit.unit}
                    onChange={(e) => setNewHabit((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder="unit (e.g., pages, minutes)"
                    className="glass-button p-2 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={addHabit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
              >
                Create Habit
              </button>
              <button
                onClick={() => setShowAddHabit(false)}
                className="px-6 glass-button rounded-xl hover:scale-105 transition-all font-medium text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{completedToday}</div>
            <div className="text-sm text-slate-600">Completed Today</div>
          </div>

          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{totalActiveHabits}</div>
            <div className="text-sm text-slate-600">Active Habits</div>
          </div>

          <div className="glass-button p-4 rounded-lg text-center">
            <div className={cn("text-2xl font-bold mb-1", getCompletionRateColor(overallCompletionRate))}>
              {overallCompletionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-slate-600">Success Rate</div>
          </div>

          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{totalLifetimeCompletions}</div>
            <div className="text-sm text-slate-600">Total Completions</div>
          </div>
        </div>
      </GlassCard>

      {viewMode === "calendar" ? (
        <GlassCard className="p-6 bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl border border-white/20 shadow-xl">
          <div className="space-y-6">
            {filteredHabits.map((habit) => {
              const stats = habitStats[habit.id]
              const CategoryIcon = categoryConfig[habit.category as keyof typeof categoryConfig]?.icon || Target
              const calendarDays = generateCalendarDays(selectedDate)

              return (
                <div key={habit.id} className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
                    <CategoryIcon className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-lg text-slate-800">{habit.name}</h3>
                    <div className="flex items-center gap-2 ml-auto">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-slate-700">{stats?.currentStreak || 0} day streak</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                        {day}
                      </div>
                    ))}

                    {calendarDays.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
                      const isToday = day.toDateString() === new Date().toDateString()
                      const completion = getCompletionForDate(habit.id, day)
                      const isCompleted = !!completion

                      return (
                        <button
                          key={index}
                          onClick={() => toggleHabitCompletion(habit.id, day)}
                          disabled={day > new Date()}
                          className={cn(
                            "aspect-square rounded-lg text-sm font-medium transition-all duration-200 relative",
                            isCurrentMonth ? "text-slate-800" : "text-slate-400",
                            isToday && "ring-2 ring-emerald-500/50",
                            isCompleted
                              ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg transform scale-105"
                              : "bg-white/60 hover:bg-white/80 border border-white/30",
                            day > new Date() && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {day.getDate()}
                          {isCompleted && (
                            <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-white bg-emerald-600 rounded-full" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      ) : (
        <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
          {filteredHabits.map((habit) => {
            const stats = habitStats[habit.id]
            const CategoryIcon = categoryConfig[habit.category as keyof typeof categoryConfig]?.icon || Target
            const isCompletedToday = habitCompletions.some(
              (completion) =>
                completion.habit_id === habit.id &&
                completion.completed_date === new Date().toISOString().split("T")[0],
            )

            const achievement =
              achievementLevels
                .slice()
                .reverse()
                .find((level) => (stats?.currentStreak || 0) >= level.days) || achievementLevels[0]

            return (
              <GlassCard
                key={habit.id}
                className={cn(
                  "p-6 group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
                  "bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30",
                  isCompletedToday && "ring-2 ring-emerald-500/30 bg-gradient-to-br from-emerald-50/90 to-green-50/90",
                )}
              >
                <div onClick={() => setSelectedHabit(selectedHabit === habit.id ? null : habit.id)} className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleHabitCompletion(habit.id)
                      }}
                      className="transition-all duration-200 hover:scale-110 mt-1"
                    >
                      {isCompletedToday ? (
                        <div className="relative">
                          <CheckCircle2 className="w-7 h-7 text-emerald-500 drop-shadow-lg" />
                          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="w-7 h-7 text-slate-400 hover:text-emerald-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={cn(
                            "font-bold text-xl transition-colors",
                            isCompletedToday ? "text-emerald-700" : "text-slate-800",
                          )}
                        >
                          {habit.name}
                        </h3>
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                            difficultyConfig[habit.difficulty].bg,
                            difficultyConfig[habit.difficulty].color,
                          )}
                        >
                          {difficultyConfig[habit.difficulty].label}
                        </div>
                      </div>

                      {habit.description && <p className="text-slate-600 mb-3 leading-relaxed">{habit.description}</p>}

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-emerald-600" />
                          <span className="capitalize font-medium">{habit.category}</span>
                        </div>

                        {habit.is_quantity_based && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {habit.target_quantity} {habit.unit}
                            </span>
                          </div>
                        )}

                        {habit.reminder_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">{habit.reminder_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCompletion(editingCompletion === habit.id ? null : habit.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-blue-100 rounded-lg"
                      title="Edit previous days"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        archiveHabit(habit.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-yellow-100 rounded-lg"
                      title="Archive habit"
                    >
                      <Archive className="w-4 h-4 text-yellow-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteHabit(habit.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-red-100 rounded-lg"
                      title="Delete habit"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {editingCompletion === habit.id && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/30">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Edit Previous Days
                    </h4>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() - (13 - i))
                        const completion = getCompletionForDate(habit.id, date)
                        const isCompleted = !!completion

                        return (
                          <button
                            key={i}
                            onClick={() => toggleHabitCompletion(habit.id, date)}
                            className={cn(
                              "aspect-square rounded-lg text-xs font-medium transition-all duration-200",
                              isCompleted
                                ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md"
                                : "bg-white/80 text-slate-600 hover:bg-blue-100 border border-blue-200/50",
                            )}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Click on any day to toggle completion</p>
                  </div>
                )}

                {/* Enhanced Achievement & Streak Display */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <achievement.icon className={cn("w-6 h-6 drop-shadow-sm", achievement.color)} />
                    <span className="font-semibold text-slate-700">{achievement.title}</span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Flame className="w-5 h-5 text-orange-500 drop-shadow-sm" />
                      <span className="text-lg">{stats?.currentStreak || 0}</span>
                      <span className="text-sm text-slate-600">day streak</span>
                    </div>
                    <div className="text-xs text-slate-500">Best: {stats?.longestStreak || 0} days</div>
                  </div>
                </div>

                {/* Enhanced Stats */}
                {stats && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                        <div className="text-xl font-bold text-slate-800">{stats.totalDays}</div>
                        <div className="text-sm text-slate-600">Total Days</div>
                      </div>
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                        <div className={cn("text-xl font-bold", getCompletionRateColor(stats.completionRate))}>
                          {stats.completionRate.toFixed(0)}%
                        </div>
                        <div className="text-sm text-slate-600">Success Rate</div>
                      </div>
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                        <div className="text-xl font-bold text-slate-800">{stats.bestDay}</div>
                        <div className="text-sm text-slate-600">Best Day</div>
                      </div>
                    </div>

                    {/* Weekly Progress Visualization */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-700">Last 7 Days</span>
                        <span className="text-xs text-slate-600">
                          {stats.weeklyProgress.filter((d) => d === 1).length}/7
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {stats.weeklyProgress.map((completed, i) => (
                          <div
                            key={i}
                            className={cn("flex-1 h-2 rounded-full", completed ? "bg-green-500" : "bg-slate-200")}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedHabit === habit.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-4">
                        {/* Monthly Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700">Last 30 Days</span>
                            <span className="text-xs text-slate-600">
                              {stats.monthlyProgress.filter((d) => d === 1).length}/30
                            </span>
                          </div>
                          <div className="grid grid-cols-10 gap-1">
                            {stats.monthlyProgress.map((completed, i) => (
                              <div
                                key={i}
                                className={cn("aspect-square rounded-sm", completed ? "bg-green-500" : "bg-slate-200")}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Quantity Stats for quantity-based habits */}
                        {habit.is_quantity_based && stats.totalQuantity && (
                          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-slate-800">{stats.totalQuantity}</div>
                              <div className="text-sm text-slate-600">Total {habit.unit} completed</div>
                            </div>
                          </div>
                        )}

                        {/* Recent Completions */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Activity</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {habitCompletions
                              .filter((c) => c.habit_id === habit.id)
                              .slice(0, 5)
                              .map((completion) => (
                                <div
                                  key={completion.id}
                                  className="flex items-center justify-between text-xs text-slate-600"
                                >
                                  <span>{new Date(completion.completed_date).toLocaleDateString()}</span>
                                  {completion.quantity && completion.quantity > 1 && (
                                    <span>
                                      {completion.quantity} {habit.unit}
                                    </span>
                                  )}
                                  {completion.completion_time && <span>{completion.completion_time.slice(0, 5)}</span>}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </GlassCard>
            )
          })}

          {filteredHabits.length === 0 && (
            <div className="col-span-full">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  {showArchived ? "No archived habits" : "No habits yet"}
                </h3>
                <p className="text-slate-500">
                  {showArchived
                    ? "You haven't archived any habits yet."
                    : "Start building better habits by adding your first one above."}
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* Enhanced AI Insights */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-slate-800">Intelligent Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Performance Analysis</span>
            </div>
            <p className="text-sm text-slate-700">
              Your overall completion rate is {overallCompletionRate.toFixed(0)}%.
              {overallCompletionRate >= 80
                ? " Excellent consistency! Keep up the great work."
                : overallCompletionRate >= 60
                  ? " Good progress! Try to be more consistent with your daily habits."
                  : " Focus on building smaller, more achievable habits first."}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Habit Stacking Tip</span>
            </div>
            <p className="text-sm text-slate-700">
              Link new habits to existing routines. For example, "After I brush my teeth, I will do 10 push-ups." This
              creates automatic triggers for habit execution.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Optimal Timing</span>
            </div>
            <p className="text-sm text-slate-700">
              {completedToday > 0
                ? `Great job completing ${completedToday} habit${completedToday > 1 ? "s" : ""} today! `
                : "You haven't completed any habits today yet. "}
              Morning habits have a 70% higher success rate than evening ones.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800">Achievement Unlocked</span>
            </div>
            <p className="text-sm text-slate-700">
              {totalLifetimeCompletions >= 100
                ? "🏆 Century Club! You've completed over 100 habits. You're building incredible momentum!"
                : totalLifetimeCompletions >= 50
                  ? "🌟 Half Century! 50+ completions shows real commitment to growth."
                  : totalLifetimeCompletions >= 10
                    ? "⚡ Getting Started! 10+ completions - you're building the foundation for lasting change."
                    : "🌱 Every journey begins with a single step. Your first completion is the most important one!"}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
