"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Award
} from "lucide-react"

export default function HabitsStreaksPage() {
  const habits = [
    {
      id: 1,
      name: "Morning Exercise",
      currentStreak: 12,
      longestStreak: 28,
      totalDays: 45,
      category: "Health",
      icon: "🏃‍♂️",
      color: "from-green-400 to-blue-500"
    },
    {
      id: 2,
      name: "Read 30 minutes",
      currentStreak: 8,
      longestStreak: 15,
      totalDays: 32,
      category: "Learning",
      icon: "📚",
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      name: "Meditation",
      currentStreak: 5,
      longestStreak: 21,
      totalDays: 28,
      category: "Mindfulness",
      icon: "🧘‍♂️",
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 4,
      name: "Write in Journal",
      currentStreak: 3,
      longestStreak: 12,
      totalDays: 18,
      category: "Reflection",
      icon: "✍️",
      color: "from-orange-400 to-red-500"
    }
  ]

  const achievements = [
    {
      title: "7-Day Warrior",
      description: "Complete a habit for 7 consecutive days",
      icon: Trophy,
      achieved: true,
      date: "2024-01-15"
    },
    {
      title: "Monthly Master",
      description: "Complete a habit for 30 consecutive days",
      icon: Award,
      achieved: false,
      progress: 12
    },
    {
      title: "Consistency King",
      description: "Maintain 5 habits for 2 weeks",
      icon: Target,
      achieved: false,
      progress: 3
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-slate-800">Habit Streaks</h1>
      </div>

      {/* Current Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {habits.map((habit) => (
          <GlassCard key={habit.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{habit.icon}</div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{habit.currentStreak}</p>
                  <p className="text-xs text-slate-600">day streak</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800">{habit.name}</h3>
                <p className="text-sm text-slate-600">{habit.category}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Longest:</span>
                  <span className="font-medium">{habit.longestStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total:</span>
                  <span className="font-medium">{habit.totalDays} days</span>
                </div>
              </div>

              {/* Streak Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${habit.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(habit.currentStreak / habit.longestStreak) * 100}%` }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Achievements */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-slate-800">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              achievement.achieved 
                ? 'border-green-200 bg-green-50/50' 
                : 'border-slate-200 bg-slate-50/50'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-full ${
                  achievement.achieved 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{achievement.title}</h3>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                </div>
              </div>
              
              {achievement.achieved ? (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Achieved on {new Date(achievement.date).toLocaleDateString()}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{achievement.progress}/5</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Streak Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-slate-800">Streak Trends</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Streak trend chart would go here</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Monthly Overview</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Monthly habit completion calendar would go here</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
