"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { 
  analyticsService, 
  type AnalyticsData, 
  type AnalyticsMetrics, 
  type TrafficSource, 
  type RealTimeData,
  type GeographicData,
  type DeviceData,
  type PageData
} from "@/lib/analytics-service"
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Zap,
  Star,
  Award,
  BookOpen,
  FileText,
  ExternalLink,
  UserCheck,
  Timer,
  Percent,
  ShoppingCart,
  CreditCard,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Upload,
  Filter,
  Search,
  Settings,
  Info,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
]

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  iconColor?: string;
  subtitle?: string;
  trend?: Array<{ date: string; value: number }>;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor = 'text-blue-500',
  subtitle,
  trend,
  format = 'number',
  loading = false
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return analyticsService.formatCurrency(val);
      case 'duration':
        return analyticsService.formatDuration(val);
      default:
        return analyticsService.formatNumber(val);
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6 hover">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="w-8 h-8 bg-slate-200 rounded"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 hover group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <Icon className={`w-6 h-6 ${iconColor} group-hover:scale-110 transition-transform`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-slate-800">
            {formatValue(value)}
          </span>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      {trend && trend.length > 0 && (
        <div className="mt-4 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={iconColor.replace('text-', '#').replace('-500', '')} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}

interface RealTimeWidgetProps {
  data: RealTimeData;
  loading?: boolean;
}

export function RealTimeWidget({ data, loading = false }: RealTimeWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-slate-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-800">Real-Time Activity</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-500">Live</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-slate-800 mb-2">
          {data.activeUsers}
        </div>
        <p className="text-sm text-slate-600">Active Users Right Now</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600">By Country</h4>
          {data.activeUsersByCountry.slice(0, 3).map((country, index) => (
            <div key={country.country} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-slate-700">{country.country}</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {country.activeUsers}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600">By Device</h4>
          {data.activeUsersByDevice.map((device, index) => (
            <div key={device.deviceCategory} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {device.deviceCategory === 'desktop' && <Monitor className="w-4 h-4 text-slate-500" />}
                {device.deviceCategory === 'mobile' && <Smartphone className="w-4 h-4 text-slate-500" />}
                {device.deviceCategory === 'tablet' && <Tablet className="w-4 h-4 text-slate-500" />}
                <span className="text-sm text-slate-700 capitalize">{device.deviceCategory}</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {device.activeUsers}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-600 mb-3">Top Pages</h4>
        <div className="space-y-2">
          {data.topPages.slice(0, 3).map((page, index) => (
            <div key={page.pagePath} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">#{index + 1}</span>
                <span className="text-sm text-slate-700 truncate">{page.pageTitle}</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {page.activeUsers}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

interface TrafficSourcesWidgetProps {
  data: TrafficSource[];
  loading?: boolean;
}

export function TrafficSourcesWidget({ data, loading = false }: TrafficSourcesWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  const totalSessions = data.reduce((sum, source) => sum + source.sessions, 0);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-slate-800">Traffic Sources</h3>
        </div>
        <span className="text-sm text-slate-500">{totalSessions.toLocaleString()} total sessions</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data.map((source, index) => ({
                  name: source.source,
                  value: source.sessions,
                  color: COLORS[index % COLORS.length]
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'Sessions']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Details */}
        <div className="space-y-4">
          {data.map((source, index) => {
            const percentage = (source.sessions / totalSessions) * 100;
            return (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="font-semibold text-slate-800 capitalize">{source.source}</p>
                      <p className="text-sm text-slate-500">{source.medium}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {analyticsService.formatNumber(source.sessions)}
                    </p>
                    <p className="text-sm text-slate-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="block">Users</span>
                    <span className="font-semibold">{analyticsService.formatNumber(source.users)}</span>
                  </div>
                  <div>
                    <span className="block">Bounce Rate</span>
                    <span className="font-semibold">{analyticsService.formatPercentage(source.bounceRate)}</span>
                  </div>
                  <div>
                    <span className="block">Avg Duration</span>
                    <span className="font-semibold">{analyticsService.formatDuration(source.avgSessionDuration)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

interface GeographicWidgetProps {
  data: GeographicData[];
  loading?: boolean;
}

export function GeographicWidget({ data, loading = false }: GeographicWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="w-6 h-6 text-green-500" />
        <h3 className="text-lg font-semibold text-slate-800">Geographic Distribution</h3>
      </div>

      <div className="space-y-4">
        {data.map((location, index) => (
          <div key={`${location.country}-${location.city}`} className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div>
                  <p className="font-semibold text-slate-800">{location.country}</p>
                  <p className="text-sm text-slate-500">{location.city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">
                  {analyticsService.formatNumber(location.sessions)}
                </p>
                <p className="text-sm text-slate-500">
                  {analyticsService.formatNumber(location.users)} users
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(location.sessions / Math.max(...data.map(d => d.sessions))) * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

interface DeviceWidgetProps {
  data: DeviceData[];
  loading?: boolean;
}

export function DeviceWidget({ data, loading = false }: DeviceWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-48 bg-slate-200 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  const totalSessions = data.reduce((sum, device) => sum + device.sessions, 0);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Smartphone className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-semibold text-slate-800">Device Categories</h3>
      </div>

      <div className="space-y-4">
        {data.map((device, index) => {
          const percentage = (device.sessions / totalSessions) * 100;
          const Icon = device.deviceCategory === 'desktop' ? Monitor : 
                      device.deviceCategory === 'mobile' ? Smartphone : Tablet;
          
          return (
            <div key={device.deviceCategory} className="glass-panel p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6 text-slate-600" />
                  <div>
                    <p className="font-semibold text-slate-800 capitalize">{device.deviceCategory}</p>
                    <p className="text-sm text-slate-500">{percentage.toFixed(1)}% of sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    {analyticsService.formatNumber(device.sessions)}
                  </p>
                  <p className="text-sm text-slate-500">sessions</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Users</span>
                  <p className="font-semibold text-slate-800">
                    {analyticsService.formatNumber(device.users)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Bounce Rate</span>
                  <p className="font-semibold text-slate-800">
                    {analyticsService.formatPercentage(device.bounceRate)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

interface TopPagesWidgetProps {
  data: PageData[];
  loading?: boolean;
}

export function TopPagesWidget({ data, loading = false }: TopPagesWidgetProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-slate-800">Top Pages</h3>
        </div>
        <ExternalLink className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {data.map((page, index) => (
          <div key={page.pagePath} className="glass-panel p-4 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{page.pageTitle}</p>
                  <p className="text-sm text-slate-500 truncate">{page.pagePath}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-800">
                  {analyticsService.formatNumber(page.pageviews)}
                </p>
                <p className="text-sm text-slate-500">pageviews</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Unique Views</span>
                <p className="font-semibold text-slate-800">
                  {analyticsService.formatNumber(page.uniquePageviews)}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Avg Time</span>
                <p className="font-semibold text-slate-800">
                  {analyticsService.formatDuration(page.avgTimeOnPage)}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Bounce Rate</span>
                <p className="font-semibold text-slate-800">
                  {analyticsService.formatPercentage(page.bounceRate)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

interface AnalyticsOverviewProps {
  data: AnalyticsData;
  loading?: boolean;
  onRefresh?: () => void;
}

export function AnalyticsOverview({ data, loading = false, onRefresh }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <MetricCard
              key={i}
              title="Loading..."
              value={0}
              icon={Users}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Sessions"
          value={metrics.sessions}
          change={12.5}
          changeType="increase"
          icon={Activity}
          iconColor="text-blue-500"
          subtitle="Total visits"
          format="number"
        />
        
        <MetricCard
          title="Users"
          value={metrics.users}
          change={8.3}
          changeType="increase"
          icon={Users}
          iconColor="text-green-500"
          subtitle="Unique visitors"
          format="number"
        />
        
        <MetricCard
          title="Page Views"
          value={metrics.pageviews}
          change={-2.1}
          changeType="decrease"
          icon={Eye}
          iconColor="text-purple-500"
          subtitle="Total page views"
          format="number"
        />
        
        <MetricCard
          title="Bounce Rate"
          value={metrics.bounceRate * 100}
          change={-5.2}
          changeType="decrease"
          icon={MousePointer}
          iconColor="text-orange-500"
          subtitle="Single page sessions"
          format="percentage"
        />
        
        <MetricCard
          title="Avg Session Duration"
          value={metrics.avgSessionDuration}
          change={15.7}
          changeType="increase"
          icon={Clock}
          iconColor="text-indigo-500"
          subtitle="Time on site"
          format="duration"
        />
        
        <MetricCard
          title="Pages per Session"
          value={metrics.pagesPerSession}
          change={3.4}
          changeType="increase"
          icon={FileText}
          iconColor="text-pink-500"
          subtitle="Engagement depth"
          format="number"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate * 100}
          change={22.1}
          changeType="increase"
          icon={Target}
          iconColor="text-red-500"
          subtitle="Goal completions"
          format="percentage"
        />
        
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          change={18.9}
          changeType="increase"
          icon={DollarSign}
          iconColor="text-emerald-500"
          subtitle="Total earnings"
          format="currency"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="New Users"
          value={metrics.newUsers}
          change={5.6}
          changeType="increase"
          icon={UserCheck}
          iconColor="text-cyan-500"
          subtitle="First-time visitors"
          format="number"
        />
        
        <MetricCard
          title="Goal Completions"
          value={metrics.goalCompletions}
          change={12.3}
          changeType="increase"
          icon={Award}
          iconColor="text-yellow-500"
          subtitle="Achieved objectives"
          format="number"
        />
        
        <MetricCard
          title="E-commerce Conversion"
          value={metrics.ecommerceConversionRate * 100}
          change={-1.8}
          changeType="decrease"
          icon={ShoppingCart}
          iconColor="text-teal-500"
          subtitle="Purchase rate"
          format="percentage"
        />
      </div>
    </div>
  );
}

// Export all components
export {
  MetricCard,
  RealTimeWidget,
  TrafficSourcesWidget,
  GeographicWidget,
  DeviceWidget,
  TopPagesWidget,
  AnalyticsOverview
};
