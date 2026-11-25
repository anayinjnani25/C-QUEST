-- C//QUEST: game data for signed-in players.
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- Every table is owned per user and locked down with row-level security, so a
-- player can only ever read or change their own rows.

-- One row per campaign run ("save slot").
create table if not exists public.saves (
  id          text primary key check (char_length(id) between 1 and 80),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null default 'Operator' check (char_length(name) <= 60),
  glyph       text not null default '✦' check (char_length(glyph) <= 8),
  progress    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists saves_user_id_idx on public.saves (user_id);

-- Per-player settings: which save is active, and sound on/off.
create table if not exists public.player_settings (
  user_id        uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  active_save_id text references public.saves (id) on delete set null,
  sound          boolean not null default true,
  updated_at     timestamptz not null default now()
);
create index if not exists player_settings_active_save_idx on public.player_settings (active_save_id);

-- The code a player last ran in a quest or mastery challenge, per save.
create table if not exists public.drafts (
  save_id     text not null references public.saves (id) on delete cascade,
  draft_key   text not null check (char_length(draft_key) <= 120),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  code        text not null default '' check (char_length(code) <= 100000),
  updated_at  timestamptz not null default now(),
  primary key (save_id, draft_key)
);
create index if not exists drafts_user_id_idx on public.drafts (user_id);

-- Keep updated_at current on every write.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists saves_touch on public.saves;
create trigger saves_touch before update on public.saves
  for each row execute function public.touch_updated_at();
drop trigger if exists player_settings_touch on public.player_settings;
create trigger player_settings_touch before update on public.player_settings
  for each row execute function public.touch_updated_at();
drop trigger if exists drafts_touch on public.drafts;
create trigger drafts_touch before update on public.drafts
  for each row execute function public.touch_updated_at();

-- Row-level security: owners only.
alter table public.saves enable row level security;
alter table public.player_settings enable row level security;
alter table public.drafts enable row level security;

drop policy if exists "saves: owner select" on public.saves;
drop policy if exists "saves: owner insert" on public.saves;
drop policy if exists "saves: owner update" on public.saves;
drop policy if exists "saves: owner delete" on public.saves;
create policy "saves: owner select" on public.saves for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "saves: owner insert" on public.saves for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "saves: owner update" on public.saves for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saves: owner delete" on public.saves for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "settings: owner select" on public.player_settings;
drop policy if exists "settings: owner insert" on public.player_settings;
drop policy if exists "settings: owner update" on public.player_settings;
drop policy if exists "settings: owner delete" on public.player_settings;
create policy "settings: owner select" on public.player_settings for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "settings: owner insert" on public.player_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "settings: owner update" on public.player_settings for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "settings: owner delete" on public.player_settings for delete to authenticated
  using ((select auth.uid()) = user_id);

-- A draft may only point at one of the player's own saves.
drop policy if exists "drafts: owner select" on public.drafts;
drop policy if exists "drafts: owner insert" on public.drafts;
drop policy if exists "drafts: owner update" on public.drafts;
drop policy if exists "drafts: owner delete" on public.drafts;
create policy "drafts: owner select" on public.drafts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "drafts: owner insert" on public.drafts for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.saves s where s.id = save_id and s.user_id = (select auth.uid()))
  );
create policy "drafts: owner update" on public.drafts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.saves s where s.id = save_id and s.user_id = (select auth.uid()))
  );
create policy "drafts: owner delete" on public.drafts for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Signed-out visitors get nothing; signed-in players get only what RLS allows.
revoke all on public.saves, public.player_settings, public.drafts from anon;
grant select, insert, update, delete on public.saves, public.player_settings, public.drafts to authenticated;
