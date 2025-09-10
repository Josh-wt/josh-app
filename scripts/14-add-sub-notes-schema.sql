-- Add sub-notes table for super notes functionality
CREATE TABLE IF NOT EXISTS sub_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hidden_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for sub_notes
ALTER TABLE sub_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sub_notes
CREATE POLICY "Users can view their own sub-notes" ON sub_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sub-notes" ON sub_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sub-notes" ON sub_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sub-notes" ON sub_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sub_notes_note_id ON sub_notes(note_id);
CREATE INDEX IF NOT EXISTS idx_sub_notes_user_id ON sub_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_notes_order ON sub_notes(order_index);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sub_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sub_notes_updated_at
  BEFORE UPDATE ON sub_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_sub_notes_updated_at();
