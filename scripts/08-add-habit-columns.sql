-- Add missing columns to habits table for enhanced functionality
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS description text DEFAULT '',
ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS target_days text[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
ADD COLUMN IF NOT EXISTS reminder_time time,
ADD COLUMN IF NOT EXISTS color text DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS icon text DEFAULT 'target',
ADD COLUMN IF NOT EXISTS is_quantity_based boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS target_quantity integer,
ADD COLUMN IF NOT EXISTS unit text,
ADD COLUMN IF NOT EXISTS total_completions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notes text DEFAULT '';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_category ON habits(user_id, category);
CREATE INDEX IF NOT EXISTS idx_habits_archived ON habits(user_id, is_archived);
CREATE INDEX IF NOT EXISTS idx_habits_difficulty ON habits(difficulty);

-- Update existing habits to have default values
UPDATE habits 
SET 
  description = COALESCE(description, ''),
  difficulty = COALESCE(difficulty, 'medium'),
  target_days = COALESCE(target_days, ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  color = COALESCE(color, '#10b981'),
  icon = COALESCE(icon, 'target'),
  is_quantity_based = COALESCE(is_quantity_based, false),
  total_completions = COALESCE(total_completions, 0),
  is_archived = COALESCE(is_archived, false),
  notes = COALESCE(notes, '')
WHERE description IS NULL OR difficulty IS NULL OR target_days IS NULL OR color IS NULL OR icon IS NULL OR is_quantity_based IS NULL OR total_completions IS NULL OR is_archived IS NULL OR notes IS NULL;
