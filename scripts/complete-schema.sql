-- Complete Josh App Database Schema
-- This script creates all necessary tables for the Josh App to function properly

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create missing tables that components expect

-- Note Folders table (missing - causing the error)
CREATE TABLE IF NOT EXISTS public.note_folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'folder',
    parent_folder_id UUID REFERENCES public.note_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add folder_id to notes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'folder_id') THEN
        ALTER TABLE public.notes ADD COLUMN folder_id UUID REFERENCES public.note_folders(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add missing columns to notes table for enhanced functionality
DO $$ 
BEGIN
    -- Add is_favorite column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'is_favorite') THEN
        ALTER TABLE public.notes ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add color column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'color') THEN
        ALTER TABLE public.notes ADD COLUMN color TEXT DEFAULT '#FFFFFF';
    END IF;
    
    -- Add is_archived column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'is_archived') THEN
        ALTER TABLE public.notes ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add reminder_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'reminder_date') THEN
        ALTER TABLE public.notes ADD COLUMN reminder_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add word_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'word_count') THEN
        ALTER TABLE public.notes ADD COLUMN word_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add note_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'note_type') THEN
        ALTER TABLE public.notes ADD COLUMN note_type TEXT DEFAULT 'note';
    END IF;
END $$;

-- Note Templates table
CREATE TABLE IF NOT EXISTS public.note_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    note_type TEXT DEFAULT 'note',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note Attachments table
CREATE TABLE IF NOT EXISTS public.note_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Notes table
CREATE TABLE IF NOT EXISTS public.voice_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    transcription TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables that components expect

-- Add missing columns to habits table
DO $$ 
BEGIN
    -- Ensure all habit columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'reminder_time') THEN
        ALTER TABLE public.habits ADD COLUMN reminder_time TIME WITHOUT TIME ZONE;
    END IF;
END $$;

-- Add missing columns to transactions table
DO $$ 
BEGIN
    -- Add currency column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'currency') THEN
        ALTER TABLE public.transactions ADD COLUMN currency TEXT DEFAULT 'INR';
    END IF;
    
    -- Add payment_method column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'payment_method') THEN
        ALTER TABLE public.transactions ADD COLUMN payment_method TEXT;
    END IF;
    
    -- Add notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'notes') THEN
        ALTER TABLE public.transactions ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_note_folders_user_id ON public.note_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_note_folders_parent ON public.note_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON public.notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_archived ON public.notes(is_archived);
CREATE INDEX IF NOT EXISTS idx_notes_reminder_date ON public.notes(reminder_date);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON public.note_attachments(note_id);
CREATE INDEX IF NOT EXISTS idx_voice_notes_note_id ON public.voice_notes(note_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON public.habit_completions(habit_id, completed_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_moods_user_date ON public.moods(user_id, date);

-- Insert default note folders
INSERT INTO public.note_folders (user_id, name, color, icon) 
SELECT DISTINCT user_id, 'General', '#3B82F6', 'folder'
FROM public.notes 
WHERE NOT EXISTS (
    SELECT 1 FROM public.note_folders 
    WHERE note_folders.user_id = notes.user_id 
    AND note_folders.name = 'General'
);

-- Insert default note templates
INSERT INTO public.note_templates (user_id, name, content, note_type, is_default)
SELECT DISTINCT user_id, 'Meeting Notes', '# Meeting Notes\n\n**Date:** \n**Attendees:** \n**Agenda:** \n\n## Discussion Points\n\n## Action Items\n\n## Next Steps\n', 'meeting', true
FROM public.notes 
WHERE NOT EXISTS (
    SELECT 1 FROM public.note_templates 
    WHERE note_templates.user_id = notes.user_id 
    AND note_templates.name = 'Meeting Notes'
);

-- Enable Row Level Security on all tables
ALTER TABLE public.note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for note_folders
CREATE POLICY "Users can view their own note folders" ON public.note_folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own note folders" ON public.note_folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own note folders" ON public.note_folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note folders" ON public.note_folders
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for note_templates
CREATE POLICY "Users can view their own note templates" ON public.note_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own note templates" ON public.note_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own note templates" ON public.note_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note templates" ON public.note_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for note_attachments
CREATE POLICY "Users can view attachments for their notes" ON public.note_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert attachments for their notes" ON public.note_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attachments for their notes" ON public.note_attachments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Create RLS policies for voice_notes
CREATE POLICY "Users can view voice notes for their notes" ON public.voice_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = voice_notes.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert voice notes for their notes" ON public.voice_notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = voice_notes.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete voice notes for their notes" ON public.voice_notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.notes 
            WHERE notes.id = voice_notes.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Update existing notes to have default values for new columns
UPDATE public.notes 
SET 
    is_favorite = COALESCE(is_favorite, FALSE),
    color = COALESCE(color, '#FFFFFF'),
    is_archived = COALESCE(is_archived, FALSE),
    word_count = COALESCE(word_count, LENGTH(content) / 5),
    note_type = COALESCE(note_type, 'note')
WHERE is_favorite IS NULL OR color IS NULL OR is_archived IS NULL OR word_count IS NULL OR note_type IS NULL;

-- Update existing transactions to have default currency
UPDATE public.transactions 
SET currency = COALESCE(currency, 'INR')
WHERE currency IS NULL;

COMMIT;
