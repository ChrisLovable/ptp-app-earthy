# Database Update Guide - Secure Player Links

## IMPORTANT: How to Update Your Database

This update adds secure unique tokens for each player to prevent link guessing and unauthorized access.

---

## 🔧 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Run the Migration SQL**

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database_migration_share_token.sql`
4. Click **Run**

This will:
- Add a `share_token` column to the `players` table
- Generate secure random tokens for all existing players
- Create an index for fast token lookups

---

## 📋 **What the Migration Does**

```sql
-- Adds share_token column
ALTER TABLE players ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Creates index
CREATE INDEX IF NOT EXISTS idx_players_share_token ON players(share_token);

-- Generates tokens for existing players
UPDATE players 
SET share_token = encode(gen_random_bytes(32), 'hex')
WHERE share_token IS NULL;

-- Makes token required
ALTER TABLE players ALTER COLUMN share_token SET NOT NULL;
```

---

## ✅ **After Migration**

1. **All existing players** will automatically get secure tokens
2. **New players** will get tokens when created
3. **Player links** will now use format: `?token=abc123...` instead of `?player=1`
4. **Links cannot be guessed** - each token is a 64-character random hex string

---

## 🔒 **Security Benefits**

- ✅ **Before**: Links like `?player=1`, `?player=2` could be guessed
- ✅ **After**: Links like `?token=a1b2c3d4e5f6...` are cryptographically secure
- ✅ **Unique**: Each player gets a unique, non-guessable token
- ✅ **No enumeration**: Attackers cannot discover other players by incrementing IDs

---

## ⚠️ **VERIFY AFTER MIGRATION**

Run this query to verify all players have tokens:

```sql
SELECT id, name, share_token, LENGTH(share_token) as token_length 
FROM players;
```

All players should have:
- A `share_token` value
- A token length of 64 characters

---

## 🔄 **For New Deployments**

If setting up a new database, the updated `database.sql` already includes the `share_token` column, so no migration is needed.

---

## 📝 **Notes**

- Tokens are **permanent** - they don't change unless regenerated
- If you need to regenerate a token for a player, the app will do it automatically
- Old links using `?player=ID` will **no longer work** - they must use `?token=TOKEN`
