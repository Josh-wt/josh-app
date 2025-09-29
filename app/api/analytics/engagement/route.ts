import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get study streaks
    const { data: studyStreaks, error: streaksError } = await supabase
      .from('study_streaks')
      .select('*')
    
    if (streaksError) throw streaksError

    // Get study goals
    const { data: studyGoals, error: goalsError } = await supabase
      .from('study_goals')
      .select('*')
    
    if (goalsError) throw goalsError

    // Get saved resources
    const { data: savedResources, error: resourcesError } = await supabase
      .from('saved_resources')
      .select('*')
    
    if (resourcesError) throw resourcesError

    // Get assessment feedback
    const { data: assessmentFeedback, error: feedbackError } = await supabase
      .from('assessment_feedback')
      .select('*')
    
    if (feedbackError) throw feedbackError

    // Study streaks analysis
    const totalUsersWithStreaks = studyStreaks?.length || 0
    const avgStreak = studyStreaks?.reduce((sum, streak) => sum + (streak.streak_count || 0), 0) / totalUsersWithStreaks || 0
    const maxStreak = Math.max(...(studyStreaks?.map(s => s.streak_count || 0) || [0]))
    const avgTotalDays = studyStreaks?.reduce((sum, streak) => sum + (streak.total_study_days || 0), 0) / totalUsersWithStreaks || 0
    const users7DayStreak = studyStreaks?.filter(s => (s.streak_count || 0) >= 7).length || 0
    const users30DayStreak = studyStreaks?.filter(s => (s.streak_count || 0) >= 30).length || 0

    // Study goals analysis
    const totalGoals = studyGoals?.length || 0
    const completedGoals = studyGoals?.filter(g => g.completed === true).length || 0
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 10000) / 100 : 0

    // Saved resources count
    const totalSavedResources = savedResources?.length || 0

    // Assessment feedback analysis
    const totalFeedback = assessmentFeedback?.length || 0
    const positiveFeedback = assessmentFeedback?.filter(f => f.accurate === true).length || 0
    const negativeFeedback = assessmentFeedback?.filter(f => f.accurate === false).length || 0
    const accuracyRate = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 10000) / 100 : 0

    // Feedback categories
    const feedbackCategories = assessmentFeedback?.reduce((acc: any, feedback) => {
      const category = feedback.category || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {}) || {}

    const feedbackCategoryBreakdown = Object.entries(feedbackCategories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count as number / totalFeedback) * 10000) / 100
    })).sort((a, b) => b.count - a.count)

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentGoals = studyGoals?.filter(g => 
      new Date(g.created_at) >= thirtyDaysAgo
    ) || []
    
    const recentCompletedGoals = recentGoals.filter(g => g.completed === true)
    const recentCompletionRate = recentGoals.length > 0 ? 
      Math.round((recentCompletedGoals.length / recentGoals.length) * 10000) / 100 : 0

    return NextResponse.json({
      study_streaks: {
        total_users_with_streaks: totalUsersWithStreaks,
        avg_streak: Math.round(avgStreak * 100) / 100,
        max_streak: maxStreak,
        avg_total_days: Math.round(avgTotalDays * 100) / 100,
        users_7day_streak: users7DayStreak,
        users_30day_streak: users30DayStreak,
        streak_retention_rate: totalUsersWithStreaks > 0 ? 
          Math.round((users7DayStreak / totalUsersWithStreaks) * 10000) / 100 : 0
      },
      study_goals: {
        total_goals: totalGoals,
        completed_goals: completedGoals,
        completion_rate: completionRate,
        recent_goals_30d: recentGoals.length,
        recent_completed_goals_30d: recentCompletedGoals.length,
        recent_completion_rate: recentCompletionRate
      },
      saved_resources: {
        total_saved_resources: totalSavedResources
      },
      assessment_feedback: {
        total_feedback: totalFeedback,
        positive_feedback: positiveFeedback,
        negative_feedback: negativeFeedback,
        accuracy_rate: accuracyRate,
        feedback_categories: feedbackCategoryBreakdown
      }
    })
    
  } catch (error) {
    console.error('Error fetching engagement metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch engagement metrics' },
      { status: 500 }
    )
  }
}
