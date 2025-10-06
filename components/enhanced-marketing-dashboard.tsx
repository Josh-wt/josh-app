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
import { RealAnalyticsDashboard } from "@/components/real-analytics-dashboard"
import { realGoogleAnalyticsAPI, type StandardMetrics, type GeographicMetrics } from "@/lib/real-google-analytics-api"
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
  Clock,
  AlertCircle,
  BookOpen,
  Target,
  Award,
  Star,
  Zap,
  Brain,
  FileText,
  GraduationCap,
  Trophy,
  TrendingUp as TrendingUpIcon,
  UserPlus,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart,
  LineChart as LineChartIcon,
  Globe,
  Eye
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

export function EnhancedMarketingDashboard() {
  const [metrics, setMetrics] = useState<MarketingMetrics | null>(null)
  const [analyticsMetrics, setAnalyticsMetrics] = useState<StandardMetrics | null>(null)
  const [geographicData, setGeographicData] = useState<GeographicMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState(30)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'learning' | 'performance' | 'analytics' | 'database'>('overview')
  
  // Additional comprehensive metrics
  const [evaluationMetrics, setEvaluationMetrics] = useState<any>(null)
  const [userMetrics, setUserMetrics] = useState<any>(null)
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)

  // Database browser state
  const [databaseTables, setDatabaseTables] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userEvaluations, setUserEvaluations] = useState<any[]>([])
  const [databaseLoading, setDatabaseLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

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

  const fetchAnalyticsData = async (timeRange: number = selectedTimeRange) => {
    try {
      setAnalyticsError(null)
      const [standardMetrics, geographicMetrics] = await Promise.all([
        realGoogleAnalyticsAPI.getStandardMetrics(timeRange),
        realGoogleAnalyticsAPI.getGeographicMetrics(timeRange)
      ])
      setAnalyticsMetrics(standardMetrics)
      setGeographicData(geographicMetrics)
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
      console.error('Error fetching analytics data:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    fetchAnalyticsData()
    fetchComprehensiveMetrics()
    fetchDatabaseTables()
  }, [])

  const fetchComprehensiveMetrics = async () => {
    try {
      // Fetch evaluation metrics
      const evaluationResponse = await fetch('/api/analytics/evaluations')
      if (evaluationResponse.ok) {
        const evaluationData = await evaluationResponse.json()
        setEvaluationMetrics(evaluationData)
      }

      // Fetch user metrics
      const userResponse = await fetch('/api/analytics/users')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserMetrics(userData)
      }

      // Fetch engagement metrics
      const engagementResponse = await fetch('/api/analytics/engagement')
      if (engagementResponse.ok) {
        const engagementData = await engagementResponse.json()
        setEngagementMetrics(engagementData)
      }

      // Fetch performance metrics
      const performanceResponse = await fetch('/api/analytics/performance')
      if (performanceResponse.ok) {
        const performanceData = await performanceResponse.json()
        setPerformanceMetrics(performanceData)
      }
    } catch (err) {
      console.error('Failed to fetch comprehensive metrics:', err)
    }
  }

  const fetchDatabaseTables = async () => {
    try {
      setDatabaseLoading(true)
      const response = await fetch('/api/analytics/comprehensive')
      if (response.ok) {
        const data = await response.json()
        // Get table information from the comprehensive API
        const tables = [
          { name: 'assessment_users', displayName: 'Assessment Users', description: 'User accounts and profiles' },
          { name: 'assessment_evaluations', displayName: 'Evaluations', description: 'Student evaluations and feedback' },
          { name: 'study_goals', displayName: 'Study Goals', description: 'User learning goals and progress' },
          { name: 'study_streaks', displayName: 'Study Streaks', description: 'User study streak data' },
          { name: 'saved_resources', displayName: 'Saved Resources', description: 'User saved learning resources' },
          { name: 'subscriptions', displayName: 'Subscriptions', description: 'Subscription plans and billing' },
          { name: 'profiles', displayName: 'Profiles', description: 'User profile information' }
        ]
        setDatabaseTables(tables)
      }
    } catch (err) {
      console.error('Failed to fetch database tables:', err)
    } finally {
      setDatabaseLoading(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      setDatabaseLoading(true)
      const response = await fetch(`/api/analytics/standard?table=${tableName}&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setTableData(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch table data:', err)
    } finally {
      setDatabaseLoading(false)
    }
  }

  const fetchUserEvaluations = async (userId: string) => {
    try {
      setDatabaseLoading(true)
      const response = await fetch(`/api/analytics/standard?table=assessment_evaluations&filter=user_id:${userId}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setUserEvaluations(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch user evaluations:', err)
    } finally {
      setDatabaseLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchMetrics()
    fetchAnalyticsData()
    fetchComprehensiveMetrics()
  }

  const handleTimeRangeChange = (timeRange: number) => {
    setSelectedTimeRange(timeRange)
    setLoading(true)
    setAnalyticsLoading(true)
    fetchMetrics(timeRange)
    fetchAnalyticsData(timeRange)
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
              <h2 className="text-2xl font-bold text-slate-800">Enhanced Marketing Dashboard</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
              <h2 className="text-2xl font-bold text-slate-800">Enhanced Marketing Dashboard</h2>
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
            <h2 className="text-2xl font-bold text-slate-800">Enhanced Marketing Dashboard</h2>
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'assessments', label: 'Assessments', icon: FileText },
            { id: 'learning', label: 'Learning', icon: BookOpen },
            { id: 'performance', label: 'Performance', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: Globe },
            { id: 'database', label: 'Database Browser', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'glass-button bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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

              {/* Assessment Users */}
              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Assessment Users</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatNumber(metrics.assessmentAnalytics.total_assessment_users)}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              {/* Total Evaluations */}
              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Evaluations</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatNumber(metrics.assessmentAnalytics.total_evaluations)}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-500" />
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
                  <TrendingUpIcon className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>

            {/* Engagement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <GlassCard className="p-4">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-600">Active Users (7d)</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatNumber(metrics.assessmentAnalytics.active_assessment_users)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-600">Study Goals</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatNumber(metrics.learningProgressAnalytics.study_goals.total_goals)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-slate-600">Completion Rate</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {metrics.learningProgressAnalytics.study_goals.completion_rate}%
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Website Analytics Overview */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-slate-800">Website Analytics</h3>
                {analyticsError && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Analytics Error</span>
                  </div>
                )}
              </div>

              {/* Website Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <GlassCard className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-600">Website Visitors</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-slate-200 h-6 w-16 rounded"></div>
                        ) : (
                          formatNumber(analyticsMetrics?.totalUsers || 0)
                        )}
                      </p>
                      <p className="text-xs text-slate-500">Last {selectedTimeRange} days</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm text-slate-600">Sessions</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-slate-200 h-6 w-16 rounded"></div>
                        ) : (
                          formatNumber(analyticsMetrics?.sessions || 0)
                        )}
                      </p>
                      <p className="text-xs text-slate-500">Last {selectedTimeRange} days</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="text-sm text-slate-600">Page Views</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-slate-200 h-6 w-16 rounded"></div>
                        ) : (
                          formatNumber(analyticsMetrics?.screenPageViews || 0)
                        )}
                      </p>
                      <p className="text-xs text-slate-500">Last {selectedTimeRange} days</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm text-slate-600">Avg Session</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-slate-200 h-6 w-16 rounded"></div>
                        ) : (
                          analyticsMetrics ? 
                            `${Math.floor(analyticsMetrics.averageSessionDuration / 60)}:${Math.floor(analyticsMetrics.averageSessionDuration % 60).toString().padStart(2, '0')}` :
                            '0:00'
                        )}
                      </p>
                      <p className="text-xs text-slate-500">Duration</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Top Traffic Locations */}
              {geographicData.length > 0 && (
                <GlassCard className="p-4">
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">Top Traffic Locations</h4>
                  <div className="space-y-2">
                    {geographicData.slice(0, 5).map((location, index) => (
                      <div key={location.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                            {index + 1}
                          </div>
                          <span className="text-slate-700 font-medium">{location.country}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>{formatNumber(location.sessions)} sessions</span>
                          <span>{formatNumber(location.totalUsers)} users</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <>
            {/* Assessment Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Evaluations</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {evaluationMetrics?.total_evaluations || 0}
                    </p>
                    <p className="text-xs text-slate-500">All time</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Recent Evaluations</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {evaluationMetrics?.recent_evaluations || 0}
                    </p>
                    <p className="text-xs text-slate-500">Last 30 days</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Return Users</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {evaluationMetrics?.return_users || 0}
                    </p>
                    <p className="text-xs text-slate-500">
                      {evaluationMetrics?.return_rate || 0}% return rate
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Avg per User</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {evaluationMetrics?.avg_evaluations_per_user?.toFixed(1) || 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Daily Evaluations Chart */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Evaluations (30d)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evaluationMetrics?.daily_trends || []}>
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
                      />
                      <Area 
                        type="monotone" 
                        dataKey="evaluations" 
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="unique_users" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Question Type Breakdown */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Question Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={evaluationMetrics?.question_types || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, count }) => `${name}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {(evaluationMetrics?.question_types || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* Academic Level Breakdown */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Academic Level Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.assessmentAnalytics.academic_level_breakdown.map((level, index) => (
                  <div key={level.academic_level} className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 capitalize">
                        {level.academic_level.replace('_', ' ')}
                      </h4>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{formatNumber(level.user_count)}</p>
                    <p className="text-sm text-slate-600">Avg {level.avg_questions_marked} questions marked</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {/* Learning Tab */}
        {activeTab === 'learning' && (
          <>
            {/* Learning Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Study Streaks</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {engagementMetrics?.study_streaks || 0}
                    </p>
                    <p className="text-xs text-slate-500">Active streaks</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Max Streak</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {engagementMetrics?.max_streak || 0}
                    </p>
                    <p className="text-xs text-slate-500">days</p>
                  </div>
                  <Trophy className="w-8 h-8 text-orange-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Saved Resources</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {engagementMetrics?.saved_resources || 0}
                    </p>
                    <p className="text-xs text-slate-500">Total saved</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Goal Completion</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {engagementMetrics?.goal_completion_rate || 0}%
                    </p>
                    <p className="text-xs text-slate-500">Success rate</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>
            </div>

            {/* Engagement Levels */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">User Engagement Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(metrics.learningProgressAnalytics.user_engagement_levels.highly_engaged)}</p>
                  <p className="text-sm text-slate-600">Highly Engaged</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(metrics.learningProgressAnalytics.user_engagement_levels.moderately_engaged)}</p>
                  <p className="text-sm text-slate-600">Moderately Engaged</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(metrics.learningProgressAnalytics.user_engagement_levels.low_engagement)}</p>
                  <p className="text-sm text-slate-600">Low Engagement</p>
                </div>
              </div>
            </GlassCard>

            {/* Study Streaks Chart */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Study Streak Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={[
                    { name: 'Current Streak', value: metrics.learningProgressAnalytics.study_streaks.avg_current_streak },
                    { name: 'Longest Streak', value: metrics.learningProgressAnalytics.study_streaks.avg_longest_streak },
                    { name: 'Total Study Days', value: metrics.learningProgressAnalytics.study_streaks.total_study_days / 10 }
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
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <>
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {performanceMetrics?.conversion_rate || 0}%
                    </p>
                    <p className="text-xs text-slate-500">{formatNumber(metrics.performanceInsights.subscription_analytics.total_subscribers)} subscribers</p>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-green-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Retention Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {performanceMetrics?.retention_rate || 0}%
                    </p>
                    <p className="text-xs text-slate-500">7-day retention</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Users (7d)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {userMetrics?.new_users_7d || 0}
                    </p>
                    <p className="text-xs text-slate-500">vs {userMetrics?.new_users_30d || 0} (30d)</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-500" />
                </div>
              </GlassCard>

              <GlassCard className="p-4 hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Feedback Quality</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {performanceMetrics?.feedback_quality || 0}%
                    </p>
                    <p className="text-xs text-slate-500">Positive feedback</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </GlassCard>
            </div>

            {/* Content Performance */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Most Popular Question Types</h3>
              <div className="space-y-3">
                {metrics.performanceInsights.content_performance.most_popular_question_types.map((type, index) => (
                  <div key={type.question_type} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" 
                           style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 capitalize">
                          {type.question_type.replace('igcse_', '').replace('alevel_', '').replace('_', ' ')}
                        </p>
                        <p className="text-sm text-slate-600">{formatNumber(type.unique_users)} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{formatNumber(type.evaluation_count)}</p>
                      <p className="text-sm text-slate-600">evaluations</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Academic Level Distribution */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Academic Level Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={metrics.performanceInsights.content_performance.academic_level_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, percentage }) => `${level}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="user_count"
                    >
                      {metrics.performanceInsights.content_performance.academic_level_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <RealAnalyticsDashboard days={selectedTimeRange} />
        )}

        {/* Database Browser Tab */}
        {activeTab === 'database' && (
          <>
            {/* Database Tables Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Database Tables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {databaseTables.map((table) => (
                  <GlassCard 
                    key={table.name} 
                    className="p-4 hover cursor-pointer"
                    onClick={() => {
                      setSelectedTable(table.name)
                      fetchTableData(table.name)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{table.displayName}</h4>
                      <div className={`w-3 h-3 rounded-full ${selectedTable === table.name ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{table.description}</p>
                    <p className="text-xs text-slate-500 font-mono">{table.name}</p>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Table Data Browser */}
            {selectedTable && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {databaseTables.find(t => t.name === selectedTable)?.displayName} Data
                  </h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => fetchTableData(selectedTable)}
                      disabled={databaseLoading}
                      className="glass-button px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${databaseLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {databaseLoading ? (
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                      <span className="ml-2 text-slate-600">Loading data...</span>
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                              <th key={key} className="text-left py-2 px-3 font-semibold text-slate-700">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData
                            .filter((row) => 
                              searchTerm === '' || 
                              Object.values(row).some(value => 
                                String(value).toLowerCase().includes(searchTerm.toLowerCase())
                              )
                            )
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((row, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              {Object.entries(row).map(([key, value]) => (
                                <td key={key} className="py-2 px-3 text-slate-600">
                                  {key === 'user_id' || key === 'uid' ? (
                                    <button
                                      onClick={() => {
                                        setSelectedUser(row)
                                        fetchUserEvaluations(String(value))
                                      }}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {String(value).substring(0, 8)}...
                                    </button>
                                  ) : key === 'email' ? (
                                    <span className="font-medium text-slate-800">{String(value)}</span>
                                  ) : (
                                    <span className="max-w-xs truncate block">
                                      {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {tableData.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <div className="text-sm text-slate-600">
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tableData.length)} of {tableData.length} entries
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="glass-button px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage * itemsPerPage >= tableData.length}
                            className="glass-button px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                )}
              </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
              <div className="mb-6">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">User Details</h3>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">User Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Email:</span> {selectedUser.email || 'N/A'}</div>
                        <div><span className="font-medium">UID:</span> {selectedUser.uid || selectedUser.user_id || 'N/A'}</div>
                        <div><span className="font-medium">Display Name:</span> {selectedUser.display_name || 'N/A'}</div>
                        <div><span className="font-medium">Academic Level:</span> {selectedUser.academic_level || 'N/A'}</div>
                        <div><span className="font-medium">Created:</span> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Activity Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Questions Marked:</span> {selectedUser.questions_marked || 0}</div>
                        <div><span className="font-medium">Credits:</span> {selectedUser.credits || 0}</div>
                        <div><span className="font-medium">Current Plan:</span> {selectedUser.current_plan || 'free'}</div>
                        <div><span className="font-medium">Subscription Status:</span> {selectedUser.subscription_status || 'free'}</div>
                        <div><span className="font-medium">Launch User:</span> {selectedUser.is_launch_user ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>

                  {/* User Evaluations */}
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Recent Evaluations ({userEvaluations.length})</h4>
                    {userEvaluations.length > 0 ? (
                      <div className="space-y-3">
                        {userEvaluations.slice(0, 5).map((evaluation, index) => (
                          <div key={index} className="glass-panel p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-800">
                                {evaluation.question_type || 'Unknown Type'}
                              </span>
                              <span className="text-sm text-slate-500">
                                {evaluation.timestamp ? new Date(evaluation.timestamp).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 mb-2">
                              <span className="font-medium">Grade:</span> {evaluation.grade || 'N/A'}
                            </div>
                            {evaluation.student_response && (
                              <div className="text-sm text-slate-600">
                                <span className="font-medium">Response:</span> 
                                <p className="mt-1 p-2 bg-slate-50 rounded text-xs">
                                  {evaluation.student_response.length > 200 
                                    ? `${evaluation.student_response.substring(0, 200)}...` 
                                    : evaluation.student_response}
                                </p>
                              </div>
                            )}
                            {evaluation.feedback && (
                              <div className="text-sm text-slate-600 mt-2">
                                <span className="font-medium">Feedback:</span>
                                <p className="mt-1 p-2 bg-blue-50 rounded text-xs">
                                  {evaluation.feedback.length > 200 
                                    ? `${evaluation.feedback.substring(0, 200)}...` 
                                    : evaluation.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                        {userEvaluations.length > 5 && (
                          <div className="text-center text-sm text-slate-500">
                            ... and {userEvaluations.length - 5} more evaluations
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No evaluations found for this user</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </GlassCard>

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
