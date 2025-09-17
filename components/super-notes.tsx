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
  Layers,
  X,
  Search,
  Filter
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
    tags: [] as string[]
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
    "projects",
    "learning",
    "meetings",
    "goals",
    "research"
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchSuperNotes(user)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchSuperNotes = async (user: any) => {
    try {
      const { data: notes, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (notesError) throw notesError

      const notesWithSubNotes = await Promise.all(
        notes.map(async (note) => {
          const { data: subNotes, error: subNotesError } = await supabase
            .from("sub_notes")
            .select("*")
            .eq("note_id", note.id)
            .order("order_index", { ascending: true })

          if (subNotesError) throw subNotesError

          return {
            ...note,
            sub_notes: subNotes || []
          }
        })
      )

      setSuperNotes(notesWithSubNotes)
    } catch (error) {
      console.error("Error fetching super notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const addSuperNote = async () => {
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
          title: editingNote.title.trim(),
          content: editingNote.content.trim(),
          tags: editingNote.tags
        })
        .eq("id", editingNote.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setSuperNotes((prev) => prev.map(note => 
        note.id === editingNote.id ? { ...note, ...data } : note
      ))
      setEditingNote(null)
    } catch (error) {
      console.error("Error updating super note:", error)
    }
  }

  const deleteSuperNote = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setSuperNotes((prev) => prev.filter(note => note.id !== id))
    } catch (error) {
      console.error("Error deleting super note:", error)
    }
  }

  const addSubNote = async (noteId: string, title: string, hiddenText: string) => {
    if (!title.trim() || !hiddenText.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("sub_notes")
        .insert([{
          note_id: noteId,
          title: title.trim(),
          hidden_text: hiddenText.trim(),
          user_id: user.id,
          order_index: 0
        }])
        .select()
        .single()

      if (error) throw error

      setSuperNotes((prev) => prev.map(note => 
        note.id === noteId 
          ? { ...note, sub_notes: [...(note.sub_notes || []), data] }
          : note
      ))
    } catch (error) {
      console.error("Error adding sub-note:", error)
    }
  }

  const deleteSubNote = async (subNoteId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("sub_notes")
        .delete()
        .eq("id", subNoteId)
        .eq("user_id", user.id)

      if (error) throw error

      setSuperNotes((prev) => prev.map(note => ({
        ...note,
        sub_notes: note.sub_notes?.filter(sub => sub.id !== subNoteId) || []
      })))
    } catch (error) {
      console.error("Error deleting sub-note:", error)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const resetForm = () => {
    setNewNote({ title: "", content: "", tags: [] })
    setShowAddNote(false)
  }

  const toggleTag = (tag: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const filteredNotes = superNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags.includes(tag))
    return matchesSearch && matchesTags
  })

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
        <p className="mobile-body text-slate-500">Sign in to access your super notes</p>
      </GlassCard>
    )
  }

  return (
    <div className="mobile-space-y">
      {/* Header */}
      <GlassCard className="mobile-card">
        <div className="mobile-flex-row justify-between mb-4">
          <div className="mobile-flex-row items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="mobile-subheading text-slate-800">Super Notes</h2>
              <p className="mobile-caption">Create notes with clickable sub-notes</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            className="glass-button px-3 sm:px-4 py-2 sm:py-3 rounded-lg mobile-flex-row gap-2 hover:scale-105 transition-all touch-target"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="mobile-text font-medium hidden sm:inline">New Super Note</span>
            <span className="mobile-text font-medium sm:hidden">New</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mobile-space-y">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search super notes..."
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
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Add/Edit Note Form */}
      {(showAddNote || editingNote) && (
        <GlassCard className="mobile-card">
          <div className="mobile-flex-row justify-between items-center mb-4">
            <h3 className="mobile-subheading text-slate-800">
              {editingNote ? "Edit Super Note" : "Add New Super Note"}
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
              <textarea
                value={editingNote?.content || newNote.content}
                onChange={(e) => editingNote 
                  ? setEditingNote({ ...editingNote, content: e.target.value })
                  : setNewNote({ ...newNote, content: e.target.value })
                }
                placeholder="Enter note content..."
                rows={4}
                className="mobile-input resize-none"
              />
            </div>

            <div>
              <label className="mobile-text font-medium text-slate-700 mb-2 block">Tags</label>
              <div className="mobile-flex-row flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => editingNote 
                      ? setEditingNote({ 
                          ...editingNote, 
                          tags: editingNote.tags.includes(tag)
                            ? editingNote.tags.filter(t => t !== tag)
                            : [...editingNote.tags, tag]
                        })
                      : toggleTag(tag)
                    }
                    className={cn(
                      "glass-button px-3 py-1 rounded-full mobile-text-xs transition-all touch-target-sm",
                      (editingNote?.tags || newNote.tags).includes(tag)
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : "text-slate-600 hover:text-slate-800"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-flex-row gap-3">
              <button
                onClick={editingNote ? updateSuperNote : addSuperNote}
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

      {/* Super Notes Display */}
      {filteredNotes.length > 0 && (
        <div className="mobile-space-y">
          <h3 className="mobile-subheading text-slate-800">Your Super Notes</h3>
          <div className="mobile-grid">
            {filteredNotes.map((note) => (
              <GlassCard 
                key={note.id} 
                className="mobile-card hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div onClick={() => setExpandedNote(note.id)} className="h-full">
                  <div className="mobile-flex-row justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="mobile-text font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors break-words">
                        {note.title}
                      </h4>
                      <p className="mobile-text-xs text-slate-600 mb-3 line-clamp-3">{note.content}</p>
                      <div className="mobile-flex-row flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-purple-100/50 rounded-full mobile-text-xs text-purple-700">
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

                  {/* Sub-Notes Preview */}
                  {note.sub_notes && note.sub_notes.length > 0 && (
                    <div className="border-t border-slate-200 pt-3">
                      <div className="mobile-flex-row justify-between mb-3">
                        <h5 className="mobile-text-xs font-medium text-slate-700">Sub-Notes</h5>
                        <span className="mobile-text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {note.sub_notes.length}
                        </span>
                      </div>
                      <div className="mobile-space-y">
                        {note.sub_notes.slice(0, 3).map((subNote) => (
                          <div
                            key={subNote.id}
                            className="mobile-flex-row items-center gap-2 p-2 glass-button rounded-lg"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(subNote.hidden_text, subNote.id)
                              }}
                              className="flex-1 text-left mobile-text-xs font-medium text-slate-700 hover:text-purple-600 transition-colors truncate"
                              title="Click to copy hidden text"
                            >
                              {subNote.title}
                            </button>
                            {copiedId === subNote.id && (
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                        {note.sub_notes.length > 3 && (
                          <div className="mobile-text-xs text-slate-500 text-center">
                            +{note.sub_notes.length - 3} more sub-notes
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="mobile-text-xs text-slate-500 text-center">
                      Click to open full view
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <GlassCard className="mobile-card text-center">
          <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
            <StickyNote className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="mobile-subheading text-slate-600 mb-2">No super notes found</h3>
          <p className="mobile-body text-slate-500">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Create your first super note to get started"}
          </p>
        </GlassCard>
      )}

      {/* Full Screen Expanded Note */}
      {expandedNote && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
          onClick={() => setExpandedNote(null)}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const note = superNotes.find(n => n.id === expandedNote)
              if (!note) {
                return <div className="mobile-padding text-center text-red-500">Note not found!</div>
              }
              
              return (
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="mobile-flex-row justify-between mobile-padding border-b border-slate-200 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="mobile-heading text-slate-800 truncate">{note.title}</h2>
                      <p className="mobile-caption text-slate-600">{note.content}</p>
                    </div>
                    <div className="mobile-flex-row gap-2 ml-4">
                      <button
                        onClick={() => deleteSuperNote(note.id)}
                        className="glass-button p-2 sm:p-3 rounded-lg hover:scale-105 transition-all touch-target-sm"
                        title="Delete Super Note"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </button>
                      <button
                        onClick={() => {
                          setExpandedNote(null)
                        }}
                        className="glass-button p-2 sm:p-3 rounded-lg hover:scale-105 transition-all touch-target-sm"
                        title="Close"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto mobile-padding min-h-0 max-h-full">
                    <div className="space-y-4 pb-4">
                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div>
                          <h3 className="mobile-text font-medium text-slate-700 mb-2">Tags</h3>
                          <div className="mobile-flex-row flex-wrap gap-2">
                            {note.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-purple-100/50 rounded-full mobile-text-xs text-purple-700">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Test content to make it scrollable */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-800">Test Content for Scrolling</h3>
                        {Array.from({ length: 20 }, (_, i) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-medium text-slate-700">Test Item {i + 1}</h4>
                            <p className="text-sm text-slate-600">This is test content to make the modal scrollable. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </div>
                        ))}
                      </div>

                      {/* Sub-Notes */}
                      <div>
                        <div className="mobile-flex-row justify-between items-center mb-4">
                          <h3 className="mobile-subheading text-slate-800">Sub-Notes</h3>
                          <button
                            onClick={() => {
                              setSelectedNoteId(note.id)
                              setShowSubNoteForm(true)
                            }}
                            className="glass-button px-3 py-2 rounded-lg mobile-flex-row gap-2 hover:scale-105 transition-all touch-target"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="mobile-text font-medium">Add Sub-Note</span>
                          </button>
                        </div>

                        {note.sub_notes && note.sub_notes.length > 0 ? (
                          <div className="space-y-4">
                            {note.sub_notes.map((subNote) => (
                              <div key={subNote.id} className="glass-button p-4 rounded-lg">
                                <div className="mobile-flex-row justify-between items-start mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="mobile-text font-semibold text-slate-800 mb-2 break-words">
                                      {subNote.title}
                                    </h4>
                                    <p className="mobile-body text-slate-600 break-words">
                                      {subNote.hidden_text}
                                    </p>
                                  </div>
                                  <div className="mobile-flex-row gap-2 ml-4">
                                    <button
                                      onClick={() => copyToClipboard(subNote.hidden_text, subNote.id)}
                                      className="glass-button p-2 rounded-lg touch-target-sm"
                                      title="Copy to clipboard"
                                    >
                                      {copiedId === subNote.id ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Copy className="w-4 h-4 text-slate-600" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => deleteSubNote(subNote.id)}
                                      className="glass-button p-2 rounded-lg touch-target-sm"
                                      title="Delete sub-note"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-slate-400" />
                            </div>
                            <h4 className="mobile-text font-medium text-slate-600 mb-2">No sub-notes yet</h4>
                            <p className="mobile-caption text-slate-500">Add your first sub-note to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Add Sub-Note Form */}
      {showSubNoteForm && selectedNoteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="mobile-padding">
              <div className="mobile-flex-row justify-between items-center mb-4">
                <h3 className="mobile-subheading text-slate-800">Add Sub-Note</h3>
                <button
                  onClick={() => {
                    setShowSubNoteForm(false)
                    setSelectedNoteId(null)
                  }}
                  className="glass-button p-2 rounded-lg touch-target-sm"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const title = formData.get('title') as string
                const hiddenText = formData.get('hiddenText') as string
                
                if (title && hiddenText) {
                  addSubNote(selectedNoteId, title, hiddenText)
                  setShowSubNoteForm(false)
                  setSelectedNoteId(null)
                }
              }} className="mobile-space-y">
                <div>
                  <label className="mobile-text font-medium text-slate-700 mb-2 block">Title</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Enter sub-note title..."
                    className="mobile-input"
                    required
                  />
                </div>

                <div>
                  <label className="mobile-text font-medium text-slate-700 mb-2 block">Hidden Text</label>
                  <textarea
                    name="hiddenText"
                    placeholder="Enter the text that will be copied when clicked..."
                    rows={4}
                    className="mobile-input resize-none"
                    required
                  />
                </div>

                <div className="mobile-flex-row gap-3">
                  <button
                    type="submit"
                    className="mobile-btn-primary flex-1"
                  >
                    Add Sub-Note
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubNoteForm(false)
                      setSelectedNoteId(null)
                    }}
                    className="mobile-btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}