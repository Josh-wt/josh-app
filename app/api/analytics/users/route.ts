import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get all users
    const { data: allUsers, error: usersError } = await supabase
      .from('assessment_users')
      .select('uid, email, academic_level, questions_marked, created_at')
    
    if (usersError) throw usersError

    const totalUsers = allUsers?.length || 0
    
    // Filter out email users (only Discord/Google users)
    const nonEmailUsers = allUsers?.filter(user => 
      !user.email || user.email === '' || user.email === null
    ) || []
    
    const emailUsers = allUsers?.filter(user => 
      user.email && user.email !== '' && user.email !== null
    ) || []

    // Daily new user signups (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentUsers = allUsers?.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ) || []
    
    const recentNonEmailUsers = nonEmailUsers.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    )

    // Daily signup trends
    const dailySignups = recentUsers.reduce((acc: any, user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, total_users: 0, non_email_users: 0, email_users: 0 }
      }
      acc[date].total_users++
      if (user.email && user.email !== '' && user.email !== null) {
        acc[date].email_users++
      } else {
        acc[date].non_email_users++
      }
      return acc
    }, {})
    
    const dailySignupTrends = Object.values(dailySignups).map((day: any) => ({
      date: day.date,
      total_users: day.total_users,
      non_email_users: day.non_email_users,
      email_users: day.email_users
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Weekly signup trends
    const weeklySignups = recentUsers.reduce((acc: any, user) => {
      const date = new Date(user.created_at)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!acc[weekKey]) {
        acc[weekKey] = { week: weekKey, total_users: 0, non_email_users: 0, email_users: 0 }
      }
      acc[weekKey].total_users++
      if (user.email && user.email !== '' && user.email !== null) {
        acc[weekKey].email_users++
      } else {
        acc[weekKey].non_email_users++
      }
      return acc
    }, {})

    const weeklySignupTrends = Object.values(weeklySignups).map((week: any) => ({
      week: week.week,
      total_users: week.total_users,
      non_email_users: week.non_email_users,
      email_users: week.email_users
    })).sort((a: any, b: any) => new Date(a.week).getTime() - new Date(b.week).getTime())

    // Academic level distribution
    const academicLevels = allUsers?.reduce((acc: any, user) => {
      const level = user.academic_level || 'Unknown'
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {}) || {}

    const academicLevelBreakdown = Object.entries(academicLevels).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count as number / totalUsers) * 10000) / 100
    })).sort((a, b) => b.count - a.count)

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

    return NextResponse.json({
      total_users: totalUsers,
      non_email_users: nonEmailUsers.length,
      email_users: emailUsers.length,
      non_email_percentage: Math.round((nonEmailUsers.length / totalUsers) * 10000) / 100,
      recent_users_30d: recentUsers.length,
      recent_non_email_users_30d: recentNonEmailUsers.length,
      daily_signup_trends: dailySignupTrends,
      weekly_signup_trends: weeklySignupTrends,
      academic_level_breakdown: academicLevelBreakdown,
      engagement_breakdown: engagementBreakdown,
      avg_questions_marked: Math.round((allUsers?.reduce((sum, user) => sum + (user.questions_marked || 0), 0) / totalUsers) * 100) / 100
    })
    
  } catch (error) {
    console.error('Error fetching user metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user metrics' },
      { status: 500 }
    )
  }
}
