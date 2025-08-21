-- Enhanced Learning Management System Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS learning_subtopics CASCADE;
DROP TABLE IF EXISTS learning_resources CASCADE;
DROP TABLE IF EXISTS learning_sessions CASCADE;
DROP TABLE IF EXISTS learning_goals CASCADE;

-- Create learning topics table (main topics)
CREATE TABLE learning_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  difficulty_level TEXT DEFAULT 'Beginner' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  target_completion_date DATE,
  estimated_hours INTEGER DEFAULT 0,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'BookOpen',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning subtopics table (checklists under main topics)
CREATE TABLE learning_subtopics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_minutes INTEGER DEFAULT 30,
  actual_minutes INTEGER DEFAULT 0,
  difficulty_level TEXT DEFAULT 'Beginner' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning resources table
CREATE TABLE learning_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES learning_subtopics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  resource_type TEXT DEFAULT 'Article' CHECK (resource_type IN ('Article', 'Video', 'Book', 'Course', 'Podcast', 'Document', 'Other')),
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning sessions table (study time tracking)
CREATE TABLE learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES learning_subtopics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning goals table
CREATE TABLE learning_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing learning_progress table to be compatible
ALTER TABLE learning_progress ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE;
ALTER TABLE learning_progress ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'Beginner';
ALTER TABLE learning_progress ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT 30;
ALTER TABLE learning_progress ADD COLUMN IF NOT EXISTS actual_minutes INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_learning_topics_user_id ON learning_topics(user_id);
CREATE INDEX idx_learning_subtopics_topic_id ON learning_subtopics(topic_id);
CREATE INDEX idx_learning_subtopics_user_id ON learning_subtopics(user_id);
CREATE INDEX idx_learning_resources_topic_id ON learning_resources(topic_id);
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_goals_topic_id ON learning_goals(topic_id);

-- Enable RLS
ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own learning topics" ON learning_topics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own learning subtopics" ON learning_subtopics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own learning resources" ON learning_resources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own learning sessions" ON learning_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own learning goals" ON learning_goals FOR ALL USING (auth.uid() = user_id);
