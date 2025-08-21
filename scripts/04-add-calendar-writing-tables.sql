-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  attendees TEXT,
  color TEXT DEFAULT '#3b82f6',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create writing_entries table
CREATE TABLE IF NOT EXISTS writing_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  type TEXT CHECK (type IN ('journal', 'story', 'notes', 'poem', 'article')) DEFAULT 'journal',
  mood TEXT,
  word_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create writing_goals table
CREATE TABLE IF NOT EXISTS writing_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  target_words INTEGER NOT NULL,
  current_words INTEGER DEFAULT 0,
  deadline DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own calendar events" ON calendar_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own writing entries" ON writing_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own writing goals" ON writing_goals
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_writing_entries_user_updated ON writing_entries(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_goals_user_deadline ON writing_goals(user_id, deadline);
