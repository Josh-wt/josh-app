interface FoodItem {
  name: string
  quantity: number
  unit: string
  calories_per_unit: number
  protein_per_unit: number
  carbs_per_unit: number
  fat_per_unit: number
  fiber_per_unit: number
  sugar_per_unit: number
  sodium_per_unit: number
  confidence?: number
}

interface ParsedMeal {
  foods: FoodItem[]
  meal_type: "breakfast" | "lunch" | "dinner" | "snack"
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  total_fiber: number
  total_sugar: number
  total_sodium: number
}

export class AIFoodService {
  constructor() {
    // API key is now handled server-side
  }

  async parseFoodDescription(description: string): Promise<ParsedMeal> {
    try {
      const formData = new FormData()
      formData.append('description', description)

      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error: ${response.status}`)
      }

      const data = await response.json()
      
      // Validate the response structure
      if (!data.foods || !Array.isArray(data.foods)) {
        throw new Error("Invalid response structure from AI service")
      }

      return data as ParsedMeal
    } catch (error) {
      console.error("Error parsing food description:", error)
      throw new Error(`Failed to parse food description: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async analyzeFoodImage(imageFile: File): Promise<ParsedMeal> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error: ${response.status}`)
      }

      const data = await response.json()
      
      // Validate the response structure
      if (!data.foods || !Array.isArray(data.foods)) {
        throw new Error("Invalid response structure from AI service")
      }

      return data as ParsedMeal
    } catch (error) {
      console.error("Error analyzing food image:", error)
      throw new Error(`Failed to analyze food image: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }


  async getWeeklyNutritionSummary(startDate: string, endDate: string, userId: string): Promise<any> {
    // This would typically fetch from your database
    // For now, returning a mock structure
    return {
      week_start: startDate,
      week_end: endDate,
      daily_totals: [],
      weekly_average: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      },
      trends: {
        calorie_trend: "stable",
        protein_trend: "stable",
        meal_consistency: "good"
      }
    }
  }
}

export const aiFoodService = new AIFoodService()
