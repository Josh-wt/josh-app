"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { Heart, Brain, Plus, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface MoodEntry {
  id: string
  date: string
  mood_score: number // renamed from mood
  energy_level: number // renamed from energy
  stress_level: number // renamed from stress
  notes?: string
  tags: string[]
  created_at: string
  user_id: string
}

const moodEmojis = {
  1: { emoji: "😢", label: "Very Low", color: "text-red-500" },
  2: { emoji: "😕", label: "Low", color: "text-orange-500" },
  3: { emoji: "😐", label: "Neutral", color: "text-yellow-500" },
  4: { emoji: "😊", label: "Good", color: "text-green-500" },
  5: { emoji: "😄", label: "Excellent", color: "text-emerald-500" },
}

const commonTags = ["work", "family", "exercise", "sleep", "social", "creative", "stressed", "relaxed", "productive"]

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMood, setCurrentMood] = useState(3)
  const [currentEnergy, setCurrentEnergy] = useState(3)
  const [currentStress, setCurrentStress] = useState(3)
  const [currentNotes, setCurrentNotes] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchMoodEntries()
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("moods")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching mood entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMoodEntry = async () => {
    if (!user) return

    const today = new Date().toISOString().split("T")[0]

    try {
      const { data, error } = await supabase
        .from("moods")
        .insert([
          {
            date: today,
            mood_score: currentMood, // updated column name
            energy_level: currentEnergy, // updated column name
            stress_level: currentStress, // updated column name
            notes: currentNotes || null,
            tags: selectedTags,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setEntries((prev) => [data, ...prev])
      setCurrentMood(3)
      setCurrentEnergy(3)
      setCurrentStress(3)
      setCurrentNotes("")
      setSelectedTags([])
      setShowAddEntry(false)
    } catch (error) {
      console.error("Error adding mood entry:", error)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const averageMood =
    entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length : 0
  const moodTrend = entries.length > 1 ? entries[0].mood_score - entries[1].mood_score : 0

  if (!user) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 text-center">
          <div className="text-lg font-medium text-slate-600 mb-2">Please sign in</div>
          <p className="text-slate-500">You need to be authenticated to track your mood.</p>
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
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Today's Mood Input */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Mood Tracker</h2>
              <p className="text-sm text-slate-600">How are you feeling today?</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddEntry(!showAddEntry)}
            className="glass-button p-3 rounded-xl hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {showAddEntry && (
          <div className="space-y-6 mb-6 p-4 glass-button rounded-xl">
            {/* Mood Scale */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">Overall Mood</label>
              <div className="flex items-center justify-between">
                {Object.entries(moodEmojis).map(([value, { emoji, label, color }]) => (
                  <button
                    key={value}
                    onClick={() => setCurrentMood(Number(value))}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                      currentMood === Number(value) ? "glass-active scale-110" : "glass-button hover:scale-105",
                    )}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className={cn("text-xs font-medium", color)}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy & Stress Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Energy Level</label>
                <div className="glass-button p-4 rounded-lg">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentEnergy}
                    onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-2">
                    <span>Low</span>
                    <span className="font-medium text-green-600">{currentEnergy}/5</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Stress Level</label>
                <div className="glass-button p-4 rounded-lg">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentStress}
                    onChange={(e) => setCurrentStress(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-2">
                    <span>Low</span>
                    <span className="font-medium text-red-600">{currentStress}/5</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
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
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "glass-button hover:scale-105",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Notes (Optional)</label>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="How was your day? Any specific thoughts or events?"
                className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none resize-none text-slate-800 placeholder-slate-500"
                rows={3}
              />
            </div>

            <button
              onClick={addMoodEntry}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
            >
              Save Mood Entry
            </button>
          </div>
        )}

        {/* Current Mood Display */}
        {!showAddEntry && entries.length > 0 && (
          <div className="text-center">
            <div className="text-6xl mb-2">{moodEmojis[entries[0].mood_score as keyof typeof moodEmojis].emoji}</div>
            <p className="text-lg font-medium text-slate-800 mb-1">
              {moodEmojis[entries[0].mood_score as keyof typeof moodEmojis].label}
            </p>
            <p className="text-sm text-slate-600">Latest mood entry</p>
          </div>
        )}
      </GlassCard>

      {/* Mood Insights */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-slate-800">AI Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{averageMood.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Mood</div>
          </div>

          <div className="glass-button p-4 rounded-lg text-center">
            <div className={cn("text-2xl font-bold mb-1", moodTrend > 0 ? "text-green-600" : "text-red-600")}>
              {moodTrend > 0 ? "↗" : moodTrend < 0 ? "↘" : "→"}
            </div>
            <div className="text-sm text-slate-600">Trend</div>
          </div>

          <div className="glass-button p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{entries.length}</div>
            <div className="text-sm text-slate-600">Entries</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/30">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Pattern detected:</span> Your mood tends to be higher on days when you include
            'productive' or 'exercise' tags. Consider maintaining these positive activities!
          </p>
        </div>
      </GlassCard>

      {/* Recent Entries */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-800">Recent Entries</h3>
        </div>

        <div className="space-y-3">
          {entries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="glass-button p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmojis[entry.mood_score as keyof typeof moodEmojis].emoji}</span>
                  <div>
                    <div className="font-medium text-slate-800">
                      {moodEmojis[entry.mood_score as keyof typeof moodEmojis].label}
                    </div>
                    <div className="text-sm text-slate-600">{new Date(entry.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>Energy: {entry.energy_level}/5</div>
                  <div>Stress: {entry.stress_level}/5</div>
                </div>
              </div>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-200/50 rounded-full text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {entry.notes && <p className="text-sm text-slate-700 italic">{entry.notes}</p>}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
