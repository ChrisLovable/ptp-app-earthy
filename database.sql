-- PTP App Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Players table
create table players (
  id bigserial primary key,
  name text not null,
  email text not null,
  share_token text unique not null,
  
  -- Target titles
  target_titles jsonb default '{
    "target1": "Skinfolds",
    "target2": "Bronco",
    "target3": "CMJ",
    "target4": "Body Weight",
    "target5": "VO2 Max",
    "target6": "Flexibility"
  }'::jsonb,
  
  -- Target values
  targets jsonb default '{
    "target1": "",
    "target2": "",
    "target3": "",
    "target4": "",
    "target5": "",
    "target6": ""
  }'::jsonb,
  
  -- Target visibility
  target_visible jsonb default '{
    "target1": true,
    "target2": true,
    "target3": true,
    "target4": false,
    "target5": false,
    "target6": false
  }'::jsonb,
  
  -- Card titles
  card_titles jsonb default '{
    "card1": "Strength",
    "card2": "Conditioning",
    "card3": "Speed",
    "card4": "Mobility",
    "card5": "Recovery",
    "card6": "Nutrition"
  }'::jsonb,
  
  -- Training plan
  plan jsonb default '{
    "card1": "",
    "card1Focus": "",
    "card2": "",
    "card2Focus": "",
    "card3": "",
    "card3Focus": "",
    "card4": "",
    "card4Focus": "",
    "card5": "",
    "card5Focus": "",
    "card6": "",
    "card6Focus": ""
  }'::jsonb,
  
  -- Card visibility
  card_visible jsonb default '{
    "card1": true,
    "card2": true,
    "card3": true,
    "card4": true,
    "card5": true,
    "card6": true
  }'::jsonb,
  
  -- Timestamps
  last_updated date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Player history table
create table player_history (
  id uuid default uuid_generate_v4() primary key,
  player_id bigint references players(id) on delete cascade,
  player_data jsonb not null,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_players_last_updated on players(last_updated desc);
create index idx_players_share_token on players(share_token);
create index idx_player_history_player_id on player_history(player_id);
create index idx_player_history_saved_at on player_history(saved_at desc);

-- Enable Row Level Security
alter table players enable row level security;
alter table player_history enable row level security;

-- Public access policies (adjust later for auth)
create policy "Enable read access for all users" on players for select using (true);
create policy "Enable insert for all users" on players for insert with check (true);
create policy "Enable update for all users" on players for update using (true);
create policy "Enable delete for all users" on players for delete using (true);

create policy "Enable read access for all users" on player_history for select using (true);
create policy "Enable insert for all users" on player_history for insert with check (true);

-- Insert demo data
insert into players (name, email, share_token, target_titles, targets, target_visible, card_titles, plan, card_visible, last_updated)
values (
  'Marcus Johnson',
  'marcus@team.com',
  encode(gen_random_bytes(32), 'hex'),
  '{"target1": "Skinfolds", "target2": "Bronco", "target3": "CMJ", "target4": "Body Weight", "target5": "VO2 Max", "target6": "Flexibility"}'::jsonb,
  '{"target1": "45mm", "target2": "4:20", "target3": "65cm", "target4": "85kg", "target5": "52 ml/kg/min", "target6": ""}'::jsonb,
  '{"target1": true, "target2": true, "target3": true, "target4": true, "target5": true, "target6": false}'::jsonb,
  '{"card1": "Strength", "card2": "Conditioning", "card3": "Speed", "card4": "Mobility", "card5": "Recovery", "card6": "Nutrition"}'::jsonb,
  '{"card1": "Week 3 - Hypertrophy Block\n\nDay 1: Upper Body\n- Bench Press 4x8 @ 75%\n- Pull-ups 4x8\n- Dumbbell Shoulder Press 3x10\n- Cable Rows 3x12\n\nDay 2: Lower Body\n- Back Squat 4x6 @ 80%\n- Romanian Deadlifts 3x8\n- Bulgarian Split Squats 3x10 each\n- Leg Curls 3x12", "card1Focus": "Focus on time under tension and controlled eccentric phase", "card2": "Conditioning Block - Week 3\n\nMonday: Aerobic Base\n- 30min steady state run @ 65-70% max HR\n\nWednesday: Threshold Work\n- 4x 5min @ 85% max HR\n- 3min recovery between sets\n\nFriday: Interval Training\n- 8x 400m @ 90% effort\n- 90sec rest between reps", "card2Focus": "Build aerobic base while maintaining speed endurance", "card3": "", "card3Focus": "", "card4": "", "card4Focus": "", "card5": "", "card5Focus": "", "card6": "", "card6Focus": ""}'::jsonb,
  '{"card1": true, "card2": true, "card3": false, "card4": false, "card5": false, "card6": false}'::jsonb,
  current_date
);
