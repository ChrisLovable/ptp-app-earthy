# SUPABASE SETUP GUIDE - STEP BY STEP

## 🚀 PART 1: CREATE SUPABASE PROJECT (3 MINUTES)

### Step 1: Create Supabase Account
1. Go to: **https://supabase.com/**
2. Click: **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Confirm email if needed

### Step 2: Create New Project
1. Click: **"New project"**
2. Choose organization (or create one)
3. Fill in:
   - **Name:** `ptp-app`
   - **Database Password:** (generate strong one, SAVE IT!)
   - **Region:** (choose closest to you)
4. Click: **"Create new project"**
5. Wait 2 minutes for provisioning...

### Step 3: Get API Keys
1. In left sidebar, click: **"Settings"** (gear icon)
2. Click: **"API"**
3. You'll see:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **KEEP THIS TAB OPEN!**

---

## 📊 PART 2: CREATE DATABASE TABLES (2 MINUTES)

### Step 4: Run SQL Schema
1. In left sidebar, click: **"SQL Editor"** (</> icon)
2. Click: **"New query"**
3. Open the `database.sql` file from the project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click: **"Run"** (or Ctrl+Enter)
7. You should see: ✓ Success. No rows returned

### Step 5: Verify Tables Created
1. In left sidebar, click: **"Table Editor"**
2. You should see 2 tables:
   - **players** (with 1 demo row - Marcus Johnson)
   - **player_history**
3. Click **players** → You'll see Marcus Johnson's data!

---

## 💻 PART 3: SETUP PROJECT IN CURSOR (5 MINUTES)

### Step 6: Extract Project Files
1. Download `ptp-app-SUPABASE.tar.gz`
2. Extract to folder: `ptp-app`
3. Open **Cursor** → File → Open Folder → Select `ptp-app`

### Step 7: Install Dependencies
1. Open Terminal in Cursor (**Terminal → New Terminal**)
2. Run:
```bash
npm install
```
3. Wait 1-2 minutes...

### Step 8: Create .env File
1. Copy `.env.example` → `.env`
2. Open `.env`
3. Paste your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Save file (**Ctrl+S**)

### Step 9: Start Development Server
1. In Terminal:
```bash
npm run dev
```
2. Wait 5 seconds...
3. Open: **http://localhost:3000**

---

## ✅ PART 4: TEST THE APP (2 MINUTES)

### Step 10: Verify Connection
1. App should load with "ADRIAN LE ROUX" header
2. You should see **Marcus Johnson** card (from demo data)
3. Click on Marcus → You should see his training plan!

### Step 11: Test Add Player
1. Click: **"➕ Add New Player"**
2. Name: `Test Player`
3. Email: `test@test.com`
4. Click: **"Add Player"**
5. New player card appears!

### Step 12: Verify Database Storage
1. Go back to **Supabase Dashboard**
2. Click: **"Table Editor"** → **players**
3. You should see:
   - Marcus Johnson
   - Test Player ← NEW!

### Step 13: Test Historical Data
1. In app, click on **Test Player**
2. Edit something (add a target value)
3. Click: **"💾 Save Changes"**
4. In Supabase, check **player_history** table
5. You should see a history entry!

---

## 🚢 PART 5: DEPLOYMENT (10 MINUTES)

### Option A: Vercel (EASIEST - RECOMMENDED)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel

# Answer prompts:
# Setup and deploy: Y
# Scope: (your username)
# Link to existing: N
# Project name: ptp-app
# Directory: ./
# Override settings: N

# Add environment variables:
vercel env add VITE_SUPABASE_URL
# Paste your URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your key

# Deploy to production
vercel --prod
```

**Your URL:** `https://ptp-app-xxxxx.vercel.app`

### Option B: Netlify

```bash
# Build the app
npm run build

# Go to netlify.com
# Drag & drop the 'dist' folder

# After upload, go to Site settings → Environment variables
# Add:
# VITE_SUPABASE_URL = your URL
# VITE_SUPABASE_ANON_KEY = your key

# Trigger redeploy
```

