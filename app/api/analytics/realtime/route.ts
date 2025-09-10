import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Import the MCP tool function
    const { mcp_analytics_mcp_run_realtime_report } = await import('@/lib/mcp-tools')
    
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId') || '495635139'
    
    const response = await mcp_analytics_mcp_run_realtime_report({
      property_id: parseInt(propertyId),
      dimensions: [
        'country',
        'deviceCategory'
      ],
      metrics: [
        'activeUsers'
      ]
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in realtime analytics API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch realtime analytics data' },
      { status: 500 }
    )
  }
}
