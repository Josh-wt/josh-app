"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import {
  BookOpen,
  Plus,
  ChevronDown,
  Clock,
  Brain,
  Search,
  Edit,
  CalendarIcon,
  Flame,
  Trophy,
  Tag,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface LearningTopic {
  id: string
  title: string
  description?: string
  category: string
  difficulty_level: "Beginner" | "Intermediate" | "Advanced"
  priority: "Low" | "Medium" | "High"
  target_completion_date?: string
  estimated_hours: number
  color: string
  icon: string
  is_archived: boolean
  created_at: string
  subtopics?: LearningSubtopic[]
  resources?: LearningResource[]
  progress?: number
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
  created_at: string
}

interface LearningResource {
  id: string
  topic_id: string
  subtopic_id?: string
  title: string
  url?: string
  resource_type: "Article" | "Video" | "Book" | "Course" | "Podcast" | "Document" | "Other"
  notes?: string
  is_completed: boolean
  rating?: number
  created_at: string
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
  created_at: string
}

interface LearningGoal {
  id: string
  topic_id: string
  title: string
  description?: string
  target_date?: string
  is_achieved: boolean
  achieved_at?: string
  created_at: string
}

export function LearningCorner() {
  const [topics, setTopics] = useState<LearningTopic[]>([])
  const [sessions, setSessions] = useState<LearningSession[]>([])
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "topics" | "sessions" | "goals" | "analytics">("overview")
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [showAddSubtopic, setShowAddSubtopic] = useState<string | null>(null)
  const [showAddResource, setShowAddResource] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterDifficulty, setFilterDifficulty] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [showBulkImport, setShowBulkImport] = useState<string | null>(null)
  const [bulkSubtopics, setBulkSubtopics] = useState("")
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [studyStreak, setStudyStreak] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(10) // hours
  const [weeklyProgress, setWeeklyProgress] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [showResourceForm, setShowResourceForm] = useState<string | null>(null)
  const [showGoalForm, setShowGoalForm] = useState<string | null>(null)
  const [editingTopic, setEditingTopic] = useState<string | null>(null)

  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    category: "General",
    difficulty_level: "Beginner" as const,
    priority: "Medium" as const,
    target_completion_date: "",
    estimated_hours: 10,
    color: "#6366f1",
    icon: "BookOpen",
  })

  const [newSubtopic, setNewSubtopic] = useState({
    title: "",
    description: "",
    estimated_minutes: 30,
    difficulty_level: "Beginner" as const,
  })

  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    resource_type: "Article" as const,
    notes: "",
  })

  const [user, setUser] = useState<any>(null)
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchAllData(user)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchAllData = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      await Promise.all([fetchTopics(userToUse), fetchSessions(userToUse), fetchGoals(userToUse)])
    } catch (error) {
      console.error("Error fetching learning data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    const { data: topicsData, error: topicsError } = await supabase
      .from("learning_topics")
      .select("*")
      .eq("user_id", userToUse.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })

    if (topicsError) throw topicsError

    // Fetch subtopics and resources for each topic
    const topicsWithDetails = await Promise.all(
      (topicsData || []).map(async (topic) => {
        const [subtopicsResult, resourcesResult] = await Promise.all([
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
        ])

        const subtopics = subtopicsResult.data || []
        const resources = resourcesResult.data || []
        const completedSubtopics = subtopics.filter((s) => s.is_completed).length
        const progress = subtopics.length > 0 ? (completedSubtopics / subtopics.length) * 100 : 0

        return {
          ...topic,
          subtopics,
          resources,
          progress,
        }
      }),
    )

    setTopics(topicsWithDetails)
  }

  const fetchSessions = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    const { data, error } = await supabase
      .from("learning_sessions")
      .select("*")
      .eq("user_id", userToUse.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error
    setSessions(data || [])
  }

  const fetchGoals = async (currentUser?: any) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    const { data, error } = await supabase
      .from("learning_goals")
      .select("*")
      .eq("user_id", userToUse.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    setGoals(data || [])
  }

  const addTopic = async () => {
    if (!newTopic.title.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("learning_topics")
        .insert([{ ...newTopic, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setTopics((prev) => [{ ...data, subtopics: [], resources: [], progress: 0 }, ...prev])
      setNewTopic({
        title: "",
        description: "",
        category: "General",
        difficulty_level: "Beginner",
        priority: "Medium",
        target_completion_date: "",
        estimated_hours: 10,
        color: "#6366f1",
        icon: "BookOpen",
      })
      setShowAddTopic(false)
    } catch (error) {
      console.error("Error adding topic:", error)
    }
  }

  const addSubtopic = async (topicId: string) => {
    if (!newSubtopic.title.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("learning_subtopics")
        .insert([
          {
            ...newSubtopic,
            topic_id: topicId,
            user_id: user.id,
            order_index: topics.find((t) => t.id === topicId)?.subtopics?.length || 0,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                subtopics: [...(topic.subtopics || []), data],
                progress: calculateProgress([...(topic.subtopics || []), data]),
              }
            : topic,
        ),
      )

      setNewSubtopic({
        title: "",
        description: "",
        estimated_minutes: 30,
        difficulty_level: "Beginner",
      })
      setShowAddSubtopic(null)
    } catch (error) {
      console.error("Error adding subtopic:", error)
    }
  }

  const toggleSubtopic = async (topicId: string, subtopicId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("learning_subtopics")
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", subtopicId)

      if (error) throw error

      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                subtopics: topic.subtopics?.map((sub) =>
                  sub.id === subtopicId
                    ? {
                        ...sub,
                        is_completed: completed,
                        completed_at: completed ? new Date().toISOString() : undefined,
                      }
                    : sub,
                ),
                progress: calculateProgress(
                  topic.subtopics?.map((sub) => (sub.id === subtopicId ? { ...sub, is_completed: completed } : sub)) ||
                    [],
                ),
              }
            : topic,
        ),
      )
    } catch (error) {
      console.error("Error toggling subtopic:", error)
    }
  }

  const startStudySession = async (topicId: string, subtopicId?: string) => {
    setActiveSession(topicId)
    setSessionStartTime(new Date())
  }

  const endStudySession = async () => {
    if (!activeSession || !sessionStartTime || !user) return

    const endTime = new Date()
    const durationMinutes = Math.round((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60))

    try {
      const { error } = await supabase.from("learning_sessions").insert([
        {
          topic_id: activeSession,
          user_id: user.id,
          session_date: new Date().toISOString().split("T")[0],
          start_time: sessionStartTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          focus_rating: 4, // Default rating
        },
      ])

      if (error) throw error

      setActiveSession(null)
      setSessionStartTime(null)
      fetchSessions()
    } catch (error) {
      console.error("Error ending study session:", error)
    }
  }

  const calculateProgress = (subtopics: LearningSubtopic[]) => {
    if (subtopics.length === 0) return 0
    const completed = subtopics.filter((s) => s.is_completed).length
    return (completed / subtopics.length) * 100
  }

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-600 bg-green-100"
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100"
      case "Advanced":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const bulkImportSubtopics = async (topicId: string) => {
    if (!bulkSubtopics.trim() || !user) return

    try {
      const subtopicLines = bulkSubtopics
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const subtopicsToAdd = subtopicLines.map((line, index) => {
        // Parse format: "Title [difficulty] [minutes]" or just "Title"
        const match = line.match(/^(.+?)(?:\s*\[(\w+)\])?(?:\s*\[(\d+)(?:min|m)?\])?$/)
        const title = match?.[1]?.trim() || line
        const difficulty = match?.[2] || "Beginner"
        const minutes = Number.parseInt(match?.[3] || "30")

        return {
          title,
          topic_id: topicId,
          user_id: user.id,
          order_index: (topics.find((t) => t.id === topicId)?.subtopics?.length || 0) + index,
          difficulty_level: ["Beginner", "Intermediate", "Advanced"].includes(difficulty) ? difficulty : "Beginner",
          estimated_minutes: minutes,
          actual_minutes: 0,
          is_completed: false,
        }
      })

      const { data, error } = await supabase.from("learning_subtopics").insert(subtopicsToAdd).select()

      if (error) throw error

      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                subtopics: [...(topic.subtopics || []), ...data],
                progress: calculateProgress([...(topic.subtopics || []), ...data]),
              }
            : topic,
        ),
      )

      setBulkSubtopics("")
      setShowBulkImport(null)
    } catch (error) {
      console.error("Error bulk importing subtopics:", error)
    }
  }

  const getFilteredTopics = () => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "All" || topic.category === filterCategory
      const matchesDifficulty = filterDifficulty === "All" || topic.difficulty_level === filterDifficulty
      const matchesPriority = filterPriority === "All" || topic.priority === filterPriority

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPriority
    })
  }

  const getCalendarData = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const days = []

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const daysSessions = sessions.filter((s) => s.session_date === dateStr)
      const totalMinutes = daysSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

      days.push({
        date: new Date(d),
        sessions: daysSessions.length,
        minutes: totalMinutes,
        hasStudy: totalMinutes > 0,
      })
    }

    return days
  }

  const checkAchievements = () => {
    const newAchievements = []

    const totalTopics = topics.length
    const completedTopics = topics.filter((t) => t.progress === 100).length
    const totalSubtopics = topics.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0)
    const completedSubtopics = topics.reduce(
      (acc, topic) => acc + (topic.subtopics?.filter((s) => s.is_completed).length || 0),
      0,
    )
    const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0)

    if (completedTopics >= 1 && !achievements.includes("first-topic")) {
      newAchievements.push("first-topic")
    }
    if (completedSubtopics >= 10 && !achievements.includes("subtopic-master")) {
      newAchievements.push("subtopic-master")
    }
    if (totalStudyTime >= 600 && !achievements.includes("study-warrior")) {
      // 10 hours
      newAchievements.push("study-warrior")
    }
    if (studyStreak >= 7 && !achievements.includes("week-streak")) {
      newAchievements.push("week-streak")
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements])
    }
  }

  useEffect(() => {
    const totalTopics = topics.length
    const completedTopics = topics.filter((t) => t.progress === 100).length
    const totalSubtopics = topics.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0)
    const completedSubtopics = topics.reduce(
      (acc, topic) => acc + (topic.subtopics?.filter((s) => s.is_completed).length || 0),
      0,
    )
    const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0)
    checkAchievements()
  }, [topics, sessions, studyStreak])

  const totalTopics = topics.length
  const completedTopics = topics.filter((t) => t.progress === 100).length
  const totalSubtopics = topics.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0)
  const completedSubtopics = topics.reduce(
    (acc, topic) => acc + (topic.subtopics?.filter((s) => s.is_completed).length || 0),
    0,
  )
  const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0)
  const averageProgress = topics.length > 0 ? topics.reduce((acc, topic) => acc + topic.progress, 0) / topics.length : 0

  const filteredTopics = topics.filter((topic) => {
    const searchMatch = topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    const difficultyMatch = difficultyFilter === "" || topic.difficulty_level === difficultyFilter
    const statusMatch =
      statusFilter === "" ||
      (statusFilter === "completed" && topic.progress === 100) ||
      (statusFilter === "in-progress" && topic.progress > 0 && topic.progress < 100) ||
      (statusFilter === "not-started" && topic.progress === 0)
    return searchMatch && difficultyMatch && statusMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Enhanced Stats */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Learning Hub</h2>
              <p className="text-slate-600">Master new skills with structured learning paths</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendarView(!showCalendarView)}
              className={cn(
                "glass-button p-3 rounded-xl hover:scale-105 transition-all",
                showCalendarView && "bg-indigo-100/50",
              )}
            >
              <CalendarIcon className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => setShowAddTopic(!showAddTopic)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              New Topic
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">TOPICS</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{totalTopics}</div>
            <div className="text-sm text-slate-600">{completedTopics} completed</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100/50">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-600 font-medium">PROGRESS</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0}%
            </div>
            <div className="text-sm text-slate-600">
              {completedSubtopics}/{totalSubtopics} done
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100/50">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-purple-600 font-medium">TIME</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{Math.round(totalStudyTime / 60)}h</div>
            <div className="text-sm text-slate-600">{Math.round(weeklyProgress)}h this week</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100/50">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-orange-600 font-medium">STREAK</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{studyStreak}</div>
            <div className="text-sm text-slate-600">days in a row</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100/50">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-yellow-600 font-medium">BADGES</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{achievements.length}</div>
            <div className="text-sm text-slate-600">earned</div>
          </div>
        </div>
      </GlassCard>

      {/* Search and Filters Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learning topics..."
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option value="">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Calendar View */}
      {showCalendarView && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Study Calendar</h3>
            <div className="flex items-center gap-2">
              <button className="glass-button p-2 rounded-lg hover:scale-105 transition-all">
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square glass-button rounded-lg flex items-center justify-center text-sm hover:scale-105 transition-all cursor-pointer"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Add Topic Form */}
      {showAddTopic && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Create New Learning Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Topic Title</label>
              <input
                type="text"
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                placeholder="e.g., Master React Development"
                className="w-full p-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input
                type="text"
                value={newTopic.category}
                onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                placeholder="e.g., Programming, Design, Business"
                className="w-full p-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
              <select
                value={newTopic.difficulty_level}
                onChange={(e) => setNewTopic({ ...newTopic, difficulty_level: e.target.value })}
                className="w-full p-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Hours</label>
              <input
                type="number"
                value={newTopic.estimated_hours}
                onChange={(e) => setNewTopic({ ...newTopic, estimated_hours: Number.parseInt(e.target.value) })}
                placeholder="20"
                className="w-full p-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                placeholder="Describe what you'll learn in this topic..."
                rows={3}
                className="w-full p-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addTopic}
              disabled={!newTopic.title.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Topic
            </button>
            <button
              onClick={() => {
                setShowAddTopic(false)
                setNewTopic({
                  title: "",
                  description: "",
                  category: "",
                  difficulty_level: "Beginner",
                  estimated_hours: 10,
                })
              }}
              className="glass-button px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      )}

      {/* Learning Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <GlassCard key={topic.id} className="p-6 hover:scale-[1.02] transition-all duration-300">
            {/* Topic Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">{topic.title}</h3>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      topic.difficulty_level === "Beginner" && "bg-green-100 text-green-700",
                      topic.difficulty_level === "Intermediate" && "bg-yellow-100 text-yellow-700",
                      topic.difficulty_level === "Advanced" && "bg-red-100 text-red-700",
                    )}
                  >
                    {topic.difficulty_level}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{topic.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.estimated_hours}h estimated
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {topic.category}
                  </span>
                </div>
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
              <button
                onClick={() => setShowAddSubtopic(showAddSubtopic === topic.id ? null : topic.id)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Subtopic
              </button>
              <button
                onClick={() => {}}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm font-medium"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Edit Topic
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
