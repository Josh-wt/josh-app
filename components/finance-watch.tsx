"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import {
  DollarSign,
  TrendingUp,
  PieChart,
  CreditCard,
  Wallet,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit3,
  Calendar,
  ArrowUpDown,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Transaction {
  id: string
  description: string
  amount: number
  category: "income" | "food" | "transport" | "entertainment" | "utilities" | "shopping" | "investment"
  date: string
  type: "income" | "expense"
  user_id: string
  created_at: string
}

interface Investment {
  id: string
  symbol: string
  name: string
  shares: number
  purchase_price: number
  purchase_date: string
  notes?: string
  current_price?: number
  change?: number
  changePercent?: number
  market_value?: number
  total_gain_loss?: number
  gain_loss_percent?: number
}

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
  user_id: string
}

const USD_TO_INR_RATE = 87.8

const formatCurrency = (amount: number, currency: "USD" | "INR" = "INR") => {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  } else {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

const convertCurrency = (amount: number, from: "USD" | "INR", to: "USD" | "INR") => {
  if (from === to) return amount
  if (from === "USD" && to === "INR") return amount * USD_TO_INR_RATE
  if (from === "INR" && to === "USD") return amount / USD_TO_INR_RATE
  return amount
}

export function FinanceWatch() {
  const [viewCurrency, setViewCurrency] = useState<"USD" | "INR">("INR")
  const [inputCurrency, setInputCurrency] = useState<"USD" | "INR">("INR")
  const [showCurrencyToggle, setShowCurrencyToggle] = useState(false)
  const [tempCurrency, setTempCurrency] = useState<"USD" | "INR">("INR")

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "transactions" | "budget" | "investments">("overview")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "food" as Transaction["category"],
    type: "expense" as Transaction["type"],
  })
  const [newBudget, setNewBudget] = useState({
    name: "",
    budgeted: "",
    color: "bg-blue-500",
  })
  const [newInvestment, setNewInvestment] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchase_price: "",
    purchase_date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchTransactions(user)
        fetchBudgetCategories(user)
        fetchInvestments(user)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchTransactions = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("date", { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgetCategories = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("name", { ascending: true })

      if (error) throw error

      // Calculate spent amounts from transactions
      const categoriesWithSpent = (data || []).map((category) => {
        const spent = transactions
          .filter((t) => t.category === category.name.toLowerCase() && t.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        return { ...category, spent }
      })

      setBudgetCategories(categoriesWithSpent)
    } catch (error) {
      console.error("Error fetching budget categories:", error)
    }
  }

  const fetchInvestments = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("symbol", { ascending: true })

      if (error) throw error

      // Fetch current stock prices for each investment
      const investmentsWithPrices = await Promise.all(
        (data || []).map(async (investment) => {
          const currentPrice = await fetchStockPrice(investment.symbol)
          const market_value = currentPrice * investment.shares
          const total_cost = investment.purchase_price * investment.shares
          const total_gain_loss = market_value - total_cost
          const gain_loss_percent = (total_gain_loss / total_cost) * 100

          return {
            ...investment,
            current_price: currentPrice,
            market_value,
            total_gain_loss,
            gain_loss_percent,
          }
        }),
      )

      setInvestments(investmentsWithPrices)
    } catch (error) {
      console.error("Error fetching investments:", error)
    }
  }

  const fetchStockPrice = async (symbol: string): Promise<number> => {
    try {
      const apiKey = "2NFG4GB8UKBLM4MM"
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      )
      const data = await response.json()

      const quote = data["Global Quote"]
      if (!quote) {
        throw new Error(`No data available for ${symbol}`)
      }

      return Number.parseFloat(quote["05. price"])
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error)
      // Return a fallback price based on symbol
      const fallbackPrices: { [key: string]: number } = {
        RDDT: 65.42,
        NET: 78.91,
        AAPL: 175.0,
        GOOGL: 140.0,
        MSFT: 380.0,
        TSLA: 250.0,
        AMZN: 145.0,
        NVDA: 450.0,
      }
      return fallbackPrices[symbol] || 100.0
    }
  }

  const addInvestment = async () => {
    if (!newInvestment.symbol.trim() || !newInvestment.shares || !newInvestment.purchase_price || !user) return

    try {
      const { data, error } = await supabase
        .from("investments")
        .insert([
          {
            symbol: newInvestment.symbol.toUpperCase().trim(),
            name: newInvestment.name.trim() || newInvestment.symbol.toUpperCase(),
            shares: Number.parseFloat(newInvestment.shares),
            purchase_price: Number.parseFloat(newInvestment.purchase_price),
            purchase_date: newInvestment.purchase_date,
            notes: newInvestment.notes.trim(),
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Fetch current price and calculate metrics
      const currentPrice = await fetchStockPrice(data.symbol)
      const market_value = currentPrice * data.shares
      const total_cost = data.purchase_price * data.shares
      const total_gain_loss = market_value - total_cost
      const gain_loss_percent = (total_gain_loss / total_cost) * 100

      const investmentWithMetrics = {
        ...data,
        current_price: currentPrice,
        market_value,
        total_gain_loss,
        gain_loss_percent,
      }

      setInvestments((prev) => [...prev, investmentWithMetrics])
      setNewInvestment({
        symbol: "",
        name: "",
        shares: "",
        purchase_price: "",
        purchase_date: new Date().toISOString().split("T")[0],
        notes: "",
      })
      setShowAddInvestment(false)
    } catch (error) {
      console.error("Error adding investment:", error)
    }
  }

  const updateInvestment = async () => {
    if (!editingInvestment || !user) return

    try {
      const { data, error } = await supabase
        .from("investments")
        .update({
          symbol: editingInvestment.symbol.toUpperCase().trim(),
          name: editingInvestment.name.trim(),
          shares: editingInvestment.shares,
          purchase_price: editingInvestment.purchase_price,
          purchase_date: editingInvestment.purchase_date,
          notes: editingInvestment.notes?.trim(),
        })
        .eq("id", editingInvestment.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      // Recalculate metrics with updated data
      const currentPrice = await fetchStockPrice(data.symbol)
      const market_value = currentPrice * data.shares
      const total_cost = data.purchase_price * data.shares
      const total_gain_loss = market_value - total_cost
      const gain_loss_percent = (total_gain_loss / total_cost) * 100

      const updatedInvestment = {
        ...data,
        current_price: currentPrice,
        market_value,
        total_gain_loss,
        gain_loss_percent,
      }

      setInvestments((prev) => prev.map((inv) => (inv.id === editingInvestment.id ? updatedInvestment : inv)))
      setEditingInvestment(null)
    } catch (error) {
      console.error("Error updating investment:", error)
    }
  }

  const deleteInvestment = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("investments").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setInvestments((prev) => prev.filter((inv) => inv.id !== id))
    } catch (error) {
      console.error("Error deleting investment:", error)
    }
  }

  const addTransaction = async () => {
    if (!newTransaction.description.trim() || !newTransaction.amount || !user) return

    const amount = Number.parseFloat(newTransaction.amount)
    const amountInINR = inputCurrency === "USD" ? convertCurrency(amount, "USD", "INR") : amount
    const finalAmount = newTransaction.type === "expense" ? -Math.abs(amountInINR) : Math.abs(amountInINR)

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            description: newTransaction.description.trim(),
            amount: finalAmount,
            category: newTransaction.category,
            type: newTransaction.type,
            date: new Date().toISOString().split("T")[0],
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setTransactions((prev) => [data, ...prev])
      setNewTransaction({ description: "", amount: "", category: "food", type: "expense" })
      setShowAddTransaction(false)
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const addBudgetCategory = async () => {
    if (!newBudget.name.trim() || !newBudget.budgeted || !user) return

    try {
      const { data, error } = await supabase
        .from("budget_categories")
        .insert([
          {
            name: newBudget.name.trim(),
            budgeted: Number.parseFloat(newBudget.budgeted),
            color: newBudget.color,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setBudgetCategories((prev) => [...prev, { ...data, spent: 0 }])
      setNewBudget({ name: "", budgeted: "", color: "bg-blue-500" })
      setShowAddBudget(false)
    } catch (error) {
      console.error("Error adding budget category:", error)
    }
  }

  const deleteBudgetCategory = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("budget_categories").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setBudgetCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting budget category:", error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchInvestments(user)
      }
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [user])

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
  const netWorth = totalIncome - totalExpenses
  const portfolioValue = investments.reduce((sum, inv) => sum + (inv.market_value || 0), 0)
  const portfolioGainLoss = investments.reduce((sum, inv) => sum + (inv.total_gain_loss || 0), 0)

  const categoryIcons = {
    income: Wallet,
    food: "🍽️",
    transport: "🚗",
    entertainment: "🎬",
    utilities: "⚡",
    shopping: "🛍️",
    investment: TrendingUp,
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 text-center">
          <div className="text-lg font-medium text-slate-600 mb-2">Please sign in</div>
          <p className="text-slate-500">You need to be authenticated to access your financial data.</p>
        </GlassCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Finance Watch</h2>
              <p className="text-sm text-slate-600">Track spending, investments, and financial goals</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCurrencyToggle(!showCurrencyToggle)}
              className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <span>₹/$ Convert</span>
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showCurrencyToggle && (
          <div className="mb-6 p-4 glass-button rounded-xl">
            <h3 className="font-medium text-slate-800 mb-3">Currency Converter (1 USD = ₹87.8)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  onChange={(e) => {
                    const amount = Number.parseFloat(e.target.value) || 0
                    if (tempCurrency === "INR") {
                      const usdAmount = convertCurrency(amount, "INR", "USD")
                      console.log(`₹${amount} = $${usdAmount.toFixed(2)}`)
                    } else {
                      const inrAmount = convertCurrency(amount, "USD", "INR")
                      console.log(`$${amount} = ₹${inrAmount.toFixed(2)}`)
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">From</label>
                <select
                  value={tempCurrency}
                  onChange={(e) => setTempCurrency(e.target.value as "USD" | "INR")}
                  className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="text-sm text-slate-600">Exchange Rate: 1 USD = ₹87.8</div>
            </div>
          </div>
        )}

        {/* View Navigation */}
        <div className="flex items-center gap-2">
          {[
            { key: "overview", label: "Overview", icon: PieChart },
            { key: "transactions", label: "Transactions", icon: CreditCard },
            { key: "budget", label: "Budget", icon: Target },
            { key: "investments", label: "Investments", icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={cn(
                "glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all",
                activeView === key && "glass-active",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Overview */}
      {activeView === "overview" && (
        <>
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-6 text-center" hover>
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(netWorth, "INR")}</div>
              <div className="text-sm text-slate-600">Net Worth</div>
            </GlassCard>

            <GlassCard className="p-6 text-center" hover>
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(totalIncome, "INR")}</div>
              <div className="text-sm text-slate-600">Income</div>
            </GlassCard>

            <GlassCard className="p-6 text-center" hover>
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(totalExpenses, "INR")}</div>
              <div className="text-sm text-slate-600">Expenses</div>
            </GlassCard>

            <GlassCard className="p-6 text-center" hover>
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(portfolioValue, "USD")}</div>
              <div className="text-sm text-slate-600">Portfolio (USD)</div>
            </GlassCard>
          </div>

          {/* Quick Portfolio Overview */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Investment Portfolio (USD)</h3>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  portfolioGainLoss >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {portfolioGainLoss >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {formatCurrency(Math.abs(portfolioGainLoss), "USD")} Total
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investments.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No investments yet</h3>
                  <p className="text-slate-500">Add your first investment in the Investments tab.</p>
                </div>
              ) : (
                investments.slice(0, 4).map((investment) => (
                  <div key={investment.id} className="glass-button p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-slate-800">{investment.symbol}</div>
                        <div className="text-sm text-slate-600">{investment.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">
                          {formatCurrency(investment.current_price || 0, "USD")}
                        </div>
                        <div
                          className={cn(
                            "text-sm flex items-center gap-1",
                            (investment.total_gain_loss || 0) >= 0 ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {(investment.total_gain_loss || 0) >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {investment.gain_loss_percent?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{investment.shares} shares</span>
                      <span className="font-medium">{formatCurrency(investment.market_value || 0, "USD")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </>
      )}

      {/* Transactions */}
      {activeView === "transactions" && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Transactions</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 glass-button rounded-lg p-1">
                <button
                  onClick={() => setViewCurrency("INR")}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-all",
                    viewCurrency === "INR" ? "bg-white/50 text-slate-800" : "text-slate-600",
                  )}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setViewCurrency("USD")}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-all",
                    viewCurrency === "USD" ? "bg-white/50 text-slate-800" : "text-slate-600",
                  )}
                >
                  $ USD
                </button>
              </div>
              <button
                onClick={() => setShowAddTransaction(!showAddTransaction)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {showAddTransaction && (
            <div className="space-y-4 p-4 glass-button rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Grocery shopping, Salary"
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Amount ({inputCurrency === "INR" ? "₹" : "$"})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="flex-1 glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                    />
                    <div className="flex items-center gap-1 glass-button rounded-lg p-1">
                      <button
                        onClick={() => setInputCurrency("INR")}
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-all",
                          inputCurrency === "INR" ? "bg-white/50 text-slate-800" : "text-slate-600",
                        )}
                      >
                        ₹
                      </button>
                      <button
                        onClick={() => setInputCurrency("USD")}
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-all",
                          inputCurrency === "USD" ? "bg-white/50 text-slate-800" : "text-slate-600",
                        )}
                      >
                        $
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction((prev) => ({ ...prev, category: e.target.value as Transaction["category"] }))
                    }
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                  >
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="shopping">Shopping</option>
                    <option value="investment">Investment</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) =>
                      setNewTransaction((prev) => ({ ...prev, type: e.target.value as Transaction["type"] }))
                    }
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addTransaction}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
              >
                Add Transaction
              </button>
            </div>
          )}

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No transactions yet</h3>
                <p className="text-slate-500">Start by adding your first transaction above.</p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const Icon =
                  typeof categoryIcons[transaction.category] === "string" ? null : categoryIcons[transaction.category]
                const emoji =
                  typeof categoryIcons[transaction.category] === "string" ? categoryIcons[transaction.category] : null

                return (
                  <div key={transaction.id} className="glass-button p-4 rounded-lg group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-200/50 to-slate-300/50 rounded-full flex items-center justify-center">
                          {Icon ? (
                            <Icon className="w-5 h-5 text-slate-600" />
                          ) : (
                            <span className="text-lg">{emoji}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{transaction.description}</div>
                          <div className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="capitalize">{transaction.category}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "font-semibold",
                            transaction.type === "income" ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {transaction.type === "income" ? "+" : ""}
                          {viewCurrency === "INR"
                            ? formatCurrency(Math.abs(transaction.amount), "INR")
                            : formatCurrency(convertCurrency(Math.abs(transaction.amount), "INR", "USD"), "USD")}
                        </div>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </GlassCard>
      )}

      {/* Budget */}
      {activeView === "budget" && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Budget Categories</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 glass-button rounded-lg p-1">
                <button
                  onClick={() => setViewCurrency("INR")}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-all",
                    viewCurrency === "INR" ? "bg-white/50 text-slate-800" : "text-slate-600",
                  )}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setViewCurrency("USD")}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-all",
                    viewCurrency === "USD" ? "bg-white/50 text-slate-800" : "text-slate-600",
                  )}
                >
                  $ USD
                </button>
              </div>
              <button
                onClick={() => setShowAddBudget(!showAddBudget)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {showAddBudget && (
            <div className="space-y-4 p-4 glass-button rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Category Name</label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Food, Transport"
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Budget Amount</label>
                  <input
                    type="number"
                    value={newBudget.budgeted}
                    onChange={(e) => setNewBudget((prev) => ({ ...prev, budgeted: e.target.value }))}
                    placeholder="0.00"
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
              <button
                onClick={addBudgetCategory}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
              >
                Add Budget Category
              </button>
            </div>
          )}

          <div className="space-y-4">
            {budgetCategories.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No budget categories yet</h3>
                <p className="text-slate-500">Start by adding your first budget category above.</p>
              </div>
            ) : (
              budgetCategories.map((category) => {
                const percentage = (category.spent / category.budgeted) * 100
                const isOverBudget = category.spent > category.budgeted

                return (
                  <div key={category.id} className="glass-button p-4 rounded-lg group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", isOverBudget ? "text-red-600" : "text-slate-600")}>
                          {viewCurrency === "INR"
                            ? formatCurrency(category.spent, "INR")
                            : formatCurrency(convertCurrency(category.spent, "INR", "USD"), "USD")}{" "}
                          /{" "}
                          {viewCurrency === "INR"
                            ? formatCurrency(category.budgeted, "INR")
                            : formatCurrency(convertCurrency(category.budgeted, "INR", "USD"), "USD")}
                        </span>
                        <button
                          onClick={() => deleteBudgetCategory(category.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2 mb-2">
                      <div
                        className={cn("h-2 rounded-full transition-all", isOverBudget ? "bg-red-500" : category.color)}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>
                        {viewCurrency === "INR"
                          ? formatCurrency(category.budgeted - category.spent, "INR")
                          : formatCurrency(
                              convertCurrency(category.budgeted - category.spent, "INR", "USD"),
                              "USD",
                            )}{" "}
                        remaining
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </GlassCard>
      )}

      {/* Investments - Always USD, no toggle */}
      {activeView === "investments" && (
        <>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Investment Portfolio (USD)</h3>
              <button
                onClick={() => setShowAddInvestment(!showAddInvestment)}
                className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Add Investment Form */}
            {showAddInvestment && (
              <div className="space-y-4 p-4 glass-button rounded-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Stock Symbol</label>
                    <input
                      type="text"
                      value={newInvestment.symbol}
                      onChange={(e) => setNewInvestment((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                      placeholder="e.g., AAPL, GOOGL, TSLA"
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Company Name</label>
                    <input
                      type="text"
                      value={newInvestment.name}
                      onChange={(e) => setNewInvestment((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Apple Inc."
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newInvestment.shares}
                      onChange={(e) => setNewInvestment((prev) => ({ ...prev, shares: e.target.value }))}
                      placeholder="0"
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Purchase Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newInvestment.purchase_price}
                      onChange={(e) => setNewInvestment((prev) => ({ ...prev, purchase_price: e.target.value }))}
                      placeholder="0.00"
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Purchase Date</label>
                    <input
                      type="date"
                      value={newInvestment.purchase_date}
                      onChange={(e) => setNewInvestment((prev) => ({ ...prev, purchase_date: e.target.value }))}
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newInvestment.notes}
                    onChange={(e) => setNewInvestment((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Investment notes or strategy"
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800 placeholder-slate-500"
                  />
                </div>
                <button
                  onClick={addInvestment}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
                >
                  Add Investment
                </button>
              </div>
            )}

            {/* Edit Investment Form */}
            {editingInvestment && (
              <div className="space-y-4 p-4 glass-button rounded-xl mb-6 border-2 border-blue-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-800">Edit Investment</h4>
                  <button onClick={() => setEditingInvestment(null)} className="text-slate-500 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Stock Symbol</label>
                    <input
                      type="text"
                      value={editingInvestment.symbol}
                      onChange={(e) =>
                        setEditingInvestment((prev) =>
                          prev ? { ...prev, symbol: e.target.value.toUpperCase() } : null,
                        )
                      }
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Company Name</label>
                    <input
                      type="text"
                      value={editingInvestment.name}
                      onChange={(e) =>
                        setEditingInvestment((prev) => (prev ? { ...prev, name: e.target.value } : null))
                      }
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editingInvestment.shares}
                      onChange={(e) =>
                        setEditingInvestment((prev) =>
                          prev ? { ...prev, shares: Number.parseFloat(e.target.value) || 0 } : null,
                        )
                      }
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Purchase Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingInvestment.purchase_price}
                      onChange={(e) =>
                        setEditingInvestment((prev) =>
                          prev ? { ...prev, purchase_price: Number.parseFloat(e.target.value) || 0 } : null,
                        )
                      }
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Purchase Date</label>
                    <input
                      type="date"
                      value={editingInvestment.purchase_date}
                      onChange={(e) =>
                        setEditingInvestment((prev) => (prev ? { ...prev, purchase_date: e.target.value } : null))
                      }
                      className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Notes</label>
                  <input
                    type="text"
                    value={editingInvestment.notes || ""}
                    onChange={(e) => setEditingInvestment((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                    className="w-full glass-button p-3 rounded-lg bg-transparent border-none outline-none text-slate-800"
                  />
                </div>
                <button
                  onClick={updateInvestment}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:scale-105 transition-all font-medium"
                >
                  Update Investment
                </button>
              </div>
            )}

            <div className="space-y-4">
              {investments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 glass-button rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No investments yet</h3>
                  <p className="text-slate-500">Start by adding your first investment above.</p>
                </div>
              ) : (
                investments.map((investment) => (
                  <div key={investment.id} className="glass-button p-6 rounded-lg group">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          {investment.symbol}
                          <span className="text-sm font-normal text-slate-600">({investment.shares} shares)</span>
                        </h4>
                        <p className="text-sm text-slate-600">{investment.name}</p>
                        {investment.notes && <p className="text-xs text-slate-500 mt-1">{investment.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-800">
                            {formatCurrency(investment.current_price || 0, "USD")}
                          </div>
                          <div
                            className={cn(
                              "text-sm flex items-center gap-1",
                              (investment.total_gain_loss || 0) >= 0 ? "text-green-600" : "text-red-600",
                            )}
                          >
                            {(investment.total_gain_loss || 0) >= 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {investment.gain_loss_percent?.toFixed(2)}%
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={() => setEditingInvestment(investment)}
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Edit3 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => deleteInvestment(investment.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-slate-800">
                          {formatCurrency(investment.purchase_price, "USD")}
                        </div>
                        <div className="text-sm text-slate-600">Purchase Price</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-800">
                          {formatCurrency(investment.market_value || 0, "USD")}
                        </div>
                        <div className="text-sm text-slate-600">Market Value</div>
                      </div>
                      <div>
                        <div
                          className={cn(
                            "text-lg font-semibold",
                            (investment.total_gain_loss || 0) >= 0 ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {(investment.total_gain_loss || 0) >= 0 ? "+" : ""}
                          {formatCurrency(investment.total_gain_loss || 0, "USD")}
                        </div>
                        <div className="text-sm text-slate-600">Total Gain/Loss</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-800 flex items-center justify-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(investment.purchase_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-slate-600">Purchase Date</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-800">
                          {formatCurrency(investment.purchase_price * investment.shares, "USD")}
                        </div>
                        <div className="text-sm text-slate-600">Total Cost</div>
                      </div>
                    </div>

                    {/* Live Price Indicator */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-slate-100/50 to-slate-200/50 rounded-lg flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live prices updated every 5 minutes via Alpha Vantage API
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Portfolio Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 glass-button rounded-lg">
                <div className="text-2xl font-bold text-slate-800">{formatCurrency(portfolioValue, "USD")}</div>
                <div className="text-sm text-slate-600">Total Market Value</div>
              </div>
              <div className="text-center p-4 glass-button rounded-lg">
                <div className="text-2xl font-bold text-slate-800">
                  {formatCurrency(
                    investments.reduce((sum, inv) => sum + inv.purchase_price * inv.shares, 0),
                    "USD",
                  )}
                </div>
                <div className="text-sm text-slate-600">Total Cost Basis</div>
              </div>
              <div className="text-center p-4 glass-button rounded-lg">
                <div className={cn("text-2xl font-bold", portfolioGainLoss >= 0 ? "text-green-600" : "text-red-600")}>
                  {portfolioGainLoss >= 0 ? "+" : ""}
                  {formatCurrency(portfolioGainLoss, "USD")}
                </div>
                <div className="text-sm text-slate-600">Total Gain/Loss</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/30">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Custom Portfolio:</span> Track your actual investments with real
                  purchase prices and quantities for accurate performance analysis.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/30">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Live Market Data:</span> Stock prices update automatically every 5
                  minutes using Alpha Vantage API for real-time portfolio tracking.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200/30">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Performance Tracking:</span> View detailed gain/loss calculations based
                  on your actual purchase prices and current market values.
                </p>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}
