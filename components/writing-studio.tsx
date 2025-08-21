"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { createClient } from "@/lib/supabase/client"
import { PenTool, Plus, Search, Target, Save, FileText } from "lucide-react"

interface WritingEntry {
  id: string
  title: string
  content: string
  type: "journal" | "story" | "notes" | "poem" | "article"
  mood?: string
  word_count: number
  tags: string[]
  is_favorite: boolean
  user_id: string
  created_at: string
  updated_at: string
}

interface WritingGoal {
  id: string
  title: string
  target_words: number
  current_words: number
  deadline: string
  user_id: string
}

export function WritingStudio() {
  const [entries, setEntries] = useState<WritingEntry[]>([])
  const [goals, setGoals] = useState<WritingGoal[]>([])
  const [activeEntry, setActiveEntry] = useState<WritingEntry | null>(null)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wordCount, setWordCount] = useState(0)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    type: "journal" as const,
    mood: "",
    tags: [] as string[],
    tagInput: "",
  })

  const supabase = createClient()

  const writingTemplates = {
    journal: "Today I feel...\n\nWhat happened:\n\nWhat I learned:\n\nTomorrow I want to:",
    story: "Once upon a time...\n\n[Setting the scene]\n\n[Main character]\n\n[Conflict]\n\n[Resolution]",
    notes: "Key Points:\n• \n• \n• \n\nDetails:\n\nAction Items:\n• \n• ",
    poem: "[Title]\n\nVerse 1:\n\n\nVerse 2:\n\n\nConclusion:",
    article:
      "# [Title]\n\n## Introduction\n\n## Main Points\n\n### Point 1\n\n### Point 2\n\n### Point 3\n\n## Conclusion",
  }

  const moodEmojis = {
    happy: "😊",
    excited: "🎉",
    calm: "😌",
    thoughtful: "🤔",
    creative: "✨",
    focused: "🎯",
    grateful: "🙏",
    inspired: "💡",
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (activeEntry) {
      const words = activeEntry.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
      setWordCount(words)
    }
  }, [activeEntry]) // Updated to use activeEntry instead of activeEntry?.content

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      fetchEntries(user)
      fetchGoals(user)
    } else {
      setLoading(false)
    }
  }

  const fetchEntries = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from("writing_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGoals = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from("writing_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  const saveEntry = async (entry: WritingEntry) => {
    if (!user) return

    try {
      const wordCount = entry.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length

      const { data, error } = await supabase
        .from("writing_entries")
        .upsert([
          {
            ...entry,
            word_count: wordCount,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error
      if (data) {
        setEntries((prev) => {
          const index = prev.findIndex((e) => e.id === entry.id)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = data[0]
            return updated
          } else {
            return [data[0], ...prev]
          }
        })
      }
    } catch (error) {
      console.error("Error saving entry:", error)
    }
  }

  const createNewEntry = async () => {
    if (!user || !newEntry.title) return

    try {
      const wordCount = newEntry.content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length

      const { data, error } = await supabase
        .from("writing_entries")
        .insert([
          {
            title: newEntry.title,
            content: newEntry.content,
            type: newEntry.type,
            mood: newEntry.mood,
            word_count: wordCount,
            tags: newEntry.tags,
            is_favorite: false,
            user_id: user.id,
          },
        ])
        .select()

      if (error) throw error
      if (data) {
        setEntries([data[0], ...entries])
        setActiveEntry(data[0])
        setNewEntry({
          title: "",
          content: "",
          type: "journal",
          mood: "",
          tags: [],
          tagInput: "",
        })
        setShowNewEntry(false)
      }
    } catch (error) {
      console.error("Error creating entry:", error)
    }
  }

  const addTag = () => {
    if (newEntry.tagInput.trim() && !newEntry.tags.includes(newEntry.tagInput.trim())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, newEntry.tagInput.trim()],
        tagInput: "",
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || entry.type === selectedType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading writing studio...</p>
      </GlassCard>
    )
  }

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <PenTool className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Please sign in</h2>
        <p className="text-slate-600">Sign in to access your writing studio</p>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Header */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <PenTool className="w-6 h-6 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">Writing Studio</h2>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="glass-button p-2 rounded-lg hover:glass-active transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-10 pr-4 py-2 rounded-lg glass-button focus:glass-active outline-none transition-all"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 rounded-lg glass-button focus:glass-active outline-none transition-all"
            >
              <option value="all">All Types</option>
              <option value="journal">Journal</option>
              <option value="story">Story</option>
              <option value="notes">Notes</option>
              <option value="poem">Poem</option>
              <option value="article">Article</option>
            </select>
          </div>
        </GlassCard>

        {/* Writing Goals */}
        {goals.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Writing Goals
            </h3>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="glass-button p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-800">{goal.title}</span>
                    <span className="text-sm text-slate-600">
                      {goal.current_words}/{goal.target_words}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((goal.current_words / goal.target_words) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Entries List */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Entries</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setActiveEntry(entry)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeEntry?.id === entry.id ? "glass-active" : "glass-button hover:glass-active"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800 truncate">{entry.title}</span>
                  <span className="text-xs text-slate-500 capitalize">{entry.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{entry.word_count} words</span>
                  {entry.mood && <span className="text-sm">{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Main Editor */}
      <div className="lg:col-span-2">
        {activeEntry ? (
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={activeEntry.title}
                onChange={(e) => setActiveEntry({ ...activeEntry, title: e.target.value })}
                className="text-2xl font-bold text-slate-800 bg-transparent outline-none flex-1 mr-4"
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">{wordCount} words</span>
                <button
                  onClick={() => saveEntry(activeEntry)}
                  className="glass-button p-2 rounded-lg hover:glass-active transition-all"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <select
                value={activeEntry.type}
                onChange={(e) => setActiveEntry({ ...activeEntry, type: e.target.value as any })}
                className="glass-button px-3 py-1 rounded-lg text-sm"
              >
                <option value="journal">Journal</option>
                <option value="story">Story</option>
                <option value="notes">Notes</option>
                <option value="poem">Poem</option>
                <option value="article">Article</option>
              </select>

              {activeEntry.mood && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Mood:</span>
                  <span>{moodEmojis[activeEntry.mood as keyof typeof moodEmojis]}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {activeEntry.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={activeEntry.content}
              onChange={(e) => setActiveEntry({ ...activeEntry, content: e.target.value })}
              className="w-full h-96 p-4 rounded-lg glass-button focus:glass-active outline-none resize-none font-mono text-slate-800 leading-relaxed"
              placeholder="Start writing..."
            />
          </GlassCard>
        ) : (
          <GlassCard className="p-8 text-center h-full flex items-center justify-center">
            <div>
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Select an entry to edit</h3>
              <p className="text-slate-600">Choose an entry from the sidebar or create a new one</p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Entry</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                  placeholder="Entry title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => {
                      const type = e.target.value as keyof typeof writingTemplates
                      setNewEntry({
                        ...newEntry,
                        type,
                        content: writingTemplates[type],
                      })
                    }}
                    className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                  >
                    <option value="journal">Journal</option>
                    <option value="story">Story</option>
                    <option value="notes">Notes</option>
                    <option value="poem">Poem</option>
                    <option value="article">Article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mood</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                    className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                  >
                    <option value="">Select mood</option>
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <option key={mood} value={mood}>
                        {emoji} {mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newEntry.tagInput}
                    onChange={(e) => setNewEntry({ ...newEntry, tagInput: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="flex-1 p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    placeholder="Add tags"
                  />
                  <button
                    onClick={addTag}
                    className="glass-button px-4 py-3 rounded-lg hover:glass-active transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newEntry.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="w-full h-64 p-3 rounded-lg glass-button focus:glass-active outline-none transition-all resize-none font-mono"
                  placeholder="Start writing..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewEntry(false)}
                className="flex-1 glass-button py-3 rounded-lg hover:glass-active transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createNewEntry}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Create Entry
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
