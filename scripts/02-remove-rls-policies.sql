-- Remove Row Level Security for single-user app
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE moods DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON habits;
DROP POLICY IF EXISTS "Users can update own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON habits;
DROP POLICY IF EXISTS "Users can view own habit entries" ON habit_entries;
DROP POLICY IF EXISTS "Users can insert own habit entries" ON habit_entries;
DROP POLICY IF EXISTS "Users can update own habit entries" ON habit_entries;
DROP POLICY IF EXISTS "Users can delete own habit entries" ON habit_entries;
DROP POLICY IF EXISTS "Users can view own moods" ON moods;
DROP POLICY IF EXISTS "Users can insert own moods" ON moods;
DROP POLICY IF EXISTS "Users can update own moods" ON moods;
DROP POLICY IF EXISTS "Users can delete own moods" ON moods;
DROP POLICY IF EXISTS "Users can view own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can insert own budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can update own budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can delete own budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can view own learning progress" ON learning_progress;
DROP POLICY IF EXISTS "Users can insert own learning progress" ON learning_progress;
DROP POLICY IF EXISTS "Users can update own learning progress" ON learning_progress;
DROP POLICY IF EXISTS "Users can delete own learning progress" ON learning_progress;

-- Remove user_id columns since we don't need user separation
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;
ALTER TABLE habits DROP COLUMN IF EXISTS user_id;
ALTER TABLE habit_entries DROP COLUMN IF EXISTS user_id;
ALTER TABLE moods DROP COLUMN IF EXISTS user_id;
ALTER TABLE notes DROP COLUMN IF EXISTS user_id;
ALTER TABLE transactions DROP COLUMN IF EXISTS user_id;
ALTER TABLE budget_categories DROP COLUMN IF EXISTS user_id;
ALTER TABLE learning_progress DROP COLUMN IF EXISTS user_id;

-- Drop profiles table since we don't need user management
DROP TABLE IF EXISTS profiles;
