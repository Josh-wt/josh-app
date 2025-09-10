"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Trash2, 
  Share, 
  Tag,
  Calendar,
  Clock,
  FileText
} from "lucide-react"
import { useState } from "react"

interface NotePageProps {
  params: {
    id: string
  }
}

export default function NoteDetailPage({ params }: NotePageProps) {
  const noteId = params.id
  const [isEditing, setIsEditing] = useState(false)
  const [noteContent, setNoteContent] = useState(`# Meeting Notes - Project Planning

## Agenda
- Review project requirements
- Discuss timeline and milestones
- Assign team responsibilities
- Set up communication channels

## Key Points
- **Timeline**: 6 weeks for MVP
- **Team**: 4 developers, 1 designer, 1 PM
- **Budget**: $50,000 allocated
- **Tools**: React, Node.js, PostgreSQL

## Action Items
- [ ] Create project repository
- [ ] Set up development environment
- [ ] Design wireframes
- [ ] Create project timeline
- [ ] Schedule weekly standups

## Next Meeting
**Date**: February 15, 2024
**Time**: 2:00 PM
**Location**: Conference Room A

---
*Created: January 30, 2024*
*Last Modified: January 30, 2024*`)

  // Mock note data - in real app, fetch based on noteId
  const note = {
    id: noteId,
    title: "Meeting Notes - Project Planning",
    content: noteContent,
    tags: ["meeting", "project", "planning"],
    createdAt: "2024-01-30T10:00:00Z",
    updatedAt: "2024-01-30T14:30:00Z",
    category: "Work",
    isFavorite: true
  }

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleDelete = () => {
    // Delete logic here
    if (confirm("Are you sure you want to delete this note?")) {
      // Navigate back to notes list
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="glass-button p-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            {isEditing ? (
              <input 
                type="text" 
                value={note.title}
                className="text-2xl font-bold text-slate-800 bg-transparent border-none outline-none"
                onChange={(e) => {/* Update title logic */}}
              />
            ) : (
              <h1 className="text-2xl font-bold text-slate-800">{note.title}</h1>
            )}
            <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Modified {new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-green-600"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
          <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={handleDelete}
            className="glass-button px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6">
            {isEditing ? (
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-96 p-4 bg-transparent border-none outline-none resize-none font-mono text-sm"
                placeholder="Start writing your note..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
                  {noteContent}
                </pre>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Note Info */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">Note Info</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-600">Category</span>
                <p className="font-medium text-slate-800">{note.category}</p>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Status</span>
                <p className="font-medium text-green-600">Active</p>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Word Count</span>
                <p className="font-medium text-slate-800">{noteContent.split(' ').length} words</p>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Character Count</span>
                <p className="font-medium text-slate-800">{noteContent.length} characters</p>
              </div>
            </div>
          </GlassCard>

          {/* Tags */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Tag className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-800">Tags</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-4">
              <input 
                type="text" 
                placeholder="Add tag..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Duplicate Note
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Export as PDF
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Print Note
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Archive Note
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
