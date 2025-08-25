"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { GlassCard } from "@/components/glass-card"
import { createClient } from "@/lib/supabase/client"
import {
  PenTool, Plus, Search, Target, Save, FileText, BookOpen, Users, Clock, 
  BarChart3, Calendar, Settings, Bookmark, Archive, Star, Filter, 
  Eye, EyeOff, Maximize, Minimize, Play, Pause, RotateCcw, Download,
  Upload, Share2, Copy, Trash2, Edit3, Type, AlignLeft, Bold, Italic,
  Underline, List, Hash, Quote, Link2, Image, Zap, Brain, Globe,
  Timer, TrendingUp, Award, Lightbulb, Music, Volume2, VolumeX,
  Moon, Sun, Palette, Keyboard, Wifi, WifiOff, CheckCircle, AlertCircle,
  RefreshCw, ChevronDown, ChevronRight, FolderPlus, Folder, SortAsc,
  Calendar as CalendarIcon, PieChart, LineChart, Database, Map,
  Compass, Camera, Mic, Tag, Flag, Heart, MessageSquare, GitBranch,
  History, FileDown, FilePlus, FolderOpen, X, MoreHorizontal,
  Layers, Scissors, Clipboard, Undo, Redo, AlignCenter, AlignRight,
  AlignJustify, Indent, Outdent, Strikethrough, Subscript, Superscript
} from "lucide-react"
import { cn } from "@/lib/utils"

// ========================
// INTERFACES & TYPES
// ========================

interface WritingEntry {
  id: string
  title: string
  content: string
  type: "novel" | "short-story" | "screenplay" | "poetry" | "journal" | "notes" | "article" | "blog" | "essay" | "research"
  status: "draft" | "review" | "editing" | "complete" | "published" | "archived"
  genre?: string
  mood?: string
  word_count: number
  character_count: number
  reading_time: number
  tags: string[]
  is_favorite: boolean
  is_private: boolean
  project_id?: string
  chapter_number?: number
  scene_number?: number
  target_words?: number
  deadline?: string
  last_edited: string
  version: number
  user_id: string
  created_at: string
  updated_at: string
  backup_versions?: WritingVersion[]
  characters?: Character[]
  locations?: Location[]
  research_notes?: ResearchNote[]
}

interface WritingVersion {
  id: string
  entry_id: string
  version_number: number
  title: string
  content: string
  word_count: number
  created_at: string
  notes?: string
}

interface WritingProject {
  id: string
  title: string
  description?: string
  type: "novel" | "series" | "collection" | "screenplay" | "other"
  status: "planning" | "writing" | "editing" | "complete"
  genre?: string
  target_words?: number
  current_words: number
  deadline?: string
  cover_image?: string
  tags: string[]
  user_id: string
  created_at: string
  updated_at: string
  entries?: WritingEntry[]
  characters?: Character[]
  locations?: Location[]
  timeline?: TimelineEvent[]
}

interface Character {
  id: string
  name: string
  role: "protagonist" | "antagonist" | "supporting" | "minor"
  age?: number
  description?: string
  backstory?: string
  personality_traits: string[]
  appearance?: string
  relationships: Relationship[]
  character_arc?: string
  notes?: string
  image_url?: string
  project_id?: string
  user_id: string
  created_at: string
}

interface Relationship {
  character_id: string
  character_name: string
  relationship_type: string
  description?: string
}

interface Location {
  id: string
  name: string
  type: "city" | "building" | "room" | "landscape" | "fictional" | "historical"
  description?: string
  significance?: string
  atmosphere?: string
  image_url?: string
  coordinates?: { lat: number, lng: number }
  project_id?: string
  user_id: string
  created_at: string
}

interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  type: "plot" | "character" | "world" | "historical"
  importance: "low" | "medium" | "high"
  project_id: string
  related_characters: string[]
  related_locations: string[]
  user_id: string
  created_at: string
}

interface ResearchNote {
  id: string
  title: string
  content: string
  source?: string
  url?: string
  tags: string[]
  entry_id?: string
  project_id?: string
  user_id: string
  created_at: string
}

interface WritingGoal {
  id: string
  title: string
  type: "daily" | "weekly" | "monthly" | "project" | "custom"
  target_words: number
  current_words: number
  target_time?: number // in minutes
  current_time?: number
  deadline?: string
  project_id?: string
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
}

interface WritingSession {
  id: string
  entry_id?: string
  project_id?: string
  start_time: string
  end_time?: string
  duration_minutes: number
  words_written: number
  session_type: "writing" | "editing" | "research" | "planning"
  mood_before?: string
  mood_after?: string
  productivity_rating?: number
  notes?: string
  user_id: string
  created_at: string
}

interface WritingStatistics {
  totalWords: number
  totalEntries: number
  totalSessions: number
  totalWritingTime: number
  avgWordsPerSession: number
  avgSessionLength: number
  currentStreak: number
  longestStreak: number
  wordsThisWeek: number
  wordsThisMonth: number
  wordsToday: number
  favoriteGenre: string
  mostProductiveTime: string
  weeklyGoalProgress: number
  monthlyGoalProgress: number
}

interface WritingPrompt {
  id: string
  title: string
  prompt: string
  genre?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "character" | "plot" | "setting" | "dialogue" | "theme"
  tags: string[]
  used: boolean
}

// ========================
// CONSTANTS
// ========================

