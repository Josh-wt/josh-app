-- Add missing columns to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_estimate integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS worth_tracking boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Update existing tasks to have proper default values
UPDATE public.tasks 
SET 
  completed = COALESCE(completed, false),
  order_index = COALESCE(order_index, 0),
  time_estimate = COALESCE(time_estimate, 0),
  worth_tracking = COALESCE(worth_tracking, true),
  tags = COALESCE(tags, '{}')
WHERE completed IS NULL OR order_index IS NULL OR time_estimate IS NULL OR worth_tracking IS NULL OR tags IS NULL;

-- Create index for better performance on completed tasks
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_order_index ON public.tasks(order_index);
