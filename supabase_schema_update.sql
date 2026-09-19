-- Supabase schema migration
-- Run this script in your Supabase SQL editor to add the new fields required by the AI Radar

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS ministry text,
ADD COLUMN IF NOT EXISTS completion_progress integer,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS key_objectives text[],
ADD COLUMN IF NOT EXISTS beneficiaries text,
ADD COLUMN IF NOT EXISTS expected_impact text,
ADD COLUMN IF NOT EXISTS timeline jsonb;
