"use client"

import { GlassCard } from "@/components/glass-card"
import { 
  CreditCard, 
  Plus, 
  Filter, 
  Search,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpDown
} from "lucide-react"
import { useState } from "react"

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const transactions = [
    {
      id: 1,
      date: "2024-01-30",
      description: "Starbucks Coffee",
      category: "Food & Dining",
      amount: -5.45,
      type: "expense",
      account: "Chase Credit Card",
      status: "completed"
    },
    {
      id: 2,
      date: "2024-01-30",
      description: "Freelance Payment - Web Design",
      category: "Income",
      amount: 1200.00,
      type: "income",
      account: "Business Checking",
      status: "completed"
    },
    {
      id: 3,
      date: "2024-01-29",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: -15.99,
      type: "expense",
      account: "Chase Credit Card",
      status: "completed"
    },
    {
      id: 4,
      date: "2024-01-29",
      description: "Grocery Shopping - Whole Foods",
      category: "Food & Dining",
      amount: -87.32,
      type: "expense",
      account: "Chase Credit Card",
      status: "completed"
    },
    {
      id: 5,
      date: "2024-01-28",
      description: "Gas Station",
      category: "Transportation",
      amount: -42.15,
      type: "expense",
      account: "Chase Credit Card",
      status: "completed"
    },
    {
      id: 6,
      date: "2024-01-28",
      description: "Salary Deposit",
      category: "Income",
      amount: 3500.00,
      type: "income",
      account: "Primary Checking",
      status: "completed"
    },
    {
      id: 7,
      date: "2024-01-27",
      description: "Amazon Purchase - Office Supplies",
      category: "Business",
      amount: -156.78,
      type: "expense",
      account: "Business Credit Card",
      status: "completed"
    },
    {
      id: 8,
      date: "2024-01-27",
      description: "Rent Payment",
      category: "Housing",
      amount: -1200.00,
      type: "expense",
      account: "Primary Checking",
      status: "completed"
    }
  ]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === "all" || 
      (filter === "income" && transaction.type === "income") ||
      (filter === "expense" && transaction.type === "expense") ||
      (filter === "pending" && transaction.status === "pending")
    
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netAmount = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-green-500" />
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
        </div>
        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Net Amount</p>
              <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netAmount.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <ArrowUpDown className={`w-6 h-6 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
              <option value="pending">Pending</option>
            </select>
            
            <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
            
            <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Transactions List */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-800">{transaction.description}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
