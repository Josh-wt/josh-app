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

// Advanced Database Browser API Functions
export interface DatabaseTable {
  name: string
  displayName: string
  description: string
  icon: string
  color: string
  rowCount?: number
  lastUpdated?: string
}

export interface TableData {
  data: any[]
  count: number
  schema: any[]
  error?: string
}

export interface UserSearchResult {
  id: string
  type: 'user' | 'evaluation' | 'goal' | 'streak' | 'resource' | 'subscription'
  data: any
  relevanceScore?: number
}

export interface UserProfile {
  user: any
  evaluations: any[]
  goals: any[]
  streaks: any[]
  resources: any[]
  subscriptions: any[]
  statistics: {
    totalEvaluations: number
    totalGoals: number
    currentStreak: number
    longestStreak: number
    totalResources: number
    subscriptionStatus: string
    lastActivity: string
    engagementScore: number
  }
}

// Get all available database tables
export async function getDatabaseTables(): Promise<DatabaseTable[]> {
  try {
    // First, let's get actual table information from the database
    const { data: tablesData, error: tablesError } = await everythingEnglishClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'assessment_users',
        'assessment_evaluations', 
        'study_goals',
        'study_streaks',
        'saved_resources',
        'subscriptions'
      ])

    if (tablesError) {
      console.error('Error fetching table names:', tablesError)
    }

    const availableTables = tablesData?.map(t => t.table_name) || []

    const tables: DatabaseTable[] = [
      {
        name: 'assessment_users',
        displayName: 'Assessment Users',
        description: 'User accounts and profiles with authentication data',
        icon: 'Users',
        color: 'blue'
      },
      {
        name: 'assessment_evaluations',
        displayName: 'Evaluations',
        description: 'Student evaluations, scores, and feedback data',
        icon: 'FileText',
        color: 'green'
      },
      {
        name: 'study_goals',
        displayName: 'Study Goals',
        description: 'User learning goals, progress tracking, and objectives',
        icon: 'Target',
        color: 'purple'
      },
      {
        name: 'study_streaks',
        displayName: 'Study Streaks',
        description: 'User study streak data and activity patterns',
        icon: 'Zap',
        color: 'orange'
      },
      {
        name: 'saved_resources',
        displayName: 'Saved Resources',
        description: 'User bookmarked learning resources and materials',
        icon: 'BookOpen',
        color: 'indigo'
      },
      {
        name: 'subscriptions',
        displayName: 'Subscriptions',
        description: 'Subscription plans, billing, and payment information',
        icon: 'CreditCard',
        color: 'emerald'
      }
    ]

    // Filter to only include tables that actually exist
    return tables.filter(table => availableTables.includes(table.name))
  } catch (error) {
    console.error('Error in getDatabaseTables:', error)
    // Return default tables even if there's an error
    return [
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
      }
    ]
  }
}

