# C//QUEST

A browser game that teaches C from first principles: six worlds, thirty quests, and a small C
parser/evaluator that runs entirely in the page. Players sign in with **Continue with Google**
(Supabase Auth), and their saves, settings and code drafts are stored in Supabase Postgres with
row-level security, so progress follows them to any device.

Built with [TanStack Start](https://tanstack.com/start) (React 19, plain JavaScript), rendered on
the server by default and packaged as a Cloudflare Worker by the Cloudflare Vite plugin.

## Supabase setup (once)

1. Copy `.env.example` to `.env` and fill in your project URL and publishable key.
2. In the Supabase SQL editor, run `supabase/migrations/20261125000000_cquest_init.sql`
   (tables `saves`, `player_settings`, `drafts`, all with owner-only RLS).
3. Enable the Google provider under Authentication > Sign In / Providers, and add your site URLs
   under Authentication > URL Configuration.

Saves made before sign-in existed are uploaded from `localStorage` on a player's first sign-in.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:3000).

## Build

```bash
npm run build   # -> dist/client (assets) + dist/server (the Worker)
npm run preview
```

There is no `index.html`: the HTML document is rendered from `src/routes/__root.jsx`. Dev and
build both execute server code in `workerd` through `@cloudflare/vite-plugin`, so the local run
matches the Worker output.

## Deploy

Every push to `main` builds the static site and publishes it to GitHub Pages
(`.github/workflows/pages.yml`): https://anayinjnani25.github.io/C-QUEST/

## Layout

| Path | What it is |
| --- | --- |
| `src/routes/index.jsx` | Title screen and the player's adventure card |
| `src/routes/start.jsx` | Onboarding: name, then choose your character |
| `src/routes/map.jsx` | The campaign map |
| `src/routes/mission.$missionId.jsx` | A quest: briefing, code editor, run, memory view |
| `src/routes/profile.jsx` | Stats, achievements, export/import |
| `src/lib/supabase.js`, `src/lib/auth/` | Supabase client and Google sign-in |
| `src/lib/game/` | Saves (synced to Supabase via `cloud.js`), heroes, curriculum, achievements, feedback, sound |
| `supabase/migrations/` | Database schema and row-level security |
| `src/lib/c/` | The in-browser C engine and syntax highlighting |
| `src/components/game/` | Campaign chrome (HUD, world sections, hero avatar) |
| `src/components/arena/` | Mission chrome (editor, terminal, checks, tutor) |
| `src/components/ui/` | shadcn/ui primitives (button, dialog, input, sonner); tokens live in `src/index.css` and `tailwind.config.js` |

`src/router.jsx` builds the router and its QueryClient per request; `src/server.js` is the Worker
entry (`main` in `wrangler.jsonc`).
