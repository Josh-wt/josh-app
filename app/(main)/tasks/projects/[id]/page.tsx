"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const projectId = params.id

  // Mock project data - in real app, fetch based on projectId
  const project = {
    id: projectId,
    name: "Website Redesign",
    description: "Complete overhaul of the main website with modern design and improved user experience",
    status: "in-progress",
    progress: 65,
    dueDate: "2024-02-15",
    startDate: "2024-01-01",
    team: [
      { name: "Josh", role: "Project Manager", avatar: "J" },
      { name: "Sarah", role: "UI/UX Designer", avatar: "S" },
      { name: "Mike", role: "Frontend Developer", avatar: "M" }
    ],
    tasks: [
      { id: 1, title: "Design wireframes", status: "completed", assignee: "Sarah", dueDate: "2024-01-15" },
      { id: 2, title: "Create mockups", status: "completed", assignee: "Sarah", dueDate: "2024-01-20" },
      { id: 3, title: "Set up development environment", status: "completed", assignee: "Mike", dueDate: "2024-01-25" },
      { id: 4, title: "Implement homepage", status: "in-progress", assignee: "Mike", dueDate: "2024-02-05" },
      { id: 5, title: "Implement product pages", status: "pending", assignee: "Mike", dueDate: "2024-02-10" },
      { id: 6, title: "Content migration", status: "pending", assignee: "Josh", dueDate: "2024-02-12" }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-100"
      case "in-progress": return "text-blue-500 bg-blue-100"
      case "pending": return "text-yellow-500 bg-yellow-100"
      default: return "text-gray-500 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle
      case "in-progress": return Clock
      case "pending": return AlertCircle
      default: return Clock
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button className="glass-button p-2 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <p className="text-slate-600 mt-1">{project.description}</p>
        </div>
        <div className="flex space-x-2">
          <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button className="glass-button px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Overall Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Start Date:</span>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-600">Due Date:</span>
                  <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tasks */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Tasks</h3>
              <button className="glass-button px-3 py-1 rounded-lg flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
            <div className="space-y-3">
              {project.tasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status)
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`w-4 h-4 ${getStatusColor(task.status).split(' ')[0]}`} />
                      <div>
                        <p className="font-medium text-slate-800">{task.title}</p>
                        <p className="text-sm text-slate-600">Assigned to {task.assignee}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Team Members</h3>
            <div className="space-y-3">
              {project.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-sm font-medium text-white">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Project Stats */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Tasks:</span>
                <span className="font-medium">{project.tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Completed:</span>
                <span className="font-medium text-green-600">
                  {project.tasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">In Progress:</span>
                <span className="font-medium text-blue-600">
                  {project.tasks.filter(t => t.status === 'in-progress').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pending:</span>
                <span className="font-medium text-yellow-600">
                  {project.tasks.filter(t => t.status === 'pending').length}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
