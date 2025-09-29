import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get comprehensive evaluation metrics
    const evaluationMetrics = await getEvaluationMetrics(supabase)
    
    // Get user analytics (excluding email users)
    const userMetrics = await getUserMetrics(supabase)
    
    // Get engagement metrics
    const engagementMetrics = await getEngagementMetrics(supabase)
    
    // Get performance metrics
    const performanceMetrics = await getPerformanceMetrics(supabase)
    
    // Get daily trends
    const dailyTrends = await getDailyTrends(supabase)
    
    // Get question type breakdown
    const questionTypes = await getQuestionTypeBreakdown(supabase)
    
    // Get user activity patterns
    const userActivity = await getUserActivityPatterns(supabase)
    
    return NextResponse.json({
      evaluationMetrics,
      userMetrics,
      engagementMetrics,
      performanceMetrics,
      dailyTrends,
      questionTypes,
      userActivity,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching comprehensive analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

async function getEvaluationMetrics(supabase: any) {
  // Total evaluations
  const { data: totalEvals } = await supabase
    .from('assessment_evaluations')
    .select('id', { count: 'exact' })
  
  // Recent evaluations (30 days)
  const { data: recentEvals } = await supabase
    .from('assessment_evaluations')
    .select('id', { count: 'exact' })
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  // Weekly evaluations
  const { data: weeklyEvals } = await supabase
    .from('assessment_evaluations')
    .select('id', { count: 'exact' })
    .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  
  // Daily evaluations
  const { data: dailyEvals } = await supabase
    .from('assessment_evaluations')
    .select('id', { count: 'exact' })
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  
  // Return users analysis
  const { data: userEvalCounts } = await supabase
    .from('assessment_evaluations')
    .select('user_id')
  
  const userCounts = userEvalCounts?.reduce((acc: any, evaluation: any) => {
    acc[evaluation.user_id] = (acc[evaluation.user_id] || 0) + 1
    return acc
  }, {}) || {}
  
  const totalUsers = Object.keys(userCounts).length
  const returnUsers = Object.values(userCounts).filter((count: any) => count > 1).length
  const returnRate = totalUsers > 0 ? (returnUsers / totalUsers) * 100 : 0
  const avgEvaluationsPerUser = totalUsers > 0 ? totalEvals?.length / totalUsers : 0
  const maxEvaluationsByUser = Math.max(...Object.values(userCounts) as number[], 0)
  
  return {
    total_evaluations: totalEvals?.length || 0,
    recent_evaluations: recentEvals?.length || 0,
    weekly_evaluations: weeklyEvals?.length || 0,
    daily_evaluations: dailyEvals?.length || 0,
    unique_users: totalUsers,
    return_users: returnUsers,
    return_rate: Math.round(returnRate * 100) / 100,
    avg_evaluations_per_user: Math.round(avgEvaluationsPerUser * 100) / 100,
    max_evaluations_by_user: maxEvaluationsByUser
  }
}

async function getUserMetrics(supabase: any) {
  // Total users (excluding email users - Discord/Google only)
  const { data: totalUsers } = await supabase
    .from('assessment_users')
    .select('id', { count: 'exact' })
    .is('deleted_at', null)
    .or('email.is.null,email.eq.')
  
  // New users in last 30 days (non-email only)
  const { data: newUsers30d } = await supabase
    .from('assessment_users')
    .select('id', { count: 'exact' })
    .is('deleted_at', null)
    .or('email.is.null,email.eq.')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  // New users in last 7 days (non-email only)
  const { data: newUsers7d } = await supabase
    .from('assessment_users')
    .select('id', { count: 'exact' })
    .is('deleted_at', null)
    .or('email.is.null,email.eq.')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  
  // New users today (non-email only)
  const { data: newUsers1d } = await supabase
    .from('assessment_users')
    .select('id', { count: 'exact' })
    .is('deleted_at', null)
    .or('email.is.null,email.eq.')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  
  // User growth trends
  const { data: userGrowth } = await supabase
    .from('assessment_users')
    .select('created_at')
    .is('deleted_at', null)
    .or('email.is.null,email.eq.')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })
  
  return {
    total_users: totalUsers?.length || 0,
    new_users_30d: newUsers30d?.length || 0,
    new_users_7d: newUsers7d?.length || 0,
    new_users_1d: newUsers1d?.length || 0,
    user_growth_data: userGrowth || []
  }
}

