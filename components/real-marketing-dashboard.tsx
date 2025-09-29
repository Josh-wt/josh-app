"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import {
  FileText,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Activity,
  Clock,
  AlertCircle,
  BookOpen,
  Target,
  Award,
  Star,
  Zap,
  Brain,
  GraduationCap,
  Trophy,
  UserPlus,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart,
  LineChart as LineChartIcon,
  Globe,
  Eye,
  BarChart3
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const TIME_RANGES = [
  { label: "24h", value: 1 },
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

interface ComprehensiveAnalytics {
  evaluationMetrics: {
    total_evaluations: number
    recent_evaluations: number
    weekly_evaluations: number
    daily_evaluations: number
    unique_users: number
    return_users: number
    return_rate: number
    avg_evaluations_per_user: number
    max_evaluations_by_user: number
  }
  userMetrics: {
    total_users: number
    new_users_30d: number
    new_users_7d: number
    new_users_1d: number
    user_growth_data: any[]
  }
  engagementMetrics: {
    study_streaks: number
    max_streak: number
    avg_streak: number
    saved_resources: number
    users_with_saved_resources: number
    total_goals: number
    completed_goals: number
    goal_completion_rate: number
  }
  performanceMetrics: {
    feedback_quality: number
    total_feedback: number
    conversion_rate: number
    active_subscriptions: number
    retention_rate: number
  }
  dailyTrends: Array<{
    date: string
    evaluations: number
    unique_users: number
  }>
  questionTypes: Array<{
    question_type: string
    count: number
  }>
  userActivity: {
    hourly_activity: Array<{
      hour: number
      count: number
    }>
    weekly_activity: Array<{
      day: number
      count: number
    }>
  }
  timestamp: string
}

export function RealMarketingDashboard() {
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState(30)
  const [activeTab, setActiveTab] = useState<'overview' | 'evaluations' | 'users' | 'engagement' | 'performance'>('overview')

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/comprehensive')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-slate-600">Loading comprehensive analytics...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Analytics</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Marketing Analytics Dashboard</h1>
            <p className="text-slate-600">Real-time insights from Supabase data</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              {TIME_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'evaluations', label: 'Evaluations', icon: FileText },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'engagement', label: 'Engagement', icon: Activity },
            { id: 'performance', label: 'Performance', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Evaluations</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {formatNumber(analytics.evaluationMetrics.total_evaluations)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {analytics.evaluationMetrics.recent_evaluations} in last 30 days
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Return Users</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analytics.evaluationMetrics.return_users}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatPercentage(analytics.evaluationMetrics.return_rate)} return rate
                    </p>
                  </div>
                  <UserCheck className="w-12 h-12 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Users (Non-Email)</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analytics.userMetrics.new_users_30d}
                    </p>
                    <p className="text-xs text-slate-500">
                      {analytics.userMetrics.new_users_7d} in last 7 days
                    </p>
                  </div>
                  <UserPlus className="w-12 h-12 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Avg per User</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analytics.evaluationMetrics.avg_evaluations_per_user.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500">
                      evaluations per user
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-orange-500" />
                </div>
              </GlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Evaluations Trend */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Evaluations Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.dailyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px' 
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="evaluations" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Question Types Breakdown */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Question Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics.questionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ question_type, count }) => `${question_type.replace('igcse_', '').replace('alevel_', '')}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.questionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* Evaluations Tab */}
        {activeTab === 'evaluations' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Evaluations</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatNumber(analytics.evaluationMetrics.total_evaluations)}
                    </p>
                    <p className="text-xs text-slate-500">All time</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Recent Evaluations</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.evaluationMetrics.recent_evaluations}
                    </p>
                    <p className="text-xs text-slate-500">Last 30 days</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Return Users</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.evaluationMetrics.return_users}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatPercentage(analytics.evaluationMetrics.return_rate)} return rate
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Max by User</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.evaluationMetrics.max_evaluations_by_user}
                    </p>
                    <p className="text-xs text-slate-500">Most active user</p>
                  </div>
                  <Trophy className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Users (Non-Email)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.userMetrics.total_users}
                    </p>
                    <p className="text-xs text-slate-500">Discord/Google only</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Users (30d)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.userMetrics.new_users_30d}
                    </p>
                    <p className="text-xs text-slate-500">Last 30 days</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Users (7d)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.userMetrics.new_users_7d}
                    </p>
                    <p className="text-xs text-slate-500">Last 7 days</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Users (Today)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.userMetrics.new_users_1d}
                    </p>
                    <p className="text-xs text-slate-500">Last 24 hours</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Active Streaks</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.engagementMetrics.study_streaks}
                    </p>
                    <p className="text-xs text-slate-500">Current streaks</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Max Streak</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.engagementMetrics.max_streak}
                    </p>
                    <p className="text-xs text-slate-500">days</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Saved Resources</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.engagementMetrics.saved_resources}
                    </p>
                    <p className="text-xs text-slate-500">Total saved</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Goal Completion</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatPercentage(analytics.engagementMetrics.goal_completion_rate)}
                    </p>
                    <p className="text-xs text-slate-500">Success rate</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Feedback Quality</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatPercentage(analytics.performanceMetrics.feedback_quality)}
                    </p>
                    <p className="text-xs text-slate-500">Positive feedback</p>
                  </div>
                  <Star className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatPercentage(analytics.performanceMetrics.conversion_rate)}
                    </p>
                    <p className="text-xs text-slate-500">Subscription conversion</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Retention Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatPercentage(analytics.performanceMetrics.retention_rate)}
                    </p>
                    <p className="text-xs text-slate-500">7-day retention</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {analytics.performanceMetrics.active_subscriptions}
                    </p>
                    <p className="text-xs text-slate-500">Current active</p>
                  </div>
                  <Award className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Last updated: {new Date(analytics.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
