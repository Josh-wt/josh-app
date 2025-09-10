"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle,
  BarChart3,
  Activity
} from "lucide-react"

export default function PerformancePage() {
  const performanceMetrics = [
    {
      title: "Productivity Score",
      value: "87%",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Goal Completion",
      value: "23/30",
      change: "+5 this week",
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Focus Time",
      value: "4.2h",
      change: "+0.8h",
      icon: Clock,
      color: "text-purple-500"
    },
    {
      title: "Tasks Completed",
      value: "156",
      change: "+23 this week",
      icon: CheckCircle,
      color: "text-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-slate-800">Performance Overview</h1>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                <p className="text-xs text-green-600 mt-1">{metric.change}</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-r from-${metric.color.split('-')[1]}-100/20 to-${metric.color.split('-')[1]}-200/20`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-slate-800">Weekly Activity</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Chart component would go here</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Productivity Trends</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Trend chart would go here</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
