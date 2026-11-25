// Reads and writes C//QUEST data in Supabase. Row-level security limits every
// query to the signed-in player's own rows, so no user_id filter is needed for
// safety; user_id is set by the database default (auth.uid()).
import { getSupabase } from "@/lib/supabase";

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase isn't configured.");
  return supabase;
}

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    glyph: row.glyph,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    progress: row.progress || {},
  };
}

function toRow(save) {
  return {
    id: save.id,
    name: save.name,
    glyph: save.glyph,
    progress: save.progress,
    created_at: save.createdAt,
  };
}

export async function fetchStore() {
  const supabase = db();
  const [saves, settings] = await Promise.all([
    supabase.from("saves").select("*").order("updated_at", { ascending: false }),
    supabase.from("player_settings").select("*").maybeSingle(),
  ]);
  if (saves.error) throw saves.error;
  if (settings.error) throw settings.error;
  return {
    saves: (saves.data || []).map(fromRow),
    activeId: settings.data?.active_save_id || null,
    settings: { sound: settings.data ? settings.data.sound !== false : true },
  };
}

export async function upsertSave(save) {
  const { error } = await db().from("saves").upsert(toRow(save));
  if (error) throw error;
}

export async function upsertSaves(saves) {
  if (!saves.length) return;
  const { error } = await db().from("saves").upsert(saves.map(toRow));
  if (error) throw error;
}

export async function removeSave(id) {
  const { error } = await db().from("saves").delete().eq("id", id);
  if (error) throw error;
}

export async function saveSettings(userId, { activeId, sound }) {
  const { error } = await db()
    .from("player_settings")
    .upsert({ user_id: userId, active_save_id: activeId || null, sound: sound !== false });
  if (error) throw error;
}

export async function fetchDraft(saveId, draftKey) {
  const { data, error } = await db()
    .from("drafts")
    .select("code")
    .eq("save_id", saveId)
    .eq("draft_key", draftKey)
    .maybeSingle();
  if (error) throw error;
  return data?.code ?? null;
}

export async function storeDraft(saveId, draftKey, code) {
  const { error } = await db().from("drafts").upsert({ save_id: saveId, draft_key: draftKey, code });
  if (error) throw error;
}
