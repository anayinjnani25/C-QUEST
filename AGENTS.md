# C//QUEST — project conventions

A browser game built with TanStack Start (React 19, plain JavaScript — no TypeScript). Players
sign in with Google through Supabase Auth, and saves, settings and code drafts live in Supabase
Postgres behind row-level security (`supabase/migrations/`). `src/lib/supabase.js` is the browser
client, `src/lib/auth/AuthProvider.jsx` holds the session, `src/lib/game/cloud.js` does every query,
and `src/lib/game/GameProvider.jsx` keeps state in memory and syncs changes. Only the theme choice
stays in `localStorage`.

## Structure

- `src/routes/*.jsx`: one page per file (`index.jsx` → `/`, `mission.$missionId.jsx` →
  `/mission/$missionId`). `src/routeTree.gen.ts` is generated on every dev/build run — never edit
  or commit it.
- `src/routes/__root.jsx`: the HTML document (`<html>`, `<head>` via `HeadContent`, `<Scripts />`)
  and the `GameProvider` + `Toaster` providers. There is no `index.html`.
- `src/lib/supabase.js`, `src/lib/auth/`: Supabase client (env: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY`, see `.env.example`) and the Google-only sign-in.
- `src/lib/game/`: saves/storage, curriculum, achievements, tutor feedback, sound.
- `src/lib/c/`: the in-browser C engine (`runC`, `evaluateChecks`) and highlighter.
- `src/components/game/` and `src/components/arena/`: campaign and mission UI.
- `src/components/ui/`: the few shadcn/ui primitives the game uses (button, dialog, input, sonner).
  `src/index.css` + `tailwind.config.js`: design tokens.
- `src/server.js`: the Worker entry (`main` in `wrangler.jsonc`). Keep it.

## Rules

- Write JavaScript/JSX only — no `.ts`/`.tsx` files and no type annotations (the generated
  `src/routeTree.gen.ts` is the sole exception).
- Pages that read saved progress use `ssr: false` (all current pages do), because the Supabase
  session only exists in the browser.
- Sign-in is Google only (`signInWithOAuth({ provider: "google" })`). Don't add other providers.
- Schema changes go in a new file under `supabase/migrations/`, with RLS enabled and owner-only policies.
- Server and first client render must match: read `window`, `document` and browser storage only in
  effects and handlers, and format dates and numbers with an explicit locale and time zone.
- Keep `vite.config.js` plugins in order: `cloudflare()`, `tanstackStart()`, `react()`.
- Run `npm run lint` before finishing code changes.
- Never commit `dist`, `.wrangler`, `.tanstack` or `src/routeTree.gen.ts`.
