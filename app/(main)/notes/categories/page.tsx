"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  Folder, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  Tag
} from "lucide-react"

export default function NotesCategoriesPage() {
  const categories = [
    {
      id: 1,
      name: "Work",
      description: "Work-related notes and documents",
      color: "from-blue-400 to-blue-600",
      noteCount: 24,
      lastUpdated: "2024-01-30T14:30:00Z"
    },
    {
      id: 2,
      name: "Personal",
      description: "Personal thoughts and ideas",
      color: "from-green-400 to-green-600",
      noteCount: 18,
      lastUpdated: "2024-01-29T09:15:00Z"
    },
    {
      id: 3,
      name: "Learning",
      description: "Study notes and educational content",
      color: "from-purple-400 to-purple-600",
      noteCount: 12,
      lastUpdated: "2024-01-28T16:45:00Z"
    },
    {
      id: 4,
      name: "Projects",
      description: "Project documentation and planning",
      color: "from-orange-400 to-orange-600",
      noteCount: 8,
      lastUpdated: "2024-01-27T11:20:00Z"
    },
    {
      id: 5,
      name: "Ideas",
      description: "Random ideas and inspiration",
      color: "from-pink-400 to-pink-600",
      noteCount: 15,
      lastUpdated: "2024-01-26T20:10:00Z"
    },
    {
      id: 6,
      name: "Meetings",
      description: "Meeting notes and minutes",
      color: "from-cyan-400 to-cyan-600",
      noteCount: 31,
      lastUpdated: "2024-01-30T10:00:00Z"
    }
  ]

  const recentNotes = [
    {
      id: 1,
      title: "Q1 Planning Meeting",
      category: "Meetings",
      updatedAt: "2024-01-30T14:30:00Z",
      preview: "Discussed Q1 goals and milestones..."
    },
    {
      id: 2,
      title: "React Best Practices",
      category: "Learning",
      updatedAt: "2024-01-29T16:45:00Z",
      preview: "Key concepts and patterns for React development..."
    },
    {
      id: 3,
      title: "App Redesign Ideas",
      category: "Ideas",
      updatedAt: "2024-01-28T20:10:00Z",
      preview: "New UI/UX concepts for the mobile app..."
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-800">Note Categories</h1>
        </div>
        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <GlassCard key={category.id} className="p-6">
            <div className="space-y-4">
              {/* Category Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
                    <p className="text-sm text-slate-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Notes:</span>
                  <span className="font-medium">{category.noteCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(category.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-2 px-4 bg-gradient-to-r ${category.color} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}>
                View Notes
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Notes */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold text-slate-800">Recent Notes</h2>
        </div>
        
        <div className="space-y-3">
          {recentNotes.map((note) => (
            <div key={note.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-medium text-slate-800">{note.title}</h3>
                  <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                    {note.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{note.preview}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Category Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">
            {categories.reduce((sum, cat) => sum + cat.noteCount, 0)}
          </div>
          <div className="text-sm text-slate-600">Total Notes</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">
            {categories.length}
          </div>
          <div className="text-sm text-slate-600">Categories</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">
            {Math.round(categories.reduce((sum, cat) => sum + cat.noteCount, 0) / categories.length)}
          </div>
          <div className="text-sm text-slate-600">Avg Notes/Category</div>
        </GlassCard>
      </div>
    </div>
  )
}
