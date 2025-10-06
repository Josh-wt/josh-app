import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const table = searchParams.get('table')
    const limit = parseInt(searchParams.get('limit') || '50')
    const filter = searchParams.get('filter')
    const orderBy = searchParams.get('orderBy')
    const orderDirection = searchParams.get('orderDirection') || 'desc'

    if (!table) {
      return NextResponse.json(
        { error: 'Table parameter is required' },
        { status: 400 }
      )
    }

    // Validate table name to prevent SQL injection
    const allowedTables = [
      'assessment_users',
      'assessment_evaluations', 
      'study_goals',
      'study_streaks',
      'saved_resources',
      'subscriptions',
      'profiles',
      'generated_plans',
      'plan_adaptations',
      'assessment_feedback',
      'assessment_badges',
      'subscription_features',
      'subscription_usage',
      'subscription_billing_history'
    ]

    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      )
    }

    let query = supabase
      .from(table)
      .select('*')
      .limit(limit)

    // Apply filters
    if (filter) {
      const [column, value] = filter.split(':')
      if (column && value) {
        query = query.eq(column, value)
      }
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })
    } else {
      // Default ordering by created_at or timestamp
      const defaultOrderColumn = table === 'assessment_evaluations' ? 'timestamp' : 'created_at'
      query = query.order(defaultOrderColumn, { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
      table,
      limit
    })

  } catch (error) {
    console.error('Error fetching table data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch table data' },
      { status: 500 }
    )
  }
}