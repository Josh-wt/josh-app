"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  BarChart3,
  Users,
  Target,
  Calendar,
  DollarSign
} from "lucide-react"

export default function MarketingCampaignsPage() {
  const campaigns = [
    {
      id: 1,
      name: "Q1 Product Launch",
      description: "Launch campaign for new product features",
      status: "active",
      type: "Email Marketing",
      budget: 5000,
      spent: 3200,
      startDate: "2024-01-15",
      endDate: "2024-03-31",
      metrics: {
        impressions: 125000,
        clicks: 8500,
        conversions: 420,
        ctr: 6.8,
        cpc: 0.38
      }
    },
    {
      id: 2,
      name: "Social Media Boost",
      description: "Increase social media engagement and followers",
      status: "paused",
      type: "Social Media",
      budget: 2000,
      spent: 1200,
      startDate: "2024-01-01",
      endDate: "2024-02-29",
      metrics: {
        impressions: 89000,
        clicks: 4200,
        conversions: 180,
        ctr: 4.7,
        cpc: 0.29
      }
    },
    {
      id: 3,
      name: "Retargeting Campaign",
      description: "Re-engage website visitors who didn't convert",
      status: "completed",
      type: "Display Ads",
      budget: 3000,
      spent: 3000,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      metrics: {
        impressions: 200000,
        clicks: 12000,
        conversions: 680,
        ctr: 6.0,
        cpc: 0.25
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500 bg-green-100"
      case "paused": return "text-yellow-500 bg-yellow-100"
      case "completed": return "text-blue-500 bg-blue-100"
      case "draft": return "text-gray-500 bg-gray-100"
      default: return "text-gray-500 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return Play
      case "paused": return Pause
      case "completed": return BarChart3
      default: return Pause
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Megaphone className="w-6 h-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-slate-800">Marketing Campaigns</h1>
        </div>
        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6 text-center">
          <div className="text-2xl font-bold text-slate-800 mb-1">{campaigns.length}</div>
          <div className="text-sm text-slate-600">Total Campaigns</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">Active</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            ${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Total Spent</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)}
          </div>
          <div className="text-sm text-slate-600">Total Conversions</div>
        </GlassCard>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const StatusIcon = getStatusIcon(campaign.status)
          const budgetUsed = (campaign.spent / campaign.budget) * 100
          
          return (
            <GlassCard key={campaign.id} className="p-6">
              <div className="space-y-4">
                {/* Campaign Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{campaign.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{campaign.status}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-3">{campaign.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{campaign.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Budget Usage</span>
                    <span className="font-medium">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
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

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">
                      {campaign.metrics.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">
                      {campaign.metrics.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">
                      {campaign.metrics.conversions}
                    </div>
                    <div className="text-xs text-slate-600">Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">
                      {campaign.metrics.ctr}%
                    </div>
                    <div className="text-xs text-slate-600">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">
                      ${campaign.metrics.cpc}
                    </div>
                    <div className="text-xs text-slate-600">CPC</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
