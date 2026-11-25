# C//QUEST: Supabase + Google sign-in setup

Project: `https://gxzzhbqqqmaakwspdpat.supabase.co`
Supabase callback URL (you'll paste this into Google): `https://gxzzhbqqqmaakwspdpat.supabase.co/auth/v1/callback`

Do the four parts in order. Total time: about 15 minutes.

## 1. Create the database tables (Supabase): already done for gxzzhbqqqmaakwspdpat

1. Open https://supabase.com/dashboard/project/gxzzhbqqqmaakwspdpat/sql/new
2. Open `supabase/migrations/20261125000000_cquest_init.sql` from this project, copy all of it, paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned".
4. Check **Table Editor**: you now have `saves`, `player_settings` and `drafts`, each marked "RLS enabled".

## 2. Create Google OAuth credentials (Google Cloud)

1. Go to https://console.cloud.google.com/ and sign in.
2. Top bar project picker > **New project** > name it `C-QUEST` > **Create**, then select it.
3. Left menu > **APIs & Services** > **OAuth consent screen** (this opens **Google Auth Platform**). Click **Get started**.
   - App name: `C//QUEST`. User support email: your email. **Next**.
   - Audience: **External**. **Next**.
   - Contact email: your email. **Next**, tick the policy box, **Create**.
4. **Branding** (left menu): under **Authorized domains** add `supabase.co` (and `github.io` if you host on GitHub Pages). **Save**.
5. **Data Access** > **Add or remove scopes**: tick `.../auth/userinfo.email`, `.../auth/userinfo.profile` and `openid`. **Update** > **Save**.
6. **Clients** > **Create client**:
   - Application type: **Web application**. Name: `C-QUEST web`.
   - **Authorized JavaScript origins**: add
     - `http://localhost:5173`
     - `http://localhost:3000`
     - `https://anayinjnani25.github.io` (the live site)
   - **Authorized redirect URIs**: add exactly
     `https://gxzzhbqqqmaakwspdpat.supabase.co/auth/v1/callback`
   - Click **Create**. Copy the **Client ID** and **Client secret** (keep the secret private).
7. **Audience**: while the app is in **Testing**, only the Google accounts you add under **Test users** can sign in. Add yours now. When you want anyone to sign in, click **Publish app** (basic email/profile scopes don't need Google review).

## 3. Turn on Google in Supabase Auth

1. Open https://supabase.com/dashboard/project/gxzzhbqqqmaakwspdpat/auth/providers
2. Click **Google** > toggle **Enable Sign in with Google** on.
3. Paste the **Client ID** and **Client Secret** from step 2.6. **Save**.
4. Google only: on the same page open **Email** and toggle it **off**, then **Save**. (The site only shows "Continue with Google", and this stops anyone creating email accounts through the API.)
5. Open https://supabase.com/dashboard/project/gxzzhbqqqmaakwspdpat/auth/url-configuration
   - **Site URL**: your live site, `https://anayinjnani25.github.io/C-QUEST/`.
   - **Redirect URLs** > **Add URL**, add each of:
     - `http://localhost:5173/**`
     - `http://127.0.0.1:5173/**`
     - `http://localhost:3000/**`
     - `https://anayinjnani25.github.io/C-QUEST/**`
   - **Save**.

## 4. Run it

```bash
npm install          # pulls in @supabase/supabase-js
npm run dev
```

Open the URL Vite prints, click **Continue with Google**, pick your account, and you land back on the title screen signed in. Create a run, finish a quest, then check **Table Editor > saves** in Supabase: your row is there.

Optional: create `.env` from `.env.example` to point at a different Supabase project. Without it, the app uses the project above.

## Troubleshooting

- **"redirect_uri_mismatch"** from Google: the redirect URI in step 2.6 must be exactly `https://gxzzhbqqqmaakwspdpat.supabase.co/auth/v1/callback`.
- **"Unsupported provider: provider is not enabled"**: step 3.2 wasn't saved.
- **You land on the Site URL instead of the page you started on**: that URL is missing from Redirect URLs (step 3.5).
- **"Access blocked: app is in testing"**: add the account as a test user, or publish the app (step 2.7).
- **"Couldn't load your saves"** toast after sign-in: the SQL in part 1 hasn't been run.
