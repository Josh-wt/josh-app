"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  Search,
  Settings,
  Lightbulb,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Info,
  HelpCircle,
  Type,
  FileText,
  Hash,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Loader
} from "lucide-react"

// Simple utility functions to replace external dependencies
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Simple GlassCard component replacement
const GlassCard = ({ children, className, onClick }: { 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void 
}) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Mock Supabase client
const createClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@example.com' } } })
  },
  from: (table: string) => ({
    select: () => ({ 
      eq: () => ({ 
        order: () => ({ 
          data: [], 
          error: null 
        }),
        data: [],
        error: null
      }),
      data: [],
      error: null
    }),
    insert: () => ({ 
      select: () => ({ 
        single: () => ({
          data: { id: Date.now().toString(), created_at: new Date().toISOString() },
          error: null
        }),
        data: [],
        error: null
      })
    }),
    update: () => ({ 
      eq: () => ({ 
        data: null, 
        error: null 
      })
    }),
    delete: () => ({ 
      eq: () => ({ 
        data: null, 
        error: null 
      })
    })
  })
})

// Type definitions
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
  target_days: string[]
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
  priority: "low" | "medium" | "high" | "critical"
  estimated_duration: number
  tags: string[]
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
  satisfaction_rating?: number
  difficulty_experienced?: number
  time_taken?: number
  focus_score?: number
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
  worstDay: string
  bestTime: string
  totalQuantity?: number
  averageQuantity?: number
  consistencyScore: number
  improvementRate: number
  predictedSuccess: number
  personalizedInsights: string[]
  optimizationSuggestions: string[]
}

// Enhanced Category Configuration
const categoryConfig = {
  health: {
    color: "from-green-400/30 to-emerald-500/30 border-green-300/40",
    icon: Heart,
    bgColor: "bg-green-50/80",
    textColor: "text-green-800",
    gradientClasses: "bg-gradient-to-br from-green-100 via-emerald-50 to-green-100"
  },
  fitness: {
    color: "from-orange-400/30 to-red-500/30 border-orange-300/40",
    icon: Zap,
    bgColor: "bg-orange-50/80",
    textColor: "text-orange-800",
    gradientClasses: "bg-gradient-to-br from-orange-100 via-red-50 to-orange-100"
  },
  productivity: {
    color: "from-blue-400/30 to-indigo-500/30 border-blue-300/40",
    icon: Briefcase,
    bgColor: "bg-blue-50/80",
    textColor: "text-blue-800",
    gradientClasses: "bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-100"
  },
  learning: {
    color: "from-purple-400/30 to-violet-500/30 border-purple-300/40",
    icon: BookOpen,
    bgColor: "bg-purple-50/80",
    textColor: "text-purple-800",
    gradientClasses: "bg-gradient-to-br from-purple-100 via-violet-50 to-purple-100"
  },
  mindfulness: {
    color: "from-indigo-400/30 to-blue-500/30 border-indigo-300/40",
    icon: Brain,
    bgColor: "bg-indigo-50/80",
    textColor: "text-indigo-800",
    gradientClasses: "bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100"
  },
  personal: {
    color: "from-pink-400/30 to-rose-500/30 border-pink-300/40",
    icon: Home,
    bgColor: "bg-pink-50/80",
    textColor: "text-pink-800",
    gradientClasses: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100"
  },
  social: {
    color: "from-cyan-400/30 to-teal-500/30 border-cyan-300/40",
    icon: Coffee,
    bgColor: "bg-cyan-50/80",
    textColor: "text-cyan-800",
    gradientClasses: "bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-100"
  }
}

const difficultyConfig = {
  easy: {
    color: "text-green-700",
    bg: "bg-green-100/80",
    border: "border-green-200",
    label: "Easy",
    description: "2-10 minutes daily",
    icon: Star,
    multiplier: 1
  },
  medium: {
    color: "text-yellow-700",
    bg: "bg-yellow-100/80",
    border: "border-yellow-200",
    label: "Medium",
    description: "10-30 minutes daily",
    icon: Target,
    multiplier: 2
  },
  hard: {
    color: "text-red-700",
    bg: "bg-red-100/80",
    border: "border-red-200",
    label: "Hard",
    description: "30+ minutes daily",
    icon: Crown,
    multiplier: 3
  }
}

