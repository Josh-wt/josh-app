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
  private apiKey: string
  private baseUrl = "https://openrouter.ai/api/v1"

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || ""
    if (!this.apiKey) {
      console.warn("QWEN_API_KEY not found in environment variables")
    }
  }

  async parseFoodDescription(description: string): Promise<ParsedMeal> {
    if (!this.apiKey) {
      throw new Error("AI service not configured")
    }

    const prompt = `You are a nutrition expert. Parse the following food description and return detailed nutrition information for each food item mentioned.

Food description: "${description}"

For each food item, provide:
- name: The food name
- quantity: Estimated quantity (be realistic)
- unit: Appropriate unit (g, ml, cup, piece, slice, etc.)
- calories_per_unit: Calories per unit
- protein_per_unit: Protein in grams per unit
- carbs_per_unit: Carbohydrates in grams per unit
- fat_per_unit: Fat in grams per unit
- fiber_per_unit: Fiber in grams per unit
- sugar_per_unit: Sugar in grams per unit
- sodium_per_unit: Sodium in mg per unit

Also determine the most likely meal type (breakfast, lunch, dinner, or snack) based on the description.

Return the response as a JSON object with this exact structure:
{
  "meal_type": "breakfast|lunch|dinner|snack",
  "foods": [
    {
      "name": "food name",
      "quantity": number,
      "unit": "unit",
      "calories_per_unit": number,
      "protein_per_unit": number,
      "carbs_per_unit": number,
      "fat_per_unit": number,
      "fiber_per_unit": number,
      "sugar_per_unit": number,
      "sodium_per_unit": number
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "total_fiber": number,
  "total_sugar": number,
  "total_sodium": number
}

Be accurate with nutrition data based on USDA nutrition database. If uncertain about quantities, make reasonable estimates.`

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Josh App Meals Tracker"
        },
        body: JSON.stringify({
          model: "qwen/qwen-2.5-72b-instruct",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error("No response from AI service")
      }

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from AI service")
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!parsed.foods || !Array.isArray(parsed.foods)) {
        throw new Error("Invalid response structure from AI service")
      }

      return parsed as ParsedMeal
    } catch (error) {
      console.error("Error parsing food description:", error)
      throw new Error(`Failed to parse food description: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async analyzeFoodImage(imageFile: File): Promise<ParsedMeal> {
    if (!this.apiKey) {
      throw new Error("AI service not configured")
    }

    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile)

    const prompt = `You are a nutrition expert with computer vision capabilities. Analyze this food image and identify all food items visible.

For each food item you can identify, provide:
- name: The food name
- quantity: Estimated quantity based on what's visible (be realistic)
- unit: Appropriate unit (g, ml, cup, piece, slice, etc.)
- calories_per_unit: Calories per unit
- protein_per_unit: Protein in grams per unit
- carbs_per_unit: Carbohydrates in grams per unit
- fat_per_unit: Fat in grams per unit
- fiber_per_unit: Fiber in grams per unit
- sugar_per_unit: Sugar in grams per unit
- sodium_per_unit: Sodium in mg per unit

Also determine the most likely meal type (breakfast, lunch, dinner, or snack) based on the foods visible.

Return the response as a JSON object with this exact structure:
{
  "meal_type": "breakfast|lunch|dinner|snack",
  "foods": [
    {
      "name": "food name",
      "quantity": number,
      "unit": "unit",
      "calories_per_unit": number,
      "protein_per_unit": number,
      "carbs_per_unit": number,
      "fat_per_unit": number,
      "fiber_per_unit": number,
      "sugar_per_unit": number,
      "sodium_per_unit": number
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "total_fiber": number,
  "total_sugar": number,
  "total_sodium": number
}

Be accurate with nutrition data based on USDA nutrition database. If uncertain about quantities, make reasonable estimates based on what's visible in the image.`

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Josh App Meals Tracker"
        },
        body: JSON.stringify({
          model: "qwen/qwen-vl-72b-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageFile.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error("No response from AI service")
      }

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from AI service")
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!parsed.foods || !Array.isArray(parsed.foods)) {
        throw new Error("Invalid response structure from AI service")
      }

      return parsed as ParsedMeal
    } catch (error) {
      console.error("Error analyzing food image:", error)
      throw new Error(`Failed to analyze food image: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1]) // Remove data:image/...;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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
