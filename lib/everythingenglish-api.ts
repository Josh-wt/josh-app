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

export interface AssessmentAnalytics {
  total_evaluations: number
  total_assessment_users: number
  active_assessment_users: number
  recent_evaluations: number
  daily_evaluations: Array<{
    date: string
    count: number
    unique_users: number
  }>
  question_type_breakdown: Array<{
    question_type: string
    count: number
    unique_users: number
  }>
  academic_level_breakdown: Array<{
    academic_level: string
    user_count: number
    avg_questions_marked: number
    active_subscribers: number
  }>
  engagement_metrics: {
    avg_evaluations_per_user: number
    most_active_user_evaluations: number
    users_with_multiple_evaluations: number
  }
}

export interface LearningProgressAnalytics {
  study_streaks: {
    total_users_with_streaks: number
    avg_current_streak: number
    max_current_streak: number
    avg_longest_streak: number
    total_study_days: number
  }
  study_goals: {
    total_goals: number
    completed_goals: number
    active_goals: number
    completion_rate: number
  }
  saved_resources: {
    total_saved_resources: number
    unique_users_saving: number
    avg_resources_per_user: number
    most_popular_category: string | null
  }
  user_engagement_levels: {
    highly_engaged: number
    moderately_engaged: number
    low_engagement: number
  }
}

export interface PerformanceInsights {
  subscription_analytics: {
    total_subscribers: number
    free_users: number
    launch_users: number
    conversion_rate: number
  }
  content_performance: {
    most_popular_question_types: Array<{
      question_type: string
      evaluation_count: number
      unique_users: number
    }>
    academic_level_distribution: Array<{
      level: string
      user_count: number
      percentage: number
    }>
  }
  growth_indicators: {
    new_users_last_7_days: number
    new_users_last_30_days: number
    active_users_last_7_days: number
    retention_rate_7d: number
  }
  feedback_quality: {
    total_feedback_responses: number
    positive_feedback_rate: number
    feedback_categories: Array<{
      category: string
      count: number
      accuracy_rate: number
    }>
  }
}

export interface MarketingMetrics {
  signupAnalytics: SignupAnalytics
  activityAnalytics: UserActivityAnalytics
  assessmentAnalytics: AssessmentAnalytics
  learningProgressAnalytics: LearningProgressAnalytics
  performanceInsights: PerformanceInsights
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

export async function getAssessmentAnalytics(daysBack: number = 30): Promise<AssessmentAnalytics> {
  try {
    const { data, error } = await everythingEnglishClient.rpc('get_assessment_analytics', {
      days_back: daysBack
    })
    
    if (error) {
      console.error('Error fetching assessment analytics:', error)
      throw new Error(`Failed to fetch assessment analytics: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in getAssessmentAnalytics:', error)
    throw error
  }
}

export async function getLearningProgressAnalytics(): Promise<LearningProgressAnalytics> {
  try {
    const { data, error } = await everythingEnglishClient.rpc('get_learning_progress_analytics')
    
    if (error) {
      console.error('Error fetching learning progress analytics:', error)
      // Return default values if there's an error
      return {
        study_streaks: {
          total_users_with_streaks: 0,
          avg_current_streak: 0,
          max_current_streak: 0,
          avg_longest_streak: 0,
          total_study_days: 0
        },
        study_goals: {
          total_goals: 0,
          completed_goals: 0,
          active_goals: 0,
          completion_rate: 0
        },
        saved_resources: {
          total_saved_resources: 0,
          unique_users_saving: 0,
          avg_resources_per_user: 0,
          most_popular_category: null
        },
        user_engagement_levels: {
          highly_engaged: 0,
          moderately_engaged: 0,
          low_engagement: 0
        }
      }
    }
    
    return data
  } catch (error) {
    console.error('Error in getLearningProgressAnalytics:', error)
    // Return default values on any error
    return {
      study_streaks: {
        total_users_with_streaks: 0,
        avg_current_streak: 0,
        max_current_streak: 0,
        avg_longest_streak: 0,
        total_study_days: 0
      },
      study_goals: {
        total_goals: 0,
        completed_goals: 0,
        active_goals: 0,
        completion_rate: 0
      },
      saved_resources: {
        total_saved_resources: 0,
        unique_users_saving: 0,
        avg_resources_per_user: 0,
        most_popular_category: null
      },
      user_engagement_levels: {
        highly_engaged: 0,
        moderately_engaged: 0,
        low_engagement: 0
      }
    }
  }
}

export async function getPerformanceInsights(): Promise<PerformanceInsights> {
  try {
    const { data, error } = await everythingEnglishClient.rpc('get_performance_insights')
    
    if (error) {
      console.error('Error fetching performance insights:', error)
      // Return default values if there's an error
      return {
        subscription_analytics: {
          total_subscribers: 0,
          free_users: 0,
          launch_users: 0,
          conversion_rate: 0
        },
        content_performance: {
          most_popular_question_types: [],
          academic_level_distribution: []
        },
        growth_indicators: {
          new_users_last_7_days: 0,
          new_users_last_30_days: 0,
          active_users_last_7_days: 0,
          retention_rate_7d: 0
        },
        feedback_quality: {
          total_feedback_responses: 0,
          positive_feedback_rate: 0,
          feedback_categories: []
        }
      }
    }
    
    return data
  } catch (error) {
    console.error('Error in getPerformanceInsights:', error)
    // Return default values on any error
    return {
      subscription_analytics: {
        total_subscribers: 0,
        free_users: 0,
        launch_users: 0,
        conversion_rate: 0
      },
      content_performance: {
        most_popular_question_types: [],
        academic_level_distribution: []
      },
      growth_indicators: {
        new_users_last_7_days: 0,
        new_users_last_30_days: 0,
        active_users_last_7_days: 0,
        retention_rate_7d: 0
      },
      feedback_quality: {
        total_feedback_responses: 0,
        positive_feedback_rate: 0,
        feedback_categories: []
      }
    }
  }
}

export async function getAllMarketingMetrics(daysBack: number = 30): Promise<MarketingMetrics> {
  try {
    const [signupAnalytics, activityAnalytics, assessmentAnalytics, learningProgressAnalytics, performanceInsights] = await Promise.all([
      getSignupAnalytics(daysBack),
      getUserActivityAnalytics(),
      getAssessmentAnalytics(daysBack),
      getLearningProgressAnalytics(),
      getPerformanceInsights()
    ])
    
    return {
      signupAnalytics,
      activityAnalytics,
      assessmentAnalytics,
      learningProgressAnalytics,
      performanceInsights,
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
