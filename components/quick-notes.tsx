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
  X,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  user_id: string
  created_at: string
  updated_at: string
  color?: string
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
  "learning",
  "goals",
  "notes"
]

const colorOptions = [
  { value: "bg-white", label: "White", color: "#ffffff" },
  { value: "bg-blue-50", label: "Blue", color: "#eff6ff" },
  { value: "bg-green-50", label: "Green", color: "#f0fdf4" },
  { value: "bg-yellow-50", label: "Yellow", color: "#fefce8" },
  { value: "bg-purple-50", label: "Purple", color: "#faf5ff" },
  { value: "bg-pink-50", label: "Pink", color: "#fdf2f8" },
  { value: "bg-orange-50", label: "Orange", color: "#fff7ed" },
  { value: "bg-red-50", label: "Red", color: "#fef2f2" }
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
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    color: "bg-white"
  })
  
  const supabase = createClient()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchNotes(user)
      } else {
        setLoading(false)
      }
    }
    getUser()

    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (editingNote) {
          setEditingNote({ ...editingNote, content: editingNote.content + ' ' + transcript })
        } else {
          setNewNote({ ...newNote, content: newNote.content + ' ' + transcript })
        }
      }
      
      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!newNote.title.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          tags: newNote.tags,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      setNotes((prev) => [data, ...prev])
      resetForm()
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const updateNote = async () => {
    if (!editingNote || !user) return

    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title.trim(),
          content: editingNote.content.trim(),
          tags: editingNote.tags
        })
        .eq("id", editingNote.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setNotes((prev) => prev.map(note => 
        note.id === editingNote.id ? data : note
      ))
      setEditingNote(null)
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const deleteNote = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setNotes((prev) => prev.filter(note => note.id !== id))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const toggleTag = (tag: string) => {
    if (editingNote) {
      setEditingNote({
        ...editingNote,
        tags: editingNote.tags.includes(tag)
          ? editingNote.tags.filter(t => t !== tag)
          : [...editingNote.tags, tag]
      })
    } else {
      setNewNote({
        ...newNote,
        tags: newNote.tags.includes(tag)
          ? newNote.tags.filter(t => t !== tag)
          : [...newNote.tags, tag]
      })
    }
  }

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const resetForm = () => {
    setNewNote({ title: "", content: "", tags: [], color: "bg-white" })
    setShowAddNote(false)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const activeNotes = filteredNotes.filter(note => !note.tags.includes('archived'))
  const archivedNotes = filteredNotes.filter(note => note.tags.includes('archived'))

  if (loading) {
    return (
      <div className="mobile-space-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <GlassCard key={i} className="mobile-card">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <GlassCard className="mobile-card text-center">
        <h3 className="mobile-subheading text-slate-600 mb-2">Please sign in</h3>
        <p className="mobile-body text-slate-500">Sign in to access your notes</p>
      </GlassCard>
    )
  }

  return (
    <div className="mobile-space-y">
      {/* Header */}
      <GlassCard className="mobile-card">
        <div className="mobile-flex-row justify-between mb-4">
          <div className="mobile-flex-row items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full flex items-center justify-center">
              <StickyNote className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="mobile-subheading text-slate-800">Quick Notes</h2>
              <p className="mobile-caption">Capture your thoughts instantly</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            className="glass-button px-3 sm:px-4 py-2 sm:py-3 rounded-lg mobile-flex-row gap-2 hover:scale-105 transition-all touch-target"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="mobile-text font-medium hidden sm:inline">New Note</span>
            <span className="mobile-text font-medium sm:hidden">New</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mobile-space-y">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-input pl-10"
            />
          </div>
          
          <div className="mobile-flex-row flex-wrap gap-2">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )
                }}
                className={cn(
                  "glass-button px-3 py-1 rounded-full mobile-text-xs transition-all touch-target-sm",
                  selectedTags.includes(tag)
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mobile-grid grid-cols-3 gap-3">
            <div className="glass-button p-3 rounded-lg text-center">
              <div className="mobile-text font-bold text-slate-800 mb-1">{activeNotes.length}</div>
              <div className="mobile-text-xs text-slate-600">Active</div>
            </div>
            <div className="glass-button p-3 rounded-lg text-center">
              <div className="mobile-text font-bold text-slate-800 mb-1">{archivedNotes.length}</div>
              <div className="mobile-text-xs text-slate-600">Archived</div>
            </div>
            <div className="glass-button p-3 rounded-lg text-center">
              <div className="mobile-text font-bold text-slate-800 mb-1">
                {notes.reduce((sum, note) => sum + note.content.split(' ').length, 0).toLocaleString()}
              </div>
              <div className="mobile-text-xs text-slate-600">Words</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Add/Edit Note Form */}
      {(showAddNote || editingNote) && (
        <GlassCard className="mobile-card">
          <div className="mobile-flex-row justify-between items-center mb-4">
            <h3 className="mobile-subheading text-slate-800">
              {editingNote ? "Edit Note" : "Add New Note"}
            </h3>
            <button
              onClick={() => {
                setShowAddNote(false)
                setEditingNote(null)
                resetForm()
              }}
              className="glass-button p-2 rounded-lg touch-target-sm"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="mobile-space-y">
            <div>
              <label className="mobile-text font-medium text-slate-700 mb-2 block">Title</label>
              <input
                type="text"
                value={editingNote?.title || newNote.title}
                onChange={(e) => editingNote 
                  ? setEditingNote({ ...editingNote, title: e.target.value })
                  : setNewNote({ ...newNote, title: e.target.value })
                }
                placeholder="Enter note title..."
                className="mobile-input"
              />
            </div>

            <div>
              <label className="mobile-text font-medium text-slate-700 mb-2 block">Content</label>
              <div className="relative">
                <textarea
                  value={editingNote?.content || newNote.content}
                  onChange={(e) => editingNote 
                    ? setEditingNote({ ...editingNote, content: e.target.value })
                    : setNewNote({ ...newNote, content: e.target.value })
                  }
                  placeholder="Enter note content..."
                  rows={6}
                  className="mobile-input resize-none pr-12"
                />
                <div className="absolute bottom-3 right-3 mobile-flex-row gap-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "glass-button p-2 rounded-lg touch-target-sm",
                      isRecording ? "bg-red-100 text-red-600" : "text-slate-600"
                    )}
                    title={isRecording ? "Stop recording" : "Start voice input"}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mobile-text font-medium text-slate-700 mb-2 block">Tags</label>
              <div className="mobile-flex-row flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "glass-button px-3 py-1 rounded-full mobile-text-xs transition-all touch-target-sm",
                      (editingNote?.tags || newNote.tags).includes(tag)
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mobile-text font-medium text-slate-700 mb-2 block">Color</label>
              <div className="mobile-flex-row flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => editingNote 
                      ? setEditingNote({ ...editingNote, color: color.value })
                      : setNewNote({ ...newNote, color: color.value })
                    }
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all touch-target-sm",
                      (editingNote?.color || newNote.color) === color.value 
                        ? "ring-2 ring-slate-400" 
                        : "border-slate-200"
                    )}
                    style={{ backgroundColor: color.color }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="mobile-flex-row gap-3">
              <button
                onClick={editingNote ? updateNote : addNote}
                className="mobile-btn-primary flex-1"
              >
                {editingNote ? "Update Note" : "Add Note"}
              </button>
              <button
                onClick={() => {
                  setShowAddNote(false)
                  setEditingNote(null)
                  resetForm()
                }}
                className="mobile-btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Notes Display */}
      {activeNotes.length > 0 && (
        <div className="mobile-space-y">
          <h3 className="mobile-subheading text-slate-800">Your Notes</h3>
          <div className="mobile-grid">
            {activeNotes.map((note) => (
              <GlassCard 
                key={note.id} 
                className={cn(
                  "mobile-card hover:scale-[1.02] transition-all group",
                  note.color || "bg-white"
                )}
              >
                <div className="mobile-flex-row justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="mobile-text font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors break-words">
                      {note.title}
                    </h4>
                    <p className="mobile-body text-slate-600 mb-3 line-clamp-4 break-words">
                      {note.content}
                    </p>
                    <div className="mobile-flex-row flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100/50 rounded-full mobile-text-xs text-blue-700">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100/50 rounded-full mobile-text-xs text-slate-600">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mobile-flex-row justify-between items-center pt-3 border-t border-slate-200">
                  <div className="mobile-text-xs text-slate-500">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                  <div className="mobile-flex-row gap-2">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="glass-button p-2 rounded-lg touch-target-sm"
                      title="Edit note"
                    >
                      <Edit3 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="glass-button p-2 rounded-lg touch-target-sm"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeNotes.length === 0 && (
        <GlassCard className="mobile-card text-center">
          <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
            <StickyNote className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="mobile-subheading text-slate-600 mb-2">No notes found</h3>
          <p className="mobile-body text-slate-500">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Create your first note to get started"}
          </p>
        </GlassCard>
      )}
    </div>
  )
}