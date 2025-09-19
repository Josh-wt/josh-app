import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const description = formData.get('description') as string

    if (!imageFile && !description) {
      return NextResponse.json(
        { error: 'Either image file or description is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured - missing API key' },
        { status: 500 }
      )
    }

    const baseUrl = "https://openrouter.ai/api/v1"
    let base64Image = ""

    if (imageFile) {
      // Convert image to base64
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      base64Image = buffer.toString('base64')
    }

    const prompt = imageFile 
      ? `You are a nutrition expert with computer vision capabilities. Analyze this food image and identify all food items visible.

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
      : `You are a nutrition expert. Parse this food description and identify all food items mentioned.

For each food item you can identify, provide:
- name: The food name
- quantity: Estimated quantity based on the description (be realistic)
- unit: Appropriate unit (g, ml, cup, piece, slice, etc.)
- calories_per_unit: Calories per unit
- protein_per_unit: Protein in grams per unit
- carbs_per_unit: Carbohydrates in grams per unit
- fat_per_unit: Fat in grams per unit
- fiber_per_unit: Fiber in grams per unit
- sugar_per_unit: Sugar in grams per unit
- sodium_per_unit: Sodium in mg per unit

Also determine the most likely meal type (breakfast, lunch, dinner, or snack) based on the foods mentioned.

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

Be accurate with nutrition data based on USDA nutrition database. If uncertain about quantities, make reasonable estimates based on the description.`

    const messages = [
      {
        role: "user",
        content: imageFile 
          ? [
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
          : [
              {
                type: "text",
                text: `${prompt}\n\nFood description: ${description}`
              }
            ]
      }
    ]

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Josh App Meals Tracker"
      },
      body: JSON.stringify({
        model: imageFile ? "qwen/qwen-vl-72b-instruct" : "qwen/qwen-2.5-72b-instruct",
        messages,
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      return NextResponse.json(
        { error: `AI API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI service" },
        { status: 500 }
      )
    }

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Invalid response format from AI service" },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate the response structure
    if (!parsed.foods || !Array.isArray(parsed.foods)) {
      return NextResponse.json(
        { error: "Invalid response structure from AI service" },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)

  } catch (error) {
    console.error("Error in AI image analysis API:", error)
    return NextResponse.json(
      { error: `Failed to analyze ${imageFile ? 'image' : 'description'}: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}


