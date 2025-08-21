-- Add missing columns to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_estimate INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS worth_tracking BOOLEAN DEFAULT true;

-- Update existing tasks to have proper order_index values
UPDATE tasks 
SET order_index = row_number() OVER (PARTITION BY user_id ORDER BY created_at)
WHERE order_index = 0;

-- Create index for better performance on ordering
CREATE INDEX IF NOT EXISTS idx_tasks_user_order ON tasks(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed ON tasks(user_id, completed);
