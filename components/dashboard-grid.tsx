"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { CheckSquare, Heart, Target, TrendingUp, Zap, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardData {
  tasks: { id: string; title: string; completed: boolean }[]
  todayMood: { mood: string; emoji: string; energy: number } | null
  longestStreak: { habit: string; streak: number } | null
  recentTransactions: { amount: number; description: string }[]
  taskStats: { completed: number; total: number }
  portfolioData: { symbol: string; change: number }[]
}

export function DashboardGrid() {
  const [data, setData] = useState<DashboardData>({
    tasks: [],
    todayMood: null,
    longestStreak: null,
    recentTransactions: [],
    taskStats: { completed: 0, total: 0 },
    portfolioData: [],
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

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
        await fetchDashboardData(user)
      }
    } catch (error) {
      console.error("Error getting user:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async (user: any) => {
    try {
      // Fetch recent tasks
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, completed")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      // Fetch today's mood
      const today = new Date().toISOString().split("T")[0]
      const { data: moodData } = await supabase
        .from("moods")
        .select("mood, energy")
        .eq("user_id", user.id)
        .eq("date", today)
        .single()

      // Fetch habit streaks
      const { data: habits } = await supabase
        .from("habits")
        .select("name, current_streak")
        .eq("user_id", user.id)
        .order("current_streak", { ascending: false })
        .limit(1)

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, description")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

      // Calculate task stats
      const { data: allTasks } = await supabase.from("tasks").select("completed").eq("user_id", user.id)

      const taskStats = {
        completed: allTasks?.filter((t) => t.completed).length || 0,
        total: allTasks?.length || 0,
      }

      // Mock portfolio data (you can replace with real API)
      const portfolioData = [
        { symbol: "RDDT", change: (Math.random() - 0.5) * 5 },
        { symbol: "NET", change: (Math.random() - 0.5) * 4 },
      ]

      setData({
        tasks: tasks || [],
        todayMood: moodData
          ? {
              mood: moodData.mood,
              emoji: getMoodEmoji(moodData.mood),
              energy: moodData.energy,
            }
          : null,
        longestStreak: habits?.[0]
          ? {
              habit: habits[0].name,
              streak: habits[0].current_streak,
            }
          : null,
        recentTransactions: transactions || [],
        taskStats,
        portfolioData,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      amazing: "🤩",
      great: "😊",
      good: "🙂",
      okay: "😐",
      bad: "😔",
      terrible: "😢",
    }
    return moodEmojis[mood] || "😐"
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !completed })
        .eq("id", taskId)
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task)),
        taskStats: {
          completed: prev.taskStats.completed + (completed ? -1 : 1),
          total: prev.taskStats.total,
        },
      }))
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <GlassCard key={i} className="p-4 sm:p-6 animate-pulse">
            <div className="h-3 sm:h-4 bg-slate-200 rounded mb-3 sm:mb-4"></div>
            <div className="h-6 sm:h-8 bg-slate-200 rounded"></div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <h3 className="text-lg font-medium text-slate-600 mb-2">Please sign in</h3>
        <p className="text-slate-500">Sign in to view your dashboard</p>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {/* Today's Focus */}
      <GlassCard className="p-4 sm:p-6" hover>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Today's Focus</h3>
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tasks completed</span>
            <span className="font-medium text-slate-800">
              {data.taskStats.completed}/{data.taskStats.total}
            </span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all"
              style={{
                width: data.taskStats.total > 0 ? `${(data.taskStats.completed / data.taskStats.total) * 100}%` : "0%",
              }}
            ></div>
          </div>
        </div>
      </GlassCard>

      {/* Mood Today */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Mood Today</h3>
          <Heart className="w-5 h-5 text-pink-500" />
        </div>
        <div className="text-center">
          {data.todayMood ? (
            <>
              <div className="text-3xl mb-2">{data.todayMood.emoji}</div>
              <p className="text-sm text-slate-600 capitalize">
                {data.todayMood.mood} • Energy: {data.todayMood.energy}/10
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl mb-2">😐</div>
              <p className="text-sm text-slate-600">No mood logged today</p>
            </>
          )}
        </div>
      </GlassCard>

      {/* Habit Streak */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Best Streak</h3>
          <Target className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-center">
          {data.longestStreak ? (
            <>
              <div className="text-2xl font-bold text-slate-800 mb-1">{data.longestStreak.streak} days</div>
              <p className="text-sm text-slate-600">{data.longestStreak.habit}</p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-slate-800 mb-1">0 days</div>
              <p className="text-sm text-slate-600">No habits yet</p>
            </>
          )}
        </div>
      </GlassCard>

      {/* Recent Tasks */}
      <GlassCard className="p-6 md:col-span-2" hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Recent Tasks</h3>
          <CheckSquare className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          {data.tasks.length > 0 ? (
            data.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 glass-button rounded-lg">
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`w-4 h-4 rounded border-2 transition-all ${
                    task.completed
                      ? "bg-gradient-to-r from-cyan-400 to-blue-400 border-cyan-400"
                      : "border-slate-300 hover:border-cyan-400"
                  }`}
                />
                <span className={`text-sm flex-1 ${task.completed ? "text-slate-500 line-through" : "text-slate-700"}`}>
                  {task.title}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 mb-2">No tasks yet</p>
              <p className="text-xs text-slate-500">Go to Tasks tab to add some</p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Portfolio */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Portfolio</h3>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="space-y-2">
          {data.portfolioData.map((stock) => (
            <div key={stock.symbol} className="flex justify-between text-sm">
              <span className="text-slate-600">{stock.symbol}</span>
              <span className={`font-medium ${stock.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-6 md:col-span-2 lg:col-span-3" hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recentTransactions.length > 0 ? (
            data.recentTransactions.map((transaction, index) => (
              <div key={index} className="glass-button p-4 rounded-lg">
                <div className="text-lg font-semibold text-slate-800 mb-1">
                  ${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <p className="text-xs text-slate-600 truncate">{transaction.description}</p>
                <span className={`text-xs ${transaction.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {transaction.amount >= 0 ? "Income" : "Expense"}
                </span>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 text-center py-4">
              <p className="text-sm text-slate-600">No recent transactions</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
