# Recipe Retrieve

A personal recipe collection app with Google login, manual entry, and Instagram import via AI parsing. Built as a PWA — install it on Android and use the system share sheet to send Instagram posts directly to the app.

## Stack

- **Frontend**: React + Vite + React Router v6 (deployed on Netlify)
- **Backend**: PocketBase (deployed on Linode)
- **Auth**: Google OAuth via PocketBase
- **AI**: Anthropic Claude (recipe parsing from Instagram captions)
- **PWA**: Web Share Target API for Android share sheet integration

## Setup

### 1. Backend

See [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md) for full Linode + PocketBase + Nginx + HTTPS setup.

### 2. Frontend

```bash
cp .env.example .env.local
# Fill in VITE_POCKETBASE_URL and VITE_ANTHROPIC_API_KEY

npm install
npm run dev
```

### 3. Build & Deploy to Netlify

```bash
npm run build
# Deploy dist/ to Netlify, or connect your repo for auto-deploys
# Add env vars in Netlify dashboard
```

## Features

- **Google Sign-In** — authentication via PocketBase OAuth2
- **Recipe collection** — searchable, filterable grid
- **Manual entry** — full recipe form (ingredients, steps, times, tags)
- **Instagram import** — paste a URL + caption → Claude extracts the recipe
- **Web Share Target** — on Android, once installed as PWA, appears in the system share sheet so you can share Instagram posts directly to the app
- **Protected routes** — all recipe pages require authentication

## PWA / Share Target

After deploying to Netlify over HTTPS:
1. Open the site in Chrome on Android
2. Tap the browser menu → "Add to Home Screen"
3. Once installed, go to any Instagram post → Share → Recipe Retrieve
4. The app opens at `/share-target`, reads the URL, and redirects to the Instagram import flow
