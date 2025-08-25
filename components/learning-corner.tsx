"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { GlassCard } from "./glass-card"
import {
  BookOpen,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  Brain,
  Search,
  Edit,
  CalendarIcon,
  Calendar,
  Flame,
  Trophy,
  Tag,
  CheckCircle,
  Play,
  Pause,
  Square,
  Filter,
  MoreVertical,
  Archive,
  Star,
  Target,
  TrendingUp,
  Users,
  FileText,
  ExternalLink,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  Zap,
  Award,
  Globe,
  BookMarkCheck,
  GraduationCap,
  Lightbulb,
  Timer,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2,
  Copy,
  Share2,
  Bookmark
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

// ========================
// TYPE DEFINITIONS
// ========================

interface LearningTopic {
  id: string
  title: string
  description?: string
  category: string
  difficulty_level: "Beginner" | "Intermediate" | "Advanced"
  priority: "Low" | "Medium" | "High"
  target_completion_date?: string
  estimated_hours: number
  actual_hours: number
  color: string
  icon: string
  is_archived: boolean
  is_favorite: boolean
  tags: string[]
  created_at: string
  updated_at: string
  subtopics?: LearningSubtopic[]
  resources?: LearningResource[]
  sessions?: LearningSession[]
  goals?: LearningGoal[]
  progress?: number
  completion_percentage?: number
  last_studied?: string
  study_streak?: number
}

interface LearningSubtopic {
  id: string
  topic_id: string
  title: string
  description?: string
  order_index: number
  is_completed: boolean
  completed_at?: string
  estimated_minutes: number
  actual_minutes: number
  difficulty_level: "Beginner" | "Intermediate" | "Advanced"
  notes?: string
  resources?: LearningResource[]
  created_at: string
  updated_at: string
}

interface LearningResource {
  id: string
  topic_id: string
  subtopic_id?: string
  title: string
  url?: string
  resource_type: "Article" | "Video" | "Book" | "Course" | "Podcast" | "Document" | "Tool" | "Other"
  description?: string
  notes?: string
  is_completed: boolean
  is_favorite: boolean
  rating?: number
  estimated_duration?: number
  tags: string[]
  created_at: string
  updated_at: string
}

interface LearningSession {
  id: string
  topic_id: string
  subtopic_id?: string
  session_date: string
  start_time?: string
  end_time?: string
  duration_minutes?: number
  notes?: string
  focus_rating?: number
  energy_level?: number
  environment?: string
  distractions?: number
  key_insights?: string
  challenges?: string
  created_at: string
}

interface LearningGoal {
  id: string
  topic_id: string
  title: string
  description?: string
  target_date?: string
  target_value?: number
  current_value?: number
  unit?: string
  is_achieved: boolean
  achieved_at?: string
  priority: "Low" | "Medium" | "High"
  created_at: string
  updated_at: string
}

interface StudyStats {
  totalTopics: number
  completedTopics: number
  inProgressTopics: number
  totalSubtopics: number
  completedSubtopics: number
  totalStudyTime: number
  weeklyStudyTime: number
  monthlyStudyTime: number
  studyStreak: number
  longestStreak: number
  averageSessionLength: number
  totalSessions: number
  favoriteTopics: number
  completionRate: number
  weeklyGoalProgress: number
  monthlyGoalProgress: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: "time" | "completion" | "streak" | "consistency" | "exploration"
  threshold: number
  currentValue: number
  isUnlocked: boolean
  unlockedAt?: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

// ========================
// UTILITY CONSTANTS
// ========================

const DIFFICULTY_COLORS = {
  Beginner: "text-green-700 bg-green-100 border-green-200",
  Intermediate: "text-yellow-700 bg-yellow-100 border-yellow-200", 
  Advanced: "text-red-700 bg-red-100 border-red-200"
} as const

const PRIORITY_COLORS = {
  Low: "text-blue-700 bg-blue-100 border-blue-200",
  Medium: "text-yellow-700 bg-yellow-100 border-yellow-200",
  High: "text-red-700 bg-red-100 border-red-200"
} as const

const RESOURCE_TYPE_ICONS = {
  Article: FileText,
  Video: Play,
  Book: BookOpen,
  Course: GraduationCap,
  Podcast: Users,
  Document: FileText,
  Tool: Settings,
  Other: Globe
} as const

const STUDY_ENVIRONMENTS = [
  "Home Office", "Library", "Coffee Shop", "Bedroom", "Study Room", "Online", "Classroom", "Other"
]

const CATEGORIES = [
  "Programming", "Design", "Business", "Language", "Science", "Math", "History", 
  "Art", "Music", "Literature", "Philosophy", "Psychology", "Health", "Fitness", "Cooking", "Other"
]

const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-topic",
    title: "First Steps",
    description: "Create your first learning topic",
    icon: "🎯",
    type: "completion",
    threshold: 1,
    currentValue: 0,
    isUnlocked: false,
    rarity: "common"
  },
  {
    id: "completion-master",
    title: "Completion Master", 
    description: "Complete 5 learning topics",
    icon: "🏆",
    type: "completion",
    threshold: 5,
    currentValue: 0,
    isUnlocked: false,
    rarity: "rare"
  },
  {
    id: "study-warrior",
    title: "Study Warrior",
    description: "Study for 100 hours total",
    icon: "⚔️",
    type: "time",
    threshold: 6000, // 100 hours in minutes
    currentValue: 0,
    isUnlocked: false,
    rarity: "epic"
  },
  {
    id: "consistency-king",
    title: "Consistency King",
    description: "Study for 30 days in a row",
    icon: "👑",
    type: "streak",
    threshold: 30,
    currentValue: 0,
    isUnlocked: false,
    rarity: "legendary"
  },
  {
    id: "explorer",
    title: "Knowledge Explorer",
    description: "Study topics in 5 different categories",
    icon: "🗺️",
    type: "exploration",
    threshold: 5,
    currentValue: 0,
    isUnlocked: false,
    rarity: "rare"
  }
]

// ========================
// MAIN COMPONENT
// ========================

