import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get total evaluations and unique users
    const { data: totalEvaluations, error: totalError } = await supabase
      .from('assessment_evaluations')
      .select('id, user_id, timestamp, question_type')
    
    if (totalError) throw totalError

    // Calculate comprehensive evaluation metrics
    const totalEvals = totalEvaluations?.length || 0
    const uniqueUsers = new Set(totalEvaluations?.map(e => e.user_id)).size
    
    // Recent evaluations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentEvaluations = totalEvaluations?.filter(e => 
      new Date(e.timestamp) >= thirtyDaysAgo
    ) || []
    
    // Daily evaluation trends (last 30 days)
    const dailyEvaluations = recentEvaluations.reduce((acc: any, evaluation) => {
      const date = new Date(evaluation.timestamp).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, evaluations: 0, unique_users: new Set() }
      }
      acc[date].evaluations++
      acc[date].unique_users.add(evaluation.user_id)
      return acc
    }, {})
    
    const dailyTrends = Object.values(dailyEvaluations).map((day: any) => ({
      date: day.date,
      evaluations: day.evaluations,
      unique_users: day.unique_users.size
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Question type breakdown
    const questionTypeBreakdown = recentEvaluations.reduce((acc: any, evaluation) => {
      acc[evaluation.question_type] = (acc[evaluation.question_type] || 0) + 1
      return acc
    }, {})

    // Return users analysis (users with multiple evaluations)
    const userEvaluationCounts = recentEvaluations.reduce((acc: any, evaluation) => {
      acc[evaluation.user_id] = (acc[evaluation.user_id] || 0) + 1
      return acc
    }, {})
    
    const returnUsers = Object.values(userEvaluationCounts).filter((count: any) => count > 1).length
    const singleEvaluationUsers = Object.values(userEvaluationCounts).filter((count: any) => count === 1).length

    // Weekly trends
    const weeklyTrends = recentEvaluations.reduce((acc: any, evaluation) => {
      const date = new Date(evaluation.timestamp)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!acc[weekKey]) {
        acc[weekKey] = { week: weekKey, evaluations: 0, unique_users: new Set() }
      }
      acc[weekKey].evaluations++
      acc[weekKey].unique_users.add(evaluation.user_id)
      return acc
    }, {})

    const weeklyData = Object.values(weeklyTrends).map((week: any) => ({
      week: week.week,
      evaluations: week.evaluations,
      unique_users: week.unique_users.size,
      avg_evaluations_per_user: Math.round((week.evaluations / week.unique_users.size) * 100) / 100
    })).sort((a: any, b: any) => new Date(a.week).getTime() - new Date(b.week).getTime())

    return NextResponse.json({
      total_evaluations: totalEvals,
      unique_users: uniqueUsers,
      recent_evaluations: recentEvaluations.length,
      avg_evaluations_per_user: Math.round((totalEvals / uniqueUsers) * 100) / 100,
      return_users: returnUsers,
      single_evaluation_users: singleEvaluationUsers,
      return_rate: Math.round((returnUsers / uniqueUsers) * 10000) / 100,
      daily_trends: dailyTrends,
      weekly_trends: weeklyData,
      question_type_breakdown: Object.entries(questionTypeBreakdown).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count as number / recentEvaluations.length) * 10000) / 100
      })).sort((a, b) => (b.count as number) - (a.count as number))
    })
    
  } catch (error) {
    console.error('Error fetching evaluation metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evaluation metrics' },
      { status: 500 }
    )
  }
}
