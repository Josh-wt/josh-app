"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { 
  getAllMarketingMetrics, 
  formatNumber, 
  formatPercentage, 
  getGrowthColor, 
  getGrowthIcon,
  type MarketingMetrics 
} from "@/lib/everythingenglish-api"
import {
  BarChart3,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  Activity,
  Mail,
  Clock,
  AlertCircle
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const TIME_RANGES = [
  { label: "24h", value: 1 },
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 }
]

export function MarketingDashboard() {
  const [metrics, setMetrics] = useState<MarketingMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState(30)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMetrics = async (timeRange: number = selectedTimeRange) => {
    try {
      setError(null)
      const data = await getAllMarketingMetrics(timeRange)
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marketing metrics')
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchMetrics()
  }

  const handleTimeRangeChange = (timeRange: number) => {
    setSelectedTimeRange(timeRange)
    setLoading(true)
    fetchMetrics(timeRange)
  }

  const getGrowthIconComponent = (growthRate: number) => {
    const iconType = getGrowthIcon(growthRate)
    const colorClass = getGrowthColor(growthRate)
    
    switch (iconType) {
      case 'trending-up':
        return <TrendingUp className={`w-4 h-4 ${colorClass}`} />
      case 'trending-down':
        return <TrendingDown className={`w-4 h-4 ${colorClass}`} />
      default:
        return <Minus className={`w-4 h-4 ${colorClass}`} />
    }
  }

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-800">Marketing Dashboard</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-panel p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-800">Marketing Dashboard</h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Data</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-800">Marketing Dashboard</h2>
            <span className="text-sm text-slate-500">EverythingEnglish.xyz</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div className="flex space-x-1">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleTimeRangeChange(range.value)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedTimeRange === range.value
                        ? 'glass-button bg-slate-100 text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="glass-button p-2 rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <GlassCard className="p-4 hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(metrics.signupAnalytics.total_users)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </GlassCard>

          {/* Confirmed Users */}
          <GlassCard className="p-4 hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Confirmed Users</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(metrics.signupAnalytics.confirmed_users)}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.activityAnalytics.email_confirmation_rate}% rate
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </GlassCard>

          {/* Recent Signups */}
          <GlassCard className="p-4 hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Recent Signups</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(metrics.signupAnalytics.recent_signups)}
                </p>
                <p className="text-xs text-slate-500">
                  Last {selectedTimeRange} days
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </GlassCard>

          {/* Growth Rate */}
          <GlassCard className="p-4 hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Growth Rate</p>
                <div className="flex items-center space-x-2">
                  <p className={`text-2xl font-bold ${getGrowthColor(metrics.signupAnalytics.growth_rate)}`}>
                    {formatPercentage(metrics.signupAnalytics.growth_rate)}
                  </p>
                  {getGrowthIconComponent(metrics.signupAnalytics.growth_rate)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </GlassCard>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600">Active (7d)</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatNumber(metrics.activityAnalytics.active_last_7_days)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-slate-600">Active (30d)</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatNumber(metrics.activityAnalytics.active_last_30_days)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Never Signed In</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatNumber(metrics.activityAnalytics.never_signed_in)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </GlassCard>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Signups Chart */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Signups</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.signupAnalytics.daily_signups}>
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* User Activity Breakdown */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">User Activity Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Active (7d)', value: metrics.activityAnalytics.active_last_7_days, color: '#3b82f6' },
                { name: 'Active (30d)', value: metrics.activityAnalytics.active_last_30_days, color: '#10b981' },
                { name: 'Never Signed In', value: metrics.activityAnalytics.never_signed_in, color: '#f59e0b' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Last Updated */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {new Date(metrics.lastUpdated).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live data</span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