async function getEngagementMetrics(supabase: any) {
  // Study streaks
  const { data: streaks } = await supabase
    .from('study_streaks')
    .select('streak_count, longest_streak')
  
  const activeStreaks = streaks?.filter((s: any) => s.streak_count > 0).length || 0
  const maxStreak = Math.max(...(streaks?.map((s: any) => s.longest_streak) || [0]), 0)
  const avgStreak = streaks?.length > 0 ? 
    streaks.reduce((sum: any, s: any) => sum + s.streak_count, 0) / streaks.length : 0
  
  // Saved resources
  const { data: savedResources } = await supabase
    .from('saved_resources')
    .select('id', { count: 'exact' })
  
  const { data: usersWithResources } = await supabase
    .from('saved_resources')
    .select('user_id')
  
  const uniqueUsersWithResources = new Set(usersWithResources?.map((r: any) => r.user_id) || []).size
  
  // Study goals
  const { data: goals } = await supabase
    .from('study_goals')
    .select('completed')
  
  const totalGoals = goals?.length || 0
  const completedGoals = goals?.filter((g: any) => g.completed).length || 0
  const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
  
  return {
    study_streaks: activeStreaks,
    max_streak: maxStreak,
    avg_streak: Math.round(avgStreak * 100) / 100,
    saved_resources: savedResources?.length || 0,
    users_with_saved_resources: uniqueUsersWithResources,
    total_goals: totalGoals,
    completed_goals: completedGoals,
    goal_completion_rate: Math.round(goalCompletionRate * 100) / 100
  }
}

async function getPerformanceMetrics(supabase: any) {
  // Feedback quality
  const { data: feedback } = await supabase
    .from('assessment_feedback')
    .select('accurate')
  
  const totalFeedback = feedback?.length || 0
  const positiveFeedback = feedback?.filter((f: any) => f.accurate).length || 0
  const feedbackQuality = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0
  
  // Subscription metrics
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('status')
  
  const totalSubscriptions = subscriptions?.length || 0
  const activeSubscriptions = subscriptions?.filter((s: any) => s.status === 'active').length || 0
  const conversionRate = totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions) * 100 : 0
  
  // Retention rate (users who did evaluations in last 7 days vs last 30 days)
  const { data: recentUsers } = await supabase
    .from('assessment_evaluations')
    .select('user_id')
    .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  
  const { data: monthlyUsers } = await supabase
    .from('assessment_evaluations')
    .select('user_id')
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  const recentUserSet = new Set(recentUsers?.map((u: any) => u.user_id) || [])
  const monthlyUserSet = new Set(monthlyUsers?.map((u: any) => u.user_id) || [])
  const retentionRate = monthlyUserSet.size > 0 ? (recentUserSet.size / monthlyUserSet.size) * 100 : 0
  
  return {
    feedback_quality: Math.round(feedbackQuality * 100) / 100,
    total_feedback: totalFeedback,
    conversion_rate: Math.round(conversionRate * 100) / 100,
    active_subscriptions: activeSubscriptions,
    retention_rate: Math.round(retentionRate * 100) / 100
  }
}

async function getDailyTrends(supabase: any) {
  const { data: dailyData } = await supabase
    .from('assessment_evaluations')
    .select('timestamp, user_id')
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true })
  
  // Group by date
  const dailyTrends = dailyData?.reduce((acc: any, evaluation: any) => {
    const date = new Date(evaluation.timestamp).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, evaluations: 0, unique_users: new Set() }
    }
    acc[date].evaluations++
    acc[date].unique_users.add(evaluation.user_id)
    return acc
  }, {}) || {}
  
  return Object.values(dailyTrends).map((trend: any) => ({
    date: trend.date,
    evaluations: trend.evaluations,
    unique_users: trend.unique_users.size
  }))
}

async function getQuestionTypeBreakdown(supabase: any) {
  const { data: questionTypes } = await supabase
    .from('assessment_evaluations')
    .select('question_type')
  
  const breakdown = questionTypes?.reduce((acc: any, evaluation: any) => {
    acc[evaluation.question_type] = (acc[evaluation.question_type] || 0) + 1
    return acc
  }, {}) || {}
  
  return Object.entries(breakdown).map(([question_type, count]) => ({
    question_type,
    count
  })).sort((a: any, b: any) => b.count - a.count)
}

async function getUserActivityPatterns(supabase: any) {
  const { data: evaluations } = await supabase
    .from('assessment_evaluations')
    .select('timestamp, user_id')
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  // Group by hour of day
  const hourlyActivity = evaluations?.reduce((acc: any, evaluation: any) => {
    const hour = new Date(evaluation.timestamp).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {}) || {}
  
  // Group by day of week
  const weeklyActivity = evaluations?.reduce((acc: any, evaluation: any) => {
    const day = new Date(evaluation.timestamp).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {}) || {}
  
  return {
    hourly_activity: Object.entries(hourlyActivity).map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    })),
    weekly_activity: Object.entries(weeklyActivity).map(([day, count]) => ({
      day: parseInt(day),
      count
    }))
  }
}
