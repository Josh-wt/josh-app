"use client"
import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  X, 
  Droplets, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Apple,
  Cookie,
  Brain,
  CheckCircle2,
  AlertCircle,
  Flame,
  Zap,
  Heart,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Meal {
  id: string
  name: string
  description?: string
  meal_type: "breakfast" | "lunch" | "dinner" | "snack"
  date: string
  time?: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  total_fiber: number
  total_sugar: number
  total_sodium: number
  image_url?: string
  created_at: string
  updated_at: string
  user_id: string
  food_items?: FoodItem[]
}

interface FoodItem {
  id: string
  meal_id: string
  name: string
  brand?: string
  quantity: number
  unit: string
  calories_per_unit: number
  protein_per_unit: number
  carbs_per_unit: number
  fat_per_unit: number
  fiber_per_unit: number
  sugar_per_unit: number
  sodium_per_unit: number
  created_at: string
}

interface NutritionGoals {
  id: string
  user_id: string
  daily_calories: number
  daily_protein: number
  daily_carbs: number
  daily_fat: number
  daily_fiber: number
  daily_sugar: number
  daily_sodium: number
  activity_level: string
  weight_goal: string
  target_weight?: number
  current_weight?: number
  height?: number
  age?: number
  gender?: string
}

interface FoodDatabaseItem {
  id: string
  name: string
  brand?: string
  category: string
  serving_size: number
  serving_unit: string
  calories_per_serving: number
  protein_per_serving: number
  carbs_per_serving: number
  fat_per_serving: number
  fiber_per_serving: number
  sugar_per_serving: number
  sodium_per_serving: number
  is_user_added: boolean
  added_by_user_id?: string
}

const mealTypeIcons = {
  breakfast: Sun,
  lunch: Coffee,
  dinner: Moon,
  snack: Cookie,
}

const mealTypeColors = {
  breakfast: "from-yellow-400 to-orange-500",
  lunch: "from-blue-400 to-cyan-500",
  dinner: "from-purple-400 to-indigo-500",
  snack: "from-green-400 to-emerald-500",
}

const mealTypeLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch", 
  dinner: "Dinner",
  snack: "Snack",
}

