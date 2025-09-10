"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  ArrowLeft, 
  Edit, 
  Play,
  Pause,
  BarChart3,
  Users,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  MousePointer,
  CheckCircle
} from "lucide-react"

interface CampaignDetailPageProps {
  params: {
    id: string
  }
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const campaignId = params.id

  // Mock campaign data - in real app, fetch based on campaignId
  const campaign = {
    id: campaignId,
    name: "Q1 Product Launch",
    description: "Launch campaign for new product features targeting existing customers and new prospects",
    status: "active",
    type: "Email Marketing",
    budget: 5000,
    spent: 3200,
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    targetAudience: "Existing customers, Tech professionals, Small business owners",
    metrics: {
      impressions: 125000,
      clicks: 8500,
      conversions: 420,
      ctr: 6.8,
      cpc: 0.38,
      cpm: 25.6,
      conversionRate: 4.9,
      roas: 3.2
    },
    dailyPerformance: [
      { date: "2024-01-15", impressions: 4200, clicks: 285, conversions: 14, spend: 108 },
      { date: "2024-01-16", impressions: 4800, clicks: 326, conversions: 18, spend: 124 },
      { date: "2024-01-17", impressions: 5200, clicks: 354, conversions: 22, spend: 135 },
      { date: "2024-01-18", impressions: 4600, clicks: 312, conversions: 16, spend: 119 },
      { date: "2024-01-19", impressions: 5100, clicks: 347, conversions: 20, spend: 132 }
    ]
  }

  const budgetUsed = (campaign.spent / campaign.budget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="glass-button p-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{campaign.name}</h1>
            <p className="text-slate-600 mt-1">{campaign.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-green-600">
            <Play className="w-4 h-4" />
            <span>Resume</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {campaign.metrics.impressions.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600">Impressions</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {campaign.metrics.clicks.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600">Clicks</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {campaign.metrics.conversions}
              </div>
              <div className="text-xs text-slate-600">Conversions</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {campaign.metrics.ctr}%
              </div>
              <div className="text-xs text-slate-600">CTR</div>
            </GlassCard>
          </div>

          {/* Performance Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800">Daily Performance</h3>
            </div>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <p>Performance chart would go here</p>
            </div>
          </GlassCard>

          {/* Daily Performance Table */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-slate-600">Date</th>
                    <th className="text-right py-2 text-slate-600">Impressions</th>
                    <th className="text-right py-2 text-slate-600">Clicks</th>
                    <th className="text-right py-2 text-slate-600">Conversions</th>
                    <th className="text-right py-2 text-slate-600">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.dailyPerformance.map((day, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-2 text-slate-800">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-right text-slate-800">
                        {day.impressions.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-slate-800">
                        {day.clicks.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-slate-800">
                        {day.conversions}
                      </td>
                      <td className="py-2 text-right text-slate-800">
                        ${day.spend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Info */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Campaign Details</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-600">Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-600 capitalize">{campaign.status}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Type</span>
                <p className="font-medium text-slate-800">{campaign.type}</p>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Duration</span>
                <p className="font-medium text-slate-800">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Target Audience</span>
                <p className="font-medium text-slate-800 text-sm">{campaign.targetAudience}</p>
              </div>
            </div>
          </GlassCard>

          {/* Budget */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800">Budget</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Budget</span>
                <span className="font-medium">${campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Spent</span>
                <span className="font-medium">${campaign.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Remaining</span>
                <span className="font-medium">${(campaign.budget - campaign.spent).toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Usage</span>
                  <span className="font-medium">{budgetUsed.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budgetUsed > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                      budgetUsed > 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-green-500 to-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Performance Metrics */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">Performance</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">CTR</span>
                <span className="font-medium">{campaign.metrics.ctr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">CPC</span>
                <span className="font-medium">${campaign.metrics.cpc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">CPM</span>
                <span className="font-medium">${campaign.metrics.cpm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Conversion Rate</span>
                <span className="font-medium">{campaign.metrics.conversionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">ROAS</span>
                <span className="font-medium">{campaign.metrics.roas}x</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
