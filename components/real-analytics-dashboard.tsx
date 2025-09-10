"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { 
  RealTimeGoogleAnalyticsWidget,
  GeographicGoogleAnalyticsWidget,
  DeviceGoogleAnalyticsWidget,
  MetricCard
} from "@/components/analytics-widgets"
import { 
  realGoogleAnalyticsAPI, 
  type StandardMetrics
} from "@/lib/real-google-analytics-api"
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  Activity,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface RealAnalyticsDashboardProps {
  className?: string;
  days?: number;
}

export function RealAnalyticsDashboard({ className = "", days = 7 }: RealAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<StandardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const standardMetrics = await realGoogleAnalyticsAPI.getStandardMetrics(days);
      setMetrics(standardMetrics);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchMetrics();
  };

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 text-red-500">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Analytics Data Error</h3>
              <p className="text-sm">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Real-Time Analytics Dashboard</h2>
          <p className="text-slate-600">Live data from Google Analytics</p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Sessions (7 days)"
          value={metrics?.sessions || 0}
          icon={Activity}
          iconColor="text-blue-500"
          subtitle="Total visits"
          format="number"
          loading={isLoading}
        />
        
        <MetricCard
          title="Users (7 days)"
          value={metrics?.totalUsers || 0}
          icon={Users}
          iconColor="text-green-500"
          subtitle="Unique visitors"
          format="number"
          loading={isLoading}
        />
        
        <MetricCard
          title="New Users (7 days)"
          value={metrics?.newUsers || 0}
          icon={TrendingUp}
          iconColor="text-purple-500"
          subtitle="First-time visitors"
          format="number"
          loading={isLoading}
        />
        
        <MetricCard
          title="Page Views (7 days)"
          value={metrics?.screenPageViews || 0}
          icon={Eye}
          iconColor="text-orange-500"
          subtitle="Total page views"
          format="number"
          loading={isLoading}
        />
        
        <MetricCard
          title="Bounce Rate (7 days)"
          value={metrics?.bounceRate ? metrics.bounceRate * 100 : 0}
          icon={MousePointer}
          iconColor="text-red-500"
          subtitle="Single page sessions"
          format="percentage"
          loading={isLoading}
        />
        
        <MetricCard
          title="Avg Session Duration (7 days)"
          value={metrics?.averageSessionDuration || 0}
          icon={Clock}
          iconColor="text-indigo-500"
          subtitle="Time on site"
          format="duration"
          loading={isLoading}
        />
      </div>

      {/* Real-time and Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeGoogleAnalyticsWidget loading={isLoading} />
        <GeographicGoogleAnalyticsWidget loading={isLoading} days={days} />
      </div>

      {/* Device Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceGoogleAnalyticsWidget loading={isLoading} days={days} />
        
        {/* Data Source Info */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-slate-800">Data Source</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-700">Google Analytics Property</h4>
              <p className="text-sm text-slate-600">everythingenglishai1 (495635139)</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-700">Data Freshness</h4>
              <p className="text-sm text-slate-600">
                Real-time data updates every 30 seconds<br />
                Historical data updates every 5 minutes
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-700">Time Range</h4>
              <p className="text-sm text-slate-600">
                Real-time: Current active users<br />
                Historical: Last 7 days
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected to Google Analytics</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Summary Stats */}
      {metrics && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Summary (Last 7 Days)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {realGoogleAnalyticsAPI.formatNumber(metrics.sessions)}
              </div>
              <div className="text-sm text-slate-600">Total Sessions</div>
              <div className="text-xs text-slate-500 mt-1">
                {realGoogleAnalyticsAPI.formatNumber(metrics.totalUsers)} unique users
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {realGoogleAnalyticsAPI.formatNumber(metrics.screenPageViews)}
              </div>
              <div className="text-sm text-slate-600">Page Views</div>
              <div className="text-xs text-slate-500 mt-1">
                {(metrics.screenPageViews / metrics.sessions).toFixed(1)} pages per session
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {realGoogleAnalyticsAPI.formatDuration(metrics.averageSessionDuration)}
              </div>
              <div className="text-sm text-slate-600">Avg Session Duration</div>
              <div className="text-xs text-slate-500 mt-1">
                {realGoogleAnalyticsAPI.formatPercentage(metrics.bounceRate)} bounce rate
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default RealAnalyticsDashboard;
