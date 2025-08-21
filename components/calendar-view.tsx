"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { createClient } from "@/lib/supabase/client"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  attendees?: string
  color: string
  user_id: string
  created_at: string
}

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    attendees: "",
    color: "#3b82f6",
  })

  const supabase = createClient()

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      fetchEvents(user)
    } else {
      setLoading(false)
    }
  }

  const fetchEvents = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async () => {
    if (!user || !newEvent.title || !newEvent.start_date) return

    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert([
          {
            ...newEvent,
            user_id: user.id,
            end_date: newEvent.end_date || newEvent.start_date,
          },
        ])
        .select()

      if (error) throw error
      if (data) {
        setEvents([...events, ...data])
        setNewEvent({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          location: "",
          attendees: "",
          color: "#3b82f6",
        })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error("Error adding event:", error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.start_date.split("T")[0] === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading calendar...</p>
      </GlassCard>
    )
  }

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Please sign in</h2>
        <p className="text-slate-600">Sign in to access your calendar and events</p>
      </GlassCard>
    )
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-800">Calendar</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:glass-active transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="glass-button p-2 rounded-lg hover:glass-active transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-semibold text-slate-800 min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="glass-button p-2 rounded-lg hover:glass-active transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-1">
            {(["month", "week", "day"] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  view === viewType ? "glass-active text-slate-800" : "glass-button text-slate-600 hover:glass-active"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Calendar Grid */}
      <GlassCard className="p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24"></div>
            }

            const dayEvents = getEventsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`h-24 p-2 rounded-lg border transition-all ${
                  isToday ? "bg-blue-50/50 border-blue-200" : "glass-button hover:glass-active border-transparent"
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-slate-700"}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-white truncate"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New Event</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.start_date}
                  onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                  className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.end_date}
                  onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                  className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-3 rounded-lg glass-button focus:glass-active outline-none transition-all"
                    placeholder="Location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                    className="w-full h-12 rounded-lg glass-button cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 glass-button py-3 rounded-lg hover:glass-active transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Add Event
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
