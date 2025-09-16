"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Edit,
  Trash2,
  Pause,
  Play,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Bell,
  Settings,
  Download,
  Upload,
  Archive,
  Tag,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  Gamepad2,
  BookOpen,
  Music,
  Video,
  Camera,
  Palette,
  Code,
  Database,
  Cloud,
  Shield,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PlusCircle,
  List,
  Grid3X3,
  LayoutGrid
} from "lucide-react"
import type { Subscription, SubscriptionAnalytics } from "@/lib/types/subscription"

const iconMap: { [key: string]: React.ElementType } = {
  'entertainment': Video,
  'productivity': Target,
  'development': Code,
  'music': Music,
  'design': Palette,
  'gaming': Gamepad2,
  'education': BookOpen,
  'photography': Camera,
  'cloud': Cloud,
  'security': Shield,
  'default': CreditCard
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics>({
    totalMonthly: 0,
    totalYearly: 0,
    activeSubscriptions: 0,
    cancelledThisMonth: 0,
    savingsThisMonth: 0,
    upcomingBills: 0,
    categoryBreakdown: {},
    spendingTrend: [],
    topCategories: []
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  const supabase = createClient()

  // Fetch subscriptions data
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)

        // Fetch subscriptions
        const { data: subsData, error: subsError } = await supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: false })

        if (subsError) throw subsError

        const transformedSubs = subsData?.map(sub => ({
          ...sub,
          cost: parseFloat(sub.cost),
          annual_cost: parseFloat(sub.annual_cost),
          current_usage: sub.current_usage || 0,
          reminder_days: sub.reminder_days || [7, 3, 1],
          tags: sub.tags || [],
          is_essential: sub.is_essential || false,
          auto_renew: sub.auto_renew || true
        })) || []

        setSubscriptions(transformedSubs)

        // Calculate analytics
        const totalMonthly = transformedSubs
          .filter(sub => sub.billing_cycle === 'monthly' && sub.status === 'active')
          .reduce((sum, sub) => sum + sub.cost, 0)

        const totalYearly = transformedSubs
          .filter(sub => sub.billing_cycle === 'yearly' && sub.status === 'active')
          .reduce((sum, sub) => sum + sub.cost, 0)

        const activeSubscriptions = transformedSubs.filter(sub => sub.status === 'active').length

        const categoryBreakdown = transformedSubs.reduce((acc, sub) => {
          if (sub.status === 'active') {
            acc[sub.category] = (acc[sub.category] || 0) + sub.cost
          }
          return acc
        }, {} as { [key: string]: number })

        const topCategories = Object.entries(categoryBreakdown)
          .map(([category, amount]) => ({
            category,
            amount: amount as number,
            count: transformedSubs.filter(sub => sub.category === category && sub.status === 'active').length
          }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)

        setAnalytics({
          totalMonthly,
          totalYearly,
          activeSubscriptions,
          cancelledThisMonth: 0, // You can calculate this based on end_date
          savingsThisMonth: 0, // You can calculate this from payment history
          upcomingBills: transformedSubs
            .filter(sub => sub.status === 'active')
            .reduce((sum, sub) => sum + sub.cost, 0),
          categoryBreakdown,
          spendingTrend: [], // You can calculate this from payment history
          topCategories
        })

      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [supabase])

  // Filtered and sorted subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (sub.description && sub.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (sub.tags && sub.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesStatus = filterStatus === "all" || sub.status === filterStatus
      const matchesCategory = filterCategory === "all" || sub.category === filterCategory

      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "cost":
          return b.cost - a.cost
        case "nextBilling":
          return new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime()
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  }, [subscriptions, searchTerm, filterStatus, filterCategory, sortBy])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(subscriptions.map(sub => sub.category))]
    return cats.sort()
  }, [subscriptions])

  // Get status counts
  const statusCounts = useMemo(() => {
    return subscriptions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
  }, [subscriptions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilBilling = (dateString: string) => {
    const today = new Date()
    const billingDate = new Date(dateString)
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100"
      case "trial": return "text-blue-600 bg-blue-100"
      case "paused": return "text-yellow-600 bg-yellow-100"
      case "cancelled": return "text-red-600 bg-red-100"
      case "expired": return "text-gray-600 bg-gray-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle
      case "trial": return Clock
      case "paused": return Pause
      case "cancelled": return Minus
      case "expired": return AlertTriangle
      default: return AlertTriangle
    }
  }

  const getCategoryIcon = (category: string) => {
    const normalizedCategory = category.toLowerCase()
    return iconMap[normalizedCategory] || iconMap['default']
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-600" />
            <p className="text-slate-600">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Subscription Manager
          </h1>
          <p className="text-slate-600 mt-1">
            Track, manage, and optimize your subscriptions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            variant="outline"
            className="glass-button"
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="glass-button">
            <PlusCircle className="w-4 h-4" />
            Add Subscription
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <GlassCard className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm text-slate-600">Monthly Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.totalMonthly)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-600">Yearly Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.totalYearly)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-slate-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{analytics.activeSubscriptions}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-slate-600">Upcoming Bills</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.upcomingBills)}</p>
        </div>
      </GlassCard>

      {/* Filters and Search */}
      <GlassCard className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 glass-input">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-32 glass-input">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 glass-input">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
              <SelectItem value="nextBilling">Next Billing</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Subscription List/Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {filteredSubscriptions.length === 0 && !loading ? (
          <GlassCard className="col-span-full p-6 text-center text-slate-500">
            No subscriptions found matching your criteria.
          </GlassCard>
        ) : (
          filteredSubscriptions.map((sub) => {
            const CategoryIcon = getCategoryIcon(sub.category)
            const StatusIcon = getStatusIcon(sub.status)
            const daysUntilBilling = getDaysUntilBilling(sub.next_billing_date)
            const usagePercentage = sub.usage_limit ? (sub.current_usage / sub.usage_limit) * 100 : 0

            return viewMode === "grid" ? (
              <GlassCard key={sub.id} className="p-5 space-y-4 relative overflow-hidden group glass-hover">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(sub.status)} border-0`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {sub.status}
                  </Badge>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: sub.color }}
                  >
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{sub.name}</h3>
                    <p className="text-sm text-slate-600 truncate">{sub.category}</p>
                  </div>
                </div>

                {/* Cost and Billing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-800">{formatCurrency(sub.cost)}</span>
                    <span className="text-sm text-slate-600 capitalize">{sub.billing_cycle}</span>
                  </div>
                  
                  {sub.annual_cost > 0 && (
                    <p className="text-sm text-slate-500">
                      {formatCurrency(sub.annual_cost)}/year
                    </p>
                  )}
                </div>

                {/* Next Billing */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Next billing:</span>
                  <span className={`font-medium ${daysUntilBilling <= 3 ? 'text-red-600' : 'text-slate-800'}`}>
                    {formatDate(sub.next_billing_date)} ({daysUntilBilling} days)
                  </span>
                </div>

                {/* Usage Progress */}
                {sub.usage_limit && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Usage</span>
                      <span className="text-slate-800">
                        {sub.current_usage}/{sub.usage_limit} {sub.usage_unit}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                )}

                {/* Tags */}
                {sub.tags && sub.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sub.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {sub.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{sub.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 glass-button"
                    onClick={() => {
                      setSelectedSubscription(sub)
                      setShowDetailsModal(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass-button"
                    onClick={() => {
                      // Handle edit
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {sub.website_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button"
                      onClick={() => window.open(sub.website_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </GlassCard>
            ) : (
              <GlassCard key={sub.id} className="p-5 flex items-center justify-between space-x-4 glass-hover">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: sub.color }}
                  >
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800 truncate">{sub.name}</h3>
                      <Badge className={`${getStatusColor(sub.status)} border-0 text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{sub.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(sub.cost)}</p>
                    <p className="text-slate-600 capitalize">{sub.billing_cycle}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-slate-600">Next billing</p>
                    <p className={`font-medium ${getDaysUntilBilling(sub.next_billing_date) <= 3 ? 'text-red-600' : 'text-slate-800'}`}>
                      {formatDate(sub.next_billing_date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button"
                      onClick={() => {
                        setSelectedSubscription(sub)
                        setShowDetailsModal(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button"
                      onClick={() => {
                        // Handle edit
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {sub.website_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass-button"
                        onClick={() => window.open(sub.website_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            )
          })
        )}
      </div>

      {/* Add Subscription Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-600">Add subscription form will be implemented here.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddModal(false)}>
                Add Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Details Modal */}
      {selectedSubscription && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedSubscription.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-slate-600">Subscription details will be implemented here.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