const achievementLevels = [
  { days: 1, icon: Sparkles, title: "First Step", color: "text-green-500", points: 10 },
  { days: 3, icon: Star, title: "Getting Started", color: "text-blue-500", points: 30 },
  { days: 7, icon: Award, title: "Week Warrior", color: "text-purple-500", points: 100 },
  { days: 14, icon: Medal, title: "Fortnight Fighter", color: "text-orange-500", points: 250 },
  { days: 30, icon: Trophy, title: "Month Master", color: "text-red-500", points: 500 },
  { days: 60, icon: Crown, title: "Habit Hero", color: "text-indigo-500", points: 1000 },
  { days: 100, icon: Gem, title: "Century Champion", color: "text-pink-500", points: 2000 }
]

// Demo data generator
const generateDemoData = () => {
  const demoHabits: Habit[] = [
    {
      id: "1",
      name: "Morning Meditation",
      description: "Start each day with 10 minutes of mindfulness meditation to center myself and set positive intentions.",
      category: "mindfulness",
      difficulty: "easy",
      current_streak: 12,
      best_streak: 25,
      total_completions: 45,
      target_frequency: 7,
      target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      color: "#6366f1",
      icon: "brain",
      is_quantity_based: false,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
      user_id: "demo-user",
      is_archived: false,
      priority: "high",
      estimated_duration: 10,
      tags: ["morning", "mindfulness", "meditation"]
    },
    {
      id: "2",
      name: "Daily Reading",
      description: "Read at least 20 pages of educational or inspiring books to expand knowledge and perspective.",
      category: "learning",
      difficulty: "medium",
      current_streak: 8,
      best_streak: 18,
      total_completions: 32,
      target_frequency: 5,
      target_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      color: "#8b5cf6",
      icon: "book",
      is_quantity_based: true,
      target_quantity: 20,
      unit: "pages",
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
      user_id: "demo-user",
      is_archived: false,
      priority: "medium",
      estimated_duration: 30,
      tags: ["learning", "books", "knowledge"]
    },
    {
      id: "3",
      name: "Evening Exercise",
      description: "Complete a 45-minute workout session focusing on strength training and cardiovascular health.",
      category: "fitness",
      difficulty: "hard",
      current_streak: 5,
      best_streak: 14,
      total_completions: 28,
      target_frequency: 4,
      target_days: ["monday", "tuesday", "thursday", "friday"],
      color: "#f97316",
      icon: "zap",
      is_quantity_based: false,
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
      user_id: "demo-user",
      is_archived: false,
      priority: "high",
      estimated_duration: 45,
      tags: ["fitness", "strength", "cardio"]
    }
  ]

  const today = new Date()
  const demoCompletions: HabitCompletion[] = []
  
  // Generate completions for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    
    demoHabits.forEach(habit => {
      // Simulate realistic completion patterns
      const completionChance = habit.difficulty === 'easy' ? 0.85 : 
                              habit.difficulty === 'medium' ? 0.7 : 0.55
      
      if (Math.random() < completionChance) {
        demoCompletions.push({
          id: `${habit.id}-${dateString}`,
          habit_id: habit.id,
          completed_date: dateString,
          quantity: habit.is_quantity_based ? habit.target_quantity : 1,
          completion_time: `${7 + Math.floor(Math.random() * 14)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
          mood_after: 3 + Math.floor(Math.random() * 3), // 3-5
          satisfaction_rating: 3 + Math.floor(Math.random() * 3), // 3-5
          difficulty_experienced: Math.floor(Math.random() * 5) + 1, // 1-5
          time_taken: habit.estimated_duration + Math.floor(Math.random() * 10) - 5,
          focus_score: 3 + Math.floor(Math.random() * 3), // 3-5
          user_id: "demo-user",
          created_at: `${dateString}T${7 + Math.floor(Math.random() * 14)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`
        })
      }
    })
  }

  return { habits: demoHabits, completions: demoCompletions }
}

export function HabitTracker() {
  // Core State Management
  const [user, setUser] = useState<any>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [habitStats, setHabitStats] = useState<Record<string, HabitStats>>({})
  
  // UI State
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar" | "analytics">("grid")
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  
  // Advanced Filtering and Search
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // New Habit State
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "health",
    difficulty: "medium" as const,
    priority: "medium" as const,
    target_frequency: 7,
    target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    reminder_time: "",
    color: "#10b981",
    icon: "target",
    is_quantity_based: false,
    target_quantity: 1,
    unit: "",
    notes: "",
    tags: [] as string[],
    estimated_duration: 15
  })
  
  const supabase = createClient()

  // Initialize demo data
  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Load demo data
        const demoData = generateDemoData()
        setHabits(demoData.habits)
        setHabitCompletions(demoData.completions)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    
    initializeData()
  }, [])

  // Calculate comprehensive habit statistics
  const calculateHabitStats = useCallback(() => {
    const stats: Record<string, HabitStats> = {}

    habits.forEach((habit) => {
      const completions = habitCompletions.filter((c) => c.habit_id === habit.id)
      const createdDate = new Date(habit.created_at)
      const today = new Date()
      const daysSinceCreated = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      // Basic Statistics
      const totalDays = completions.length
      const completionRate = daysSinceCreated > 0 ? Math.min((totalDays / daysSinceCreated) * 100, 100) : 0

      // Advanced Streak Analysis
      const sortedDates = completions
        .map(c => c.completed_date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

      let currentStreak = 0
      let longestStreak = 0

      // Calculate current streak
      const todayStr = today.toISOString().split('T')[0]
      if (sortedDates.includes(todayStr)) {
        currentStreak = 1
        let checkDate = new Date(today.getTime() - 86400000)
        while (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 86400000)
        }
      } else {
        const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0]
        if (sortedDates.includes(yesterdayStr)) {
          let checkDate = new Date(today.getTime() - 86400000)
          while (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
            currentStreak++
            checkDate = new Date(checkDate.getTime() - 86400000)
          }
        }
      }

      // Calculate longest streak
      const allDates = sortedDates.sort()
      let tempStreak = 1
      for (let i = 1; i < allDates.length; i++) {
        const prevDate = new Date(allDates[i - 1])
        const currDate = new Date(allDates[i])
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
          tempStreak++
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)

      // Weekly and monthly progress
      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today.getTime() - i * 86400000).toISOString().split('T')[0]
        return sortedDates.includes(date) ? 1 : 0
      }).reverse()

      const monthlyProgress = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today.getTime() - i * 86400000).toISOString().split('T')[0]
        return sortedDates.includes(date) ? 1 : 0
      }).reverse()

      // Day analysis
      const dayCompletions = completions.reduce((acc, completion) => {
        const dayOfWeek = new Date(completion.completed_date).toLocaleDateString('en-US', { weekday: 'long' })
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const bestDay = Object.entries(dayCompletions).reduce(
        (a, b) => (dayCompletions[a[0]] > dayCompletions[b[0]] ? a : b),
        ['Monday', 0]
      )[0]

      const worstDay = Object.entries(dayCompletions).reduce(
        (a, b) => (dayCompletions[a[0]] < dayCompletions[b[0]] ? a : b),
        ['Monday', 0]
      )[0]

      // Time analysis
      const timeCompletions = completions
        .filter(c => c.completion_time)
        .reduce((acc, completion) => {
          const hour = new Date(`2000-01-01T${completion.completion_time}`).getHours()
          const timeRange = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
          acc[timeRange] = (acc[timeRange] || 0) + 1
          return acc
        }, {} as Record<string, number>)

      const bestTime = Object.entries(timeCompletions).reduce(
        (a, b) => (timeCompletions[a[0]] > timeCompletions[b[0]] ? a : b),
        ['Morning', 0]
      )[0]

      // Advanced metrics
      const consistencyScore = Math.min(completionRate + (currentStreak * 2), 100)
      const improvementRate = completions.length > 5 ? 
        ((completions.slice(-5).reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / 5) - 3) * 25 : 0
      
      const predictedSuccess = Math.min((completionRate / 100) * (consistencyScore / 100) * 100, 100)

      // Generate insights
      const insights: string[] = []
      if (completionRate > 80) {
        insights.push(`Excellent consistency! Your ${completionRate.toFixed(0)}% completion rate puts you in the top 10%.`)
      }
      if (currentStreak > 7) {
        insights.push(`Strong momentum with your ${currentStreak}-day streak. You're building lasting neural pathways.`)
      }
      if (bestTime && timeCompletions[bestTime] / completions.length > 0.6) {
        insights.push(`You perform best in the ${bestTime.toLowerCase()}. Consider scheduling similar habits then.`)
      }

      // Optimization suggestions
      const suggestions: string[] = []
      if (completionRate < 60 && habit.target_frequency > 4) {
        suggestions.push("Consider reducing target frequency to build consistency before scaling up.")
      }
      if (currentStreak === 0 && longestStreak > 7) {
        suggestions.push("You've done this before! Try the 2-minute rule: commit to just 2 minutes to restart.")
      }
      if (completions.length > 10) {
        const avgSatisfaction = completions.reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / completions.length
        if (avgSatisfaction < 3.5) {
          suggestions.push("Low satisfaction suggests this habit might need adjustment in timing or approach.")
        }
      }

      stats[habit.id] = {
        totalDays,
        completionRate,
        averageStreak: longestStreak / Math.max(1, allDates.length / 10), // Rough average
        longestStreak,
        currentStreak,
        weeklyProgress,
        monthlyProgress,
        bestDay,
        worstDay,
        bestTime,
        totalQuantity: habit.is_quantity_based ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0) : undefined,
        averageQuantity: habit.is_quantity_based && completions.length > 0 ? 
          completions.reduce((sum, c) => sum + (c.quantity || 0), 0) / completions.length : undefined,
        consistencyScore,
        improvementRate,
        predictedSuccess,
        personalizedInsights: insights,
        optimizationSuggestions: suggestions
      }
    })

    setHabitStats(stats)
  }, [habits, habitCompletions])

  useEffect(() => {
    if (habits.length > 0) {
      calculateHabitStats()
    }
  }, [habits, habitCompletions, calculateHabitStats])

  // Add new habit
  const addHabit = async () => {
    if (!newHabit.name.trim() || !user) return

    try {
      setLoading(true)
      
      const habitData: Habit = {
        id: Date.now().toString(),
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        category: newHabit.category,
        difficulty: newHabit.difficulty,
        priority: newHabit.priority,
        target_frequency: newHabit.target_frequency,
        target_days: newHabit.target_days,
        reminder_time: newHabit.reminder_time || undefined,
        color: newHabit.color,
        icon: newHabit.icon,
        is_quantity_based: newHabit.is_quantity_based,
        target_quantity: newHabit.is_quantity_based ? newHabit.target_quantity : undefined,
        unit: newHabit.is_quantity_based ? newHabit.unit : undefined,
        current_streak: 0,
        best_streak: 0,
        total_completions: 0,
        is_archived: false,
        notes: newHabit.notes,
        tags: newHabit.tags,
        estimated_duration: newHabit.estimated_duration,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
      }

      setHabits(prev => [habitData, ...prev])
      
      // Reset form
      setNewHabit({
        name: "",
        description: "",
        category: "health",
        difficulty: "medium",
        priority: "medium",
        target_frequency: 7,
        target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        reminder_time: "",
        color: "#10b981",
        icon: "target",
        is_quantity_based: false,
        target_quantity: 1,
        unit: "",
        notes: "",
        tags: [],
        estimated_duration: 15
      })
      setShowAddHabit(false)
      
    } catch (error) {
      console.error("Error adding habit:", error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle habit completion
  const toggleHabitCompletion = async (habitId: string, date?: Date) => {
    if (!user) return

    const targetDate = date || new Date()
    const dateString = targetDate.toISOString().split('T')[0]

    try {
      const existingCompletion = habitCompletions.find(
        completion => completion.habit_id === habitId && completion.completed_date === dateString
      )

      if (existingCompletion) {
        // Remove completion
        setHabitCompletions(prev => prev.filter(c => c.id !== existingCompletion.id))
      } else {
        // Add completion
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return

        const now = new Date()
        const newCompletion: HabitCompletion = {
          id: `${habitId}-${dateString}-${Date.now()}`,
          habit_id: habitId,
          completed_date: dateString,
          quantity: habit.is_quantity_based ? habit.target_quantity : 1,
          completion_time: now.toTimeString().split(" ")[0],
          mood_after: 4,
          satisfaction_rating: 4,
          difficulty_experienced: getDifficultyRating(habit.difficulty),
          time_taken: habit.estimated_duration,
          focus_score: 4,
          user_id: user.id,
          created_at: now.toISOString()
        }

        setHabitCompletions(prev => [...prev, newCompletion])
        
        // Update habit stats
        setHabits(prev => prev.map(h => 
          h.id === habitId 
            ? { ...h, total_completions: h.total_completions + 1 }
            : h
        ))
      }
    } catch (error) {
      console.error("Error toggling habit completion:", error)
    }
  }

  const getDifficultyRating = (difficulty: string): number => {
    const ratings = { 'easy': 2, 'medium': 3, 'hard': 4 }
    return ratings[difficulty as keyof typeof ratings] || 3
  }

  // Archive habit
  const archiveHabit = async (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, is_archived: true } : habit
    ))
  }

  // Delete habit
  const deleteHabit = async (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId))
    setHabitCompletions(prev => prev.filter(completion => completion.habit_id !== habitId))
  }

  // Utility functions
  const getCompletionForDate = (habitId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return habitCompletions.find(
      completion => completion.habit_id === habitId && completion.completed_date === dateString
    )
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600"
    if (rate >= 75) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    if (rate >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-blue-600"
    if (streak >= 7) return "text-green-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: "text-red-700 bg-red-100",
      high: "text-orange-700 bg-orange-100",
      medium: "text-yellow-700 bg-yellow-100",
      low: "text-green-700 bg-green-100"
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  // Advanced filtering
  const filteredAndSortedHabits = useMemo(() => {
    let filtered = habits.filter(habit => {
      if (!showArchived && habit.is_archived) return false
      if (showArchived && !habit.is_archived) return false
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        if (
          !habit.name.toLowerCase().includes(searchLower) &&
          !habit.description?.toLowerCase().includes(searchLower) &&
          !habit.tags?.some(tag => tag.toLowerCase().includes(searchLower)) &&
          !habit.category.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }
      
      if (filterCategory !== "all" && habit.category !== filterCategory) return false
      if (filterDifficulty !== "all" && habit.difficulty !== filterDifficulty) return false
      
      return true
    })

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "streak":
          aValue = habitStats[a.id]?.currentStreak || 0
          bValue = habitStats[b.id]?.currentStreak || 0
          break
        case "completion_rate":
          aValue = habitStats[a.id]?.completionRate || 0
          bValue = habitStats[b.id]?.completionRate || 0
          break
        case "name":
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [habits, habitStats, showArchived, searchTerm, filterCategory, filterDifficulty, sortBy, sortOrder])

  // Dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalActiveHabits = habits.filter(h => !h.is_archived).length
    const today = new Date().toISOString().split('T')[0]
    const completedToday = habitCompletions.filter(c => c.completed_date === today).length
    
    const overallCompletionRate = totalActiveHabits > 0
      ? Object.values(habitStats).reduce((sum, stats) => sum + stats.completionRate, 0) / totalActiveHabits
      : 0
    
    const totalStreakDays = Object.values(habitStats).reduce((sum, stats) => sum + stats.currentStreak, 0)
    const avgStreakLength = totalActiveHabits > 0 ? totalStreakDays / totalActiveHabits : 0
    
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.total_completions, 0)
    
    return {
      totalActiveHabits,
      completedToday,
      overallCompletionRate,
      avgStreakLength,
      totalCompletions,
      consistencyScore: Math.min(overallCompletionRate + (avgStreakLength * 2), 100)
    }
  }, [habits, habitCompletions, habitStats])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <GlassCard className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Habit Mastery</h2>
          <p className="text-slate-600 mb-6">This is a demo version with sample data to showcase the advanced habit tracking system.</p>
          <button 
            onClick={() => {
              const demoUser = { id: 'demo-user', email: 'demo@example.com' }
              setUser(demoUser)
              const demoData = generateDemoData()
              setHabits(demoData.habits)
              setHabitCompletions(demoData.completions)
              setLoading(false)
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Explore Demo
          </button>
        </GlassCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-slate-600 font-medium">Loading your habit journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header Dashboard */}
        <GlassCard className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                {dashboardStats.completedToday > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{dashboardStats.completedToday}</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Habit Mastery Pro
                </h1>
                <p className="text-slate-600 font-medium">AI-powered habit tracking with advanced analytics</p>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-600">
                    Consistency Score: {dashboardStats.consistencyScore.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-white/30">
                {(["grid", "list", "calendar", "analytics"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1",
                      viewMode === mode
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105"
                        : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                    )}
                  >
                    {mode === "grid" && <LayoutGrid className="w-4 h-4" />}
                    {mode === "list" && <List className="w-4 h-4" />}
                    {mode === "calendar" && <Calendar className="w-4 h-4" />}
                    {mode === "analytics" && <BarChart3 className="w-4 h-4" />}
                    <span className="hidden sm:inline">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
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

          {/* Enhanced Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search habits, tags, or descriptions..."
                className="w-full bg-white/60 backdrop-blur-sm border border-white/30 pl-10 pr-4 py-3 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryConfig).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="all">All Difficulties</option>
                {Object.entries(difficultyConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="streak">Current Streak</option>
                <option value="completion_rate">Completion Rate</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-white/80 transition-all"
                title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              >
                {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
                  showArchived
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg"
                    : "bg-white/60 backdrop-blur-sm border border-white/30 text-slate-600 hover:text-slate-800 hover:bg-white/80"
                )}
              >
                {showArchived ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {showArchived ? "Hide Archived" : "Show Archived"}
                </span>
              </button>
            </div>
          </div>

          {/* Dashboard Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-emerald-50/80 to-green-100/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Today</span>
              </div>
              <div className="text-2xl font-bold text-emerald-900">{dashboardStats.completedToday}</div>
              <div className="text-xs text-emerald-700">
                of {dashboardStats.totalActiveHabits} habits
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{dashboardStats.totalActiveHabits}</div>
              <div className="text-xs text-blue-700">habits tracking</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Success</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {dashboardStats.overallCompletionRate.toFixed(0)}%
              </div>
              <div className="text-xs text-purple-700">completion rate</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 to-red-100/80 backdrop-blur-sm p-4 rounded-xl border border-orange-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {dashboardStats.avgStreakLength.toFixed(1)}
              </div>
              <div className="text-xs text-orange-700">avg days</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50/80 to-amber-100/80 backdrop-blur-sm p-4 rounded-xl border border-yellow-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Total</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{dashboardStats.totalCompletions}</div>
              <div className="text-xs text-yellow-700">completions</div>
            </div>
          </div>
        </GlassCard>

        {/* Add Habit Form */}
        {showAddHabit && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Create New Habit</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Type className="w-4 h-4" />
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Morning Meditation, Daily Reading"
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    {Object.entries(categoryConfig).map(([key]) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your habit and why it's important..."
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 placeholder-slate-500 h-24 resize-none focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Difficulty</label>
                  <select
                    value={newHabit.difficulty}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    {Object.entries(difficultyConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Priority</label>
                  <select
                    value={newHabit.priority}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Frequency (days/week)</label>
                  <input
                    type="number"
                    value={newHabit.target_frequency}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, target_frequency: parseInt(e.target.value) }))}
                    min="1"
                    max="7"
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHabit.is_quantity_based}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, is_quantity_based: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Hash className="w-4 h-4" />
                    Track specific quantities
                  </span>
                </label>

                {newHabit.is_quantity_based && (
                  <div className="grid grid-cols-2 gap-4 pl-7">
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-1 block">Target Quantity</label>
                      <input
                        type="number"
                        value={newHabit.target_quantity}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, target_quantity: parseInt(e.target.value) }))}
                        min="1"
                        className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-1 block">Unit</label>
                      <input
                        type="text"
                        value={newHabit.unit}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="pages, minutes, reps..."
                        className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addHabit}
                  disabled={!newHabit.name.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Habit
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="px-6 bg-white/60 backdrop-blur-sm border border-white/30 text-slate-700 font-semibold rounded-xl hover:bg-white/80 hover:scale-[1.02] transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Habits Display */}
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredAndSortedHabits.length === 0 ? (
            <div className="col-span-full">
              <GlassCard className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-3">
                  {showArchived ? "No archived habits found" : searchTerm ? "No habits match your search" : "Ready to build amazing habits?"}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {showArchived 
                    ? "You haven't archived any habits yet."
                    : searchTerm 
                      ? "Try adjusting your search terms or filters."
                      : "Start your transformation journey by creating your first intelligent habit."
                  }
                </p>
                {!showArchived && (
                  <button
                    onClick={() => setShowAddHabit(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Create Your First Habit
                  </button>
                )}
              </GlassCard>
            </div>
          ) : (
            filteredAndSortedHabits.map((habit) => {
              const stats = habitStats[habit.id]
              const categoryConf = categoryConfig[habit.category as keyof typeof categoryConfig]
              const CategoryIcon = categoryConf?.icon || Target
              const isCompletedToday = habitCompletions.some(
                completion => 
                  completion.habit_id === habit.id && 
                  completion.completed_date === new Date().toISOString().split('T')[0]
              )

              return (
                <GlassCard
                  key={habit.id}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer p-6",
                    isCompletedToday && "ring-2 ring-emerald-400/30 bg-gradient-to-br from-emerald-50/90 to-green-50/90"
                  )}
                  onClick={() => setSelectedHabit(selectedHabit === habit.id ? null : habit.id)}
                >
                  {/* Habit Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Completion Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleHabitCompletion(habit.id)
                        }}
                        className="mt-1 transition-all duration-200 hover:scale-110"
                      >
                        {isCompletedToday ? (
                          <div className="relative">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-lg" />
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="w-8 h-8 text-slate-400 hover:text-emerald-500 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {/* Habit Name and Priority */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={cn(
                            "font-bold text-lg truncate transition-colors",
                            isCompletedToday ? "text-emerald-700" : "text-slate-800"
                          )}>
                            {habit.name}
                          </h3>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold shrink-0",
                            getPriorityColor(habit.priority)
                          )}>
                            {habit.priority.toUpperCase()}
                          </div>
                        </div>

                        {/* Category and Metadata */}
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-1">
                            <CategoryIcon className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium capitalize">{habit.category}</span>
                          </div>

                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold",
                            difficultyConfig[habit.difficulty].bg,
                            difficultyConfig[habit.difficulty].color
                          )}>
                            {difficultyConfig[habit.difficulty].label}
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{habit.estimated_duration}min</span>
                          </div>
                        </div>

                        {/* Description */}
                        {habit.description && (
                          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          archiveHabit(habit.id)
                        }}
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-all"
                        title="Archive habit"
                      >
                        <Archive className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteHabit(habit.id)
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        title="Delete habit"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Streak and Performance Display */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className={cn("font-bold text-lg", getStreakColor(stats?.currentStreak || 0))}>
                          {stats?.currentStreak || 0}
                        </span>
                        <span className="text-sm text-slate-600">day streak</span>
                      </div>
                      {stats?.longestStreak && stats.longestStreak > 0 && (
                        <div className="text-xs text-slate-500">
                          (best: {stats.longestStreak})
                        </div>
                      )}
                    </div>

                    {stats && (
                      <div className="text-right">
                        <div className={cn("text-lg font-bold", getCompletionRateColor(stats.completionRate))}>
                          {stats.completionRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">success rate</div>
                      </div>
                    )}
                  </div>

                  {/* Progress Visualization */}
                  {stats && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                        <span>Last 7 days</span>
                        <span>{stats.weeklyProgress.filter(d => d === 1).length}/7</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {stats.weeklyProgress.map((completed, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 h-3 rounded-sm transition-colors",
                              completed ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {habit.tags && habit.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {habit.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {habit.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          +{habit.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedHabit === habit.id && stats && (
                    <div className="pt-4 border-t border-slate-200/50 space-y-4">
                      {/* Detailed Statistics */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                          <div className="text-lg font-bold text-slate-800">{stats.totalDays}</div>
                          <div className="text-xs text-slate-600">Total Days</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                          <div className="text-lg font-bold text-slate-800">
                            {stats.averageStreak.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-600">Avg Streak</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                          <div className="text-lg font-bold text-slate-800">
                            {stats.bestTime || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-600">Best Time</div>
                        </div>
                      </div>

                      {/* Monthly Progress Heatmap */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                          <span>Last 30 days</span>
                          <span>{stats.monthlyProgress.filter(d => d === 1).length}/30</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1">
                          {stats.monthlyProgress.map((completed, i) => (
                            <div
                              key={i}
                              className={cn(
                                "aspect-square rounded-sm",
                                completed ? "bg-gradient-to-br from-emerald-400 to-green-500" : "bg-slate-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      {/* AI Insights */}
                      {stats.personalizedInsights.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            AI Insights
                          </h4>
                          <div className="space-y-2">
                            {stats.personalizedInsights.slice(0, 2).map((insight, i) => (
                              <div key={i} className="p-2 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-lg border border-purple-200/30">
                                <p className="text-sm text-purple-800">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Optimization Suggestions */}
                      {stats.optimizationSuggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            Suggestions
                          </h4>
                          <div className="space-y-2">
                            {stats.optimizationSuggestions.slice(0, 2).map((suggestion, i) => (
                              <div key={i} className="p-2 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 rounded-lg border border-yellow-200/30">
                                <p className="text-sm text-yellow-800">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
