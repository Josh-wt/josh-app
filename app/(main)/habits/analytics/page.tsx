"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Activity
} from "lucide-react"

export default function HabitsAnalyticsPage() {
  const analytics = {
    totalHabits: 12,
    activeHabits: 8,
    completedToday: 6,
    weeklyCompletion: 78,
    monthlyCompletion: 65,
    averageStreak: 8.5,
    longestStreak: 28,
    totalDaysTracked: 156
  }

  const habitCategories = [
    { name: "Health & Fitness", count: 4, completion: 85, color: "from-green-400 to-blue-500" },
    { name: "Learning & Growth", count: 3, completion: 72, color: "from-purple-400 to-pink-500" },
    { name: "Mindfulness", count: 2, completion: 68, color: "from-blue-400 to-purple-500" },
    { name: "Productivity", count: 3, completion: 91, color: "from-orange-400 to-red-500" }
  ]

  const weeklyData = [
    { day: "Mon", completed: 6, total: 8 },
    { day: "Tue", completed: 7, total: 8 },
    { day: "Wed", completed: 5, total: 8 },
    { day: "Thu", completed: 8, total: 8 },
    { day: "Fri", completed: 6, total: 8 },
    { day: "Sat", completed: 4, total: 8 },
    { day: "Sun", completed: 7, total: 8 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-slate-800">Habit Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{analytics.totalHabits}</div>
          <div className="text-xs text-slate-600">Total Habits</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{analytics.activeHabits}</div>
          <div className="text-xs text-slate-600">Active</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{analytics.completedToday}</div>
          <div className="text-xs text-slate-600">Today</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{analytics.weeklyCompletion}%</div>
          <div className="text-xs text-slate-600">This Week</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{analytics.monthlyCompletion}%</div>
          <div className="text-xs text-slate-600">This Month</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-cyan-600">{analytics.averageStreak}</div>
          <div className="text-xs text-slate-600">Avg Streak</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{analytics.longestStreak}</div>
          <div className="text-xs text-slate-600">Best Streak</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{analytics.totalDaysTracked}</div>
          <div className="text-xs text-slate-600">Days Tracked</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-slate-800">Weekly Completion</h3>
          </div>
          <div className="space-y-3">
            {weeklyData.map((day, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{day.day}</span>
                  <span className="font-medium">{day.completed}/{day.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(day.completed / day.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Habit Categories */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800">Categories</h3>
          </div>
          <div className="space-y-4">
            {habitCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-800">{category.name}</span>
                  <span className="text-sm text-slate-600">{category.count} habits</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Completion Rate</span>
                  <span>{category.completion}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${category.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Monthly Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-slate-800">Monthly Overview</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-slate-500">
          <p>Monthly habit completion heatmap would go here</p>
        </div>
      </GlassCard>

      {/* Achievement Progress */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-slate-800">Achievement Progress</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-slate-800">7-Day Warrior</span>
            </div>
            <p className="text-sm text-slate-600">Complete a habit for 7 consecutive days</p>
            <div className="mt-2 text-sm text-green-600 font-medium">✓ Achieved</div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-slate-800">Monthly Master</span>
            </div>
            <p className="text-sm text-slate-600">Complete a habit for 30 consecutive days</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span>12/30</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium text-slate-800">Consistency King</span>
            </div>
            <p className="text-sm text-slate-600">Maintain 5 habits for 2 weeks</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span>3/5</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