// Get table data with advanced filtering and pagination
export async function getTableData(
  tableName: string, 
  limit: number = 100, 
  offset: number = 0,
  orderBy: string = 'created_at',
  ascending: boolean = false
): Promise<TableData> {
  try {
    console.log(`Fetching data from table: ${tableName}`)
    
    // Get the actual data
    const { data, error, count } = await everythingEnglishClient
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending })

    if (error) {
      console.error(`Supabase query error for table ${tableName}:`, error)
      return {
        data: [],
        count: 0,
        schema: [],
        error: error.message
      }
    }

    // Get table schema information
    const { data: schemaData, error: schemaError } = await everythingEnglishClient
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')

    if (schemaError) {
      console.error(`Schema query error for table ${tableName}:`, schemaError)
    }

    console.log(`Successfully fetched ${data?.length || 0} rows from ${tableName}`)

    return {
      data: data || [],
      count: count || 0,
      schema: schemaData || [],
      error: undefined
    }
  } catch (error) {
    console.error(`Error in getTableData for ${tableName}:`, error)
    return {
      data: [],
      count: 0,
      schema: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Advanced user search across multiple tables
export async function searchUsersAdvanced(searchTerm: string): Promise<UserSearchResult[]> {
  if (!searchTerm.trim()) {
    return []
  }

  try {
    console.log(`Searching for users with term: ${searchTerm}`)
    
    const results: UserSearchResult[] = []
    const searchPattern = `%${searchTerm}%`

    // Search in assessment_users table
    try {
      const { data: usersData, error: usersError } = await everythingEnglishClient
        .from('assessment_users')
        .select('*')
        .or(`id.ilike.${searchPattern},email.ilike.${searchPattern},full_name.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
        .limit(10)

      if (!usersError && usersData) {
        usersData.forEach(user => {
          results.push({
            id: user.id,
            type: 'user',
            data: user,
            relevanceScore: calculateRelevanceScore(user, searchTerm)
          })
        })
      }
    } catch (error) {
      console.error('Error searching users:', error)
    }

    // Search in assessment_evaluations table
    try {
      const { data: evaluationsData, error: evaluationsError } = await everythingEnglishClient
        .from('assessment_evaluations')
        .select('user_id, score, created_at, question_type')
        .ilike('user_id', searchPattern)
        .limit(10)

      if (!evaluationsError && evaluationsData) {
        evaluationsData.forEach(evaluation => {
          results.push({
            id: evaluation.user_id,
            type: 'evaluation',
            data: evaluation,
            relevanceScore: 0.7
          })
        })
      }
    } catch (error) {
      console.error('Error searching evaluations:', error)
    }

    // Sort by relevance score
    results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))

    console.log(`Found ${results.length} search results`)
    return results.slice(0, 20) // Limit to 20 results
  } catch (error) {
    console.error('Error in searchUsersAdvanced:', error)
    return []
  }
}

// Calculate relevance score for search results
function calculateRelevanceScore(user: any, searchTerm: string): number {
  let score = 0
  const term = searchTerm.toLowerCase()
  
  if (user.email?.toLowerCase().includes(term)) score += 1.0
  if (user.full_name?.toLowerCase().includes(term)) score += 0.9
  if (user.display_name?.toLowerCase().includes(term)) score += 0.8
  if (user.id?.toLowerCase().includes(term)) score += 0.7
  
  return score
}

// Get comprehensive user profile data
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log(`Fetching comprehensive profile for user: ${userId}`)
    
    // Fetch user data
    const { data: userData, error: userError } = await everythingEnglishClient
      .from('assessment_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error(`User not found: ${userId}`, userError)
      return null
    }

    // Fetch related data in parallel
    const [
      evaluationsResult,
      goalsResult,
      streaksResult,
      resourcesResult,
      subscriptionsResult
    ] = await Promise.allSettled([
      everythingEnglishClient
        .from('assessment_evaluations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      everythingEnglishClient
        .from('study_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      everythingEnglishClient
        .from('study_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      everythingEnglishClient
        .from('saved_resources')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      everythingEnglishClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ])

    const evaluations = evaluationsResult.status === 'fulfilled' ? evaluationsResult.value.data || [] : []
    const goals = goalsResult.status === 'fulfilled' ? goalsResult.value.data || [] : []
    const streaks = streaksResult.status === 'fulfilled' ? streaksResult.value.data || [] : []
    const resources = resourcesResult.status === 'fulfilled' ? resourcesResult.value.data || [] : []
    const subscriptions = subscriptionsResult.status === 'fulfilled' ? subscriptionsResult.value.data || [] : []

    // Calculate statistics
    const currentStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.current_streak || 0)) : 0
    const longestStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.longest_streak || 0)) : 0
    const lastActivity = evaluations.length > 0 ? evaluations[0].created_at : userData.created_at
    const engagementScore = calculateEngagementScore(evaluations, goals, streaks, resources)

    const profile: UserProfile = {
      user: userData,
      evaluations,
      goals,
      streaks,
      resources,
      subscriptions,
      statistics: {
        totalEvaluations: evaluations.length,
        totalGoals: goals.length,
        currentStreak,
        longestStreak,
        totalResources: resources.length,
        subscriptionStatus: subscriptions.length > 0 ? subscriptions[0].status : 'free',
        lastActivity,
        engagementScore
      }
    }

    console.log(`Successfully fetched profile for user ${userId}`)
    return profile
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error)
    return null
  }
}

// Calculate user engagement score
function calculateEngagementScore(evaluations: any[], goals: any[], streaks: any[], resources: any[]): number {
  let score = 0
  
  // Base score from evaluations
  score += Math.min(evaluations.length * 2, 50)
  
  // Goals completion
  const completedGoals = goals.filter(g => g.status === 'completed').length
  score += completedGoals * 5
  
  // Streak bonus
  const maxStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.current_streak || 0)) : 0
  score += Math.min(maxStreak * 0.5, 25)
  
  // Resources saved
  score += Math.min(resources.length * 1, 15)
  
  return Math.min(score, 100) // Cap at 100
}

// Test database connection
export async function testDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { data, error } = await everythingEnglishClient
      .from('assessment_users')
      .select('count')
      .limit(1)
    
    if (error) {
      return { connected: false, error: error.message }
    }
    
    return { connected: true }
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    }
  }
}

// Get table statistics
export async function getTableStatistics(tableName: string): Promise<{
  rowCount: number
  lastUpdated: string
  columnCount: number
}> {
  try {
    const { count, error } = await everythingEnglishClient
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    const { data: schemaData } = await everythingEnglishClient
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')

    return {
      rowCount: count || 0,
      lastUpdated: new Date().toISOString(),
      columnCount: schemaData?.length || 0
    }
  } catch (error) {
    console.error(`Error getting table statistics for ${tableName}:`, error)
    return {
      rowCount: 0,
      lastUpdated: new Date().toISOString(),
      columnCount: 0
    }
  }
}
