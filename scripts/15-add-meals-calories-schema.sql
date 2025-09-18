-- Add Meals and Calories Tracking Schema
-- This script creates tables for tracking meals, calories, and nutrition

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TIME WITHOUT TIME ZONE,
    total_calories INTEGER DEFAULT 0,
    total_protein DECIMAL(10,2) DEFAULT 0,
    total_carbs DECIMAL(10,2) DEFAULT 0,
    total_fat DECIMAL(10,2) DEFAULT 0,
    total_fiber DECIMAL(10,2) DEFAULT 0,
    total_sugar DECIMAL(10,2) DEFAULT 0,
    total_sodium DECIMAL(10,2) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food items table (for individual food items in meals)
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'serving',
    calories_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    protein_per_unit DECIMAL(10,2) DEFAULT 0,
    carbs_per_unit DECIMAL(10,2) DEFAULT 0,
    fat_per_unit DECIMAL(10,2) DEFAULT 0,
    fiber_per_unit DECIMAL(10,2) DEFAULT 0,
    sugar_per_unit DECIMAL(10,2) DEFAULT 0,
    sodium_per_unit DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User nutrition goals table
CREATE TABLE IF NOT EXISTS public.nutrition_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    daily_calories INTEGER NOT NULL DEFAULT 2000,
    daily_protein DECIMAL(10,2) DEFAULT 0,
    daily_carbs DECIMAL(10,2) DEFAULT 0,
    daily_fat DECIMAL(10,2) DEFAULT 0,
    daily_fiber DECIMAL(10,2) DEFAULT 0,
    daily_sugar DECIMAL(10,2) DEFAULT 0,
    daily_sodium DECIMAL(10,2) DEFAULT 0,
    activity_level TEXT DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    weight_goal TEXT DEFAULT 'maintain' CHECK (weight_goal IN ('lose', 'maintain', 'gain')),
    target_weight DECIMAL(5,2),
    current_weight DECIMAL(5,2),
    height DECIMAL(5,2),
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food database table (common foods with nutrition info)
CREATE TABLE IF NOT EXISTS public.food_database (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT DEFAULT 'general',
    serving_size DECIMAL(10,2) NOT NULL DEFAULT 1,
    serving_unit TEXT NOT NULL DEFAULT 'serving',
    calories_per_serving DECIMAL(10,2) NOT NULL DEFAULT 0,
    protein_per_serving DECIMAL(10,2) DEFAULT 0,
    carbs_per_serving DECIMAL(10,2) DEFAULT 0,
    fat_per_serving DECIMAL(10,2) DEFAULT 0,
    fiber_per_serving DECIMAL(10,2) DEFAULT 0,
    sugar_per_serving DECIMAL(10,2) DEFAULT 0,
    sodium_per_serving DECIMAL(10,2) DEFAULT 0,
    is_user_added BOOLEAN DEFAULT FALSE,
    added_by_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Water intake tracking
CREATE TABLE IF NOT EXISTS public.water_intake (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_ml INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(date);
CREATE INDEX IF NOT EXISTS idx_meals_meal_type ON public.meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_food_items_meal_id ON public.food_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_goals_user_id ON public.nutrition_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_food_database_name ON public.food_database(name);
CREATE INDEX IF NOT EXISTS idx_food_database_category ON public.food_database(category);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON public.water_intake(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meals
CREATE POLICY "Users can view their own meals" ON public.meals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON public.meals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON public.meals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON public.meals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for food_items
CREATE POLICY "Users can view food items for their meals" ON public.food_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = food_items.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert food items for their meals" ON public.food_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = food_items.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update food items for their meals" ON public.food_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = food_items.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete food items for their meals" ON public.food_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = food_items.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

-- Create RLS policies for nutrition_goals
CREATE POLICY "Users can view their own nutrition goals" ON public.nutrition_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition goals" ON public.nutrition_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals" ON public.nutrition_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition goals" ON public.nutrition_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for food_database
CREATE POLICY "Everyone can view food database" ON public.food_database
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own food items" ON public.food_database
    FOR INSERT WITH CHECK (auth.uid() = added_by_user_id OR is_user_added = false);

CREATE POLICY "Users can update their own food items" ON public.food_database
    FOR UPDATE USING (auth.uid() = added_by_user_id);

CREATE POLICY "Users can delete their own food items" ON public.food_database
    FOR DELETE USING (auth.uid() = added_by_user_id);

-- Create RLS policies for water_intake
CREATE POLICY "Users can view their own water intake" ON public.water_intake
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water intake" ON public.water_intake
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water intake" ON public.water_intake
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water intake" ON public.water_intake
    FOR DELETE USING (auth.uid() = user_id);

-- Insert some common foods into the food database
INSERT INTO public.food_database (name, category, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, fiber_per_serving, sugar_per_serving, sodium_per_serving) VALUES
-- Breakfast items
('Oatmeal (dry)', 'breakfast', 40, 'g', 150, 5, 27, 3, 4, 1, 0),
('Whole Milk', 'dairy', 240, 'ml', 150, 8, 12, 8, 0, 12, 120),
('Banana (medium)', 'fruit', 120, 'g', 105, 1, 27, 0, 3, 14, 1),
('Egg (large)', 'protein', 50, 'g', 70, 6, 0, 5, 0, 0, 70),
('Bread (white, 1 slice)', 'grains', 28, 'g', 75, 2, 14, 1, 1, 1, 130),
('Butter', 'fats', 14, 'g', 100, 0, 0, 11, 0, 0, 0),

-- Lunch/Dinner items
('Chicken Breast (cooked)', 'protein', 100, 'g', 165, 31, 0, 4, 0, 0, 74),
('Brown Rice (cooked)', 'grains', 150, 'g', 170, 4, 35, 1, 2, 0, 5),
('Broccoli (steamed)', 'vegetables', 100, 'g', 35, 3, 7, 0, 3, 2, 33),
('Olive Oil', 'fats', 15, 'ml', 120, 0, 0, 14, 0, 0, 0),
('Salmon (cooked)', 'protein', 100, 'g', 206, 22, 0, 12, 0, 0, 44),

-- Snacks
('Apple (medium)', 'fruit', 182, 'g', 95, 0, 25, 0, 4, 19, 2),
('Almonds (raw)', 'nuts', 28, 'g', 164, 6, 6, 14, 4, 1, 1),
('Greek Yogurt (plain)', 'dairy', 170, 'g', 100, 17, 6, 0, 0, 6, 60),

-- Beverages
('Water', 'beverages', 240, 'ml', 0, 0, 0, 0, 0, 0, 0),
('Coffee (black)', 'beverages', 240, 'ml', 2, 0, 0, 0, 0, 0, 5),
('Green Tea', 'beverages', 240, 'ml', 2, 0, 0, 0, 0, 0, 0);

-- Create a function to update meal totals when food items change
CREATE OR REPLACE FUNCTION update_meal_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.meals 
    SET 
        total_calories = (
            SELECT COALESCE(SUM(fi.quantity * fi.calories_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_protein = (
            SELECT COALESCE(SUM(fi.quantity * fi.protein_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_carbs = (
            SELECT COALESCE(SUM(fi.quantity * fi.carbs_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_fat = (
            SELECT COALESCE(SUM(fi.quantity * fi.fat_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_fiber = (
            SELECT COALESCE(SUM(fi.quantity * fi.fiber_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_sugar = (
            SELECT COALESCE(SUM(fi.quantity * fi.sugar_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        total_sodium = (
            SELECT COALESCE(SUM(fi.quantity * fi.sodium_per_unit), 0)
            FROM public.food_items fi 
            WHERE fi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.meal_id, OLD.meal_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update meal totals
CREATE TRIGGER trigger_update_meal_totals_insert
    AFTER INSERT ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION update_meal_totals();

CREATE TRIGGER trigger_update_meal_totals_update
    AFTER UPDATE ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION update_meal_totals();

CREATE TRIGGER trigger_update_meal_totals_delete
    AFTER DELETE ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION update_meal_totals();

COMMIT;