const WRITING_TYPES = [
  { value: "novel", label: "Novel", icon: BookOpen },
  { value: "short-story", label: "Short Story", icon: FileText },
  { value: "screenplay", label: "Screenplay", icon: Edit3 },
  { value: "poetry", label: "Poetry", icon: Quote },
  { value: "journal", label: "Journal", icon: Calendar },
  { value: "notes", label: "Notes", icon: Bookmark },
  { value: "article", label: "Article", icon: Type },
  { value: "blog", label: "Blog Post", icon: Globe },
  { value: "essay", label: "Essay", icon: AlignLeft },
  { value: "research", label: "Research", icon: Database }
]

const GENRES = [
  "Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance", "Horror", 
  "Literary Fiction", "Historical Fiction", "Young Adult", "Children's",
  "Biography", "Memoir", "Self-Help", "Business", "Academic", "Technical",
  "Poetry", "Drama", "Comedy", "Adventure", "Crime", "Psychological",
  "Dystopian", "Steampunk", "Urban Fantasy", "Paranormal", "Western"
]

const MOODS = {
  inspired: { emoji: "✨", label: "Inspired" },
  focused: { emoji: "🎯", label: "Focused" },
  creative: { emoji: "🎨", label: "Creative" },
  contemplative: { emoji: "🤔", label: "Contemplative" },
  energetic: { emoji: "⚡", label: "Energetic" },
  melancholy: { emoji: "😔", label: "Melancholy" },
  hopeful: { emoji: "🌟", label: "Hopeful" },
  nostalgic: { emoji: "🍂", label: "Nostalgic" },
  anxious: { emoji: "😰", label: "Anxious" },
  excited: { emoji: "🎉", label: "Excited" },
  peaceful: { emoji: "🕊️", label: "Peaceful" },
  passionate: { emoji: "🔥", label: "Passionate" }
}

const WRITING_TEMPLATES = {
  novel: `Chapter 1

[Setting the scene]

[Introduce protagonist]

[Inciting incident]

[End with hook]`,
  "short-story": `Title: [Story Title]

Opening line that hooks the reader...

[Character introduction]
[Setting]
[Conflict]
[Rising action]
[Climax]
[Resolution]`,
  screenplay: `FADE IN:

EXT. [LOCATION] - [TIME]

[Scene description]

CHARACTER NAME
(emotional direction)
Dialogue goes here.

FADE OUT.`,
  poetry: `[Title]

Verse 1:
[First verse lines]

Verse 2:
[Second verse lines]

Chorus/Refrain:
[Repeating lines]`,
  journal: `[Date]

Dear Journal,

Today I feel...

What happened today:

What I'm thinking about:

Tomorrow I want to:

Gratitude:
- 
- 
- `,
  notes: `# [Topic/Title]

## Key Points:
- 
- 
- 

## Details:

## Questions:
- 
- 

## Action Items:
- [ ] 
- [ ] 
- [ ] `,
  article: `# [Article Title]

## Introduction
[Hook and thesis statement]

## Main Point 1
[Supporting details and examples]

## Main Point 2
[Supporting details and examples]

## Main Point 3
[Supporting details and examples]

## Conclusion
[Summarize and call to action]`,
  blog: `# [Blog Post Title]

[Engaging opening paragraph]

## The Problem/Question
[What are you addressing?]

## My Experience/Research
[Personal anecdotes or research]

## The Solution/Answer
[Your main content]

## Key Takeaways
- 
- 
- 

[Call to action]`,
  essay: `# [Essay Title]

## Introduction
[Thesis statement]

## Body Paragraph 1
[Main argument with evidence]

## Body Paragraph 2
[Supporting argument with evidence]

## Body Paragraph 3
[Additional support or counterargument]

## Conclusion
[Restate thesis and final thoughts]`,
  research: `# Research Notes: [Topic]

## Research Question:

## Sources:
1. 
2. 
3. 

## Key Findings:
- 
- 
- 

## Quotes & References:

## Analysis:

## Next Steps:
- 
- `
}

const AMBIENT_SOUNDS = [
  { name: "Rain", id: "rain", icon: "🌧️" },
  { name: "Forest", id: "forest", icon: "🌲" },
  { name: "Coffee Shop", id: "coffee", icon: "☕" },
  { name: "Ocean Waves", id: "ocean", icon: "🌊" },
  { name: "Fireplace", id: "fireplace", icon: "🔥" },
  { name: "Library", id: "library", icon: "📚" },
  { name: "City Traffic", id: "city", icon: "🚗" },
  { name: "Thunderstorm", id: "thunder", icon: "⛈️" }
]

const THEMES = [
  { name: "Light", id: "light", colors: { bg: "bg-slate-50", text: "text-slate-900" }},
  { name: "Dark", id: "dark", colors: { bg: "bg-slate-900", text: "text-slate-50" }},
  { name: "Sepia", id: "sepia", colors: { bg: "bg-amber-50", text: "text-amber-900" }},
  { name: "Forest", id: "forest", colors: { bg: "bg-green-50", text: "text-green-900" }},
  { name: "Ocean", id: "ocean", colors: { bg: "bg-blue-50", text: "text-blue-900" }},
]

// ========================
// MAIN COMPONENT
// ========================

