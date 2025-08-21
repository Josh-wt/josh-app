"use client"
import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { Plus, Calendar, Clock, CheckCircle2, Circle, Filter, Search, Trash2, Edit3, X, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "todo" | "in_progress" | "done" | "snoozed" | "archived"
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
}

const priorityColors = {
  low: "text-slate-500 bg-slate-100",
  medium: "text-yellow-600 bg-yellow-100",
  high: "text-orange-600 bg-orange-100",
  critical: "text-red-600 bg-red-100",
}

const statusColors = {
  todo: "text-slate-600 bg-slate-100",
  in_progress: "text-blue-600 bg-blue-100",
  done: "text-green-600 bg-green-100",
  snoozed: "text-purple-600 bg-purple-100",
  archived: "text-gray-600 bg-gray-100",
}

export function SmartTodoManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeView, setActiveView] = useState<"today" | "week" | "all">("today")
  const [groupBy, setGroupBy] = useState<"priority" | "category" | "status" | "none">("none")
  const [searchQuery, setSearchQuery] = useState("")
  const [quickFilter, setQuickFilter] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showDismissed, setShowDismissed] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: new Date().toISOString().split("T")[0],
    priority: "medium",
    category: "",
    status: "todo",
  })

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchTasks(user)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchTasks = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, category, priority, status, due_date, created_at, updated_at, user_id")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeTask = (taskText: string) => {
    const text = taskText.toLowerCase()

    let category = "personal"
    if (text.includes("#ee") || text.includes("engineering") || text.includes("code")) category = "EE"
    else if (text.includes("#content") || text.includes("write") || text.includes("blog")) category = "content"
    else if (text.includes("#infra") || text.includes("deploy") || text.includes("server")) category = "infra"
    else if (text.includes("work") || text.includes("meeting")) category = "work"

    let priority: Task["priority"] = "medium"
    if (text.includes("urgent") || text.includes("critical") || text.includes("asap")) priority = "critical"
    else if (text.includes("important") || text.includes("high")) priority = "high"
    else if (text.includes("later") || text.includes("someday")) priority = "low"

    return { category, priority }
  }

  const addTask = async () => {
    if (!formData.title.trim() || !user) return

    const analysis = analyzeTask(formData.title)

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description || null,
            category: formData.category || analysis.category,
            priority: formData.priority,
            status: formData.status,
            due_date: formData.due_date || null,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setTasks((prev) => [data, ...prev])
      resetForm()
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const dismissTask = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: "archived",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: "archived" as const } : task)))
    } catch (error) {
      console.error("Error dismissing task:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      due_date: new Date().toISOString().split("T")[0],
      priority: "medium",
      category: "",
      status: "todo",
    })
  }

  const getFilteredTasks = () => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase())

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const taskDate = task.due_date ? new Date(task.due_date) : null
      if (taskDate) taskDate.setHours(0, 0, 0, 0)
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      if (quickFilter === "ee") return matchesSearch && task.category.toLowerCase().includes("ee")
      if (quickFilter === "high-progress")
        return matchesSearch && task.priority === "high" && task.status === "in_progress"
      if (quickFilter === "overdue") return matchesSearch && taskDate && taskDate < today && task.status !== "done"

      if (!showDismissed && task.status === "archived") return false

      switch (activeView) {
        case "today":
          return matchesSearch && task.status !== "archived"
        case "week":
          return matchesSearch && task.status !== "archived" && (!taskDate || taskDate <= weekFromNow)
        case "all":
        default:
          return matchesSearch
      }
    })

    const grouped: Record<string, Task[]> = {}
    filtered.forEach((task) => {
      const key =
        groupBy === "priority"
          ? task.priority
          : groupBy === "category"
            ? task.category
            : groupBy === "status"
              ? task.status
              : "All"

      if (!grouped[key]) grouped[key] = []
      grouped[key].push(task)
    })

    return grouped
  }

  const getSmartSuggestions = () => {
    const suggestions = []

    const snoozedTasks = tasks.filter((t) => t.status === "snoozed")
    if (snoozedTasks.length > 0) {
      suggestions.push(`You have ${snoozedTasks.length} snoozed tasks that might need attention`)
    }

    const overdueCritical = tasks.filter(
      (t) => t.priority === "critical" && t.due_date && new Date(t.due_date) < new Date() && t.status !== "done",
    )
    if (overdueCritical.length > 0) {
      suggestions.push(`${overdueCritical.length} critical tasks are overdue!`)
    }

    return suggestions
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 text-center">
          <div className="text-lg font-medium text-slate-600 mb-2">Please sign in</div>
          <p className="text-slate-500">You need to be authenticated to access your tasks.</p>
        </GlassCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  const groupedTasks = getFilteredTasks()
  const suggestions = getSmartSuggestions()

  return (
    <div className="space-y-6 relative">
      {suggestions.length > 0 && (
        <GlassCard className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/30">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Smart Suggestions</h3>
              {suggestions.map((suggestion, i) => (
                <p key={i} className="text-sm text-amber-700">
                  {suggestion}
                </p>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {[
              { key: "today", label: "Active", icon: Calendar },
              { key: "week", label: "Week", icon: Clock },
              { key: "all", label: "All", icon: Filter },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={cn(
                  "glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all",
                  activeView === key && "glass-active",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowDismissed(!showDismissed)}
              className={cn(
                "glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all",
                showDismissed && "glass-active",
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              Dismissed ({tasks.filter((t) => t.status === "archived").length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="glass-button px-3 py-2 rounded-lg text-sm bg-transparent"
            >
              <option value="none">None</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, descriptions, categories..."
              className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { key: "ee", label: "#EE" },
              { key: "high-progress", label: "High + Progress" },
              { key: "overdue", label: "Overdue" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setQuickFilter(quickFilter === key ? "" : key)}
                className={cn(
                  "glass-button px-3 py-1 rounded-lg text-sm transition-all",
                  quickFilter === key && "glass-active",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="w-full glass-button p-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all group"
        >
          <Plus className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors" />
          <span className="text-slate-600 group-hover:text-cyan-600 transition-colors">Add New Task</span>
        </button>
      </GlassCard>

      {(showAddForm || editingTask) && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800">{editingTask ? "Edit Task" : "Add New Task"}</h3>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingTask(null)
                resetForm()
              }}
              className="glass-button p-2 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="e.g., Fix #EE authentication bug (urgent)"
                className="w-full glass-button p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional details about the task..."
                rows={3}
                className="w-full glass-button p-3 rounded-lg resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                  className="w-full glass-button p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full glass-button p-3 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., EE, personal, content, infra"
                  className="w-full glass-button p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full glass-button p-3 rounded-lg"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="snoozed">Snoozed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={editingTask ? () => updateTask(editingTask.id, formData) : addTask}
                className="glass-button px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition-all"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingTask(null)
                  resetForm()
                }}
                className="glass-button px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName}>
            {groupBy !== "none" && (
              <h3 className="text-lg font-medium text-slate-700 mb-3 capitalize">
                {groupName} ({groupTasks.length})
              </h3>
            )}

            <div className="space-y-3">
              {groupTasks.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
                  <p className="text-slate-500">
                    {activeView === "today" && "You're all caught up!"}
                    {activeView === "week" && "No tasks for this week."}
                    {activeView === "all" && "Start by adding your first task."}
                  </p>
                </GlassCard>
              ) : (
                groupTasks.map((task) => (
                  <GlassCard key={task.id} className="p-4 hover:scale-[1.01] transition-transform group">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === "done" ? "todo" : "done",
                          })
                        }
                        className="mt-1 transition-colors"
                      >
                        {task.status === "done" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3
                              className={cn(
                                "font-medium mb-1",
                                task.status === "done" ? "text-slate-500 line-through" : "text-slate-800",
                                task.status === "archived" && "text-slate-400",
                              )}
                            >
                              {task.title}
                            </h3>
                            {task.description && <p className="text-sm text-slate-600 mb-2">{task.description}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            {task.status === "done" && (
                              <button
                                onClick={() => dismissTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-purple-100 rounded"
                                title="Dismiss completed task"
                              >
                                <X className="w-4 h-4 text-purple-500" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingTask(task)
                                setFormData({
                                  title: task.title,
                                  description: task.description || "",
                                  due_date: task.due_date || new Date().toISOString().split("T")[0],
                                  priority: task.priority,
                                  category: task.category,
                                  status: task.status,
                                })
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                            >
                              <Edit3 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span
                            className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityColors[task.priority])}
                          >
                            {task.priority}
                          </span>

                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[task.status])}>
                            {task.status.replace("_", " ")}
                          </span>

                          {task.category && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                              {task.category}
                            </span>
                          )}

                          {task.due_date && (
                            <div className="flex items-center gap-1 text-slate-600">
                              <Calendar className="w-3 h-3" />
                              <span
                                className={cn(
                                  new Date(task.due_date) < new Date() &&
                                    task.status !== "done" &&
                                    "text-red-600 font-medium",
                                )}
                              >
                                {new Date(task.due_date).toDateString() === new Date().toDateString()
                                  ? "Today"
                                  : new Date(task.due_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <GlassCard className="p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-800">{tasks.filter((t) => t.status === "todo").length}</div>
            <div className="text-sm text-slate-600">Todo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === "in_progress").length}
            </div>
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "done" || t.status === "archived").length}
            </div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-600">
              {Math.round(
                (tasks.filter((t) => t.status === "done" || t.status === "archived").length /
                  Math.max(tasks.length, 1)) *
                  100,
              )}
              %
            </div>
            <div className="text-sm text-slate-600">Progress</div>
          </div>
        </div>
      </GlassCard>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 glass-button p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
