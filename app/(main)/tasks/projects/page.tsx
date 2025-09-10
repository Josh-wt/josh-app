"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of the main website",
      status: "in-progress",
      progress: 65,
      dueDate: "2024-02-15",
      team: ["Josh", "Sarah", "Mike"],
      tasks: { completed: 13, total: 20 }
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for productivity tracking",
      status: "planning",
      progress: 15,
      dueDate: "2024-03-30",
      team: ["Josh", "Alex"],
      tasks: { completed: 3, total: 20 }
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 marketing campaign launch",
      status: "completed",
      progress: 100,
      dueDate: "2024-01-31",
      team: ["Josh", "Marketing Team"],
      tasks: { completed: 8, total: 8 }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-100"
      case "in-progress": return "text-blue-500 bg-blue-100"
      case "planning": return "text-yellow-500 bg-yellow-100"
      default: return "text-gray-500 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle
      case "in-progress": return Clock
      case "planning": return AlertCircle
      default: return Clock
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderOpen className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        </div>
        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const StatusIcon = getStatusIcon(project.status)
          return (
            <GlassCard key={project.id} className="p-6">
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{project.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{project.team.length} team members</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>{project.tasks.completed}/{project.tasks.total} tasks completed</span>
                  </div>
                </div>

                {/* Team Members */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Team:</span>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <div 
                        key={index}
                        className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white"
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 border-2 border-white">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
