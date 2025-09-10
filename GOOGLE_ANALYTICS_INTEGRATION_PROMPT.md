# Google Analytics Integration Implementation Prompt

## Context
You are working on a personal dashboard application built with Next.js, TypeScript, and Tailwind CSS. The Google Analytics MCP tool is now properly configured and working. You need to integrate Google Analytics data into the existing marketing dashboard components.

## Project Structure
- **Main Dashboard**: `/app/page.tsx`
- **Marketing Components**: 
  - `/components/enhanced-marketing-dashboard.tsx`
  - `/components/marketing-dashboard.tsx`
  - `/components/finance-watch.tsx`
- **Other Components**: Various dashboard widgets in `/components/`
- **Database**: Supabase integration with tables for tasks, habits, notes, etc.

## Available Google Analytics MCP Functions
- `mcp_analytics-mcp_get_account_summaries` - Get account and property info
- `mcp_analytics-mcp_get_property_details` - Get property details
- `mcp_analytics-mcp_run_report` - Generate analytics reports
- `mcp_analytics-mcp_run_realtime_report` - Get real-time data
- `mcp_analytics-mcp_get_custom_dimensions_and_metrics` - Get custom data

## Implementation Goals

### 1. Create Google Analytics Service Layer
Create a new service file `/lib/analytics-service.ts` that:
- Wraps the MCP analytics functions
- Provides clean TypeScript interfaces
- Handles error cases gracefully
- Caches data appropriately

### 2. Enhance Marketing Dashboard Components
Update the existing marketing dashboard components to:
- Display real-time visitor data
- Show traffic sources and acquisition metrics
- Display conversion rates and goals
- Show user engagement metrics
- Include revenue/e-commerce data if available

### 3. Key Metrics to Display
Focus on these essential marketing metrics:
- **Traffic**: Sessions, users, page views
- **Acquisition**: Traffic sources, campaigns, referrals
- **Behavior**: Bounce rate, session duration, pages per session
- **Conversions**: Goal completions, conversion rate
- **Real-time**: Active users, current traffic sources

### 4. Integration Points
- Integrate with existing `enhanced-marketing-dashboard.tsx`
- Connect with `finance-watch.tsx` for ROI tracking
- Feed data to `personal-ai-hub.tsx` for insights
- Use existing glass-card styling for consistency

## Implementation Steps

### Step 1: Test Google Analytics Connection
First, verify the connection works:
```typescript
// Test basic connection
const accounts = await mcp_analytics-mcp_get_account_summaries();
console.log('Available accounts:', accounts);
```

### Step 2: Create Analytics Service
Build a service layer that:
- Fetches property details
- Gets standard metrics (sessions, users, pageviews, bounce rate)
- Retrieves traffic source data
- Fetches real-time data
- Handles different date ranges (today, yesterday, last 7 days, last 30 days)

### Step 3: Update Marketing Dashboard
Enhance the existing marketing dashboard with:
- Real-time visitor counter
- Traffic sources breakdown (pie chart or list)
- Key metrics cards (sessions, users, bounce rate, conversion rate)
- Top pages/landing pages
- Geographic data if available

### Step 4: Add Data Visualization
Use the existing glass-card components to display:
- Metric cards with trend indicators
- Traffic source pie charts
- Time-series charts for key metrics
- Real-time activity feed

### Step 5: Error Handling & Loading States
Implement:
- Loading skeletons for data fetching
- Error boundaries for API failures
- Fallback data when analytics is unavailable
- Retry mechanisms for failed requests

## Code Style Guidelines
- Use TypeScript with proper interfaces
- Follow existing component patterns
- Use Tailwind CSS for styling
- Maintain glass-card design consistency
- Implement responsive design
- Use proper error handling

## Example Implementation Structure
```typescript
// lib/analytics-service.ts
interface AnalyticsData {
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  conversionRate: number;
  trafficSources: TrafficSource[];
  realTimeUsers: number;
}

// components/analytics-widget.tsx
export function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Implementation here
}
```

## Testing Strategy
- Test with different date ranges
- Verify real-time data updates
- Test error scenarios (no data, API failures)
- Ensure responsive design works
- Validate data accuracy against Google Analytics UI

## Success Criteria
- [ ] Google Analytics data displays in marketing dashboard
- [ ] Real-time data updates properly
- [ ] Traffic sources are clearly visualized
- [ ] Key metrics are prominently displayed
- [ ] Error handling works gracefully
- [ ] Design matches existing dashboard aesthetic
- [ ] Performance is smooth (no blocking operations)

## Notes
- The Google Analytics MCP tool is already configured and working
- Use the existing Supabase integration patterns as reference
- Maintain consistency with the current dashboard design
- Focus on the most valuable metrics for a personal dashboard
- Consider adding data refresh intervals for real-time updates

Start by testing the Google Analytics connection, then build the service layer, and finally integrate it into the existing marketing dashboard components.
