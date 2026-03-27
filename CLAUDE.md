# Recipe Retrieve

A personal recipe collection PWA. Save and organize recipes manually or import them from Instagram via AI parsing. Installable on Android with Web Share Target support so Instagram posts can be shared directly into the app.

## Stack

- **React 19** + **Vite 8** (Rolldown)
- **React Router v7** — routing, imported from `react-router` (not `react-router-dom`)
- **PocketBase** — backend, auth, and database (self-hosted on Linode)
- **Anthropic Claude API** — parses Instagram captions into structured recipe data
- **vite-plugin-pwa** — PWA + Web Share Target manifest

## Infrastructure

- **Frontend**: Netlify (`recipe-retrieve.netlify.app` or custom domain)
- **Backend**: PocketBase on Linode at `https://recipe-retrieve-pb.braican.com`
- **Auth**: Google OAuth2 via PocketBase's built-in OAuth2 provider

## Environment Variables

```bash
VITE_POCKETBASE_URL=https://recipe-retrieve-pb.braican.com
VITE_ANTHROPIC_API_KEY=...
```

Never commit `.env.local`. These are also set in Netlify's environment variables for production builds.

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # production build to dist/
npm run preview   # preview production build locally
```

Install requires `--legacy-peer-deps` due to vite-plugin-pwa's peer dep lag with Vite 8 (handled automatically via `.npmrc`).

## Project Structure

```
src/
├── App.jsx                         # Router setup, all routes defined here
├── main.jsx                        # Entry point
├── index.css                       # Global design system (CSS variables, resets)
├── lib/
│   ├── pocketbase.js               # PocketBase client singleton
│   ├── auth.jsx                    # AuthContext + useAuth hook
│   └── parseRecipe.js              # Claude API call to parse Instagram captions
├── components/
│   ├── Nav.jsx / Nav.module.css    # Sticky header + nav, wraps protected pages via Outlet
│   ├── ProtectedRoute.jsx          # Redirects to /login if not authenticated
│   ├── RecipeCard.jsx              # Card used in the Home grid
│   └── RecipeForm.jsx              # Shared form used by AddRecipe + InstagramImport
└── pages/
    ├── Login.jsx                   # Google OAuth sign-in
    ├── Home.jsx                    # Recipe grid with search + filter
    ├── RecipeDetail.jsx            # Full recipe view + delete
    ├── AddRecipe.jsx               # Manual recipe entry (uses RecipeForm)
    ├── InstagramImport.jsx         # Paste URL + caption → Claude parses → review + save
    └── ShareTarget.jsx             # Web Share Target handler (/share-target route)
```

## Routing

Routes are defined in `src/App.jsx`. Protected routes are wrapped in `<ProtectedRoute>` which checks `useAuth()`. The `<Nav>` component wraps all protected pages via `<Outlet>`.

```
/                   → Home (protected)
/recipe/:id         → RecipeDetail (protected)
/add                → AddRecipe (protected)
/add/instagram      → InstagramImport (protected)
/login              → Login (public)
/share-target       → ShareTarget (public, handles Android share sheet)
```

## Auth

Auth state lives in `AuthContext` (`src/lib/auth.jsx`). The `useAuth()` hook exposes `{ user, loading, loginWithGoogle, logout }`.

PocketBase handles the full Google OAuth2 flow — the frontend never touches Google credentials directly. `pb.authStore` persists the session to localStorage automatically.

## PocketBase

The PocketBase client singleton is at `src/lib/pocketbase.js`. Import it directly:

```js
import pb from '../lib/pocketbase'
```

### `recipes` collection fields

| Field       | Type    |
|-------------|---------|
| title       | Text    |
| description | Text    |
| servings    | Text    |
| prep_time   | Text    |
| cook_time   | Text    |
| ingredients | JSON    |
| steps       | JSON    |
| tags        | JSON    |
| notes       | Text    |
| source_url  | URL     |
| source_type | Select  | `manual` or `instagram`
| image       | File    |
| owner       | Relation → users |

All recipe queries must filter by `owner = "${user.id}"` — users can only see their own recipes.

## Styling

CSS Modules for component styles (e.g. `Nav.module.css`). Global design tokens are in `src/index.css` as CSS variables:

```css
--bg, --bg-card, --bg-elevated   /* backgrounds */
--text, --text-muted, --text-dim /* text colors */
--accent, --accent-light, --accent-dim /* amber gold accent */
--font-display: 'Playfair Display'
--font-body: 'DM Sans'
```

Theme is warm dark editorial. Don't introduce new color values — use the existing CSS variables.

## Instagram Import Flow

1. User pastes an Instagram URL + copies the post caption
2. `parseRecipe.js` sends both to the Claude API (`claude-sonnet-4-20250514`)
3. Claude returns structured JSON matching the recipe schema
4. User reviews and edits the parsed data in `RecipeForm` before saving
5. Record is saved to PocketBase with `source_type: 'instagram'`

## Web Share Target (Android PWA)

When the app is installed as a PWA on Android, it registers as a share target. Sharing an Instagram post opens `/share-target?url=...&text=...`. `ShareTarget.jsx` reads those params, stores them in `sessionStorage`, and redirects to `/add/instagram` where `InstagramImport.jsx` picks them up via router state or sessionStorage.

The share target is declared in `vite.config.js` inside the PWA manifest config.
