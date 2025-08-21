-- Add missing columns to habit_completions table
ALTER TABLE habit_completions 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS completion_time TIME DEFAULT CURRENT_TIME;

-- Update existing records to have default values
UPDATE habit_completions 
SET 
  quantity = 1,
  notes = '',
  completion_time = CURRENT_TIME
WHERE quantity IS NULL OR notes IS NULL OR completion_time IS NULL;

-- Add constraints
ALTER TABLE habit_completions 
ALTER COLUMN quantity SET NOT NULL,
ALTER COLUMN notes SET NOT NULL,
ALTER COLUMN completion_time SET NOT NULL;