### Option C: Manual Hosting

```bash
# Build
npm run build

# Upload 'dist' folder to any web host:
# - DigitalOcean App Platform
# - AWS Amplify
# - Cloudflare Pages
# - Your own VPS
```

---

## 🔒 PART 6: SECURITY (OPTIONAL - FOR PRODUCTION)

### Add Authentication (Later)

1. In Supabase, go to **Authentication**
2. Enable email auth or Google/GitHub
3. Update Row Level Security policies
4. Add auth to React app

### Update RLS Policies (When Ready)

```sql
-- Replace existing policies with:

-- Only authenticated users can insert/update/delete
create policy "Auth users can insert" on players
  for insert to authenticated
  using (true);

create policy "Auth users can update" on players
  for update to authenticated
  using (true);

create policy "Auth users can delete" on players
  for delete to authenticated
  using (true);
```

---

## 📁 PROJECT STRUCTURE

```
ptp-app/
├── database.sql          ← Run this in Supabase SQL Editor
├── package.json
├── vite.config.js
├── .env                  ← Your Supabase credentials
├── .env.example          ← Template
├── .gitignore
├── index.html
├── README.md
├── SETUP_GUIDE.md        ← This file
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── supabase.js       ← Supabase config
    ├── database.js       ← Database operations
    ├── styles.css        ← ALL styling (100% intact)
    └── components/
        ├── CoachView.jsx
        ├── PlayerView.jsx
        ├── PlayerEditor.jsx
        └── AddPlayerModal.jsx
```

---

## 🐛 TROUBLESHOOTING

### "Invalid API key"
- Check `.env` has correct values
- Restart dev server (`Ctrl+C` then `npm run dev`)

### "Table does not exist"
- Run `database.sql` in Supabase SQL Editor
- Check Table Editor to verify tables created

### "Permission denied"
- Check RLS policies are set to public (from SQL script)
- Or disable RLS temporarily for testing

### App shows no players
- Check Supabase Table Editor → players table
- Should have Marcus Johnson demo data
- Check browser console (F12) for errors

### "CORS error"
- Supabase should auto-allow all origins
- Check Project Settings → API → API Settings

---

## ✨ FEATURES

### ✅ EVERYTHING FROM ORIGINAL
- All styling preserved
- Indian flag gradients
- WhatsApp sharing with preview
- PWA support
- 6 fitness targets
- 6 training cards
- Rich text editing
- Import/Export JSON

### 🆕 NEW SUPABASE FEATURES
- **Cloud storage** - Access from anywhere
- **Historical data** - Every update saved automatically
- **Real-time sync** - Multiple coaches can edit
- **Scalable** - Handles thousands of players
- **Free tier** - 500MB database, 2GB bandwidth
- **Automatic backups** - Daily backups by Supabase

---

## 📊 DATABASE SCHEMA

### players table:
- `id` - Auto-increment primary key
- `name` - Player name
- `email` - Player email
- `target_titles` - JSONB (6 target names)
- `targets` - JSONB (6 target values)
- `target_visible` - JSONB (6 visibility flags)
- `card_titles` - JSONB (6 card titles)
- `plan` - JSONB (6 cards with content + focus)
- `card_visible` - JSONB (6 visibility flags)
- `last_updated` - Date
- `created_at` - Timestamp
- `updated_at` - Timestamp

### player_history table:
- `id` - UUID primary key
- `player_id` - Foreign key to players
- `player_data` - JSONB (full player snapshot)
- `saved_at` - Timestamp

---

## 💡 TIPS

1. **Testing:** Use demo data (Marcus Johnson) to test
2. **Development:** Run `npm run dev` for hot reload
3. **Production:** Always set env vars in hosting platform
4. **Backups:** Use Export button for JSON backups
5. **History:** View player_history table in Supabase

---

## 🎉 YOU'RE DONE!

Your app is now:
- ✅ Connected to Supabase
- ✅ Storing data in cloud
- ✅ Saving historical versions
- ✅ 100% functional
- ✅ Ready to deploy

**Next:** Deploy and share the WhatsApp link!
