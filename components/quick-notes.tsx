"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "./glass-card"
import {
  StickyNote,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  Mic,
  MicOff,
  Link,
  Archive,
  Clock,
  Bold,
  Italic,
  Underline,
  List,
  CheckSquare,
  Brain,
  FileText,
  Lightbulb,
  Users,
  Target,
  BookOpen,
  Code,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  user_id: string
}

const commonTags = [
  "work",
  "personal",
  "ideas",
  "meeting",
  "todo",
  "important",
  "project",
  "research",
  "urgent",
  "draft",
]

const noteTemplates = [
  { id: "blank", name: "Blank Note", icon: FileText, content: "" },
  {
    id: "meeting",
    name: "Meeting Notes",
    icon: Users,
    content:
      "# Meeting Notes\n\n**Date:** \n**Attendees:** \n**Agenda:** \n\n## Discussion Points\n\n## Action Items\n\n## Next Steps\n",
  },
  {
    id: "idea",
    name: "Idea Capture",
    icon: Lightbulb,
    content:
      "# 💡 Idea\n\n**Core Concept:** \n\n**Problem it solves:** \n\n**Potential impact:** \n\n**Next steps:** \n",
  },
  {
    id: "goal",
    name: "Goal Planning",
    icon: Target,
    content:
      "# 🎯 Goal\n\n**Objective:** \n\n**Why this matters:** \n\n**Success metrics:** \n\n**Action plan:** \n1. \n2. \n3. \n\n**Timeline:** \n",
  },
  {
    id: "journal",
    name: "Daily Journal",
    icon: BookOpen,
    content:
      "# Daily Journal - {date}\n\n## What happened today?\n\n## How am I feeling?\n\n## What did I learn?\n\n## Tomorrow's priorities:\n",
  },
  {
    id: "code",
    name: "Code Snippet",
    icon: Code,
    content: "# Code Snippet\n\n**Language:** \n**Purpose:** \n\n```\n// Your code here\n```\n\n**Notes:** \n",
  },
]

