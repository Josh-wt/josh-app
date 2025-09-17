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
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [reminders, setReminders] = useState<any[]>([])
  const [showReminders, setShowReminders] = useState(false)
  
  // state
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    description: '',
    cost: '',
    billing_cycle: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time',
    category: '',
    payment_method: '',
    website_url: '',
    logo_url: '',
    color: '#3B82F6',
    start_date: new Date().toISOString().split('T')[0],
    next_billing_date: '',
    end_date: '',
    trial_end_date: '',
    status: 'active' as 'active' | 'paused' | 'cancelled' | 'trial' | 'expired',
    is_essential: false,
    auto_renew: true,
    usage_limit: '',
    current_usage: 0,
    usage_unit: '',
    reminder_days: [1, 7],
    tags: '',
    notes: '',
    rating: 5
  })
  
  // Form submission handler
  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const subscriptionData = {
        ...newSubscription,
        cost: parseFloat(newSubscription.cost),
        usage_limit: newSubscription.usage_limit ? parseInt(newSubscription.usage_limit) : null,
        tags: newSubscription.tags ? newSubscription.tags.split(',').map(tag => tag.trim()) : [],
        annual_cost: calculateAnnualCost(parseFloat(newSubscription.cost), newSubscription.billing_cycle),
        // Convert empty date strings to null
        next_billing_date: newSubscription.next_billing_date || null,
        end_date: newSubscription.end_date || null,
        trial_end_date: newSubscription.trial_end_date || null
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
      
      if (error) {
        console.error('Error adding subscription:', error)
        return
      }
      
      // Refresh the subscriptions list
      await fetchSubscriptions()
      
      // Reset form and close modal
      setNewSubscription({
        name: '',
        description: '',
        cost: '',
        billing_cycle: 'monthly',
        category: '',
        payment_method: '',
        website_url: '',
        logo_url: '',
        color: '#3B82F6',
        start_date: new Date().toISOString().split('T')[0],
        next_billing_date: '',
        end_date: '',
        trial_end_date: '',
        status: 'active',
        is_essential: false,
        auto_renew: true,
        usage_limit: '',
        current_usage: 0,
        usage_unit: '',
        reminder_days: [1, 7],
        tags: '',
        notes: '',
        rating: 5
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding subscription:', error)
    }
  }

  // Edit subscription function
  const handleEditSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubscription) return
    
    try {
      const subscriptionData = {
        ...editingSubscription,
        cost: parseFloat(editingSubscription.cost.toString()),
        usage_limit: editingSubscription.usage_limit ? parseInt(editingSubscription.usage_limit.toString()) : null,
        tags: Array.isArray(editingSubscription.tags) ? editingSubscription.tags : 
              (editingSubscription.tags ? (editingSubscription.tags as string).split(',').map((tag: string) => tag.trim()) : []),
        annual_cost: calculateAnnualCost(parseFloat(editingSubscription.cost.toString()), editingSubscription.billing_cycle),
        // Convert empty date strings to null
        next_billing_date: editingSubscription.next_billing_date || null,
        end_date: editingSubscription.end_date || null,
        trial_end_date: editingSubscription.trial_end_date || null
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', editingSubscription.id)
        .select()
      
      if (error) {
        console.error('Error updating subscription:', error)
        return
      }
      
      // Refresh the subscriptions list
      await fetchSubscriptions()
      
      // Close modal and reset
      setEditingSubscription(null)
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  // Delete subscription function
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting subscription:', error)
        return
      }
      
      // Refresh the subscriptions list
      await fetchSubscriptions()
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  // Enhanced billing cycle calculations
  const calculateNextBillingDate = (startDate: string, billingCycle: string, currentNextBilling?: string) => {
    const start = new Date(startDate)
    const now = new Date()
    
    if (currentNextBilling && new Date(currentNextBilling) > now) {
      return currentNextBilling
    }
    
    let nextBilling = new Date(start)
    
    switch (billingCycle) {
      case 'weekly':
        while (nextBilling <= now) {
          nextBilling.setDate(nextBilling.getDate() + 7)
        }
        break
      case 'monthly':
        while (nextBilling <= now) {
          nextBilling.setMonth(nextBilling.getMonth() + 1)
        }
        break
      case 'quarterly':
        while (nextBilling <= now) {
          nextBilling.setMonth(nextBilling.getMonth() + 3)
        }
        break
      case 'yearly':
        while (nextBilling <= now) {
          nextBilling.setFullYear(nextBilling.getFullYear() + 1)
        }
        break
      case 'one-time':
        return null
    }
    
    return nextBilling.toISOString().split('T')[0]
  }

  // Generate reminders based on subscription data
  const generateReminders = () => {
    const today = new Date()
    const reminders: any[] = []
    
    subscriptions.forEach(sub => {
      if (sub.status === 'active' && sub.next_billing_date) {
        const billingDate = new Date(sub.next_billing_date)
        const daysUntil = Math.ceil((billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        // Check if reminder should be shown based on reminder_days
        if (sub.reminder_days && sub.reminder_days.includes(daysUntil)) {
          reminders.push({
            id: `billing-${sub.id}`,
            type: 'billing',
            title: `${sub.name} billing due`,
            message: `Your ${sub.name} subscription will be billed ${formatCurrency(sub.cost)} in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
            date: sub.next_billing_date,
            subscription: sub,
            priority: daysUntil <= 1 ? 'high' : daysUntil <= 3 ? 'medium' : 'low'
          })
        }
        
        // Check for trial ending
        if ((sub.status as any) === 'trial' && sub.trial_end_date) {
          const trialEnd = new Date(sub.trial_end_date)
          const daysUntilTrialEnd = Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntilTrialEnd <= 3 && daysUntilTrialEnd >= 0) {
            reminders.push({
              id: `trial-${sub.id}`,
              type: 'trial',
              title: `${sub.name} trial ending`,
              message: `Your ${sub.name} trial ends in ${daysUntilTrialEnd} day${daysUntilTrialEnd !== 1 ? 's' : ''}`,
              date: sub.trial_end_date,
              subscription: sub,
              priority: 'high'
            })
          }
        }
      }
    })
    
    return reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  
  // Helper function to calculate annual cost
  const calculateAnnualCost = (cost: number, cycle: string) => {
    switch (cycle) {
      case 'weekly': return cost * 52
      case 'monthly': return cost * 12
      case 'quarterly': return cost * 4
      case 'yearly': return cost
      case 'one-time': return cost
      default: return cost * 12
    }
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const supabase = createClient()

  // Fetch subscriptions function
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
        id: sub.id,
        user_id: sub.user_id,
        name: sub.name,
        description: sub.description,
        cost: sub.cost,
        billing_cycle: sub.billing_cycle,
        category: sub.category,
        payment_method: sub.payment_method,
        website_url: sub.website_url,
        logo_url: sub.logo_url,
        color: sub.color,
        start_date: sub.start_date,
        next_billing_date: sub.next_billing_date,
        end_date: sub.end_date,
        trial_end_date: sub.trial_end_date,
        status: sub.status,
        is_essential: sub.is_essential,
        auto_renew: sub.auto_renew,
        usage_limit: sub.usage_limit,
        current_usage: sub.current_usage,
        usage_unit: sub.usage_unit,
        reminder_days: sub.reminder_days || [],
        last_reminder_sent: sub.last_reminder_sent,
        annual_cost: sub.annual_cost,
        tags: sub.tags || [],
        notes: sub.notes,
        rating: sub.rating,
        last_used_date: sub.last_used_date,
        created_at: sub.created_at,
        updated_at: sub.updated_at
      })) || []

      setSubscriptions(transformedSubs)

      // Calculate analytics
      const totalCost = transformedSubs.reduce((sum, sub) => sum + (sub.cost || 0), 0)
      const activeSubs = transformedSubs.filter(sub => sub.status === 'active')
      const activeCost = activeSubs.reduce((sum, sub) => sum + (sub.cost || 0), 0)
      
      const categoryBreakdown = transformedSubs.reduce((acc, sub) => {
        if (sub.status === 'active') {
          acc[sub.category] = (acc[sub.category] || 0) + (sub.cost || 0)
        }
        return acc
      }, {} as Record<string, number>)

      const topCategories = Object.entries(categoryBreakdown)
        .map(([category, amount]) => ({
          category,
          amount: amount as number,
          count: transformedSubs.filter(sub => sub.category === category && sub.status === 'active').length
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      setAnalytics({
        totalMonthly: totalCost,
        totalYearly: transformedSubs.reduce((sum, sub) => sum + calculateAnnualCost(sub.cost || 0, sub.billing_cycle), 0),
        activeSubscriptions: activeSubs.length,
        cancelledThisMonth: transformedSubs.filter(sub => sub.status === 'cancelled' && 
          new Date(sub.updated_at).getMonth() === new Date().getMonth()).length,
        savingsThisMonth: 0, // Could be calculated based on cancelled subscriptions
        upcomingBills: transformedSubs.filter(sub => sub.status === 'active' && sub.next_billing_date &&
          new Date(sub.next_billing_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length,
        categoryBreakdown,
        spendingTrend: [], // Could be calculated from historical data
        topCategories
      })

    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch subscriptions data
  useEffect(() => {
    fetchSubscriptions()
  }, [])

  // Update reminders when subscriptions change
  useEffect(() => {
    if (subscriptions.length > 0) {
      setReminders(generateReminders())
    }
  }, [subscriptions])

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
          if (!a.next_billing_date && !b.next_billing_date) return 0
          if (!a.next_billing_date) return 1
          if (!b.next_billing_date) return -1
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilBilling = (dateString: string | null) => {
    if (!dateString) return 0
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

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <GlassCard className="p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Reminders</h3>
                <p className="text-sm text-slate-600">Upcoming bills and trial endings</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReminders(!showReminders)}
              className="glass-button"
            >
              {showReminders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          
          {showReminders && (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reminder.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : reminder.priority === 'medium'
                      ? 'bg-orange-50 border-orange-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{reminder.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{reminder.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Due: {formatDate(reminder.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass-button"
                        onClick={() => {
                          setEditingSubscription(reminder.subscription)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

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
                      setEditingSubscription(sub)
                      setShowEditModal(true)
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
                        setEditingSubscription(sub)
                        setShowEditModal(true)
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
            <form onSubmit={handleAddSubscription} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="name">Subscription Name *</Label>
                    <Input
                      id="name"
                      value={newSubscription.name}
                      onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                      placeholder="e.g., Netflix, Spotify"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newSubscription.description}
                      onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                      placeholder="Brief description of the service"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newSubscription.category}
                      onValueChange={(value) => setNewSubscription({...newSubscription, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="cloud">Cloud Services</SelectItem>
                        <SelectItem value="fitness">Fitness & Health</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="news">News & Media</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Billing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Billing Information</h3>
                  
                  <div>
                    <Label htmlFor="cost">Cost *</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={newSubscription.cost}
                      onChange={(e) => setNewSubscription({...newSubscription, cost: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="billing_cycle">Billing Cycle *</Label>
                    <Select
                      value={newSubscription.billing_cycle}
                      onValueChange={(value: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time') => 
                        setNewSubscription({...newSubscription, billing_cycle: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Input
                      id="payment_method"
                      value={newSubscription.payment_method}
                      onChange={(e) => setNewSubscription({...newSubscription, payment_method: e.target.value})}
                      placeholder="e.g., Credit Card, PayPal"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={newSubscription.website_url}
                      onChange={(e) => setNewSubscription({...newSubscription, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newSubscription.start_date}
                      onChange={(e) => setNewSubscription({...newSubscription, start_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="next_billing_date">Next Billing Date</Label>
                    <Input
                      id="next_billing_date"
                      type="date"
                      value={newSubscription.next_billing_date}
                      onChange={(e) => setNewSubscription({...newSubscription, next_billing_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newSubscription.tags}
                    onChange={(e) => setNewSubscription({...newSubscription, tags: e.target.value})}
                    placeholder="e.g., streaming, entertainment, family"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newSubscription.notes}
                    onChange={(e) => setNewSubscription({...newSubscription, notes: e.target.value})}
                    placeholder="Additional notes about this subscription"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Subscription
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingSubscription && (
              <form onSubmit={handleEditSubscription} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                    
                    <div>
                      <Label htmlFor="edit_name">Subscription Name *</Label>
                      <Input
                        id="edit_name"
                        value={editingSubscription.name}
                        onChange={(e) => setEditingSubscription({...editingSubscription, name: e.target.value})}
                        placeholder="e.g., Netflix, Spotify"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_description">Description</Label>
                      <Input
                        id="edit_description"
                        value={editingSubscription.description || ''}
                        onChange={(e) => setEditingSubscription({...editingSubscription, description: e.target.value})}
                        placeholder="Brief description"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_cost">Cost *</Label>
                      <Input
                        id="edit_cost"
                        type="number"
                        step="0.01"
                        value={editingSubscription.cost}
                        onChange={(e) => setEditingSubscription({...editingSubscription, cost: parseFloat(e.target.value)})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_billing_cycle">Billing Cycle *</Label>
                      <Select
                        value={editingSubscription.billing_cycle}
                        onValueChange={(value: any) => setEditingSubscription({...editingSubscription, billing_cycle: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="one-time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Additional Information</h3>
                    
                    <div>
                      <Label htmlFor="edit_category">Category</Label>
                      <Select
                        value={editingSubscription.category}
                        onValueChange={(value) => setEditingSubscription({...editingSubscription, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="cloud">Cloud</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_payment_method">Payment Method</Label>
                      <Input
                        id="edit_payment_method"
                        value={editingSubscription.payment_method || ''}
                        onChange={(e) => setEditingSubscription({...editingSubscription, payment_method: e.target.value})}
                        placeholder="e.g., Credit Card, PayPal"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_website_url">Website URL</Label>
                      <Input
                        id="edit_website_url"
                        type="url"
                        value={editingSubscription.website_url || ''}
                        onChange={(e) => setEditingSubscription({...editingSubscription, website_url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_status">Status</Label>
                      <Select
                        value={editingSubscription.status}
                        onValueChange={(value: any) => setEditingSubscription({...editingSubscription, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_start_date">Start Date</Label>
                    <Input
                      id="edit_start_date"
                      type="date"
                      value={editingSubscription.start_date}
                      onChange={(e) => setEditingSubscription({...editingSubscription, start_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit_next_billing_date">Next Billing Date</Label>
                    <Input
                      id="edit_next_billing_date"
                      type="date"
                      value={editingSubscription.next_billing_date || ''}
                      onChange={(e) => setEditingSubscription({...editingSubscription, next_billing_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit_tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit_tags"
                    value={Array.isArray(editingSubscription.tags) ? editingSubscription.tags.join(', ') : (editingSubscription.tags || '')}
                    onChange={(e) => setEditingSubscription({...editingSubscription, tags: e.target.value as any})}
                    placeholder="e.g., streaming, entertainment, family"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit_notes">Notes</Label>
                  <Input
                    id="edit_notes"
                    value={editingSubscription.notes || ''}
                    onChange={(e) => setEditingSubscription({...editingSubscription, notes: e.target.value})}
                    placeholder="Additional notes about this subscription"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Subscription
                  </Button>
                </div>
              </form>
            )}
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
 