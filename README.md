# PTP - PLAYER TRAINING PLAN
## React + Supabase - Complete Package

**COMPLETE CURSOR PROJECT WITH SUPABASE DATABASE**

---

## 📦 EVERYTHING INCLUDED

✅ All React components  
✅ Supabase database setup  
✅ SQL schema file  
✅ Complete documentation  
✅ PWA support  
✅ 100% styling preserved  
✅ Historical data tracking  

---

## 🚀 START HERE

1. **Read:** `SUPABASE_SETUP.md` (full step-by-step guide)
2. **Quick:** `QUICKSTART.md` (5-minute reference)
3. **Deploy:** Follow deployment section

---

## 📁 PROJECT FILES

```
ptp-app/
├── database.sql              ← RUN IN SUPABASE SQL EDITOR
├── SUPABASE_SETUP.md         ← FULL SETUP GUIDE
├── QUICKSTART.md             ← 5-MINUTE REFERENCE
├── package.json
├── .env.example              ← COPY TO .env
├── public/                   ← Icons, manifest, service worker
└── src/                      ← React app
    ├── supabase.js           ← Database config
    ├── database.js           ← CRUD operations
    ├── App.jsx               ← Main app
    ├── styles.css            ← All styling
    └── components/           ← 4 components
```

---

## ⚡ QUICK START (10 MINUTES)

### 1. Supabase (3 min)
```
supabase.com → New project → Run database.sql
```

### 2. Install (2 min)
```bash
npm install
cp .env.example .env
# Add Supabase URL + key to .env
```

### 3. Run (1 min)
```bash
npm run dev
```

### 4. Deploy (5 min)
```bash
npm install -g vercel
vercel --prod
```

---

## ✅ FEATURES

### Original (100% Preserved):
- Indian flag gradients
- WhatsApp sharing
- PWA support
- 6 fitness targets
- 6 training cards
- Rich text editing
- Import/Export

### New (Supabase):
- Cloud storage
- Historical versions
- Multi-device sync
- SQL access
- Auto backups
- Scalable

---

## 📚 DOCUMENTATION

- **SUPABASE_SETUP.md** - Complete step-by-step (START HERE)
- **QUICKSTART.md** - Commands & checklist
- **database.sql** - Database schema (run in Supabase)

---

## 🔧 COMMANDS

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Test production locally
```

---

## 🌐 DEPLOY

**Vercel (recommended):**
```bash
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder
```

---

## 📊 DATABASE

**Tables:**
- `players` - Current player data
- `player_history` - Automatic version history

**Features:**
- JSONB for flexible data
- Auto-increment IDs
- Timestamps
- Row Level Security

---

## 🐛 TROUBLESHOOTING

**App won't start?**
- Check .env file exists
- Verify Supabase credentials
- Run `npm install` again

**No database connection?**
- Run database.sql in Supabase
- Check Table Editor shows tables
- Verify URL/key in .env

**See SUPABASE_SETUP.md for detailed troubleshooting**

---

## 🎯 TESTING

- [ ] See Marcus Johnson (demo data)
- [ ] Add new player
- [ ] Edit player
- [ ] Check Supabase Table Editor
- [ ] See player_history entries
- [ ] Delete player
- [ ] WhatsApp share works

---

## Made for Adrian Le Roux 🇿🇦
