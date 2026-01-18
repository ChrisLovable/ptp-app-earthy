# STEP-BY-STEP SETUP GUIDE

## PART 1: FIREBASE SETUP (5 MINUTES)

### Step 1: Create Firebase Project

1. Open: https://console.firebase.google.com/
2. Click: **"Add project"** (blue button)
3. Enter name: `ptp-app`
4. Click: **Continue**
5. Disable Google Analytics toggle
6. Click: **Create project**
7. Wait 30 seconds...
8. Click: **Continue**

### Step 2: Create Web App

1. You're now in Firebase Console
2. Click the **</> icon** (Web app icon)
3. Enter app nickname: `PTP App`
4. **DON'T** check "Firebase Hosting"
5. Click: **Register app**
6. You'll see a config object - **KEEP THIS WINDOW OPEN**

### Step 3: Create Firestore Database

1. Open new tab to Firebase Console (same project)
2. Click: **Build** (left sidebar)
3. Click: **Firestore Database**
4. Click: **Create database** (blue button)
5. Choose: **Start in test mode**
6. Click: **Next**
7. Choose location: **(select closest to you)**
8. Click: **Enable**
9. Wait 30 seconds...
10. Done! You should see "Cloud Firestore" with empty collections

---

## PART 2: CURSOR PROJECT SETUP (3 MINUTES)

### Step 4: Create Project Folder

1. Open **Cursor**
2. File → **Open Folder**
3. Create new folder: `ptp-app`
4. Select it and click **Open**

### Step 5: Extract Files

1. Download the `ptp-app.tar.gz` file I provided
2. Extract it to your `ptp-app` folder
3. You should see:
   ```
   ptp-app/
   ├── package.json
   ├── src/
   ├── public/
   └── ...
   ```

### Step 6: Install Dependencies

1. In Cursor, open Terminal: **Terminal → New Terminal**
2. Type: `npm install`
3. Press **Enter**
4. Wait 1-2 minutes...
5. Done when you see "added XXX packages"

### Step 7: Create .env File

1. In Cursor file explorer, find `.env.example`
2. Right-click → **Duplicate**
3. Rename copy to: `.env` (no .example)
4. Open `.env` file

### Step 8: Add Firebase Config

1. Go back to Firebase tab (Step 2)
2. Copy each value and paste into `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...    ← Copy from Firebase
VITE_FIREBASE_AUTH_DOMAIN=ptp-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ptp-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=ptp-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

3. Save `.env` file (**Ctrl+S**)

### Step 9: Start App

1. In Terminal, type: `npm run dev`
2. Press **Enter**
3. Wait 5 seconds...
4. You'll see: `Local: http://localhost:3000`
5. **Ctrl+Click** the URL to open in browser

---

## PART 3: TESTING (2 MINUTES)

### Step 10: Test the App

1. Browser should open to localhost:3000
2. You'll see: "ADRIAN LE ROUX" header
3. Click: **"➕ Add New Player"**
4. Enter name: `Test Player`
5. Enter email: `test@test.com`
6. Click: **"Add Player"**
7. You should see the new player card!

### Step 11: Verify Firebase Storage

1. Go to Firebase Console
2. Click: **Firestore Database**
3. You should see:
   - **players** collection
   - Click it → You'll see your test player!

### Step 12: Test Player View

1. Click on "Test Player" card
2. Edit some fields
3. Click: **"💾 Save Changes"**
4. Check Firebase again
5. Data should be updated!

---

## PART 4: DEPLOYMENT (10 MINUTES)

### Option A: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Select: Use existing project
# Choose: ptp-app
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No

# Build & Deploy
npm run build
firebase deploy
```

Your URL: `https://ptp-app-xxxxx.web.app`

### Option B: Vercel (Easier)

```bash
# Install Vercel CLI
npm install -g vercel

# Login & Deploy
vercel

# Answer prompts:
# Setup: Y
# Project name: ptp-app
# Directory: ./
# Override: N
```

Your URL: `https://ptp-app-xxxxx.vercel.app`

### Option C: Netlify (Easiest)

```bash
# Build
npm run build

# Go to netlify.com/drop
# Drag the 'dist' folder
# Done!
```

---

## ✅ CHECKLIST

Before deploying, verify:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] `.env` file has all 6 config values
- [ ] `npm install` completed successfully
- [ ] App runs on localhost:3000
- [ ] Can add a player
- [ ] Player saves to Firebase
- [ ] Can edit player
- [ ] Can delete player

---

## 🐛 COMMON ERRORS

### "Cannot find module 'firebase'"
**Fix:** Run `npm install` again

### "Firebase: No Firebase App"
**Fix:** Check `.env` file has all values, restart dev server

### "Permission denied" in Firestore
**Fix:** Make sure Firestore is in **Test mode**

### Blank white page
**Fix:** Open browser console (F12), check for errors

### Styling looks wrong
**Fix:** Hard refresh (Ctrl+Shift+R)

---

## 🎉 YOU'RE DONE!

Your app is now:
- ✅ Running with Firebase
- ✅ Storing historical data
- ✅ 100% functional
- ✅ Ready to deploy

Next: Deploy and test WhatsApp sharing!
