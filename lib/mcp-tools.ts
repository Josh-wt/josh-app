// MCP Tools wrapper for server-side usage
// This file provides a clean interface to the MCP tools that are available in the server environment

// Note: These functions will be available in the server environment where MCP tools are accessible
// They should not be called directly from client-side code

export async function mcp_analytics_mcp_run_realtime_report(params: {
  property_id: number;
  dimensions: string[];
  metrics: string[];
}) {
  // This would normally call the actual MCP tool
  // For now, we'll return mock data to prevent errors
  console.log('MCP Realtime Report called with params:', params);
  
  // Mock response structure that matches the expected format
  return {
    result: {
      rows: [
        {
          dimension_values: [
            { value: 'United States' },
            { value: 'desktop' }
          ],
          metric_values: [
            { value: '15' }
          ]
        },
        {
          dimension_values: [
            { value: 'Canada' },
            { value: 'mobile' }
          ],
          metric_values: [
            { value: '8' }
          ]
        }
      ]
    }
  };
}

export async function mcp_analytics_mcp_run_report(params: {
  property_id: number;
  date_ranges: Array<{ start_date: string; end_date: string }>;
  dimensions?: string[];
  metrics: string[];
}) {
  // This would normally call the actual MCP tool
  // For now, we'll return mock data to prevent errors
  console.log('MCP Standard Report called with params:', params);
  
  // Mock response structure that matches the expected format
  if (params.dimensions && params.dimensions.includes('country')) {
    return {
      result: {
        rows: [
          {
            dimension_values: [{ value: 'United States' }],
            metric_values: [
              { value: '1250' }, // sessions
              { value: '980' },  // totalUsers
              { value: '320' },  // newUsers
              { value: '2100' }, // screenPageViews
              { value: '0.45' }, // bounceRate
              { value: '180' }   // averageSessionDuration
            ]
          },
          {
            dimension_values: [{ value: 'Canada' }],
            metric_values: [
              { value: '450' },  // sessions
              { value: '380' },  // totalUsers
              { value: '120' },  // newUsers
              { value: '750' },  // screenPageViews
              { value: '0.38' }, // bounceRate
              { value: '220' }   // averageSessionDuration
            ]
          }
        ]
      }
    };
  } else if (params.dimensions && params.dimensions.includes('deviceCategory')) {
    return {
      result: {
        rows: [
          {
            dimension_values: [{ value: 'desktop' }],
            metric_values: [
              { value: '1200' }, // sessions
              { value: '950' },  // totalUsers
              { value: '1800' }, // screenPageViews
              { value: '0.42' }, // bounceRate
              { value: '195' }   // averageSessionDuration
            ]
          },
          {
            dimension_values: [{ value: 'mobile' }],
            metric_values: [
              { value: '800' },  // sessions
              { value: '650' },  // totalUsers
              { value: '1200' }, // screenPageViews
              { value: '0.48' }, // bounceRate
              { value: '165' }   // averageSessionDuration
            ]
          }
        ]
      }
    };
  } else {
    // Standard metrics without dimensions
    return {
      result: {
        rows: [
          {
            metric_values: [
              { value: '2000' }, // sessions
              { value: '1600' }, // totalUsers
              { value: '440' },  // newUsers
              { value: '3000' }, // screenPageViews
              { value: '0.45' }, // bounceRate
              { value: '180' }   // averageSessionDuration
            ]
          }
        ]
      }
    };
  }
}
