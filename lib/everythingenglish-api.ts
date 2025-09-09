import { createClient } from '@supabase/supabase-js'

const EVERYTHINGENGLISH_URL = 'https://zwrwtqspeyajttnuzwkl.supabase.co'
const EVERYTHINGENGLISH_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cnd0cXNwZXlhanR0bnV6d2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc2OTQxMywiZXhwIjoyMDY5MzQ1NDEzfQ.aEjvfQgXlYqGfumqbmp2YKXFNOAhYdf7gONbWNnOpDk'

// Create client for EverythingEnglish.xyz database
export const everythingEnglishClient = createClient(
  EVERYTHINGENGLISH_URL,
  EVERYTHINGENGLISH_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Types for our analytics data
export interface SignupAnalytics {
  total_users: number
  confirmed_users: number
  recent_signups: number
  daily_signups: Array<{
    date: string
    count: number
  }>
  growth_rate: number
}

export interface UserActivityAnalytics {
  total_users: number
  active_last_7_days: number
  active_last_30_days: number
  never_signed_in: number
  email_confirmation_rate: number
}

export interface MarketingMetrics {
  signupAnalytics: SignupAnalytics
  activityAnalytics: UserActivityAnalytics
  lastUpdated: string
}

// API functions
export async function getSignupAnalytics(daysBack: number = 30): Promise<SignupAnalytics> {
  try {
    const { data, error } = await everythingEnglishClient.rpc('get_signup_analytics', {
      days_back: daysBack
    })
    
    if (error) {
      console.error('Error fetching signup analytics:', error)
      throw new Error(`Failed to fetch signup analytics: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in getSignupAnalytics:', error)
    throw error
  }
}

export async function getUserActivityAnalytics(): Promise<UserActivityAnalytics> {
  try {
    const { data, error } = await everythingEnglishClient.rpc('get_user_activity_analytics')
    
    if (error) {
      console.error('Error fetching user activity analytics:', error)
      throw new Error(`Failed to fetch user activity analytics: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in getUserActivityAnalytics:', error)
    throw error
  }
}

export async function getAllMarketingMetrics(daysBack: number = 30): Promise<MarketingMetrics> {
  try {
    const [signupAnalytics, activityAnalytics] = await Promise.all([
      getSignupAnalytics(daysBack),
      getUserActivityAnalytics()
    ])
    
    return {
      signupAnalytics,
      activityAnalytics,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching all marketing metrics:', error)
    throw error
  }
}

// Utility functions for data processing
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatPercentage(num: number): string {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`
}

export function getGrowthColor(growthRate: number): string {
  if (growthRate > 0) return 'text-green-500'
  if (growthRate < 0) return 'text-red-500'
  return 'text-gray-500'
}

export function getGrowthIcon(growthRate: number): 'trending-up' | 'trending-down' | 'minus' {
  if (growthRate > 0) return 'trending-up'
  if (growthRate < 0) return 'trending-down'
  return 'minus'
}
