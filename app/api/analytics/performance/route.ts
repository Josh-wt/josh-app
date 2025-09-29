import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get all users and evaluations for performance analysis
    const { data: allUsers, error: usersError } = await supabase
      .from('assessment_users')
      .select('uid, email, academic_level, questions_marked, created_at')
    
    if (usersError) throw usersError

    const { data: allEvaluations, error: evaluationsError } = await supabase
      .from('assessment_evaluations')
      .select('user_id, question_type, timestamp')
    
    if (evaluationsError) throw evaluationsError

    const totalUsers = allUsers?.length || 0
    const totalEvaluations = allEvaluations?.length || 0
    
    // Conversion rate (users who did at least one evaluation)
    const usersWithEvaluations = new Set(allEvaluations?.map(e => e.user_id)).size
    const conversionRate = totalUsers > 0 ? Math.round((usersWithEvaluations / totalUsers) * 10000) / 100 : 0

    // Retention rate (users who did multiple evaluations)
    const userEvaluationCounts = allEvaluations?.reduce((acc: any, evaluation) => {
      acc[evaluation.user_id] = (acc[evaluation.user_id] || 0) + 1
      return acc
    }, {}) || {}
    
    const returnUsers = Object.values(userEvaluationCounts).filter((count: any) => count > 1).length
    const retentionRate = usersWithEvaluations > 0 ? Math.round((returnUsers / usersWithEvaluations) * 10000) / 100 : 0

    // New user growth (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentUsers = allUsers?.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ) || []
    
    const recentNonEmailUsers = recentUsers.filter(user => 
      !user.email || user.email === '' || user.email === null
    )

    // Daily active users (users who did evaluations each day)
    const dailyActiveUsers = allEvaluations?.reduce((acc: any, evaluation) => {
      const date = new Date(evaluation.timestamp).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = new Set()
      }
      acc[date].add(evaluation.user_id)
      return acc
    }, {}) || {}

    const dailyActiveUserTrends = Object.entries(dailyActiveUsers).map(([date, users]: [string, any]) => ({
      date,
      active_users: users.size
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Question type performance
    const questionTypePerformance = allEvaluations?.reduce((acc: any, evaluation) => {
      if (!acc[evaluation.question_type]) {
        acc[evaluation.question_type] = {
          total_evaluations: 0,
          unique_users: new Set(),
          avg_per_user: 0
        }
      }
      acc[evaluation.question_type].total_evaluations++
      acc[evaluation.question_type].unique_users.add(evaluation.user_id)
      return acc
    }, {}) || {}

    const questionTypeStats = Object.entries(questionTypePerformance).map(([type, data]: [string, any]) => ({
      type,
      total_evaluations: data.total_evaluations,
      unique_users: data.unique_users.size,
      avg_per_user: Math.round((data.total_evaluations / data.unique_users.size) * 100) / 100,
      percentage_of_total: Math.round((data.total_evaluations / totalEvaluations) * 10000) / 100
    })).sort((a, b) => b.total_evaluations - a.total_evaluations)

    // User engagement levels
    const engagementLevels = allUsers?.reduce((acc: any, user) => {
      let level = 'No Evaluations'
      if (user.questions_marked === 1) level = '1 Evaluation'
      else if (user.questions_marked >= 2 && user.questions_marked <= 5) level = '2-5 Evaluations'
      else if (user.questions_marked >= 6 && user.questions_marked <= 10) level = '6-10 Evaluations'
      else if (user.questions_marked >= 11 && user.questions_marked <= 20) level = '11-20 Evaluations'
      else if (user.questions_marked > 20) level = '20+ Evaluations'
      
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {}) || {}

    const engagementBreakdown = Object.entries(engagementLevels).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count as number / totalUsers) * 10000) / 100
    }))

    // Academic level performance
    const academicLevelPerformance = allUsers?.reduce((acc: any, user) => {
      const level = user.academic_level || 'Unknown'
      if (!acc[level]) {
        acc[level] = {
          total_users: 0,
          total_evaluations: 0,
          avg_evaluations_per_user: 0
        }
      }
      acc[level].total_users++
      acc[level].total_evaluations += user.questions_marked || 0
      return acc
    }, {}) || {}

    const academicLevelStats = Object.entries(academicLevelPerformance).map(([level, data]: [string, any]) => ({
      level,
      total_users: data.total_users,
      total_evaluations: data.total_evaluations,
      avg_evaluations_per_user: Math.round((data.total_evaluations / data.total_users) * 100) / 100,
      percentage_of_users: Math.round((data.total_users / totalUsers) * 10000) / 100
    })).sort((a, b) => b.total_users - a.total_users)

    // Weekly performance trends
    const weeklyPerformance = allEvaluations?.reduce((acc: any, evaluation) => {
      const date = new Date(evaluation.timestamp)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!acc[weekKey]) {
        acc[weekKey] = {
          week: weekKey,
          evaluations: 0,
          unique_users: new Set(),
          avg_evaluations_per_user: 0
        }
      }
      acc[weekKey].evaluations++
      acc[weekKey].unique_users.add(evaluation.user_id)
      return acc
    }, {}) || {}

    const weeklyPerformanceTrends = Object.values(weeklyPerformance).map((week: any) => ({
      week: week.week,
      evaluations: week.evaluations,
      unique_users: week.unique_users.size,
      avg_evaluations_per_user: Math.round((week.evaluations / week.unique_users.size) * 100) / 100
    })).sort((a: any, b: any) => new Date(a.week).getTime() - new Date(b.week).getTime())

    return NextResponse.json({
      conversion_rate: conversionRate,
      retention_rate: retentionRate,
      total_users: totalUsers,
      users_with_evaluations: usersWithEvaluations,
      return_users: returnUsers,
      recent_users_30d: recentUsers.length,
      recent_non_email_users_30d: recentNonEmailUsers.length,
      daily_active_user_trends: dailyActiveUserTrends,
      question_type_performance: questionTypeStats,
      engagement_breakdown: engagementBreakdown,
      academic_level_performance: academicLevelStats,
      weekly_performance_trends: weeklyPerformanceTrends,
      avg_evaluations_per_user: totalUsers > 0 ? 
        Math.round((totalEvaluations / totalUsers) * 100) / 100 : 0
    })
    
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    )
  }
}