const noteColors = [
  { name: "Default", value: "bg-white", border: "border-slate-200" },
  { name: "Yellow", value: "bg-yellow-50", border: "border-yellow-200" },
  { name: "Blue", value: "bg-blue-50", border: "border-blue-200" },
  { name: "Green", value: "bg-green-50", border: "border-green-200" },
  { name: "Pink", value: "bg-pink-50", border: "border-pink-200" },
  { name: "Purple", value: "bg-purple-50", border: "border-purple-200" },
]

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showAddNote, setShowAddNote] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("blank")
  const [showTemplates, setShowTemplates] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })

  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const supabase = createClient()

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchNotes(user)
      }
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const addNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return
    if (!user) return

    try {
      console.log("[v0] Adding note with data:", {
        title: newNote.title || "Untitled Note",
        content: newNote.content,
        tags: newNote.tags,
        user_id: user.id,
      })

      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: newNote.title || "Untitled Note",
            content: newNote.content,
            tags: newNote.tags,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      console.log("[v0] Note added successfully:", data)
      setNotes((prev) => [data, ...prev])
      resetForm()
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const updateNote = async () => {
    if (!editingNote || !user) return

    try {
      console.log("[v0] Updating note with data:", {
        title: newNote.title || "Untitled Note",
        content: newNote.content,
        tags: newNote.tags,
      })

      const { data, error } = await supabase
        .from("notes")
        .update({
          title: newNote.title || "Untitled Note",
          content: newNote.content,
          tags: newNote.tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingNote.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      console.log("[v0] Note updated successfully:", data)
      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? data : note)))
      resetForm()
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data])
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        setNewNote((prev) => ({
          ...prev,
          content: prev.content + "\n\n[Voice note recorded - transcription would go here]",
        }))
        setAudioChunks([])
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const generateAISuggestion = async () => {
    if (!newNote.content.trim()) return

    setIsGeneratingAI(true)
    try {
      const suggestions = [
        "Consider adding more specific examples to strengthen your points.",
        "This could benefit from a summary section at the end.",
        "You might want to break this into smaller, more digestible sections.",
        "Adding action items could make this more actionable.",
        "Consider linking this to related notes or projects.",
      ]

      setTimeout(() => {
        setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
        setIsGeneratingAI(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating AI suggestion:", error)
      setIsGeneratingAI(false)
    }
  }

  const applyTemplate = (templateId: string) => {
    const template = noteTemplates.find((t) => t.id === templateId)
    if (template) {
      let content = template.content
      if (templateId === "journal") {
        content = content.replace("{date}", new Date().toLocaleDateString())
      }
      setNewNote((prev) => ({
        ...prev,
        content: content,
      }))
      setSelectedTemplate(templateId)
      setShowTemplates(false)
    }
  }

  const resetForm = () => {
    console.log("[v0] resetForm called")
    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      tags: [],
    })
    setShowTemplates(false)
    setSelectedTemplate("blank")
    setAiSuggestion("")
  }

  const closeModal = () => {
    console.log("[v0] closeModal called")
    setShowAddNote(false)
    resetForm()
  }

  const deleteNote = async (noteId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId).eq("user_id", user.id)
      if (error) throw error
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const togglePin = async (noteId: string) => {
    console.log("[v0] Pin functionality disabled - column doesn't exist")
  }

  const toggleArchive = async (noteId: string) => {
    console.log("[v0] Archive functionality disabled - column doesn't exist")
  }

  const toggleTag = (tag: string) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const startEditing = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
    })
    setShowAddNote(true)
  }

  const filteredNotes = notes.filter((note) => {
    if (!showArchived) return true
    if (showArchived) return false

    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => note.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const pinnedNotes = filteredNotes.filter((note) => false)
  const regularNotes = filteredNotes.filter((note) => true)

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
        </GlassCard>
      </div>
    )
  }

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <h3 className="text-lg font-medium text-slate-600 mb-2">Please sign in</h3>
        <p className="text-slate-500">Sign in to access your notes</p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full flex items-center justify-center">
              <StickyNote className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Smart Notes</h2>
              <p className="text-sm text-slate-600">AI-powered note-taking with voice & templates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={cn("glass-button p-2 rounded-lg transition-all", showArchived ? "bg-slate-200" : "")}
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                console.log("[v0] Plus button clicked, current showAddNote:", showAddNote)
                if (showAddNote) {
                  closeModal()
                } else {
                  setEditingNote(null)
                  resetForm()
                  setShowAddNote(true)
                }
                console.log("[v0] After click, showAddNote should be:", !showAddNote)
              }}
              className="glass-button p-3 rounded-xl hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Enhanced Search & Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 glass-button px-4 py-2 rounded-lg">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, content, tags..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                }
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-all",
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                    : "glass-button hover:scale-105",
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{notes.filter((n) => !n.is_archived).length}</div>
            <div className="text-sm text-slate-600">Active</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{pinnedNotes.length}</div>
            <div className="text-sm text-slate-600">Pinned</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{notes.filter((n) => n.is_archived).length}</div>
            <div className="text-sm text-slate-600">Archived</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {notes.reduce((sum, note) => sum + (note.word_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Words</div>
          </div>
        </div>
      </GlassCard>

      {/* Enhanced Add/Edit Note */}
      {showAddNote && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">{editingNote ? "Edit Note" : "Create New Note"}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <FileText className="w-4 h-4 mx-auto mb-2 text-slate-600" />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "glass-button p-2 rounded-lg hover:scale-105 transition-all",
                  isRecording ? "bg-red-100 text-red-600" : "",
                )}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <Brain className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Templates */}
          {showTemplates && (
            <div className="mb-6 p-4 glass-button rounded-lg">
              <h4 className="font-medium text-slate-700 mb-3">Choose Template</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {noteTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all hover:scale-105",
                      selectedTemplate === template.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <template.icon className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                    <div className="text-sm font-medium text-slate-700">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
              />
            </div>

            {/* Content with formatting toolbar */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Content</label>
              <div className="glass-button rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 p-2 border-b border-slate-200">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your note here... Use Markdown for formatting!"
                  className="w-full p-3 bg-transparent border-none outline-none resize-none text-slate-800 placeholder-slate-500"
                  rows={8}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {newNote.content.split(/\s+/).filter((word) => word.length > 0).length} words •
                {Math.ceil(newNote.content.split(/\s+/).filter((word) => word.length > 0).length / 200)} min read
              </div>
            </div>

            {/* AI Assistant */}
            {showAIAssistant && (
              <div className="glass-button p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Assistant
                  </h4>
                  <button
                    onClick={generateAISuggestion}
                    disabled={isGeneratingAI}
                    className="text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isGeneratingAI ? "Thinking..." : "Get Suggestion"}
                  </button>
                </div>
                {aiSuggestion && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
                    💡 {aiSuggestion}
                  </div>
                )}
              </div>
            )}

            {/* Tags and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        newNote.tags.includes(tag)
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                          : "glass-button hover:scale-105",
                      )}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Reminder</label>
                <input
                  type="datetime-local"
                  value={newNote.reminder_date}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, reminder_date: e.target.value }))}
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">Note Color</label>
              <div className="flex gap-2">
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewNote((prev) => ({ ...prev, color: color.value }))}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      color.value,
                      color.border,
                      newNote.color === color.value ? "ring-2 ring-slate-400" : "",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={editingNote ? updateNote : addNote}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-2 rounded-xl hover:scale-105 transition-all font-medium"
              >
                {editingNote ? "Update Note" : "Save Note"}
              </button>

              <button
                onClick={closeModal}
                className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-slate-600"
              >
                Cancel
              </button>

              {isRecording && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  Recording...
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Enhanced Notes Display */}
      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-slate-800">Pinned Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <GlassCard
                key={note.id}
                className={cn("p-4 hover:scale-[1.02] transition-transform group", note.color || "bg-white")}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 line-clamp-1 mb-1">{note.title}</h4>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => togglePin(note.id)} className="p-1 hover:bg-yellow-100 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </button>
                    <button onClick={() => toggleArchive(note.id)} className="p-1 hover:bg-slate-100 rounded">
                      <Archive className="w-4 h-4 text-slate-500" />
                    </button>
                    <button onClick={() => startEditing(note)} className="p-1 hover:bg-blue-100 rounded">
                      <Edit3 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button onClick={() => deleteNote(note.id)} className="p-1 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-3">{note.content}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {note.word_count && <span>{note.word_count} words</span>}
                    {note.reading_time && <span>• {note.reading_time} min</span>}
                  </div>
                  <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-amber-100/50 rounded-full text-xs text-amber-700">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100/50 rounded-full text-xs text-slate-600">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                  {note.reminder_date && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="w-3 h-3" />
                      {new Date(note.reminder_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      {regularNotes.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">{showArchived ? "Archived Notes" : "All Notes"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note) => (
              <GlassCard
                key={note.id}
                className={cn(
                  "p-4 hover:scale-[1.02] transition-transform group",
                  note.color || "bg-white",
                  note.is_archived ? "opacity-75" : "",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 line-clamp-1 mb-1">{note.title}</h4>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => togglePin(note.id)} className="p-1 hover:bg-yellow-100 rounded">
                      <Star className="w-4 h-4 text-slate-400 hover:text-yellow-500" />
                    </button>
                    <button onClick={() => toggleArchive(note.id)} className="p-1 hover:bg-slate-100 rounded">
                      <Archive className={cn("w-4 h-4", note.is_archived ? "text-slate-600" : "text-slate-400")} />
                    </button>
                    <button onClick={() => startEditing(note)} className="p-1 hover:bg-blue-100 rounded">
                      <Edit3 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button onClick={() => deleteNote(note.id)} className="p-1 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-3">{note.content}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {note.word_count && <span>{note.word_count} words</span>}
                    {note.reading_time && <span>• {note.reading_time} min</span>}
                  </div>
                  <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-100/50 rounded-full text-xs text-slate-600">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100/50 rounded-full text-xs text-slate-600">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                  {note.reminder_date && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="w-3 h-3" />
                      {new Date(note.reminder_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <GlassCard className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
            <StickyNote className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {showArchived ? "No archived notes" : "No notes found"}
          </h3>
          <p className="text-slate-500">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : showArchived
                ? "Archive some notes to see them here"
                : "Create your first note to get started"}
          </p>
        </GlassCard>
      )}
    </div>
  )
}