export function WritingStudio() {
  // ========================
  // STATE MANAGEMENT
  // ========================
  
  // Core Data
  const [entries, setEntries] = useState<WritingEntry[]>([])
  const [projects, setProjects] = useState<WritingProject[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [goals, setGoals] = useState<WritingGoal[]>([])
  const [sessions, setSessions] = useState<WritingSession[]>([])
  const [prompts, setPrompts] = useState<WritingPrompt[]>([])
  
  // UI State
  const [activeEntry, setActiveEntry] = useState<WritingEntry | null>(null)
  const [activeProject, setActiveProject] = useState<WritingProject | null>(null)
  const [activeView, setActiveView] = useState<"entries" | "projects" | "characters" | "locations" | "goals" | "analytics" | "prompts">("entries")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [zenMode, setZenMode] = useState(false)
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Session Tracking
  const [currentSession, setCurrentSession] = useState<WritingSession | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [sessionWordCount, setSessionWordCount] = useState(0)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionPaused, setSessionPaused] = useState(false)
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title" | "words">("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Forms and Modals
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showCharacterModal, setShowCharacterModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  
  // Environment
  const [currentTheme, setCurrentTheme] = useState("light")
  const [ambientSound, setAmbientSound] = useState<string | null>(null)
  const [soundVolume, setSoundVolume] = useState(0.3)
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("Inter")
  const [lineHeight, setLineHeight] = useState(1.6)
  
  // System State
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [online, setOnline] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form States
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    type: "novel" as const,
    genre: "",
    mood: "",
    tags: [] as string[],
    tagInput: "",
    project_id: "",
    target_words: 1000,
    deadline: ""
  })

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    type: "novel" as const,
    genre: "",
    target_words: 80000,
    deadline: "",
    tags: [] as string[],
    tagInput: ""
  })

  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting" as const,
    age: "",
    description: "",
    backstory: "",
    personality_traits: [] as string[],
    appearance: "",
    character_arc: "",
    notes: "",
    project_id: ""
  })

  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "city" as const,
    description: "",
    significance: "",
    atmosphere: "",
    project_id: ""
  })

  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "daily" as const,
    target_words: 500,
    target_time: 60,
    deadline: "",
    project_id: ""
  })

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const sessionIntervalRef = useRef<NodeJS.Timeout>()
  
  // Supabase
  const supabase = createClient()

  // ========================
  // COMPUTED VALUES
  // ========================

  const statistics: WritingStatistics = useMemo(() => {
    const totalWords = entries.reduce((sum, entry) => sum + entry.word_count, 0)
    const totalSessions = sessions.length
    const totalWritingTime = sessions.reduce((sum, session) => sum + session.duration_minutes, 0)
    
    const today = new Date().toISOString().split('T')[0]
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const wordsToday = sessions
      .filter(s => s.created_at.split('T')[0] === today)
      .reduce((sum, s) => sum + s.words_written, 0)
    
    const wordsThisWeek = sessions
      .filter(s => new Date(s.created_at) >= thisWeek)
      .reduce((sum, s) => sum + s.words_written, 0)
    
    const wordsThisMonth = sessions
      .filter(s => new Date(s.created_at) >= thisMonth)
      .reduce((sum, s) => sum + s.words_written, 0)

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    // Implementation for streak calculation would go here

    return {
      totalWords,
      totalEntries: entries.length,
      totalSessions,
      totalWritingTime,
      avgWordsPerSession: totalSessions > 0 ? totalWords / totalSessions : 0,
      avgSessionLength: totalSessions > 0 ? totalWritingTime / totalSessions : 0,
      currentStreak,
      longestStreak,
      wordsThisWeek,
      wordsThisMonth,
      wordsToday,
      favoriteGenre: "Fantasy", // Would be calculated from entries
      mostProductiveTime: "Morning", // Would be calculated from sessions
      weeklyGoalProgress: 75, // Would be calculated from goals
      monthlyGoalProgress: 60 // Would be calculated from goals
    }
  }, [entries, sessions])

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = selectedType === "all" || entry.type === selectedType
      const matchesGenre = selectedGenre === "all" || entry.genre === selectedGenre
      const matchesStatus = selectedStatus === "all" || entry.status === selectedStatus
      
      return matchesSearch && matchesType && matchesGenre && matchesStatus
    }).sort((a, b) => {
      const aValue = a[sortBy === "updated" ? "updated_at" : sortBy === "created" ? "created_at" : sortBy === "words" ? "word_count" : "title"]
      const bValue = b[sortBy === "updated" ? "updated_at" : sortBy === "created" ? "created_at" : sortBy === "words" ? "word_count" : "title"]
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    })
  }, [entries, searchTerm, selectedType, selectedGenre, selectedStatus, sortBy, sortOrder])

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    initializeApp()
    checkOnlineStatus()
    loadUserPreferences()
  }, [])

  useEffect(() => {
    if (activeEntry?.content) {
      updateWordCount(activeEntry.content)
      if (autoSave && hasUnsavedChanges) {
        scheduleAutoSave()
      }
    }
  }, [activeEntry?.content, autoSave, hasUnsavedChanges])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSessionActive && !sessionPaused) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive, sessionPaused])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveCurrentEntry()
            break
          case 'n':
            e.preventDefault()
            setShowNewEntry(true)
            break
          case 'f':
            e.preventDefault()
            setFocusMode(!focusMode)
            break
          case 'k':
            e.preventDefault()
            // Focus search
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [focusMode])

  // ========================
  // INITIALIZATION & DATA FETCHING
  // ========================

  const initializeApp = async () => {
    try {
      setLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user) {
        setUser(user)
        await Promise.all([
          fetchEntries(user),
          fetchProjects(user),
          fetchCharacters(user),
          fetchLocations(user),
          fetchGoals(user),
          fetchSessions(user),
          fetchPrompts()
        ])
      }
    } catch (err) {
      console.error("Error initializing app:", err)
      setError("Failed to load writing studio")
    } finally {
      setLoading(false)
    }
  }

  const fetchEntries = async (user: any) => {
    const { data, error } = await supabase
      .from("writing_entries")
      .select(`
        *,
        backup_versions:writing_versions(*),
        characters:entry_characters(*),
        research_notes(*)
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error
    setEntries(data || [])
  }

  const fetchProjects = async (user: any) => {
    const { data, error } = await supabase
      .from("writing_projects")
      .select(`
        *,
        entries:writing_entries(id, title, word_count, status),
        characters(*),
        locations(*),
        timeline:timeline_events(*)
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error
    setProjects(data || [])
  }

  const fetchCharacters = async (user: any) => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    setCharacters(data || [])
  }

  const fetchLocations = async (user: any) => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    setLocations(data || [])
  }

  const fetchGoals = async (user: any) => {
    const { data, error } = await supabase
      .from("writing_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    setGoals(data || [])
  }

  const fetchSessions = async (user: any) => {
    const { data, error } = await supabase
      .from("writing_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error
    setSessions(data || [])
  }

  const fetchPrompts = async () => {
    // This could be from a local collection or external API
    setPrompts([
      {
        id: "1",
        title: "The Last Library",
        prompt: "In a world where books are banned, you discover the last secret library hidden beneath your city.",
        genre: "Dystopian",
        difficulty: "intermediate",
        type: "plot",
        tags: ["dystopian", "books", "rebellion"],
        used: false
      },
      {
        id: "2", 
        title: "Memory Merchant",
        prompt: "You can buy and sell memories. What memory would be worth a fortune?",
        genre: "Science Fiction",
        difficulty: "advanced",
        type: "character",
        tags: ["memory", "sci-fi", "trade"],
        used: false
      }
      // More prompts would be loaded here
    ])
  }

  // ========================
  // UTILITY FUNCTIONS
  // ========================

  const updateWordCount = (content: string) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0)
    const characters = content.length
    const readingTimeMinutes = Math.ceil(words.length / 200) // Average reading speed
    
    setWordCount(words.length)
    setCharacterCount(characters)
    setReadingTime(readingTimeMinutes)
  }

  const calculateSessionProgress = () => {
    if (!currentSession || !sessionStartTime) return 0
    const now = new Date()
    const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000)
    return elapsed
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

  const getReadingTime = (words: number) => {
    const minutes = Math.ceil(words / 200)
    return minutes < 60 ? `${minutes}min read` : `${Math.ceil(minutes / 60)}hr read`
  }

  const checkOnlineStatus = () => {
    setOnline(navigator.onLine)
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
  }

  const loadUserPreferences = () => {
    const preferences = localStorage.getItem('writing-studio-preferences')
    if (preferences) {
      const parsed = JSON.parse(preferences)
      setCurrentTheme(parsed.theme || 'light')
      setFontSize(parsed.fontSize || 16)
      setFontFamily(parsed.fontFamily || 'Inter')
      setLineHeight(parsed.lineHeight || 1.6)
      setAutoSave(parsed.autoSave !== false)
    }
  }

  const saveUserPreferences = () => {
    const preferences = {
      theme: currentTheme,
      fontSize,
      fontFamily,
      lineHeight,
      autoSave
    }
    localStorage.setItem('writing-studio-preferences', JSON.stringify(preferences))
  }

  // ========================
  // ENTRY MANAGEMENT
  // ========================

  const createNewEntry = async () => {
    if (!user || !newEntry.title.trim()) return

    try {
      setSaving(true)
      const template = WRITING_TEMPLATES[newEntry.type] || ""
      const content = newEntry.content || template
      
      const entryData = {
        title: newEntry.title.trim(),
        content,
        type: newEntry.type,
        status: "draft" as const,
        genre: newEntry.genre || null,
        mood: newEntry.mood || null,
        word_count: content.split(/\s+/).filter(w => w.length > 0).length,
        character_count: content.length,
        reading_time: Math.ceil(content.split(/\s+/).length / 200),
        tags: newEntry.tags,
        is_favorite: false,
        is_private: false,
        project_id: newEntry.project_id || null,
        target_words: newEntry.target_words,
        deadline: newEntry.deadline || null,
        version: 1,
        last_edited: new Date().toISOString(),
        user_id: user.id
      }

      const { data, error } = await supabase
        .from("writing_entries")
        .insert([entryData])
        .select()
        .single()

      if (error) throw error

      setEntries(prev => [data, ...prev])
      setActiveEntry(data)
      setShowNewEntry(false)
      resetNewEntryForm()
      
      // Start a writing session automatically
      startWritingSession(data.id)
      
    } catch (err) {
      console.error("Error creating entry:", err)
      setError("Failed to create new entry")
    } finally {
      setSaving(false)
    }
  }

  const saveCurrentEntry = async () => {
    if (!activeEntry || !user || saving) return

    try {
      setSaving(true)
      
      const updatedEntry = {
        ...activeEntry,
        word_count: wordCount,
        character_count: characterCount,
        reading_time: readingTime,
        last_edited: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Create version backup if significant changes
      if (wordCount > activeEntry.word_count + 100 || wordCount < activeEntry.word_count - 100) {
        await createVersionBackup(activeEntry)
      }

      const { data, error } = await supabase
        .from("writing_entries")
        .update(updatedEntry)
        .eq("id", activeEntry.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setActiveEntry(data)
      setEntries(prev => prev.map(entry => entry.id === data.id ? data : entry))
      setHasUnsavedChanges(false)
      
    } catch (err) {
      console.error("Error saving entry:", err)
      setError("Failed to save entry")
    } finally {
      setSaving(false)
    }
  }

  const createVersionBackup = async (entry: WritingEntry) => {
    const versionData = {
      entry_id: entry.id,
      version_number: entry.version,
      title: entry.title,
      content: entry.content,
      word_count: entry.word_count,
      notes: `Auto-backup created on ${new Date().toLocaleString()}`,
      user_id: user.id
    }

    await supabase
      .from("writing_versions")
      .insert([versionData])
  }

  const scheduleAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges && activeEntry) {
        saveCurrentEntry()
      }
    }, 3000) // Auto-save after 3 seconds of inactivity
  }

  const deleteEntry = async (entryId: string) => {
    if (!user || !confirm("Are you sure you want to delete this entry? This cannot be undone.")) return

    try {
      const { error } = await supabase
        .from("writing_entries")
        .delete()
        .eq("id", entryId)
        .eq("user_id", user.id)

      if (error) throw error

      setEntries(prev => prev.filter(entry => entry.id !== entryId))
      
      if (activeEntry?.id === entryId) {
        setActiveEntry(null)
      }
      
    } catch (err) {
      console.error("Error deleting entry:", err)
      setError("Failed to delete entry")
    }
  }

  // ========================
  // SESSION MANAGEMENT
  // ========================

  const startWritingSession = async (entryId?: string, projectId?: string) => {
    try {
      const sessionData = {
        entry_id: entryId || activeEntry?.id || null,
        project_id: projectId || activeProject?.id || null,
        start_time: new Date().toISOString(),
        session_type: "writing" as const,
        words_written: 0,
        duration_minutes: 0,
        user_id: user.id
      }

      const { data, error } = await supabase
        .from("writing_sessions")
        .insert([sessionData])
        .select()
        .single()

      if (error) throw error

      setCurrentSession(data)
      setSessionStartTime(new Date())
      setSessionWordCount(wordCount)
      setSessionTimer(0)
      setIsSessionActive(true)
      setSessionPaused(false)
      
    } catch (err) {
      console.error("Error starting session:", err)
      setError("Failed to start writing session")
    }
  }

  const pauseWritingSession = () => {
    setSessionPaused(true)
  }

  const resumeWritingSession = () => {
    setSessionPaused(false)
  }

  const endWritingSession = async () => {
    if (!currentSession || !sessionStartTime) return

    try {
      const endTime = new Date()
      const durationMinutes = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60)
      const wordsWritten = Math.max(0, wordCount - sessionWordCount)

      const { error } = await supabase
        .from("writing_sessions")
        .update({
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          words_written: wordsWritten
        })
        .eq("id", currentSession.id)

      if (error) throw error

      // Update goals progress
      await updateGoalProgress(wordsWritten, durationMinutes)

      setCurrentSession(null)
      setSessionStartTime(null)
      setIsSessionActive(false)
      setSessionTimer(0)
      
      // Refresh sessions list
      fetchSessions(user)
      
    } catch (err) {
      console.error("Error ending session:", err)
      setError("Failed to end writing session")
    }
  }

  const updateGoalProgress = async (wordsWritten: number, timeSpent: number) => {
    if (goals.length === 0) return

    try {
      const updates = goals.map(goal => ({
        id: goal.id,
        current_words: goal.current_words + wordsWritten,
        current_time: (goal.current_time || 0) + timeSpent
      }))

      await Promise.all(
        updates.map(update =>
          supabase
            .from("writing_goals")
            .update({
              current_words: update.current_words,
              current_time: update.current_time
            })
            .eq("id", update.id)
        )
      )

      // Refresh goals
      fetchGoals(user)
      
    } catch (err) {
      console.error("Error updating goal progress:", err)
    }
  }

  // ========================
  // PROJECT MANAGEMENT
  // ========================

  const createNewProject = async () => {
    if (!user || !newProject.title.trim()) return

    try {
      const projectData = {
        title: newProject.title.trim(),
        description: newProject.description,
        type: newProject.type,
        status: "planning" as const,
        genre: newProject.genre || null,
        target_words: newProject.target_words,
        current_words: 0,
        deadline: newProject.deadline || null,
        tags: newProject.tags,
        user_id: user.id
      }

      const { data, error } = await supabase
        .from("writing_projects")
        .insert([projectData])
        .select()
        .single()

      if (error) throw error

      setProjects(prev => [data, ...prev])
      setActiveProject(data)
      setShowNewProject(false)
      resetNewProjectForm()
      
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Failed to create new project")
    }
  }

  // ========================
  // FORM HELPERS
  // ========================

  const resetNewEntryForm = () => {
    setNewEntry({
      title: "",
      content: "",
      type: "novel",
      genre: "",
      mood: "",
      tags: [],
      tagInput: "",
      project_id: "",
      target_words: 1000,
      deadline: ""
    })
  }

  const resetNewProjectForm = () => {
    setNewProject({
      title: "",
      description: "",
      type: "novel",
      genre: "",
      target_words: 80000,
      deadline: "",
      tags: [],
      tagInput: ""
    })
  }

  const addTag = (form: "entry" | "project") => {
    if (form === "entry" && newEntry.tagInput.trim()) {
      const tag = newEntry.tagInput.trim()
      if (!newEntry.tags.includes(tag)) {
        setNewEntry(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
          tagInput: ""
        }))
      }
    } else if (form === "project" && newProject.tagInput.trim()) {
      const tag = newProject.tagInput.trim()
      if (!newProject.tags.includes(tag)) {
        setNewProject(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
          tagInput: ""
        }))
      }
    }
  }

  const removeTag = (form: "entry" | "project", tagToRemove: string) => {
    if (form === "entry") {
      setNewEntry(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }))
    } else {
      setNewProject(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }))
    }
  }

  // ========================
  // RENDER HELPERS
  // ========================

  const renderSidebar = () => (
    <div className={cn(
      "transition-all duration-300 border-r border-slate-200/50",
      sidebarCollapsed ? "w-16" : "w-80",
      focusMode && "hidden lg:block"
    )}>
      <div className="h-full bg-white/40 backdrop-blur-sm">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <PenTool className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-slate-800">Writing Studio</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Navigation Tabs */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "entries", label: "Entries", icon: FileText },
                  { id: "projects", label: "Projects", icon: FolderOpen },
                  { id: "characters", label: "Characters", icon: Users },
                  { id: "goals", label: "Goals", icon: Target }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={cn(
                      "flex items-center justify-center space-x-2 p-2 rounded-lg text-sm transition-all",
                      activeView === tab.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "glass-button hover:scale-105"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg glass-button focus:glass-active outline-none transition-all text-sm"
                />
              </div>

              {activeView === "entries" && (
                <div className="space-y-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 rounded-lg glass-button focus:glass-active outline-none transition-all text-sm"
                  >
                    <option value="all">All Types</option>
                    {WRITING_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 rounded-lg glass-button focus:glass-active outline-none transition-all text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="editing">Editing</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
              )}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-hidden">
              {activeView === "entries" && renderEntriesList()}
              {activeView === "projects" && renderProjectsList()}
              {activeView === "characters" && renderCharactersList()}
              {activeView === "goals" && renderGoalsList()}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-slate-200/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowNewEntry(true)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg hover:scale-105 transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  New Entry
                </button>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="flex-1 glass-button p-2 rounded-lg hover:scale-105 transition-all text-sm"
                >
                  <FolderPlus className="w-4 h-4 inline mr-1" />
                  Project
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const renderEntriesList = () => (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {filteredEntries.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">No entries found</p>
          <button
            onClick={() => setShowNewEntry(true)}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Create your first entry
          </button>
        </div>
      ) : (
        filteredEntries.map(entry => (
          <div
            key={entry.id}
            onClick={() => setActiveEntry(entry)}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-all border",
              activeEntry?.id === entry.id
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "glass-button hover:scale-[1.02] border-transparent"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-slate-800 truncate flex-1">{entry.title}</h3>
              <div className="flex items-center space-x-1 ml-2">
                {entry.is_favorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                {entry.is_private && <Eye className="w-3 h-3 text-slate-400" />}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="capitalize">{entry.type.replace('-', ' ')}</span>
              <span>{entry.word_count.toLocaleString()} words</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {entry.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && (
                  <span className="text-xs text-slate-400">+{entry.tags.length - 2}</span>
                )}
              </div>
              
              <span className={cn(
                "px-2 py-1 text-xs rounded",
                entry.status === "complete" && "bg-green-100 text-green-700",
                entry.status === "draft" && "bg-gray-100 text-gray-700",
                entry.status === "editing" && "bg-yellow-100 text-yellow-700",
                entry.status === "review" && "bg-blue-100 text-blue-700"
              )}>
                {entry.status}
              </span>
            </div>

            {entry.deadline && (
              <div className="mt-2 text-xs text-slate-500">
                <CalendarIcon className="w-3 h-3 inline mr-1" />
                Due: {new Date(entry.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderProjectsList = () => (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">No projects yet</p>
          <button
            onClick={() => setShowNewProject(true)}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Create your first project
          </button>
        </div>
      ) : (
        projects.map(project => (
          <div
            key={project.id}
            onClick={() => setActiveProject(project)}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-all border",
              activeProject?.id === project.id
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "glass-button hover:scale-[1.02] border-transparent"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-slate-800 truncate flex-1">{project.title}</h3>
              <span className="text-xs text-slate-500 capitalize ml-2">{project.type}</span>
            </div>
            
            {project.description && (
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{project.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{project.current_words.toLocaleString()} / {project.target_words?.toLocaleString()} words</span>
                <span>{Math.round((project.current_words / (project.target_words || 1)) * 100)}%</span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full transition-all"
                  style={{ width: `${Math.min((project.current_words / (project.target_words || 1)) * 100, 100)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className={cn(
                  "px-2 py-1 text-xs rounded",
                  project.status === "complete" && "bg-green-100 text-green-700",
                  project.status === "planning" && "bg-blue-100 text-blue-700",
                  project.status === "writing" && "bg-yellow-100 text-yellow-700",
                  project.status === "editing" && "bg-purple-100 text-purple-700"
                )}>
                  {project.status}
                </span>
                
                {project.entries && (
                  <span className="text-xs text-slate-500">
                    {project.entries.length} entries
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderCharactersList = () => (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {characters.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">No characters yet</p>
          <button
            onClick={() => setShowCharacterModal(true)}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Create your first character
          </button>
        </div>
      ) : (
        characters.map(character => (
          <div
            key={character.id}
            className="p-3 rounded-lg glass-button hover:scale-[1.02] transition-all border border-transparent"
          >
            <div className="flex items-start space-x-3">
              {character.image_url ? (
                <img 
                  src={character.image_url} 
                  alt={character.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 truncate">{character.name}</h3>
                {character.age && (
                  <p className="text-xs text-slate-500">Age {character.age}</p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded",
                    character.role === "protagonist" && "bg-green-100 text-green-700",
                    character.role === "antagonist" && "bg-red-100 text-red-700",
                    character.role === "supporting" && "bg-blue-100 text-blue-700",
                    character.role === "minor" && "bg-gray-100 text-gray-700"
                  )}>
                    {character.role}
                  </span>
                </div>
                
                {character.description && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{character.description}</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderGoalsList = () => (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">No goals set</p>
          <button
            onClick={() => setShowGoalModal(true)}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Set your first goal
          </button>
        </div>
      ) : (
        goals.map(goal => (
          <div
            key={goal.id}
            className="p-3 rounded-lg glass-button border border-transparent"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-800 truncate">{goal.title}</h3>
              <span className="text-xs text-slate-500 capitalize">{goal.type}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {goal.current_words.toLocaleString()} / {goal.target_words.toLocaleString()} words
                </span>
                <span className="font-medium text-slate-800">
                  {Math.round((goal.current_words / goal.target_words) * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((goal.current_words / goal.target_words) * 100, 100)}%` }}
                />
              </div>
              
              {goal.deadline && (
                <div className="text-xs text-slate-500">
                  <CalendarIcon className="w-3 h-3 inline mr-1" />
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderToolbar = () => (
    <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/60 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        {activeEntry && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 truncate max-w-xs">
              {activeEntry.title}
            </h2>
            
            <div className="flex items-center space-x-3 text-sm text-slate-500">
              <span>{wordCount.toLocaleString()} words</span>
              <span>•</span>
              <span>{characterCount.toLocaleString()} characters</span>
              <span>•</span>
              <span>{getReadingTime(wordCount)}</span>
            </div>

            {hasUnsavedChanges && (
              <div className="flex items-center text-sm text-amber-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                Unsaved changes
              </div>
            )}

            {saving && (
              <div className="flex items-center text-sm text-indigo-600">
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Saving...
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Session Controls */}
        {isSessionActive ? (
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">
              {formatDuration(sessionTimer)}
            </span>
            {sessionPaused ? (
              <button
                onClick={resumeWritingSession}
                className="text-green-700 hover:text-green-800"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={pauseWritingSession}
                className="text-green-700 hover:text-green-800"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={endWritingSession}
              className="text-green-700 hover:text-green-800"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        ) : activeEntry && (
          <button
            onClick={() => startWritingSession(activeEntry.id)}
            className="glass-button px-3 py-2 rounded-lg hover:scale-105 transition-all text-sm"
          >
            <Play className="w-4 h-4 inline mr-1" />
            Start Session
          </button>
        )}

        {/* Writing Tools */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={cn(
            "glass-button p-2 rounded-lg hover:scale-105 transition-all",
            focusMode && "bg-indigo-100"
          )}
          title="Focus Mode"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={() => setZenMode(!zenMode)}
          className={cn(
            "glass-button p-2 rounded-lg hover:scale-105 transition-all",
            zenMode && "bg-purple-100"
          )}
          title="Zen Mode"
        >
          <Moon className="w-4 h-4" />
        </button>

        {activeEntry && (
          <>
            <button
              onClick={saveCurrentEntry}
              disabled={saving || !hasUnsavedChanges}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowVersionHistory(true)}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              title="Version History"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={() => setShowSettingsModal(true)}
          className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderEditor = () => {
    if (!activeEntry) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <PenTool className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready to Write?</h3>
            <p className="text-slate-500 mb-6">Select an entry from the sidebar or create a new one to get started.</p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all font-medium"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create New Entry
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col">
        {/* Entry Header */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-start justify-between mb-4">
            <input
              type="text"
              value={activeEntry.title}
              onChange={(e) => {
                setActiveEntry({ ...activeEntry, title: e.target.value })
                setHasUnsavedChanges(true)
              }}
              className="text-2xl font-bold text-slate-800 bg-transparent outline-none flex-1 mr-4"
              placeholder="Entry title..."
            />
            
            <div className="flex items-center space-x-3">
              <select
                value={activeEntry.status}
                onChange={(e) => {
                  setActiveEntry({ ...activeEntry, status: e.target.value as any })
                  setHasUnsavedChanges(true)
                }}
                className="glass-button px-3 py-2 rounded-lg text-sm outline-none"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="editing">Editing</option>
                <option value="complete">Complete</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <button
                onClick={() => {
                  setActiveEntry({ ...activeEntry, is_favorite: !activeEntry.is_favorite })
                  setHasUnsavedChanges(true)
                }}
                className={cn(
                  "glass-button p-2 rounded-lg hover:scale-105 transition-all",
                  activeEntry.is_favorite && "text-yellow-500"
                )}
              >
                <Star className={cn("w-4 h-4", activeEntry.is_favorite && "fill-current")} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <select
              value={activeEntry.type}
              onChange={(e) => {
                setActiveEntry({ ...activeEntry, type: e.target.value as any })
                setHasUnsavedChanges(true)
              }}
              className="glass-button px-3 py-1 rounded-lg"
            >
              {WRITING_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {activeEntry.genre && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {activeEntry.genre}
              </span>
            )}

            {activeEntry.mood && (
              <div className="flex items-center space-x-1">
                <span>{MOODS[activeEntry.mood as keyof typeof MOODS]?.emoji}</span>
                <span className="text-slate-600">{MOODS[activeEntry.mood as keyof typeof MOODS]?.label}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {activeEntry.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            {activeEntry.target_words && (
              <div className="flex items-center space-x-2 text-slate-600">
                <Target className="w-4 h-4" />
                <span>{activeEntry.word_count}/{activeEntry.target_words} words</span>
                <div className="w-20 bg-slate-200 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((activeEntry.word_count / activeEntry.target_words) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <textarea
            ref={editorRef}
            value={activeEntry.content}
            onChange={(e) => {
              setActiveEntry({ ...activeEntry, content: e.target.value })
              setHasUnsavedChanges(true)
            }}
            className={cn(
              "w-full h-full p-4 rounded-lg glass-button focus:glass-active outline-none resize-none leading-relaxed",
              zenMode && "bg-transparent border-none shadow-none",
              `text-${fontSize}px font-${fontFamily}`
            )}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              lineHeight: lineHeight
            }}
            placeholder="Start writing your story..."
          />
        </div>
      </div>
    )
  }

  // ========================
  // MODAL COMPONENTS
  // ========================

  const renderNewEntryModal = () => (
    showNewEntry && (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Create New Entry</h2>
              <button
                onClick={() => setShowNewEntry(false)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    placeholder="Enter your story title..."
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => {
                        const type = e.target.value as keyof typeof WRITING_TEMPLATES
                        setNewEntry({
                          ...newEntry,
                          type,
                          content: WRITING_TEMPLATES[type] || ""
                        })
                      }}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    >
                      {WRITING_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Genre
                    </label>
                    <select
                      value={newEntry.genre}
                      onChange={(e) => setNewEntry({ ...newEntry, genre: e.target.value })}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    >
                      <option value="">Select genre...</option>
                      {GENRES.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mood
                    </label>
                    <select
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    >
                      <option value="">Select mood...</option>
                      {Object.entries(MOODS).map(([key, mood]) => (
                        <option key={key} value={key}>
                          {mood.emoji} {mood.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project
                    </label>
                    <select
                      value={newEntry.project_id}
                      onChange={(e) => setNewEntry({ ...newEntry, project_id: e.target.value })}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    >
                      <option value="">No project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Target Words
                    </label>
                    <input
                      type="number"
                      value={newEntry.target_words}
                      onChange={(e) => setNewEntry({ ...newEntry, target_words: parseInt(e.target.value) })}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={newEntry.deadline}
                      onChange={(e) => setNewEntry({ ...newEntry, deadline: e.target.value })}
                      className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newEntry.tagInput}
                      onChange={(e) => setNewEntry({ ...newEntry, tagInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag("entry")
                        }
                      }}
                      className="flex-1 p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                      placeholder="Add tags..."
                    />
                    <button
                      onClick={() => addTag("entry")}
                      className="glass-button px-4 py-3 rounded-lg hover:scale-105 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newEntry.tags.map(tag => (
                      <span
                        key={tag}
                        onClick={() => removeTag("entry", tag)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full cursor-pointer hover:bg-indigo-200 transition-colors"
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Content Preview */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content Preview
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    className="w-full h-80 p-3 rounded-lg glass-button focus:glass-active outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                    placeholder="Your content will appear here..."
                  />
                </div>

                <div className="text-sm text-slate-500">
                  {newEntry.content.split(/\s+/).filter(w => w.length > 0).length} words • {newEntry.content.length} characters
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200/50">
              <button
                onClick={() => setShowNewEntry(false)}
                className="flex-1 glass-button py-3 rounded-lg hover:scale-105 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createNewEntry}
                disabled={!newEntry.title.trim() || saving}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  )

  // ========================
  // MAIN RENDER
  // ========================

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-2 border-slate-300 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading Writing Studio</h2>
          <p className="text-slate-600">Preparing your creative workspace...</p>
        </GlassCard>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <PenTool className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Writing Studio</h2>
          <p className="text-slate-600 mb-6">Please sign in to access your personal writing workspace.</p>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all font-medium">
            Sign In
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className={cn(
      "h-screen flex overflow-hidden",
      zenMode && "bg-slate-900 text-slate-100",
      !online && "opacity-75"
    )}>
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {!zenMode && renderToolbar()}

        {/* Editor */}
        {renderEditor()}
      </div>

      {/* Modals */}
      {renderNewEntryModal()}

      {/* Online Status Indicator */}
      {!online && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-200 text-red-800 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
