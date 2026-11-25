import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  newSave,
  parseImportedSave,
  levelProgress,
  readLegacyStore,
  clearLegacyStore,
} from "@/lib/game/storage";
import { fetchStore, removeSave, saveSettings, storeDraft, upsertSave, upsertSaves } from "@/lib/game/cloud";
import { applyCompletion } from "@/lib/game/achievements";
import { applyMastery } from "@/lib/game/mastery";
import { setSoundEnabled } from "@/lib/game/sound";
import { useAuth } from "@/lib/auth/AuthProvider";

const GameContext = createContext(null);

const EMPTY = { saves: [], activeId: null, settings: { sound: true } };

// Uploads saves made before sign-in existed, the first time a player with no
// cloud saves signs in on this browser.
async function migrateLegacy(userId, cloud) {
  const legacy = readLegacyStore();
  if (!legacy || !legacy.saves.length || cloud.saves.length) return cloud;
  await upsertSaves(legacy.saves);
  for (const d of legacy.drafts) {
    try {
      await storeDraft(d.saveId, d.draftKey, d.code);
    } catch {
      /* drafts are best effort */
    }
  }
  const activeId = legacy.saves.some((s) => s.id === legacy.activeId) ? legacy.activeId : legacy.saves[0].id;
  await saveSettings(userId, { activeId, sound: legacy.settings.sound });
  clearLegacyStore();
  return { saves: legacy.saves, activeId, settings: legacy.settings };
}

export function GameProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id || null;
  const [store, setStore] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  // The store as last written to (or read from) Supabase; writes send only the difference.
  const synced = useRef(EMPTY);
  const queue = useRef(Promise.resolve());

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setReady(false);
    setLoadError(null);
    synced.current = EMPTY;
    setStore(EMPTY);
    if (!userId) {
      setReady(true);
      return;
    }
    (async () => {
      try {
        const loaded = await migrateLegacy(userId, await fetchStore());
        if (cancelled) return;
        synced.current = loaded;
        setStore(loaded);
        setSoundEnabled(loaded.settings?.sound !== false);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err?.message || "Couldn't load your saves.");
        toast.error("Couldn't load your saves from the cloud.");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  // Push every change to Supabase, in order: changed saves, deleted saves, then settings.
  useEffect(() => {
    if (!ready || !userId || loadError) return;
    const before = synced.current;
    if (store === before) return;
    synced.current = store;
    const prevById = new Map(before.saves.map((s) => [s.id, s]));
    const changed = store.saves.filter((s) => prevById.get(s.id) !== s);
    const nextIds = new Set(store.saves.map((s) => s.id));
    const removed = before.saves.filter((s) => !nextIds.has(s.id)).map((s) => s.id);
    const settingsChanged =
      before.activeId !== store.activeId || before.settings?.sound !== store.settings?.sound;
    queue.current = queue.current.then(async () => {
      try {
        for (const save of changed) await upsertSave(save);
        for (const id of removed) await removeSave(id);
        if (settingsChanged || removed.length) {
          await saveSettings(userId, { activeId: store.activeId, sound: store.settings?.sound });
        }
      } catch (err) {
        console.error("C//QUEST sync failed", err);
        toast.error("Couldn't save your progress to the cloud. Check your connection.");
      }
    });
  }, [store, ready, userId, loadError]);

  const activeSave = useMemo(
    () => store.saves.find((s) => s.id === store.activeId) || null,
    [store.saves, store.activeId]
  );

  const createSave = useCallback((name, glyph) => {
    const save = newSave(name, glyph);
    setStore((prev) => ({ ...prev, saves: [save, ...prev.saves], activeId: save.id }));
    return save;
  }, []);

  const selectSave = useCallback((id) => {
    setStore((prev) => ({ ...prev, activeId: id }));
  }, []);

  const deleteSave = useCallback((id) => {
    setStore((prev) => {
      const saves = prev.saves.filter((s) => s.id !== id);
      return { ...prev, saves, activeId: prev.activeId === id ? saves[0]?.id || null : prev.activeId };
    });
  }, []);

  const completeMission = useCallback(
    (missionId, payload) => {
      if (!activeSave) return { newly: [] };
      const { save, newly } = applyCompletion(activeSave, missionId, payload);
      setStore((prev) => ({ ...prev, saves: prev.saves.map((s) => (s.id === save.id ? save : s)) }));
      return { newly };
    },
    [activeSave]
  );

  const completeMastery = useCallback(
    (challenge, payload) => {
      if (!activeSave) return { newly: [], already: true };
      const result = applyMastery(activeSave, challenge, payload);
      if (!result.already) {
        setStore((prev) => ({
          ...prev,
          saves: prev.saves.map((s) => (s.id === result.save.id ? result.save : s)),
        }));
      }
      return result;
    },
    [activeSave]
  );

  const importSave = useCallback((text) => {
    const save = parseImportedSave(text);
    setStore((prev) => ({ ...prev, saves: [save, ...prev.saves], activeId: save.id }));
    return save;
  }, []);

  const toggleSound = useCallback(() => {
    setStore((prev) => {
      const sound = !(prev.settings?.sound !== false);
      setSoundEnabled(sound);
      return { ...prev, settings: { ...prev.settings, sound } };
    });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      loadError,
      saves: store.saves,
      activeSave,
      activeId: store.activeId,
      soundOn: store.settings?.sound !== false,
      progress: activeSave?.progress || null,
      level: levelProgress(activeSave?.progress?.xp || 0),
      createSave,
      selectSave,
      deleteSave,
      completeMission,
      completeMastery,
      importSave,
      toggleSound,
    }),
    [
      ready,
      loadError,
      store.saves,
      activeSave,
      store.activeId,
      store.settings,
      createSave,
      selectSave,
      deleteSave,
      completeMission,
      completeMastery,
      importSave,
      toggleSound,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}