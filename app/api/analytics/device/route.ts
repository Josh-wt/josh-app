import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Import the MCP tool function
    const { mcp_analytics_mcp_run_report } = await import('@/lib/mcp-tools')
    
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId') || '495635139'
    const days = parseInt(searchParams.get('days') || '7')
    
    // Generate date ranges
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)
    
    const dateRanges = [{
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    }]
    
    const response = await mcp_analytics_mcp_run_report({
      property_id: parseInt(propertyId),
      date_ranges: dateRanges,
      dimensions: ['deviceCategory'],
      metrics: [
        'sessions',
        'totalUsers',
        'screenPageViews',
        'bounceRate',
        'averageSessionDuration'
      ]
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in device analytics API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch device analytics data' },
      { status: 500 }
    )
  }
}