export function MealsTracker() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeView, setActiveView] = useState<"today" | "week" | "all">("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [showFoodSearch, setShowFoodSearch] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<Meal["meal_type"] | null>(null)
  const [foodDatabase, setFoodDatabase] = useState<FoodDatabaseItem[]>([])
  const [foodSearchQuery, setFoodSearchQuery] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    meal_type: "breakfast" as Meal["meal_type"],
    time: new Date().toTimeString().slice(0, 5),
  })
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals | null>(null)
  const [waterIntake, setWaterIntake] = useState(0)
  const [todayStats, setTodayStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
    totalSodium: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await Promise.all([
          fetchMeals(user),
          fetchNutritionGoals(user),
          fetchWaterIntake(user),
          calculateTodayStats(user),
          fetchFoodDatabase()
        ])
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchMeals = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("meals")
        .select(`
          *,
          food_items (*)
        `)
        .eq("user_id", currentUser.id)
        .eq("date", selectedDate)
        .order("time", { ascending: true })

      if (error) throw error
      setMeals(data || [])
    } catch (error) {
      console.error("Error fetching meals:", error)
    }
  }

  const fetchNutritionGoals = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", currentUser.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setNutritionGoals(data)
    } catch (error) {
      console.error("Error fetching nutrition goals:", error)
    }
  }

  const fetchWaterIntake = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("water_intake")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("date", selectedDate)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setWaterIntake(data?.amount_ml || 0)
    } catch (error) {
      console.error("Error fetching water intake:", error)
    }
  }

  const calculateTodayStats = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("meals")
        .select("total_calories, total_protein, total_carbs, total_fat, total_fiber, total_sugar, total_sodium")
        .eq("user_id", currentUser.id)
        .eq("date", selectedDate)

      if (error) throw error

      const stats = data?.reduce((acc, meal) => ({
        totalCalories: acc.totalCalories + meal.total_calories,
        totalProtein: acc.totalProtein + meal.total_protein,
        totalCarbs: acc.totalCarbs + meal.total_carbs,
        totalFat: acc.totalFat + meal.total_fat,
        totalFiber: acc.totalFiber + meal.total_fiber,
        totalSugar: acc.totalSugar + meal.total_sugar,
        totalSodium: acc.totalSodium + meal.total_sodium,
      }), {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        totalSodium: 0,
      }) || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        totalSodium: 0,
      }

      setTodayStats(stats)
    } catch (error) {
      console.error("Error calculating today stats:", error)
    }
  }

  const fetchFoodDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("food_database")
        .select("*")
        .order("name")

      if (error) throw error
      setFoodDatabase(data || [])
    } catch (error) {
      console.error("Error fetching food database:", error)
    }
  }

  const addMeal = async () => {
    if (!formData.name.trim() || !user) return

    try {
      const { data: mealData, error: mealError } = await supabase
        .from("meals")
        .insert([{
          name: formData.name.trim(),
          description: formData.description || null,
          meal_type: selectedMealType || formData.meal_type,
          date: selectedDate,
          time: formData.time || null,
          user_id: user.id,
        }])
        .select()
        .single()

      if (mealError) throw mealError

      // Add food items to the meal
      if (selectedFoods.length > 0) {
        const foodItemsToInsert = selectedFoods.map(food => ({
          meal_id: mealData.id,
          name: food.name,
          brand: food.brand || null,
          quantity: food.quantity,
          unit: food.unit,
          calories_per_unit: food.calories_per_unit,
          protein_per_unit: food.protein_per_unit,
          carbs_per_unit: food.carbs_per_unit,
          fat_per_unit: food.fat_per_unit,
          fiber_per_unit: food.fiber_per_unit,
          sugar_per_unit: food.sugar_per_unit,
          sodium_per_unit: food.sodium_per_unit,
        }))

        const { error: foodError } = await supabase
          .from("food_items")
          .insert(foodItemsToInsert)

        if (foodError) throw foodError
      }

      setMeals(prev => [mealData, ...prev])
      await calculateTodayStats()
      resetForm()
      setShowAddForm(false)
      setSelectedMealType(null)
    } catch (error) {
      console.error("Error adding meal:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      meal_type: "breakfast",
      time: new Date().toTimeString().slice(0, 5),
    })
    setSelectedFoods([])
    setFoodSearchQuery("")
  }

  const addWaterIntake = async (amount: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("water_intake")
        .upsert({
          user_id: user.id,
          date: selectedDate,
          amount_ml: waterIntake + amount,
        })
        .select()
        .single()

      if (error) throw error
      setWaterIntake(data.amount_ml)
    } catch (error) {
      console.error("Error updating water intake:", error)
    }
  }

  const deleteMeal = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error
      setMeals(prev => prev.filter(meal => meal.id !== id))
      await calculateTodayStats()
    } catch (error) {
      console.error("Error deleting meal:", error)
    }
  }

  const getFilteredMeals = () => {
    return meals.filter(meal => {
      const matchesSearch = 
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })
  }

  const getMealsByType = () => {
    const filtered = getFilteredMeals()
    const grouped: Record<string, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    }

    filtered.forEach(meal => {
      grouped[meal.meal_type].push(meal)
    })

    return grouped
  }

  const getProgressPercentage = (current: number, goal: number) => {
    if (!goal) return 0
    return Math.min((current / goal) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-600"
    if (percentage >= 75) return "text-yellow-600"
    if (percentage >= 50) return "text-orange-600"
    return "text-red-600"
  }

  const getFilteredFoods = () => {
    return foodDatabase.filter(food =>
      food.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(foodSearchQuery.toLowerCase())
    )
  }

  const addFoodToMeal = (food: FoodDatabaseItem) => {
    const newFoodItem: FoodItem = {
      id: `temp-${Date.now()}`,
      meal_id: "",
      name: food.name,
      brand: food.brand,
      quantity: food.serving_size,
      unit: food.serving_unit,
      calories_per_unit: food.calories_per_serving,
      protein_per_unit: food.protein_per_serving,
      carbs_per_unit: food.carbs_per_serving,
      fat_per_unit: food.fat_per_serving,
      fiber_per_unit: food.fiber_per_serving,
      sugar_per_unit: food.sugar_per_serving,
      sodium_per_unit: food.sodium_per_serving,
      created_at: new Date().toISOString(),
    }
    setSelectedFoods(prev => [...prev, newFoodItem])
  }

  const removeFoodFromMeal = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId))
  }

  const updateFoodQuantity = (foodId: string, quantity: number) => {
    setSelectedFoods(prev => prev.map(food => 
      food.id === foodId ? { ...food, quantity } : food
    ))
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 text-center">
          <div className="text-lg font-medium text-slate-600 mb-2">Please sign in</div>
          <p className="text-slate-500">You need to be authenticated to track your meals.</p>
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
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  const mealsByType = getMealsByType()
  const calorieProgress = getProgressPercentage(todayStats.totalCalories, nutritionGoals?.daily_calories || 2000)

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Meals & Nutrition</h1>
            <p className="text-slate-600">
              Track your daily nutrition and maintain healthy eating habits
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800">{todayStats.totalCalories}</div>
            <div className="text-sm text-slate-600">calories today</div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-button px-3 py-2 rounded-lg"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-600">Water: {waterIntake}ml</span>
            <button
              onClick={() => addWaterIntake(250)}
              className="glass-button px-2 py-1 rounded text-sm hover:scale-105 transition-all"
            >
              +250ml
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Daily Calories</span>
            <span className={cn("text-sm font-medium", getProgressColor(calorieProgress))}>
              {todayStats.totalCalories} / {nutritionGoals?.daily_calories || 2000}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-500",
                calorieProgress >= 100 ? "bg-gradient-to-r from-green-400 to-green-600" :
                calorieProgress >= 75 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                "bg-gradient-to-r from-blue-400 to-cyan-500"
              )}
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{Math.round(todayStats.totalProtein)}g</div>
            <div className="text-xs text-slate-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{Math.round(todayStats.totalCarbs)}g</div>
            <div className="text-xs text-slate-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{Math.round(todayStats.totalFat)}g</div>
            <div className="text-xs text-slate-600">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{Math.round(todayStats.totalFiber)}g</div>
            <div className="text-xs text-slate-600">Fiber</div>
          </div>
        </div>
      </GlassCard>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
            />
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            <Plus className="w-4 h-4" />
            Add Meal
          </button>
        </div>
      </GlassCard>

      {/* Meals by Type */}
      <div className="space-y-6">
        {Object.entries(mealsByType).map(([mealType, meals]) => {
          const Icon = mealTypeIcons[mealType as keyof typeof mealTypeIcons]
          const colorClass = mealTypeColors[mealType as keyof typeof mealTypeColors]
          
          return (
            <div key={mealType}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2 rounded-lg bg-gradient-to-r", colorClass)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 capitalize">
                  {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
                </h2>
                <span className="text-sm text-slate-600">({meals.length})</span>
              </div>

              {meals.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No {mealType} logged</h3>
                  <p className="text-slate-500 mb-4">
                    Start tracking your {mealType} to maintain healthy eating habits
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMealType(mealType as Meal["meal_type"])
                      setShowAddForm(true)
                    }}
                    className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
                  </button>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <GlassCard key={meal.id} className="p-4 hover:scale-[1.01] transition-transform group">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-slate-800 mb-1">{meal.name}</h3>
                              {meal.description && (
                                <p className="text-sm text-slate-600 mb-2">{meal.description}</p>
                              )}
                              {meal.time && (
                                <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                                  <Clock className="w-3 h-3" />
                                  {meal.time}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => deleteMeal(meal.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span className="font-medium">{meal.total_calories} cal</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-blue-500" />
                              <span>{Math.round(meal.total_protein)}g protein</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-green-500" />
                              <span>{Math.round(meal.total_carbs)}g carbs</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span>{Math.round(meal.total_fat)}g fat</span>
                            </div>
                          </div>

                          {meal.food_items && meal.food_items.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="text-xs text-slate-500 mb-2">Food items:</div>
                              <div className="flex flex-wrap gap-1">
                                {meal.food_items.map((item) => (
                                  <span
                                    key={item.id}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                                  >
                                    {item.quantity}{item.unit} {item.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Smart Suggestions */}
      <GlassCard className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/30">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Smart Suggestions</h3>
            <div className="space-y-1">
              {calorieProgress < 50 && (
                <p className="text-sm text-amber-700">
                  You're only at {Math.round(calorieProgress)}% of your daily calorie goal. Consider adding a healthy snack!
                </p>
              )}
              {calorieProgress > 100 && (
                <p className="text-sm text-amber-700">
                  You've exceeded your daily calorie goal. Consider lighter meals for the rest of the day.
                </p>
              )}
              {waterIntake < 2000 && (
                <p className="text-sm text-amber-700">
                  You've only had {waterIntake}ml of water today. Aim for at least 2000ml daily.
                </p>
              )}
              {todayStats.totalFiber < 25 && (
                <p className="text-sm text-amber-700">
                  Consider adding more fiber-rich foods like fruits, vegetables, and whole grains.
                </p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Add Meal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Add New Meal</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setSelectedMealType(null)
                    resetForm()
                  }}
                  className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Meal Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Meal Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning Oatmeal"
                      className="w-full glass-button p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description..."
                      rows={2}
                      className="w-full glass-button p-3 rounded-lg resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Meal Type</label>
                      <select
                        value={selectedMealType || formData.meal_type}
                        onChange={(e) => {
                          const mealType = e.target.value as Meal["meal_type"]
                          setSelectedMealType(mealType)
                          setFormData(prev => ({ ...prev, meal_type: mealType }))
                        }}
                        className="w-full glass-button p-3 rounded-lg"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full glass-button p-3 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Foods */}
                {selectedFoods.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-slate-800 mb-3">Selected Foods</h4>
                    <div className="space-y-3">
                      {selectedFoods.map((food) => (
                        <div key={food.id} className="glass-button p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-slate-800">{food.name}</h5>
                              {food.brand && <p className="text-sm text-slate-600">{food.brand}</p>}
                            </div>
                            <button
                              onClick={() => removeFoodFromMeal(food.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-slate-600">Quantity:</label>
                              <input
                                type="number"
                                value={food.quantity}
                                onChange={(e) => updateFoodQuantity(food.id, parseFloat(e.target.value) || 0)}
                                className="w-20 glass-button p-2 rounded text-sm"
                                step="0.1"
                                min="0"
                              />
                              <span className="text-sm text-slate-600">{food.unit}</span>
                            </div>
                            
                            <div className="text-sm text-slate-600">
                              {Math.round(food.quantity * food.calories_per_unit)} cal
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Foods Button */}
                <div>
                  <button
                    onClick={() => setShowFoodSearch(true)}
                    className="w-full glass-button p-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Food Items
                  </button>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={addMeal}
                    disabled={!formData.name.trim()}
                    className="glass-button px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Meal
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setSelectedMealType(null)
                      resetForm()
                    }}
                    className="glass-button px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Search Foods</h3>
                <button
                  onClick={() => setShowFoodSearch(false)}
                  className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    placeholder="Search foods by name or category..."
                    className="bg-transparent border-none outline-none text-sm flex-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {getFilteredFoods().map((food) => (
                    <div key={food.id} className="glass-button p-4 rounded-lg hover:scale-[1.02] transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-800">{food.name}</h5>
                          {food.brand && <p className="text-sm text-slate-600">{food.brand}</p>}
                          <p className="text-xs text-slate-500 capitalize">{food.category}</p>
                        </div>
                        <button
                          onClick={() => addFoodToMeal(food)}
                          className="glass-button p-2 rounded-lg hover:scale-105 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>Calories: {food.calories_per_serving}</div>
                        <div>Protein: {food.protein_per_serving}g</div>
                        <div>Carbs: {food.carbs_per_serving}g</div>
                        <div>Fat: {food.fat_per_serving}g</div>
                      </div>
                      
                      <div className="text-xs text-slate-500 mt-2">
                        Per {food.serving_size} {food.serving_unit}
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredFoods().length === 0 && (
                  <div className="text-center py-8">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No foods found</h3>
                    <p className="text-slate-500">
                      Try searching for different food items or add your own custom food.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowFoodSearch(false)}
                    className="glass-button px-6 py-3 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Floating Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 glass-button p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
