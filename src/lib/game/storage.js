import { fetchDraft, storeDraft } from "@/lib/game/cloud";

export const TOTAL_MISSIONS = 30;
export const STORE_KEY = "cquest.store.v1";
export const DRAFT_PREFIX = "cquest.draft.v1.";

export function levelFromXp(xp = 0) {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export function xpForLevel(level) {
  return Math.pow(level - 1, 2) * 100;
}

export function levelProgress(xp = 0) {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const span = Math.max(1, ceiling - floor);
  return {
    level,
    floor,
    ceiling,
    into: Math.max(0, xp - floor),
    needed: ceiling - xp,
    pct: Math.min(100, Math.round(((xp - floor) / span) * 100)),
  };
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

export function updateStreak(streak) {
  const today = todayKey();
  const current = streak || { count: 0, best: 0, last: null };
  if (current.last === today) return current;
  const count = current.last === yesterdayKey() ? (current.count || 0) + 1 : 1;
  return { count, best: Math.max(current.best || 0, count), last: today };
}

export function emptyProgress() {
  return {
    xp: 0,
    coins: 0,
    stars: 0,
    missions: {},
    achievements: {},
    streak: { count: 0, best: 0, last: null },
    startedAt: new Date().toISOString(),
  };
}

export function newSave(name, glyph) {
  const id = `save-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    name: name || "Operator",
    glyph: glyph || "✦",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: emptyProgress(),
  };
}

// Saves made before accounts existed lived in this browser's localStorage.
// On a player's first sign-in they are uploaded to Supabase once, then cleared.
export function readLegacyStore() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const saves = Array.isArray(parsed.saves) ? parsed.saves.filter((s) => s && s.id && s.progress) : [];
    const drafts = [];
    for (const save of saves) {
      const prefix = DRAFT_PREFIX + save.id + ".";
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          drafts.push({ saveId: save.id, draftKey: key.slice(prefix.length), code: window.localStorage.getItem(key) || "" });
        }
      }
    }
    return {
      saves,
      drafts,
      activeId: parsed.activeId || null,
      settings: { sound: parsed.settings?.sound !== false },
    };
  } catch {
    return null;
  }
}

export function clearLegacyStore() {
  if (typeof window === "undefined") return;
  try {
    const doomed = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key === STORE_KEY || key.startsWith(DRAFT_PREFIX))) doomed.push(key);
    }
    doomed.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* storage blocked */
  }
}

// Drafts live in Supabase. Both helpers are async and never throw: a draft is
// a convenience, so a failed read falls back to the starter code.
export async function readDraft(saveId, draftKey) {
  try {
    return await fetchDraft(saveId, draftKey);
  } catch {
    return null;
  }
}

export async function writeDraft(saveId, draftKey, code) {
  try {
    await storeDraft(saveId, draftKey, code);
  } catch {
    /* offline or not signed in */
  }
}

export function completedCount(progress) {
  return Object.keys(progress?.missions || {}).length;
}

export function starsEarned(progress) {
  return Object.values(progress?.missions || {}).reduce((sum, m) => sum + (m.stars || 0), 0);
}

export function serializeSave(save) {
  return JSON.stringify({ format: "cquest-save", version: 1, save }, null, 2);
}

export function parseImportedSave(text) {
  const data = JSON.parse(text);
  const save = data?.save || data;
  if (!save || typeof save !== "object" || !save.progress) {
    throw new Error("That file isn't a C//QUEST save.");
  }
  return {
    id: `save-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: save.name || "Imported",
    glyph: save.glyph || "✦",
    createdAt: save.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: { ...emptyProgress(), ...save.progress },
  };
}