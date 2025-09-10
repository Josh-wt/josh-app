"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

export default function BudgetsPage() {
  const budgets = [
    {
      id: 1,
      name: "Food & Dining",
      category: "Food & Dining",
      budgetAmount: 500,
      spent: 387.45,
      period: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "on-track"
    },
    {
      id: 2,
      name: "Entertainment",
      category: "Entertainment",
      budgetAmount: 200,
      spent: 185.99,
      period: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "warning"
    },
    {
      id: 3,
      name: "Transportation",
      category: "Transportation",
      budgetAmount: 300,
      spent: 245.67,
      period: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "on-track"
    },
    {
      id: 4,
      name: "Business Expenses",
      category: "Business",
      budgetAmount: 1000,
      spent: 1156.78,
      period: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "over-budget"
    },
    {
      id: 5,
      name: "Housing",
      category: "Housing",
      budgetAmount: 1500,
      spent: 1200.00,
      period: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "on-track"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-green-500 bg-green-100"
      case "warning": return "text-yellow-500 bg-yellow-100"
      case "over-budget": return "text-red-500 bg-red-100"
      default: return "text-gray-500 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track": return CheckCircle
      case "warning": return AlertTriangle
      case "over-budget": return TrendingDown
      default: return CheckCircle
    }
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remainingBudget = totalBudget - totalSpent

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-800">Budgets</h1>
        </div>
        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Budget</span>
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-slate-800">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`w-6 h-6 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.map((budget) => {
          const StatusIcon = getStatusIcon(budget.status)
          const percentageUsed = (budget.spent / budget.budgetAmount) * 100
          const remaining = budget.budgetAmount - budget.spent
          
          return (
            <GlassCard key={budget.id} className="p-6">
              <div className="space-y-4">
                {/* Budget Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{budget.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(budget.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{budget.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-3">{budget.category} • {budget.period}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Budget: ${budget.budgetAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="w-4 h-4" />
                        <span>Spent: ${budget.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Remaining: ${remaining.toLocaleString()}</span>
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

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        percentageUsed > 100 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        percentageUsed > 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-blue-500'
                      }`}
                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Budget Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Daily Average</span>
                    <p className="font-medium">${(budget.spent / 30).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Days Left</span>
                    <p className="font-medium">
                      {Math.max(0, Math.ceil((new Date(budget.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Projected Total</span>
                    <p className="font-medium">${(budget.spent * 1.2).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Status</span>
                    <p className={`font-medium ${
                      budget.status === 'on-track' ? 'text-green-600' :
                      budget.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {budget.status === 'on-track' ? 'On Track' :
                       budget.status === 'warning' ? 'Warning' :
                       'Over Budget'}
                    </p>
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
