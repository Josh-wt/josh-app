"use client"

import { useState, useEffect, useMemo } from "react"
import { GlassCard } from "@/components/glass-card"
import { 
  getAllMarketingMetrics, 
  formatNumber, 
  formatPercentage, 
  getGrowthColor, 
  getGrowthIcon,
  type MarketingMetrics,
  everythingEnglishClient
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
  Eye,
  Filter,
  Download,
  Search,
  Settings,
  Database,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Save,
  X
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

  // Enhanced Database browser state
  const [databaseTables, setDatabaseTables] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userEvaluations, setUserEvaluations] = useState<any[]>([])
  const [databaseLoading, setDatabaseLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  
  // Advanced sorting and filtering
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [showColumnFilters, setShowColumnFilters] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [tableSchema, setTableSchema] = useState<any>(null)
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')

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
      // Direct Supabase query to get table information
      const tables = [
        { 
          name: 'assessment_users', 
          displayName: 'Assessment Users', 
          description: 'User accounts and profiles',
          icon: 'Users',
          color: 'blue'
        },
        { 
          name: 'assessment_evaluations', 
          displayName: 'Evaluations', 
          description: 'Student evaluations and feedback',
          icon: 'FileText',
          color: 'green'
        },
        { 
          name: 'study_goals', 
          displayName: 'Study Goals', 
          description: 'User learning goals and progress',
          icon: 'Target',
          color: 'purple'
        },
        { 
          name: 'study_streaks', 
          displayName: 'Study Streaks', 
          description: 'User study streak data',
          icon: 'Zap',
          color: 'orange'
        },
        { 
          name: 'saved_resources', 
          displayName: 'Saved Resources', 
          description: 'User saved learning resources',
          icon: 'BookOpen',
          color: 'indigo'
        },
        { 
          name: 'subscriptions', 
          displayName: 'Subscriptions', 
          description: 'Subscription plans and billing',
          icon: 'CreditCard',
          color: 'emerald'
        }
      ]
      setDatabaseTables(tables)
    } catch (err) {
      console.error('Failed to fetch database tables:', err)
    } finally {
      setDatabaseLoading(false)
    }
  }

  const fetchTableData = async (tableName: string, limit: number = 100, offset: number = 0) => {
    try {
      setDatabaseLoading(true)
      
      // Direct Supabase query with enhanced features
      const { data, error, count } = await everythingEnglishClient
        .from(tableName)
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase query error:', error)
        throw error
      }

      setTableData(data || [])
      
      // Get table schema information
      const { data: schemaData } = await everythingEnglishClient
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', tableName)

      setTableSchema(schemaData || [])
      
      // Set default selected columns to all columns
      if (data && data.length > 0) {
        setSelectedColumns(Object.keys(data[0]))
      }
      
    } catch (err) {
      console.error('Failed to fetch table data:', err)
      setTableData([])
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

  // Advanced sorting function
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Advanced filtering functions
  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }))
  }

  const clearAllFilters = () => {
    setColumnFilters({})
    setSearchTerm('')
    setSortConfig(null)
  }

  // Process and filter data
  const processedTableData = useMemo(() => {
    let filtered = [...tableData]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(row =>
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [tableData, searchTerm, columnFilters, sortConfig])

  // Export functions
  const exportTableData = (format: 'csv' | 'json') => {
    const dataToExport = processedTableData.map(row => {
      const filteredRow: any = {}
      selectedColumns.forEach(col => {
        filteredRow[col] = row[col]
      })
      return filteredRow
    })

    if (format === 'csv') {
      const csvContent = convertToCSV(dataToExport)
      downloadFile(csvContent, `${selectedTable}-data.csv`, 'text/csv')
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2)
      downloadFile(jsonContent, `${selectedTable}-data.json`, 'application/json')
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ''
    
    const headers = selectedColumns.length > 0 ? selectedColumns : Object.keys(data[0])
    const csvRows = [headers.join(',')]
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      })
      csvRows.push(values.join(','))
    }
    
    return csvRows.join('\n')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

        {/* Enhanced Database Browser Tab */}
        {activeTab === 'database' && (
          <>
            {/* Database Tables Overview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">EverythingEnglish Database Explorer</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live Connection</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {databaseTables.map((table) => (
                  <GlassCard 
                    key={table.name} 
                    className="p-4 hover cursor-pointer transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      setSelectedTable(table.name)
                      fetchTableData(table.name)
                      setCurrentPage(1)
                      clearAllFilters()
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-${table.color}-100 flex items-center justify-center`}>
                          {table.icon === 'Users' && <Users className={`w-5 h-5 text-${table.color}-600`} />}
                          {table.icon === 'FileText' && <FileText className={`w-5 h-5 text-${table.color}-600`} />}
                          {table.icon === 'Target' && <Target className={`w-5 h-5 text-${table.color}-600`} />}
                          {table.icon === 'Zap' && <Zap className={`w-5 h-5 text-${table.color}-600`} />}
                          {table.icon === 'BookOpen' && <BookOpen className={`w-5 h-5 text-${table.color}-600`} />}
                          {table.icon === 'CreditCard' && <CreditCard className={`w-5 h-5 text-${table.color}-600`} />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{table.displayName}</h4>
                          <p className="text-xs text-slate-500 font-mono">{table.name}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${selectedTable === table.name ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <p className="text-sm text-slate-600">{table.description}</p>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Enhanced Table Data Browser */}
            {selectedTable && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {databaseTables.find(t => t.name === selectedTable)?.displayName} Data
                    </h3>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                      {processedTableData.length} records
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowColumnFilters(!showColumnFilters)}
                      className="glass-button px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                    <button
                      onClick={clearAllFilters}
                      className="glass-button px-3 py-2 rounded-lg text-sm"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => exportTableData(exportFormat)}
                      className="glass-button px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={() => fetchTableData(selectedTable)}
                      disabled={databaseLoading}
                      className="glass-button px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${databaseLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Advanced Search and Filters */}
                <GlassCard className="p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Global Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search all columns..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Items per page</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Export Format</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                  </div>
                </GlassCard>

                {databaseLoading ? (
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                      <span className="ml-2 text-slate-600">Loading data...</span>
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard className="p-4">
                    {/* Column Selection */}
                    {showColumnFilters && tableData.length > 0 && (
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-700 mb-3">Select Columns to Display</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.keys(tableData[0]).map((column) => (
                            <label key={column} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedColumns.includes(column)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedColumns([...selectedColumns, column])
                                  } else {
                                    setSelectedColumns(selectedColumns.filter(col => col !== column))
                                  }
                                }}
                                className="rounded border-slate-300"
                              />
                              <span className="text-sm text-slate-600">{column}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Sortable Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            {(selectedColumns.length > 0 ? selectedColumns : (tableData.length > 0 ? Object.keys(tableData[0]) : [])).map((key) => (
                              <th 
                                key={key} 
                                className="text-left py-3 px-3 font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 select-none"
                                onClick={() => handleSort(key)}
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{key}</span>
                                  {sortConfig && sortConfig.key === key && (
                                    sortConfig.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4" /> : 
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {processedTableData
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((row, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              {(selectedColumns.length > 0 ? selectedColumns : Object.keys(row)).map((key) => (
                                <td key={key} className="py-3 px-3 text-slate-600">
                                  {key === 'user_id' || key === 'uid' ? (
                                    <button
                                      onClick={() => {
                                        setSelectedUser(row)
                                        fetchUserEvaluations(String(row[key]))
                                      }}
                                      className="text-blue-600 hover:text-blue-800 underline font-mono text-xs"
                                    >
                                      {String(row[key]).substring(0, 8)}...
                                    </button>
                                  ) : key === 'email' ? (
                                    <a 
                                      href={`mailto:${row[key]}`} 
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {String(row[key])}
                                    </a>
                                  ) : key === 'created_at' || key === 'updated_at' ? (
                                    <span className="text-xs text-slate-500">
                                      {new Date(row[key]).toLocaleDateString()}
                                    </span>
                                  ) : key === 'subscription_status' ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      row[key] === 'active' ? 'bg-green-100 text-green-800' :
                                      row[key] === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-slate-100 text-slate-800'
                                    }`}>
                                      {String(row[key])}
                                    </span>
                                  ) : (
                                    <span className="truncate max-w-xs block">
                                      {String(row[key])}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Enhanced Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, processedTableData.length)} of {processedTableData.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-600">
                          Page {currentPage} of {Math.ceil(processedTableData.length / itemsPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(Math.ceil(processedTableData.length / itemsPerPage), currentPage + 1))}
                          disabled={currentPage >= Math.ceil(processedTableData.length / itemsPerPage)}
                          className="px-3 py-1 text-sm border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
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
