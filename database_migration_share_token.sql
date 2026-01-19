-- MIGRATION: Add secure share_token to players table
-- Run this in Supabase SQL Editor
-- This adds a unique secure token for each player to prevent link guessing

-- Step 1: Add share_token column
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_share_token ON players(share_token);

-- Step 3: Generate tokens for existing players (run this after the column is added)
-- This will generate secure random tokens for all existing players
UPDATE players 
SET share_token = encode(gen_random_bytes(32), 'hex')
WHERE share_token IS NULL;

-- Step 4: Make share_token NOT NULL after all players have tokens
ALTER TABLE players 
ALTER COLUMN share_token SET NOT NULL;

-- Verification: Check that all players have tokens
-- SELECT id, name, share_token FROM players;
