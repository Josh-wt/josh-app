"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import {
  StickyNote,
  Plus,
  Copy,
  Check,
  Edit3,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface SubNote {
  id: string
  note_id: string
  user_id: string
  title: string
  hidden_text: string
  order_index: number
  created_at: string
  updated_at: string
}

interface SuperNote {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
  sub_notes?: SubNote[]
}

export function SuperNotes() {
  const [superNotes, setSuperNotes] = useState<SuperNote[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showAddNote, setShowAddNote] = useState(false)
  const [editingNote, setEditingNote] = useState<SuperNote | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })
  const [newSubNote, setNewSubNote] = useState({
    title: "",
    hidden_text: "",
  })
  const [showSubNoteForm, setShowSubNoteForm] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleSubNotes, setVisibleSubNotes] = useState<Set<string>>(new Set())
  const [expandedNote, setExpandedNote] = useState<string | null>(null)

  const supabase = createClient()

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
        await fetchSuperNotes(user)
      }
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuperNotes = async (user: any) => {
    try {
      // Fetch notes with their sub-notes
      const { data: notes, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (notesError) throw notesError

      // Fetch sub-notes for each note
      const notesWithSubNotes = await Promise.all(
        (notes || []).map(async (note) => {
          const { data: subNotes, error: subNotesError } = await supabase
            .from("sub_notes")
            .select("*")
            .eq("note_id", note.id)
            .eq("user_id", user.id)
            .order("order_index", { ascending: true })

          if (subNotesError) throw subNotesError

          return {
            ...note,
            sub_notes: subNotes || [],
          }
        })
      )

      setSuperNotes(notesWithSubNotes)
    } catch (error) {
      console.error("Error fetching super notes:", error)
    }
  }

  const addSuperNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: newNote.title || "Untitled Super Note",
            content: newNote.content,
            tags: newNote.tags,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setSuperNotes((prev) => [{ ...data, sub_notes: [] }, ...prev])
      resetForm()
    } catch (error) {
      console.error("Error adding super note:", error)
    }
  }

  const updateSuperNote = async () => {
    if (!editingNote || !user) return

    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: newNote.title || "Untitled Super Note",
          content: newNote.content,
          tags: newNote.tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingNote.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setSuperNotes((prev) =>
        prev.map((note) => (note.id === editingNote.id ? { ...data, sub_notes: note.sub_notes || [] } : note))
      )
      resetForm()
    } catch (error) {
      console.error("Error updating super note:", error)
    }
  }

  const addSubNote = async () => {
    if (!newSubNote.title.trim() || !newSubNote.hidden_text.trim()) return
    if (!selectedNoteId || !user) return

    try {
      // Get the current max order_index for this note
      const { data: existingSubNotes } = await supabase
        .from("sub_notes")
        .select("order_index")
        .eq("note_id", selectedNoteId)
        .order("order_index", { ascending: false })
        .limit(1)

      const nextOrderIndex = existingSubNotes?.[0]?.order_index ? existingSubNotes[0].order_index + 1 : 0

      const { data, error } = await supabase
        .from("sub_notes")
        .insert([
          {
            note_id: selectedNoteId,
            user_id: user.id,
            title: newSubNote.title,
            hidden_text: newSubNote.hidden_text,
            order_index: nextOrderIndex,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update the super notes state
      setSuperNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNoteId
            ? { ...note, sub_notes: [...(note.sub_notes || []), data] }
            : note
        )
      )

      setNewSubNote({ title: "", hidden_text: "" })
      setShowSubNoteForm(false)
    } catch (error) {
      console.error("Error adding sub-note:", error)
    }
  }

  const deleteSubNote = async (subNoteId: string, noteId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("sub_notes")
        .delete()
        .eq("id", subNoteId)
        .eq("user_id", user.id)

      if (error) throw error

      setSuperNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, sub_notes: (note.sub_notes || []).filter((sn) => sn.id !== subNoteId) }
            : note
        )
      )
    } catch (error) {
      console.error("Error deleting sub-note:", error)
    }
  }

  const copyToClipboard = async (text: string, subNoteId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(subNoteId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const toggleSubNoteVisibility = (subNoteId: string) => {
    setVisibleSubNotes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(subNoteId)) {
        newSet.delete(subNoteId)
      } else {
        newSet.add(subNoteId)
      }
      return newSet
    })
  }

  const deleteSuperNote = async (noteId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId).eq("user_id", user.id)
      if (error) throw error
      setSuperNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting super note:", error)
    }
  }

  const toggleTag = (tag: string) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const startEditing = (note: SuperNote) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
    })
    setShowAddNote(true)
  }

  const resetForm = () => {
    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      tags: [],
    })
    setNewSubNote({ title: "", hidden_text: "" })
    setShowSubNoteForm(false)
    setSelectedNoteId(null)
  }

  const closeModal = () => {
    setShowAddNote(false)
    resetForm()
  }

  const filteredNotes = superNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => note.tags.includes(tag))

    return matchesSearch && matchesTags
  })

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
        <p className="text-slate-500">Sign in to access your super notes</p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center">
              <StickyNote className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Super Notes</h2>
              <p className="text-sm text-slate-600">Notes with clickable sub-notes for instant copying</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (showAddNote) {
                closeModal()
              } else {
                setEditingNote(null)
                resetForm()
                setShowAddNote(true)
              }
            }}
            className="glass-button p-3 rounded-xl hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 glass-button px-4 py-2 rounded-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search super notes..."
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
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "glass-button hover:scale-105",
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{superNotes.length}</div>
            <div className="text-sm text-slate-600">Super Notes</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {superNotes.reduce((sum, note) => sum + (note.sub_notes?.length || 0), 0)}
            </div>
            <div className="text-sm text-slate-600">Sub-Notes</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {superNotes.reduce((sum, note) => sum + note.tags.length, 0)}
            </div>
            <div className="text-sm text-slate-600">Tags</div>
          </div>
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {superNotes.reduce((sum, note) => sum + note.content.split(/\s+/).filter((word) => word.length > 0).length, 0)}
            </div>
            <div className="text-sm text-slate-600">Words</div>
          </div>
        </div>
      </GlassCard>

      {/* Add/Edit Super Note */}
      {showAddNote && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">
              {editingNote ? "Edit Super Note" : "Create New Super Note"}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter super note title..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your super note content here..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none resize-none text-slate-800 placeholder-slate-500"
                rows={6}
              />
            </div>

            {/* Tags */}
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
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "glass-button hover:scale-105",
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={editingNote ? updateSuperNote : addSuperNote}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:scale-105 transition-all font-medium"
              >
                {editingNote ? "Update Super Note" : "Save Super Note"}
              </button>

              <button
                onClick={closeModal}
                className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Add Sub-Note Form */}
      {showSubNoteForm && selectedNoteId && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Add Sub-Note</h3>
            <button
              onClick={() => {
                setShowSubNoteForm(false)
                setSelectedNoteId(null)
                setNewSubNote({ title: "", hidden_text: "" })
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Sub-Note Title</label>
              <input
                type="text"
                value={newSubNote.title}
                onChange={(e) => setNewSubNote((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter sub-note title (clickable)..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Hidden Text</label>
              <textarea
                value={newSubNote.hidden_text}
                onChange={(e) => setNewSubNote((prev) => ({ ...prev, hidden_text: e.target.value }))}
                placeholder="Enter text that will be copied when title is clicked..."
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none resize-none text-slate-800 placeholder-slate-500"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={addSubNote}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:scale-105 transition-all font-medium"
              >
                Add Sub-Note
              </button>

              <button
                onClick={() => {
                  setShowSubNoteForm(false)
                  setSelectedNoteId(null)
                  setNewSubNote({ title: "", hidden_text: "" })
                }}
                className="glass-button px-4 py-2 rounded-lg hover:scale-105 transition-all text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Full Screen Expanded Note */}
      {expandedNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {(() => {
              const note = superNotes.find(n => n.id === expandedNote)
              if (!note) return null
              
              return (
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">{note.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedNoteId(note.id)
                          setShowSubNoteForm(true)
                        }}
                        className="glass-button p-3 rounded-lg hover:scale-105 transition-all"
                        title="Add Sub-Note"
                      >
                        <Plus className="w-5 h-5 text-purple-500" />
                      </button>
                      <button
                        onClick={() => startEditing(note)}
                        className="glass-button p-3 rounded-lg hover:scale-105 transition-all"
                        title="Edit Super Note"
                      >
                        <Edit3 className="w-5 h-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => {
                          setExpandedNote(null)
                          deleteSuperNote(note.id)
                        }}
                        className="glass-button p-3 rounded-lg hover:scale-105 transition-all"
                        title="Delete Super Note"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                      <button
                        onClick={() => setExpandedNote(null)}
                        className="glass-button p-3 rounded-lg hover:scale-105 transition-all"
                        title="Close"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* Main Note Content */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3">Main Note</h3>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>

                    {/* Sub-Notes */}
                    {note.sub_notes && note.sub_notes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Sub-Notes</h3>
                        <div className="space-y-4">
                          {note.sub_notes.map((subNote) => (
                            <div key={subNote.id} className="border border-slate-200 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                                <button
                                  onClick={() => copyToClipboard(subNote.hidden_text, subNote.id)}
                                  className="flex-1 text-left font-semibold text-lg text-slate-800 hover:text-purple-600 transition-colors"
                                  title="Click to copy hidden text"
                                >
                                  {subNote.title}
                                </button>
                                <div className="flex items-center gap-3">
                                  {copiedId === subNote.id ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                      <Check className="w-5 h-5" />
                                      <span className="text-sm font-medium">Copied!</span>
                                    </div>
                                  ) : (
                                    <Copy className="w-5 h-5 text-slate-400 hover:text-purple-500 transition-colors" />
                                  )}
                                  <button
                                    onClick={() => toggleSubNoteVisibility(subNote.id)}
                                    className="p-2 hover:bg-slate-200 rounded transition-colors"
                                    title={visibleSubNotes.has(subNote.id) ? "Hide text" : "Show text"}
                                  >
                                    {visibleSubNotes.has(subNote.id) ? (
                                      <EyeOff className="w-5 h-5 text-slate-500" />
                                    ) : (
                                      <Eye className="w-5 h-5 text-slate-500" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => deleteSubNote(subNote.id, note.id)}
                                    className="p-2 hover:bg-red-100 rounded transition-colors"
                                    title="Delete Sub-Note"
                                  >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                              {visibleSubNotes.has(subNote.id) && (
                                <div className="p-4 bg-white">
                                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {subNote.hidden_text}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!note.sub_notes || note.sub_notes.length === 0) && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No sub-notes yet</h3>
                        <p className="text-slate-500 mb-4">Add your first sub-note to get started</p>
                        <button
                          onClick={() => {
                            setSelectedNoteId(note.id)
                            setShowSubNoteForm(true)
                          }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
                        >
                          Add Sub-Note
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Super Notes Display */}
      {filteredNotes.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Your Super Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <GlassCard 
                key={note.id} 
                className="p-6 hover:scale-[1.02] transition-all cursor-pointer group"
                onClick={() => setExpandedNote(note.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {note.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-3">{note.content}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-purple-100/50 rounded-full text-xs text-purple-700">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100/50 rounded-full text-xs text-slate-600">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Notes Preview */}
                {note.sub_notes && note.sub_notes.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-slate-700">Sub-Notes</h5>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {note.sub_notes.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {note.sub_notes.slice(0, 3).map((subNote) => (
                        <div
                          key={subNote.id}
                          className="flex items-center gap-2 p-2 glass-button rounded-lg"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(subNote.hidden_text, subNote.id)
                            }}
                            className="flex-1 text-left text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors truncate"
                            title="Click to copy hidden text"
                          >
                            {subNote.title}
                          </button>
                          {copiedId === subNote.id && (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                      {note.sub_notes.length > 3 && (
                        <div className="text-xs text-slate-500 text-center py-1">
                          +{note.sub_notes.length - 3} more sub-notes
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 text-center">
                    Click to open full view
                  </div>
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
          <h3 className="text-lg font-medium text-slate-600 mb-2">No super notes found</h3>
          <p className="text-slate-500">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Create your first super note to get started"}
          </p>
        </GlassCard>
      )}
    </div>
  )
}