export function LearningCorner() {
  // ========================
  // STATE MANAGEMENT
  // ========================
  
  // Core data state
  const [topics, setTopics] = useState<LearningTopic[]>([])
  const [sessions, setSessions] = useState<LearningSession[]>([])
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>(PREDEFINED_ACHIEVEMENTS)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [activeView, setActiveView] = useState<"overview" | "topics" | "sessions" | "goals" | "analytics" | "achievements">("overview")
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set())
  
  // Modal/Form state
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [showAddSubtopic, setShowAddSubtopic] = useState<string | null>(null)
  const [showAddResource, setShowAddResource] = useState<string | null>(null)
  const [showAddGoal, setShowAddGoal] = useState<string | null>(null)
  const [showBulkImport, setShowBulkImport] = useState<string | null>(null)
  const [editingTopic, setEditingTopic] = useState<string | null>(null)
  const [editingSubtopic, setEditingSubtopic] = useState<string | null>(null)
  const [showResourceDetail, setShowResourceDetail] = useState<string | null>(null)
  const [showTopicDetail, setShowTopicDetail] = useState<string | null>(null)

  // Session tracking
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [sessionNotes, setSessionNotes] = useState("")

  // Search and filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterDifficulty, setFilterDifficulty] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState<"created" | "progress" | "priority" | "title" | "recent">("created")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Calendar and analytics
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<"week" | "month" | "quarter" | "year">("month")

  // Goals and gamification
  const [weeklyGoal, setWeeklyGoal] = useState(10) // hours
  const [monthlyGoal, setMonthlyGoal] = useState(40) // hours
  const [weeklyProgress, setWeeklyProgress] = useState(0)
  const [monthlyProgress, setMonthlyProgress] = useState(0)
  const [studyStreak, setStudyStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  // Bulk operations
  const [bulkSubtopics, setBulkSubtopics] = useState("")
  const [bulkResources, setBulkResources] = useState("")
  const [showBulkActions, setShowBulkActions] = useState(false)

  // New item forms
  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    category: "Programming",
    difficulty_level: "Beginner" as const,
    priority: "Medium" as const,
    target_completion_date: "",
    estimated_hours: 10,
    color: "#6366f1",
    icon: "BookOpen",
    tags: [] as string[],
    is_favorite: false
  })

  const [newSubtopic, setNewSubtopic] = useState({
    title: "",
    description: "",
    estimated_minutes: 30,
    difficulty_level: "Beginner" as const,
    notes: ""
  })

  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    resource_type: "Article" as const,
    description: "",
    notes: "",
    estimated_duration: 30,
    is_favorite: false,
    tags: [] as string[]
  })

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target_date: "",
    target_value: 1,
    unit: "topics",
    priority: "Medium" as const
  })

  const [newSession, setNewSession] = useState({
    notes: "",
    focus_rating: 5,
    energy_level: 5,
    environment: "Home Office",
    distractions: 0,
    key_insights: "",
    challenges: ""
  })

  // Supabase client
  const supabase = createClient()

  // ========================
  // COMPUTED VALUES
  // ========================
  
  const studyStats: StudyStats = useMemo(() => {
    const totalTopics = topics.length
    const completedTopics = topics.filter(t => t.progress === 100).length
    const inProgressTopics = topics.filter(t => t.progress > 0 && t.progress < 100).length
    const totalSubtopics = topics.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0)
    const completedSubtopics = topics.reduce((acc, topic) => 
      acc + (topic.subtopics?.filter(s => s.is_completed).length || 0), 0)
    const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0)
    
    // Calculate weekly and monthly study time
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const weeklyStudyTime = sessions
      .filter(s => new Date(s.session_date) >= weekAgo)
      .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
    
    const monthlyStudyTime = sessions
      .filter(s => new Date(s.session_date) >= monthAgo)
      .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

    const averageSessionLength = sessions.length > 0 ? 
      totalStudyTime / sessions.length : 0

    const favoriteTopics = topics.filter(t => t.is_favorite).length
    const completionRate = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0
    
    const weeklyGoalProgress = weeklyGoal > 0 ? (weeklyStudyTime / 60) / weeklyGoal * 100 : 0
    const monthlyGoalProgress = monthlyGoal > 0 ? (monthlyStudyTime / 60) / monthlyGoal * 100 : 0

    return {
      totalTopics,
      completedTopics,
      inProgressTopics,
      totalSubtopics,
      completedSubtopics,
      totalStudyTime,
      weeklyStudyTime,
      monthlyStudyTime,
      studyStreak,
      longestStreak,
      averageSessionLength,
      totalSessions: sessions.length,
      favoriteTopics,
      completionRate,
      weeklyGoalProgress,
      monthlyGoalProgress
    }
  }, [topics, sessions, weeklyGoal, monthlyGoal, studyStreak, longestStreak])

  const filteredTopics = useMemo(() => {
    let filtered = topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = filterCategory === "All" || topic.category === filterCategory
      const matchesDifficulty = filterDifficulty === "All" || topic.difficulty_level === filterDifficulty
      const matchesPriority = filterPriority === "All" || topic.priority === filterPriority
      
      const matchesStatus = filterStatus === "All" ||
        (filterStatus === "completed" && topic.progress === 100) ||
        (filterStatus === "in-progress" && topic.progress > 0 && topic.progress < 100) ||
        (filterStatus === "not-started" && topic.progress === 0) ||
        (filterStatus === "favorites" && topic.is_favorite)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPriority && matchesStatus
    })

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "progress":
          aValue = a.progress || 0
          bValue = b.progress || 0
          break
        case "priority":
          const priorityOrder = { Low: 1, Medium: 2, High: 3 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case "recent":
          aValue = new Date(a.last_studied || a.created_at).getTime()
          bValue = new Date(b.last_studied || b.created_at).getTime()
          break
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [topics, searchQuery, filterCategory, filterDifficulty, filterPriority, filterStatus, sortBy, sortOrder])

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    initializeComponent()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeSession && !sessionPaused && sessionStartTime) {
      interval = setInterval(() => {
        setSessionTimer(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeSession, sessionPaused, sessionStartTime])

  useEffect(() => {
    updateAchievements()
  }, [studyStats])

  // ========================
  // CORE FUNCTIONS
  // ========================

  const initializeComponent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      
      if (user) {
        setUser(user)
        await Promise.all([
          fetchTopics(user),
          fetchSessions(user),
          fetchGoals(user),
          loadUserPreferences(user)
        ])
      }
    } catch (err) {
      console.error("Error initializing Learning Corner:", err)
      setError("Failed to load learning data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      const { data: topicsData, error } = await supabase
        .from("learning_topics")
        .select("*")
        .eq("user_id", userToUse.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch related data for each topic
      const topicsWithDetails = await Promise.all(
        (topicsData || []).map(async (topic) => {
          const [subtopicsResult, resourcesResult, sessionsResult, goalsResult] = await Promise.all([
            supabase
              .from("learning_subtopics")
              .select("*")
              .eq("topic_id", topic.id)
              .order("order_index", { ascending: true }),
            supabase
              .from("learning_resources")
              .select("*")
              .eq("topic_id", topic.id)
              .order("created_at", { ascending: false }),
            supabase
              .from("learning_sessions")
              .select("*")
              .eq("topic_id", topic.id)
              .order("session_date", { ascending: false })
              .limit(10),
            supabase
              .from("learning_goals")
              .select("*")
              .eq("topic_id", topic.id)
              .order("created_at", { ascending: false })
          ])

          const subtopics = subtopicsResult.data || []
          const resources = resourcesResult.data || []
          const topicSessions = sessionsResult.data || []
          const topicGoals = goalsResult.data || []

          // Calculate progress and stats
          const completedSubtopics = subtopics.filter(s => s.is_completed).length
          const progress = subtopics.length > 0 ? (completedSubtopics / subtopics.length) * 100 : 0
          const actualHours = topicSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 60
          const lastStudied = topicSessions.length > 0 ? topicSessions[0].session_date : null
          
          // Calculate study streak for this topic
          const studyDates = [...new Set(topicSessions.map(s => s.session_date))].sort().reverse()
          let topicStreak = 0
          const today = new Date().toISOString().split('T')[0]
          let currentDate = today
          
          for (const date of studyDates) {
            if (date === currentDate || 
                new Date(currentDate).getTime() - new Date(date).getTime() === 24 * 60 * 60 * 1000) {
              topicStreak++
              currentDate = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            } else {
              break
            }
          }

          return {
            ...topic,
            subtopics,
            resources,
            sessions: topicSessions,
            goals: topicGoals,
            progress,
            actual_hours: actualHours,
            last_studied: lastStudied,
            study_streak: topicStreak,
            tags: topic.tags || [],
            is_favorite: topic.is_favorite || false
          }
        })
      )

      setTopics(topicsWithDetails)
    } catch (error) {
      console.error("Error fetching topics:", error)
      throw error
    }
  }

  const fetchSessions = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      const { data, error } = await supabase
        .from("learning_sessions")
        .select("*")
        .eq("user_id", userToUse.id)
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error("Error fetching sessions:", error)
      throw error
    }
  }

  const fetchGoals = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      const { data, error } = await supabase
        .from("learning_goals")
        .select("*")
        .eq("user_id", userToUse.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error("Error fetching goals:", error)
      throw error
    }
  }

  const loadUserPreferences = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      // Load user preferences from localStorage or database
      const savedPrefs = localStorage.getItem(`learning_prefs_${userToUse.id}`)
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs)
        setWeeklyGoal(prefs.weeklyGoal || 10)
        setMonthlyGoal(prefs.monthlyGoal || 40)
        setFilterCategory(prefs.filterCategory || "All")
        setSortBy(prefs.sortBy || "created")
        setSortOrder(prefs.sortOrder || "desc")
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
    }
  }

  const saveUserPreferences = useCallback(() => {
    if (!user) return
    
    const prefs = {
      weeklyGoal,
      monthlyGoal,
      filterCategory,
      sortBy,
      sortOrder
    }
    
    localStorage.setItem(`learning_prefs_${user.id}`, JSON.stringify(prefs))
  }, [user, weeklyGoal, monthlyGoal, filterCategory, sortBy, sortOrder])

  useEffect(() => {
    saveUserPreferences()
  }, [saveUserPreferences])

  // ========================
  // TOPIC MANAGEMENT
  // ========================

  const addTopic = async () => {
    if (!newTopic.title.trim() || !user) return

    try {
      const topicData = {
        ...newTopic,
        user_id: user.id,
        actual_hours: 0,
        is_archived: false,
        tags: newTopic.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("learning_topics")
        .insert([topicData])
        .select()
        .single()

      if (error) throw error

      const newTopicWithDefaults = {
        ...data,
        subtopics: [],
        resources: [],
        sessions: [],
        goals: [],
        progress: 0,
        last_studied: null,
        study_streak: 0
      }

      setTopics(prev => [newTopicWithDefaults, ...prev])
      resetTopicForm()
      setShowAddTopic(false)
    } catch (error) {
      console.error("Error adding topic:", error)
      setError("Failed to create topic. Please try again.")
    }
  }

  const updateTopic = async (topicId: string, updates: Partial<LearningTopic>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("learning_topics")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", topicId)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, ...data }
          : topic
      ))
    } catch (error) {
      console.error("Error updating topic:", error)
      setError("Failed to update topic. Please try again.")
    }
  }

  const deleteTopic = async (topicId: string) => {
    if (!user || !confirm("Are you sure you want to delete this topic? This action cannot be undone.")) return

    try {
      const { error } = await supabase
        .from("learning_topics")
        .delete()
        .eq("id", topicId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.filter(topic => topic.id !== topicId))
      setExpandedTopics(prev => {
        const newSet = new Set(prev)
        newSet.delete(topicId)
        return newSet
      })
    } catch (error) {
      console.error("Error deleting topic:", error)
      setError("Failed to delete topic. Please try again.")
    }
  }

  const toggleTopicFavorite = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId)
    if (!topic) return

    await updateTopic(topicId, { is_favorite: !topic.is_favorite })
  }

  const duplicateTopic = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId)
    if (!topic || !user) return

    try {
      const duplicatedTopic = {
        title: `${topic.title} (Copy)`,
        description: topic.description,
        category: topic.category,
        difficulty_level: topic.difficulty_level,
        priority: topic.priority,
        estimated_hours: topic.estimated_hours,
        color: topic.color,
        icon: topic.icon,
        tags: [...topic.tags],
        user_id: user.id,
        actual_hours: 0,
        is_archived: false,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: newTopic, error: topicError } = await supabase
        .from("learning_topics")
        .insert([duplicatedTopic])
        .select()
        .single()

      if (topicError) throw topicError

      // Duplicate subtopics
      if (topic.subtopics && topic.subtopics.length > 0) {
        const duplicatedSubtopics = topic.subtopics.map(subtopic => ({
          title: subtopic.title,
          description: subtopic.description,
          estimated_minutes: subtopic.estimated_minutes,
          difficulty_level: subtopic.difficulty_level,
          notes: subtopic.notes,
          order_index: subtopic.order_index,
          topic_id: newTopic.id,
          user_id: user.id,
          is_completed: false,
          actual_minutes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        const { error: subtopicsError } = await supabase
          .from("learning_subtopics")
          .insert(duplicatedSubtopics)

        if (subtopicsError) throw subtopicsError
      }

      await fetchTopics()
    } catch (error) {
      console.error("Error duplicating topic:", error)
      setError("Failed to duplicate topic. Please try again.")
    }
  }

  // ========================
  // SUBTOPIC MANAGEMENT
  // ========================

  const addSubtopic = async (topicId: string) => {
    if (!newSubtopic.title.trim() || !user) return

    try {
      const topic = topics.find(t => t.id === topicId)
      const orderIndex = topic?.subtopics?.length || 0

      const subtopicData = {
        ...newSubtopic,
        topic_id: topicId,
        user_id: user.id,
        order_index: orderIndex,
        is_completed: false,
        actual_minutes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("learning_subtopics")
        .insert([subtopicData])
        .select()
        .single()

      if (error) throw error

      setTopics(prev => prev.map(topic => 
        topic.id === topicId
          ? {
              ...topic,
              subtopics: [...(topic.subtopics || []), data],
              progress: calculateTopicProgress([...(topic.subtopics || []), data])
            }
          : topic
      ))

      resetSubtopicForm()
      setShowAddSubtopic(null)
    } catch (error) {
      console.error("Error adding subtopic:", error)
      setError("Failed to add subtopic. Please try again.")
    }
  }

  const toggleSubtopic = async (topicId: string, subtopicId: string, completed: boolean) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("learning_subtopics")
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", subtopicId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.map(topic => {
        if (topic.id !== topicId) return topic
        
        const updatedSubtopics = topic.subtopics?.map(sub => 
          sub.id === subtopicId
            ? {
                ...sub,
                is_completed: completed,
                completed_at: completed ? new Date().toISOString() : undefined
              }
            : sub
        ) || []

        return {
          ...topic,
          subtopics: updatedSubtopics,
          progress: calculateTopicProgress(updatedSubtopics)
        }
      }))
    } catch (error) {
      console.error("Error toggling subtopic:", error)
      setError("Failed to update subtopic. Please try again.")
    }
  }

  const updateSubtopic = async (subtopicId: string, updates: Partial<LearningSubtopic>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("learning_subtopics")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", subtopicId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.map(topic => ({
        ...topic,
        subtopics: topic.subtopics?.map(sub => 
          sub.id === subtopicId ? { ...sub, ...updates } : sub
        )
      })))
    } catch (error) {
      console.error("Error updating subtopic:", error)
      setError("Failed to update subtopic. Please try again.")
    }
  }

  const deleteSubtopic = async (topicId: string, subtopicId: string) => {
    if (!user || !confirm("Are you sure you want to delete this subtopic?")) return

    try {
      const { error } = await supabase
        .from("learning_subtopics")
        .delete()
        .eq("id", subtopicId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.map(topic => {
        if (topic.id !== topicId) return topic
        
        const updatedSubtopics = topic.subtopics?.filter(sub => sub.id !== subtopicId) || []
        return {
          ...topic,
          subtopics: updatedSubtopics,
          progress: calculateTopicProgress(updatedSubtopics)
        }
      }))
    } catch (error) {
      console.error("Error deleting subtopic:", error)
      setError("Failed to delete subtopic. Please try again.")
    }
  }

  const bulkImportSubtopics = async (topicId: string) => {
    if (!bulkSubtopics.trim() || !user) return

    try {
      const lines = bulkSubtopics.split('\n').map(line => line.trim()).filter(line => line)
      const topic = topics.find(t => t.id === topicId)
      let orderIndex = topic?.subtopics?.length || 0

      const subtopicsToAdd = lines.map(line => {
        // Parse format: "Title [difficulty] [minutes]" or just "Title"
        const match = line.match(/^(.+?)(?:\s*\[(\w+)\])?(?:\s*\[(\d+)(?:min|m)?\])?$/)
        const title = match?.[1]?.trim() || line
        const difficulty = match?.[2] || "Beginner"
        const minutes = parseInt(match?.[3] || "30")

        return {
          title,
          description: "",
          topic_id: topicId,
          user_id: user.id,
          order_index: orderIndex++,
          difficulty_level: ["Beginner", "Intermediate", "Advanced"].includes(difficulty) 
            ? difficulty as "Beginner" | "Intermediate" | "Advanced"
            : "Beginner",
          estimated_minutes: minutes,
          actual_minutes: 0,
          is_completed: false,
          notes: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })

      const { data, error } = await supabase
        .from("learning_subtopics")
        .insert(subtopicsToAdd)
        .select()

      if (error) throw error

      setTopics(prev => prev.map(topic => {
        if (topic.id !== topicId) return topic
        
        const updatedSubtopics = [...(topic.subtopics || []), ...data]
        return {
          ...topic,
          subtopics: updatedSubtopics,
          progress: calculateTopicProgress(updatedSubtopics)
        }
      }))

      setBulkSubtopics("")
      setShowBulkImport(null)
    } catch (error) {
      console.error("Error bulk importing subtopics:", error)
      setError("Failed to import subtopics. Please try again.")
    }
  }

  // ========================
  // RESOURCE MANAGEMENT
  // ========================

  const addResource = async (topicId: string, subtopicId?: string) => {
    if (!newResource.title.trim() || !user) return

    try {
      const resourceData = {
        ...newResource,
        topic_id: topicId,
        subtopic_id: subtopicId || null,
        user_id: user.id,
        is_completed: false,
        is_favorite: newResource.is_favorite || false,
        tags: newResource.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("learning_resources")
        .insert([resourceData])
        .select()
        .single()

      if (error) throw error

      setTopics(prev => prev.map(topic => 
        topic.id === topicId
          ? {
              ...topic,
              resources: [...(topic.resources || []), data]
            }
          : topic
      ))

      resetResourceForm()
      setShowAddResource(null)
    } catch (error) {
      console.error("Error adding resource:", error)
      setError("Failed to add resource. Please try again.")
    }
  }

  const updateResource = async (resourceId: string, updates: Partial<LearningResource>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("learning_resources")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", resourceId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.map(topic => ({
        ...topic,
        resources: topic.resources?.map(res => 
          res.id === resourceId ? { ...res, ...updates } : res
        )
      })))
    } catch (error) {
      console.error("Error updating resource:", error)
      setError("Failed to update resource. Please try again.")
    }
  }

  const deleteResource = async (resourceId: string) => {
    if (!user || !confirm("Are you sure you want to delete this resource?")) return

    try {
      const { error } = await supabase
        .from("learning_resources")
        .delete()
        .eq("id", resourceId)
        .eq("user_id", user.id)

      if (error) throw error

      setTopics(prev => prev.map(topic => ({
        ...topic,
        resources: topic.resources?.filter(res => res.id !== resourceId)
      })))
    } catch (error) {
      console.error("Error deleting resource:", error)
      setError("Failed to delete resource. Please try again.")
    }
  }

  // ========================
  // SESSION MANAGEMENT
  // ========================

  const startStudySession = async (topicId: string, subtopicId?: string) => {
    if (!user) return

    try {
      setActiveSession(topicId)
      setSessionStartTime(new Date())
      setSessionTimer(0)
      setSessionPaused(false)
      setSessionNotes("")
      
      // Update last studied timestamp
      await updateTopic(topicId, { 
        last_studied: new Date().toISOString().split('T')[0] 
      })
    } catch (error) {
      console.error("Error starting session:", error)
      setError("Failed to start study session.")
    }
  }

  const pauseStudySession = () => {
    setSessionPaused(true)
  }

  const resumeStudySession = () => {
    if (activeSession && sessionStartTime) {
      const pausedDuration = sessionTimer
      setSessionStartTime(new Date(Date.now() - pausedDuration * 1000))
      setSessionPaused(false)
    }
  }

  const endStudySession = async () => {
    if (!activeSession || !sessionStartTime || !user) return

    try {
      const endTime = new Date()
      const durationMinutes = Math.round(sessionTimer / 60)
      
      const sessionData = {
        ...newSession,
        topic_id: activeSession,
        user_id: user.id,
        session_date: new Date().toISOString().split('T')[0],
        start_time: sessionStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        notes: sessionNotes,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("learning_sessions")
        .insert([sessionData])
        .select()
        .single()

      if (error) throw error

      setSessions(prev => [data, ...prev])
      
      // Update topic's actual hours
      const topic = topics.find(t => t.id === activeSession)
      if (topic) {
        await updateTopic(activeSession, {
          actual_hours: (topic.actual_hours || 0) + (durationMinutes / 60)
        })
      }

      resetSessionState()
    } catch (error) {
      console.error("Error ending session:", error)
      setError("Failed to save study session.")
    }
  }

  const cancelStudySession = () => {
    if (confirm("Are you sure you want to cancel this study session?")) {
      resetSessionState()
    }
  }

  const resetSessionState = () => {
    setActiveSession(null)
    setSessionStartTime(null)
    setSessionTimer(0)
    setSessionPaused(false)
    setSessionNotes("")
    setNewSession({
      notes: "",
      focus_rating: 5,
      energy_level: 5,
      environment: "Home Office",
      distractions: 0,
      key_insights: "",
      challenges: ""
    })
  }

  // ========================
  // GOAL MANAGEMENT  
  // ========================

  const addGoal = async (topicId: string) => {
    if (!newGoal.title.trim() || !user) return

    try {
      const goalData = {
        ...newGoal,
        topic_id: topicId,
        user_id: user.id,
        current_value: 0,
        is_achieved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("learning_goals")
        .insert([goalData])
        .select()
        .single()

      if (error) throw error

      setGoals(prev => [data, ...prev])
      setTopics(prev => prev.map(topic => 
        topic.id === topicId
          ? {
              ...topic,
              goals: [...(topic.goals || []), data]
            }
          : topic
      ))

      resetGoalForm()
      setShowAddGoal(null)
    } catch (error) {
      console.error("Error adding goal:", error)
      setError("Failed to add goal. Please try again.")
    }
  }

  const updateGoal = async (goalId: string, updates: Partial<LearningGoal>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("learning_goals")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", goalId)
        .eq("user_id", user.id)

      if (error) throw error

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      ))
      
      setTopics(prev => prev.map(topic => ({
        ...topic,
        goals: topic.goals?.map(goal => 
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      })))
    } catch (error) {
      console.error("Error updating goal:", error)
      setError("Failed to update goal. Please try again.")
    }
  }

  const deleteGoal = async (goalId: string) => {
    if (!user || !confirm("Are you sure you want to delete this goal?")) return

    try {
      const { error } = await supabase
        .from("learning_goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", user.id)

      if (error) throw error

      setGoals(prev => prev.filter(goal => goal.id !== goalId))
      setTopics(prev => prev.map(topic => ({
        ...topic,
        goals: topic.goals?.filter(goal => goal.id !== goalId)
      })))
    } catch (error) {
      console.error("Error deleting goal:", error)
      setError("Failed to delete goal. Please try again.")
    }
  }

  // ========================
  // UTILITY FUNCTIONS
  // ========================

  const calculateTopicProgress = (subtopics: LearningSubtopic[]) => {
    if (subtopics.length === 0) return 0
    const completed = subtopics.filter(s => s.is_completed).length
    return (completed / subtopics.length) * 100
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  const updateAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let currentValue = 0
      
      switch (achievement.type) {
        case "completion":
          currentValue = studyStats.completedTopics
          break
        case "time":
          currentValue = studyStats.totalStudyTime
          break
        case "streak":
          currentValue = studyStats.studyStreak
          break
        case "exploration":
          currentValue = new Set(topics.map(t => t.category)).size
          break
        case "consistency":
          currentValue = studyStats.studyStreak
          break
      }

      const wasUnlocked = achievement.isUnlocked
      const isUnlocked = currentValue >= achievement.threshold

      return {
        ...achievement,
        currentValue,
        isUnlocked,
        unlockedAt: !wasUnlocked && isUnlocked ? new Date().toISOString() : achievement.unlockedAt
      }
    }))
  }

  const resetTopicForm = () => {
    setNewTopic({
      title: "",
      description: "",
      category: "Programming",
      difficulty_level: "Beginner",
      priority: "Medium",
      target_completion_date: "",
      estimated_hours: 10,
      color: "#6366f1",
      icon: "BookOpen",
      tags: [],
      is_favorite: false
    })
  }

  const resetSubtopicForm = () => {
    setNewSubtopic({
      title: "",
      description: "",
      estimated_minutes: 30,
      difficulty_level: "Beginner",
      notes: ""
    })
  }

  const resetResourceForm = () => {
    setNewResource({
      title: "",
      url: "",
      resource_type: "Article",
      description: "",
      notes: "",
      estimated_duration: 30,
      is_favorite: false,
      tags: []
    })
  }

  const resetGoalForm = () => {
    setNewGoal({
      title: "",
      description: "",
      target_date: "",
      target_value: 1,
      unit: "topics",
      priority: "Medium"
    })
  }

  const exportTopicsData = () => {
    const dataToExport = {
      topics: topics.map(topic => ({
        ...topic,
        subtopics: topic.subtopics,
        resources: topic.resources,
        goals: topic.goals
      })),
      sessions: sessions,
      goals: goals,
      achievements: achievements.filter(a => a.isUnlocked),
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `learning-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ========================
  // RENDER HELPERS
  // ========================

  const renderTopicCard = (topic: LearningTopic) => {
    const isExpanded = expandedTopics.has(topic.id)
    const isSelected = selectedTopics.has(topic.id)
    const hasActiveSession = activeSession === topic.id

    return (
      <GlassCard 
        key={topic.id} 
        className={cn(
          "p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative",
          isSelected && "ring-2 ring-indigo-500/50",
          hasActiveSession && "ring-2 ring-green-500/50 bg-green-50/30"
        )}
      >
        {/* Active Session Indicator */}
        {hasActiveSession && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active Session
            </div>
          </div>
        )}

        {/* Topic Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" onClick={() => toggleTopicExpansion(topic.id)}>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: topic.color }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-slate-800">{topic.title}</h3>
                  {topic.is_favorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    DIFFICULTY_COLORS[topic.difficulty_level]
                  )}>
                    {topic.difficulty_level}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    PRIORITY_COLORS[topic.priority]
                  )}>
                    {topic.priority} Priority
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {topic.category}
                  </span>
                </div>
              </div>
            </div>
            
            {topic.description && (
              <p className="text-sm text-slate-600 mb-3 ml-13">{topic.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 ml-13">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {topic.estimated_hours}h estimated
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {Math.round(topic.actual_hours || 0)}h completed
              </span>
              {topic.last_studied && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatTimeAgo(topic.last_studied)}
                </span>
              )}
              {topic.study_streak > 0 && (
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {topic.study_streak} day streak
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleTopicSelection(topic.id)
              }}
              className={cn(
                "p-2 rounded-lg transition-all",
                isSelected 
                  ? "bg-indigo-100 text-indigo-600" 
                  : "glass-button hover:scale-105"
              )}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            
            <div className="relative group">
              <button className="glass-button p-2 rounded-lg hover:scale-105 transition-all">
                <MoreVertical className="w-4 h-4 text-slate-600" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200/50 py-2 min-w-48 z-50 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTopic(topic.id)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Edit className="w-4 h-4" />
                  Edit Topic
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    duplicateTopic(topic.id)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleTopicFavorite(topic.id)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Star className={cn("w-4 h-4", topic.is_favorite && "fill-current text-yellow-500")} />
                  {topic.is_favorite ? "Remove Favorite" : "Add Favorite"}
                </button>
                <hr className="my-2 border-slate-100" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTopic(topic.id)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Topic
                </button>
              </div>
            </div>

            <button
              onClick={() => toggleTopicExpansion(topic.id)}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-600">{Math.round(topic.progress)}%</span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${topic.progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {!hasActiveSession ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                startStudySession(topic.id)
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Session
            </button>
          ) : (
            <div className="flex gap-2">
              {sessionPaused ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resumeStudySession()
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    pauseStudySession()
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  endStudySession()
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                End Session
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  cancelStudySession()
                }}
                className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAddSubtopic(showAddSubtopic === topic.id ? null : topic.id)
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Subtopic
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAddResource(showAddResource === topic.id ? null : topic.id)
            }}
            className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Add Resource
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAddGoal(showAddGoal === topic.id ? null : topic.id)
            }}
            className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Add Goal
          </button>
        </div>

        {/* Session Timer */}
        {hasActiveSession && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-lg font-mono font-semibold text-green-800">
                    {formatDuration(sessionTimer)}
                  </div>
                  <div className="text-xs text-green-600">
                    {sessionPaused ? "Paused" : "Active Session"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Session notes..."
                  className="text-sm bg-white/50 border border-green-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-slate-200/50">
            {/* Subtopics */}
            {topic.subtopics && topic.subtopics.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Subtopics ({topic.subtopics.filter(s => s.is_completed).length}/{topic.subtopics.length})
                  </h4>
                  <button
                    onClick={() => setShowBulkImport(showBulkImport === topic.id ? null : topic.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Bulk Import
                  </button>
                </div>
                <div className="grid gap-2">
                  {topic.subtopics.map((subtopic, index) => (
                    <div
                      key={subtopic.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        subtopic.is_completed 
                          ? "bg-green-50/50 border-green-200/50 text-green-800" 
                          : "bg-white/50 border-slate-200/50 hover:bg-slate-50/50"
                      )}
                    >
                      <button
                        onClick={() => toggleSubtopic(topic.id, subtopic.id, !subtopic.is_completed)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          subtopic.is_completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        {subtopic.is_completed && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium",
                            subtopic.is_completed && "line-through"
                          )}>
                            {subtopic.title}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            DIFFICULTY_COLORS[subtopic.difficulty_level]
                          )}>
                            {subtopic.difficulty_level}
                          </span>
                        </div>
                        {subtopic.description && (
                          <p className="text-sm text-slate-600 mt-1">{subtopic.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {subtopic.estimated_minutes}min estimated
                          </span>
                          {subtopic.actual_minutes > 0 && (
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {subtopic.actual_minutes}min actual
                            </span>
                          )}
                          {subtopic.completed_at && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed {formatTimeAgo(subtopic.completed_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSubtopic(subtopic.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteSubtopic(topic.id, subtopic.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {topic.resources && topic.resources.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Resources ({topic.resources.length})
                </h4>
                <div className="grid gap-2">
                  {topic.resources.map((resource) => {
                    const ResourceIcon = RESOURCE_TYPE_ICONS[resource.resource_type]
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-slate-200/50 hover:bg-slate-50/50 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <ResourceIcon className="w-4 h-4 text-slate-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{resource.title}</span>
                              {resource.is_favorite && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              )}
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                {resource.resource_type}
                              </span>
                              {resource.rating && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-3 h-3",
                                        i < resource.rating 
                                          ? "text-yellow-500 fill-current" 
                                          : "text-slate-300"
                                      )}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            {resource.description && (
                              <p className="text-sm text-slate-600 mt-1">{resource.description}</p>
                            )}
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                {resource.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => updateResource(resource.id, { 
                              is_completed: !resource.is_completed 
                            })}
                            className={cn(
                              "p-2 transition-colors",
                              resource.is_completed
                                ? "text-green-600"
                                : "text-slate-400 hover:text-green-600"
                            )}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteResource(resource.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Goals */}
            {topic.goals && topic.goals.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Goals ({topic.goals.filter(g => g.is_achieved).length}/{topic.goals.length})
                </h4>
                <div className="grid gap-2">
                  {topic.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        goal.is_achieved 
                          ? "bg-green-50/50 border-green-200/50" 
                          : "bg-white/50 border-slate-200/50"
                      )}
                    >
                      <button
                        onClick={() => updateGoal(goal.id, { 
                          is_achieved: !goal.is_achieved,
                          achieved_at: !goal.is_achieved ? new Date().toISOString() : undefined
                        })}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          goal.is_achieved
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        {goal.is_achieved && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium",
                            goal.is_achieved && "line-through text-green-800"
                          )}>
                            {goal.title}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            PRIORITY_COLORS[goal.priority]
                          )}>
                            {goal.priority}
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          {goal.target_value && goal.unit && (
                            <span>
                              Target: {goal.current_value || 0}/{goal.target_value} {goal.unit}
                            </span>
                          )}
                          {goal.target_date && (
                            <span>
                              Due: {new Date(goal.target_date).toLocaleDateString()}
                            </span>
                          )}
                          {goal.achieved_at && (
                            <span className="text-green-600">
                              Achieved {formatTimeAgo(goal.achieved_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            {topic.sessions && topic.sessions.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Sessions ({topic.sessions.length})
                </h4>
                <div className="space-y-2">
                  {topic.sessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-slate-200/50"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-800">
                            {new Date(session.session_date).toLocaleDateString()}
                          </span>
                          {session.duration_minutes && (
                            <span className="text-sm text-slate-600">
                              {Math.round(session.duration_minutes)}min
                            </span>
                          )}
                          {session.focus_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-slate-500">Focus:</span>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    i < session.focus_rating 
                                      ? "bg-indigo-500" 
                                      : "bg-slate-200"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {session.notes && (
                          <p className="text-xs text-slate-600 mt-1">{session.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Subtopic Form */}
        {showAddSubtopic === topic.id && (
          <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <h5 className="font-medium text-slate-800 mb-4">Add New Subtopic</h5>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newSubtopic.title}
                  onChange={(e) => setNewSubtopic({ ...newSubtopic, title: e.target.value })}
                  placeholder="Subtopic title..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newSubtopic.difficulty_level}
                  onChange={(e) => setNewSubtopic({ 
                    ...newSubtopic, 
                    difficulty_level: e.target.value as "Beginner" | "Intermediate" | "Advanced"
                  })}
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                
                <input
                  type="number"
                  value={newSubtopic.estimated_minutes}
                  onChange={(e) => setNewSubtopic({ 
                    ...newSubtopic, 
                    estimated_minutes: parseInt(e.target.value) 
                  })}
                  placeholder="Estimated minutes"
                  min="1"
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
              
              <textarea
                value={newSubtopic.description}
                onChange={(e) => setNewSubtopic({ ...newSubtopic, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => addSubtopic(topic.id)}
                  disabled={!newSubtopic.title.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Subtopic
                </button>
                <button
                  onClick={() => {
                    setShowAddSubtopic(null)
                    resetSubtopicForm()
                  }}
                  className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Import Form */}
        {showBulkImport === topic.id && (
          <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <h5 className="font-medium text-slate-800 mb-4">Bulk Import Subtopics</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter subtopics (one per line)
                </label>
                <textarea
                  value={bulkSubtopics}
                  onChange={(e) => setBulkSubtopics(e.target.value)}
                  placeholder="Example:
Learn React basics [Beginner] [60min]
Build first component [Intermediate] [90min]
Props and state management [Advanced] [120min]"
                  rows={6}
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Format: Title [Difficulty] [Minutes] - Difficulty and minutes are optional
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => bulkImportSubtopics(topic.id)}
                  disabled={!bulkSubtopics.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Subtopics
                </button>
                <button
                  onClick={() => {
                    setShowBulkImport(null)
                    setBulkSubtopics("")
                  }}
                  className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Resource Form */}
        {showAddResource === topic.id && (
          <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <h5 className="font-medium text-slate-800 mb-4">Add New Resource</h5>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="Resource title..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                
                <select
                  value={newResource.resource_type}
                  onChange={(e) => setNewResource({ 
                    ...newResource, 
                    resource_type: e.target.value as any
                  })}
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                >
                  <option value="Article">Article</option>
                  <option value="Video">Video</option>
                  <option value="Book">Book</option>
                  <option value="Course">Course</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Document">Document</option>
                  <option value="Tool">Tool</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="URL (optional)..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              
              <textarea
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => addResource(topic.id)}
                  disabled={!newResource.title.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Resource
                </button>
                <button
                  onClick={() => {
                    setShowAddResource(null)
                    resetResourceForm()
                  }}
                  className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Form */}
        {showAddGoal === topic.id && (
          <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <h5 className="font-medium text-slate-800 mb-4">Add New Goal</h5>
            <div className="space-y-4">
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Goal title..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    target_value: parseInt(e.target.value) 
                  })}
                  placeholder="Target value"
                  min="1"
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="Unit (e.g., topics, hours)"
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  className="p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
              
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => addGoal(topic.id)}
                  disabled={!newGoal.title.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setShowAddGoal(null)
                    resetGoalForm()
                  }}
                  className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    )
  }

  // ========================
  // MAIN RENDER
  // ========================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your learning journey...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <GlassCard className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={initializeComponent}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </GlassCard>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <GlassCard className="p-8 text-center max-w-md">
          <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Sign in to continue</h3>
          <p className="text-slate-600">Please sign in to access your learning hub and track your progress.</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section with Enhanced Stats */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Learning Hub</h2>
              <p className="text-slate-600">Master new skills with structured learning paths and intelligent progress tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={cn(
                "glass-button p-3 rounded-xl hover:scale-105 transition-all",
                showAnalytics && "bg-indigo-100/50"
              )}
              title="Analytics"
            >
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </button>
            
            <button
              onClick={() => setShowCalendarView(!showCalendarView)}
              className={cn(
                "glass-button p-3 rounded-xl hover:scale-105 transition-all",
                showCalendarView && "bg-indigo-100/50"
              )}
              title="Calendar View"
            >
              <CalendarIcon className="w-5 h-5 text-slate-600" />
            </button>
            
            <button
              onClick={exportTopicsData}
              className="glass-button p-3 rounded-xl hover:scale-105 transition-all"
              title="Export Data"
            >
              <Download className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={() => setShowAddTopic(!showAddTopic)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              New Topic
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">TOPICS</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{studyStats.totalTopics}</div>
            <div className="text-sm text-slate-600">
              {studyStats.completedTopics} completed
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100/50">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-600 font-medium">PROGRESS</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {Math.round(studyStats.completionRate)}%
            </div>
            <div className="text-sm text-slate-600">
              {studyStats.completedSubtopics}/{studyStats.totalSubtopics} items
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100/50">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-purple-600 font-medium">STUDY TIME</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {Math.round(studyStats.totalStudyTime / 60)}h
            </div>
            <div className="text-sm text-slate-600">
              {Math.round(studyStats.weeklyStudyTime / 60)}h this week
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100/50">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-orange-600 font-medium">STREAK</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{studyStats.studyStreak}</div>
            <div className="text-sm text-slate-600">
              Best: {studyStats.longestStreak} days
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100/50">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-yellow-600 font-medium">ACHIEVEMENTS</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-sm text-slate-600">
              of {achievements.length} unlocked
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100/50">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-teal-500" />
              <span className="text-xs text-teal-600 font-medium">FAVORITES</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{studyStats.favoriteTopics}</div>
            <div className="text-sm text-slate-600">
              {Math.round(studyStats.averageSessionLength)}m avg session
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        {weeklyGoal > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-800">Weekly Study Goal</h3>
              <span className="text-sm text-slate-600">
                {Math.round(studyStats.weeklyStudyTime / 60)}h / {weeklyGoal}h
              </span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(studyStats.weeklyGoalProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 mt-2">
              {studyStats.weeklyGoalProgress >= 100 
                ? "🎉 Goal achieved! Great work!" 
                : `${Math.round(100 - studyStats.weeklyGoalProgress)}% to go`}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, descriptions, or tags..."
              className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 text-slate-800 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="All">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="favorites">Favorites</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/60 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm"
              >
                <option value="created">Created</option>
                <option value="title">Title</option>
                <option value="progress">Progress</option>
                <option value="priority">Priority</option>
                <option value="recent">Recent Activity</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats and Bulk Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Showing {filteredTopics.length} of {topics.length} topics
            </span>
            {selectedTopics.size > 0 && (
              <span className="text-indigo-600 font-medium">
                {selectedTopics.size} selected
              </span>
            )}
          </div>

          {selectedTopics.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedTopics.forEach(topicId => {
                    const topic = topics.find(t => t.id === topicId)
                    if (topic) toggleTopicFavorite(topicId)
                  })
                  setSelectedTopics(new Set())
                }}
                className="glass-button px-3 py-2 rounded-lg hover:scale-105 transition-all text-sm flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Toggle Favorites
              </button>
              
              <button
                onClick={() => {
                  if (confirm(`Archive ${selectedTopics.size} selected topics?`)) {
                    selectedTopics.forEach(topicId => 
                      updateTopic(topicId, { is_archived: true })
                    )
                    setSelectedTopics(new Set())
                  }
                }}
                className="glass-button px-3 py-2 rounded-lg hover:scale-105 transition-all text-sm flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                Archive Selected
              </button>
              
              <button
                onClick={() => setSelectedTopics(new Set())}
                className="glass-button px-3 py-2 rounded-lg hover:scale-105 transition-all text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Calendar View */}
      {showCalendarView && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <CalendarFullIcon className="w-6 h-6" />
              Study Calendar
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedDate.getMonth()}
                onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), parseInt(e.target.value), 1))}
                className="px-3 py-2 bg-white/60 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i, 1).toLocaleDateString('en', { month: 'long' })}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDate.getFullYear()}
                onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedDate.getMonth(), 1))}
                className="px-3 py-2 bg-white/60 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - 6)
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
              const isToday = date.toDateString() === new Date().toDateString()
              const daysSessions = sessions.filter(s => s.session_date === date.toISOString().split('T')[0])
              const totalMinutes = daysSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
              
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square glass-button rounded-lg flex flex-col items-center justify-center text-sm hover:scale-105 transition-all cursor-pointer relative",
                    !isCurrentMonth && "opacity-50",
                    isToday && "ring-2 ring-indigo-500/50 bg-indigo-50",
                    totalMinutes > 0 && "bg-green-100 border-green-200"
                  )}
                >
                  <span className={cn("font-medium", isToday && "text-indigo-600")}>
                    {date.getDate()}
                  </span>
                  {totalMinutes > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {Math.round(totalMinutes)}m
                    </div>
                  )}
                  {totalMinutes > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {sessions.filter(s => new Date(s.session_date).getMonth() === selectedDate.getMonth()).length}
              </div>
              <div className="text-sm text-slate-600">Sessions This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(sessions
                  .filter(s => new Date(s.session_date).getMonth() === selectedDate.getMonth())
                  .reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 60
                )}h
              </div>
              <div className="text-sm text-slate-600">Study Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(sessions
                  .filter(s => new Date(s.session_date).getMonth() === selectedDate.getMonth())
                  .reduce((acc, s) => acc + (s.focus_rating || 0), 0) / 
                  Math.max(1, sessions.filter(s => new Date(s.session_date).getMonth() === selectedDate.getMonth()).length)
                )}
              </div>
              <div className="text-sm text-slate-600">Avg Focus Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(sessions
                  .filter(s => new Date(s.session_date).getMonth() === selectedDate.getMonth())
                  .map(s => s.session_date)
                ).size}
              </div>
              <div className="text-sm text-slate-600">Study Days</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Learning Analytics
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={analyticsTimeframe}
                onChange={(e) => setAnalyticsTimeframe(e.target.value as any)}
                className="px-3 py-2 bg-white/60 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Study Time Distribution */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                Study Distribution
              </h4>
              <div className="space-y-3">
                {CATEGORIES.slice(0, 5).map((category) => {
                  const categoryTopics = topics.filter(t => t.category === category)
                  const categoryTime = categoryTopics.reduce((acc, t) => acc + (t.actual_hours || 0), 0)
                  const percentage = studyStats.totalStudyTime > 0 ? (categoryTime * 60 / studyStats.totalStudyTime) * 100 : 0
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-12 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Progress Trends */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Progress Trends
              </h4>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Math.round(studyStats.completionRate)}%
                  </div>
                  <div className="text-sm text-slate-600">Overall Completion</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-slate-800">
                      {studyStats.completedTopics}
                    </div>
                    <div className="text-xs text-slate-600">Topics Done</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">
                      {studyStats.inProgressTopics}
                    </div>
                    <div className="text-xs text-slate-600">In Progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Habits */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                Study Habits
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Avg Session</span>
                  <span className="font-medium text-slate-800">
                    {Math.round(studyStats.averageSessionLength)}min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Weekly Hours</span>
                  <span className="font-medium text-slate-800">
                    {Math.round(studyStats.weeklyStudyTime / 60)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Study Streak</span>
                  <span className="font-medium text-slate-800">{studyStats.studyStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">Total Sessions</span>
                  <span className="font-medium text-slate-800">{studyStats.totalSessions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements ({achievements.filter(a => a.isUnlocked).length}/{achievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    achievement.isUnlocked
                      ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h5 className="font-medium text-slate-800">{achievement.title}</h5>
                      <p className="text-xs text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          achievement.isUnlocked ? "bg-yellow-500" : "bg-slate-400"
                        )}
                        style={{ 
                          width: `${Math.min((achievement.currentValue / achievement.threshold) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 ml-3">
                      {achievement.currentValue}/{achievement.threshold}
                    </span>
                  </div>
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="text-xs text-green-600 mt-2">
                      Unlocked {formatTimeAgo(achievement.unlockedAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Add Topic Form */}
      {showAddTopic && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create New Learning Topic
            </h3>
            <button
              onClick={() => setShowAddTopic(false)}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
            >
              <XCircle className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  placeholder="e.g., Master React Development"
                  className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={newTopic.category}
                  onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                  className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={newTopic.difficulty_level}
                    onChange={(e) => setNewTopic({ ...newTopic, difficulty_level: e.target.value as any })}
                    className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTopic.priority}
                    onChange={(e) => setNewTopic({ ...newTopic, priority: e.target.value as any })}
                    className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={newTopic.estimated_hours}
                    onChange={(e) => setNewTopic({ ...newTopic, estimated_hours: parseInt(e.target.value) })}
                    placeholder="20"
                    min="1"
                    className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Completion
                  </label>
                  <input
                    type="date"
                    value={newTopic.target_completion_date}
                    onChange={(e) => setNewTopic({ ...newTopic, target_completion_date: e.target.value })}
                    className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  placeholder="Describe what you'll learn in this topic..."
                  rows={4}
                  className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTopic.tags.join(', ')}
                  onChange={(e) => setNewTopic({ 
                    ...newTopic, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  })}
                  placeholder="react, javascript, frontend, components"
                  className="w-full p-3 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Theme
                  </label>
                  <input
                    type="color"
                    value={newTopic.color}
                    onChange={(e) => setNewTopic({ ...newTopic, color: e.target.value })}
                    className="w-full h-12 bg-white/60 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTopic.is_favorite}
                      onChange={(e) => setNewTopic({ ...newTopic, is_favorite: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Mark as Favorite
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200/50">
            <button
              onClick={addTopic}
              disabled={!newTopic.title.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Topic
            </button>
            
            <button
              onClick={() => {
                setShowAddTopic(false)
                resetTopicForm()
              }}
              className="glass-button px-8 py-3 rounded-xl hover:scale-105 transition-all font-medium"
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                resetTopicForm()
              }}
              className="glass-button px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium text-slate-600"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Reset Form
            </button>
          </div>
        </GlassCard>
      )}

      {/* Learning Topics Grid */}
      <div className="space-y-6">
        {filteredTopics.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {topics.length === 0 ? "No learning topics yet" : "No topics match your filters"}
            </h3>
            <p className="text-slate-600 mb-6">
              {topics.length === 0 
                ? "Create your first learning topic to start your educational journey!"
                : "Try adjusting your search or filters to find topics."
              }
            </p>
            {topics.length === 0 && (
              <button
                onClick={() => setShowAddTopic(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all font-medium shadow-lg"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Your First Topic
              </button>
            )}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTopics.map(renderTopicCard)}
          </div>
        )}
      </div>

      {/* Floating Action Button for Quick Add */}
      <button
        onClick={() => setShowAddTopic(!showAddTopic)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        title="Quick Add Topic"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-200 text-red-800 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
