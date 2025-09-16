export interface Subscription {
  id: string
  user_id: string
  name: string
  description?: string
  cost: number
  billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time'
  category: string
  payment_method?: string
  website_url?: string
  logo_url?: string
  color: string
  
  // Dates
  start_date: string
  next_billing_date: string
  end_date?: string
  trial_end_date?: string
  
  // Status and tracking
  status: 'active' | 'paused' | 'cancelled' | 'trial' | 'expired'
  is_essential: boolean
  auto_renew: boolean
  
  // Usage tracking
  usage_limit?: number
  current_usage: number
  usage_unit?: string
  
  // Notifications
  reminder_days: number[]
  last_reminder_sent?: string
  
  // Financial tracking
  annual_cost: number
  
  // Metadata
  tags?: string[]
  notes?: string
  rating?: number
  last_used_date?: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface SubscriptionPayment {
  id: string
  subscription_id: string
  user_id: string
  amount: number
  payment_date: string
  payment_method?: string
  transaction_id?: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  notes?: string
  created_at: string
}

export interface SubscriptionUsage {
  id: string
  subscription_id: string
  user_id: string
  usage_date: string
  usage_amount: number
  usage_type?: string
  notes?: string
  created_at: string
}

export interface SubscriptionAlert {
  id: string
  subscription_id: string
  user_id: string
  alert_type: 'renewal' | 'usage_limit' | 'price_change' | 'trial_ending' | 'custom'
  alert_date: string
  message: string
  is_sent: boolean
  is_read: boolean
  created_at: string
}

export interface SubscriptionAnalytics {
  totalMonthly: number
  totalYearly: number
  activeSubscriptions: number
  cancelledThisMonth: number
  savingsThisMonth: number
  upcomingBills: number
  categoryBreakdown: { [key: string]: number }
  spendingTrend: { month: string; amount: number }[]
  topCategories: { category: string; amount: number; count: number }[]
}
