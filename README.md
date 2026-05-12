# SpeakStar PWA — Speech Therapy App

A complete bilingual (English/Spanish) speech therapy app as a Progressive Web App.
**No build process, no npm install, no Expo.**

---

## 🚀 3 ways to use it (pick one)

### ⚡ Option 1: Test in 30 seconds on your computer
1. Just **double-click `index.html`**
2. Opens in your browser, fully working

> ⚠️ Speech recognition only works when served over HTTPS (or localhost). When testing by double-clicking, the mic won't work — only the **"Skip mic (demo)"** button does. To test speech, use Option 2 or 3.

---

### 🌐 Option 2: Get it on your phone — RECOMMENDED (5 minutes)

This gives you a real URL anyone can visit, AND lets you install it to your phone's home screen like a real app.

1. Go to **https://app.netlify.com/drop** in your browser
2. **Drag this whole `SpeakStarPWA` folder** into the page
3. Wait ~30 seconds — Netlify gives you a URL like `https://random-words-12345.netlify.app`
4. On your phone, open that URL in **Chrome**
5. In Chrome's menu (⋮), tap **"Add to Home screen"** or **"Install app"**
6. Now SpeakStar is on your home screen like a real app!

✅ Microphone works (real Web Speech API)
✅ Saves progress between sessions
✅ Works offline after first load
✅ Looks and feels like a native app

---

### 📱 Option 3: Real APK for Google Play Store (15 minutes)

Once you've done Option 2 and you have your Netlify URL:

1. Go to **https://www.pwabuilder.com**
2. Paste your Netlify URL
3. Click **Start**
4. Click the **Android** tab
5. Click **Generate Package**
6. Download the `.apk` and `.aab` files
7. Use the `.apk` to share with anyone, or upload the `.aab` to Google Play Console

PWABuilder is a free Microsoft tool that wraps PWAs into proper Android/iOS apps. The output is a real native APK — same as any other app in the Play Store.

---

## 🔑 Add real AI feedback (optional)

The app works with built-in offline encouragement messages. For personalized Claude AI feedback:

1. Get a key at https://console.anthropic.com (free credits available)
2. Open `index.html` in any text editor (Notepad works)
3. Find the line near the top:
   ```
   const ANTHROPIC_API_KEY = 'sk-ant-YOUR_KEY_HERE';
   ```
4. Replace with your real key
5. Save the file
6. Re-upload to Netlify (drag the updated folder again)

⚠️ **Don't put your API key in a public app.** For Play Store release, move the key to a backend server (see commented code in api section).

---

## 🎯 What's included

- 8 English sound categories (S, R, L, TH, SH, CH, B, P) — 40 words total
- 8 Spanish sound categories (RR, Ñ, S, LL, J, D, B/V, P) — 40 words total  
- Real microphone speech recognition (Web Speech API)
- AI feedback with Anthropic Claude (optional)
- 5 varied offline encouragement messages in each language (fallback)
- Mascot character + animations
- Star rewards system
- Progress tracking per sound category
- Bilingual UI with language toggle
- Saves progress in browser storage
- Works offline as installed PWA
- Parent guidance notes

---

## 📁 What's in this folder

- `index.html` — The entire app (just open it!)
- `manifest.json` — Tells phones how to install it as an app
- `sw.js` — Service worker for offline support
- `icon-192.png`, `icon-512.png`, `icon.png` — App icons
- `README.md` — This file

---

## ✅ Why this is better than the React Native version

- No dev environment setup needed
- No npm install / SDK version errors
- No Expo Go bugs to fight
- Works on Android, iOS, and any computer
- Real speech recognition (not just recording)
- Easier to update — just edit the HTML
- Free hosting on Netlify forever
- Can still be turned into a Play Store APK via PWABuilder
