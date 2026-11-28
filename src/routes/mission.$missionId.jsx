import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Check, Code2, Crown, Lock, Play, RotateCcw, Sparkles, Swords } from "lucide-react";
import { toast } from "sonner";
import AmbientBackground from "@/components/game/AmbientBackground";
import BriefingPanel from "@/components/arena/BriefingPanel";
import ThemeToggle from "@/components/game/ThemeToggle";
import CodeEditor from "@/components/arena/CodeEditor";
import Terminal from "@/components/arena/Terminal";
import MemoryViewer from "@/components/arena/MemoryViewer";
import BossBattle, { BOSS_STRIKE, HERO_MAX_HP } from "@/components/arena/BossBattle";
import ChecksPanel from "@/components/arena/ChecksPanel";
import TutorPanel from "@/components/arena/TutorPanel";
import VictoryOverlay from "@/components/arena/VictoryOverlay";
import { useGame } from "@/lib/game/GameProvider";
import { canSkipMission, isMissionUnlocked, missionById, nextMission } from "@/lib/game/curriculum";
import { readDraft, writeDraft } from "@/lib/game/storage";
import { evaluateChecks, runC } from "@/lib/c/engine";
import { buildTutorFeedback } from "@/lib/game/tutor";
import { sfx } from "@/lib/game/sound";
import { WORLD_ART, WORLD_ART_FALLBACK } from "@/lib/game/worldArt";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mission/$missionId")({
  ssr: false,
  head: () => ({ meta: [{ title: "Quest — C//QUEST" }] }),
  component: MissionPage,
});

const TABS = [
  ["brief", "Quest", BookOpen],
  ["code", "Code", Code2],
  ["memory", "Magic", Sparkles],
];

const BOSS_TABS = [
  ["brief", "Quest", BookOpen],
  ["code", "Code", Code2],
  ["memory", "Battle", Swords],
];

// How long the final blow plays before the victory screen covers the battle.
const FINAL_BLOW_MS = 1700;
// How long a knocked-down hero stays down before getting back up with full HP.
const KO_MS = 2300;

const freshBattle = (hits = 0) => ({ hero: HERO_MAX_HP, hits, event: null, seq: 0 });

function MissionPage() {
  const { missionId } = Route.useParams();
  const navigate = useNavigate();
  const { ready, activeSave, progress, completeMission, completeBossPart } = useGame();
  const mission = useMemo(() => missionById(missionId), [missionId]);
  const parts = mission?.parts || null;
  const [partIndex, setPartIndex] = useState(0);
  // Attempts and hints across every program of a boss quest, for its star rating.
  const [tally, setTally] = useState({ attempts: 0, hints: 0 });
  // The program being solved: a boss quest swaps in the current part's goal, code and checks.
  const active = useMemo(
    () => (mission && parts ? { ...mission, ...(parts[partIndex] || parts[0]), title: mission.title } : mission),
    [mission, parts, partIndex]
  );
  const draftKey = mission ? (parts && partIndex > 0 ? `${mission.id}.p${partIndex + 1}` : mission.id) : null;
  const bossDone = Boolean(mission && progress?.missions?.[mission.id]);
  const solvedParts = useMemo(() => {
    if (!parts) return [];
    if (bossDone) return parts.map((_, i) => i);
    return progress?.bossParts?.[mission.id] || [];
  }, [parts, bossDone, progress?.bossParts, mission?.id]);

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [victory, setVictory] = useState(null);
  const [tab, setTab] = useState("code");
  // Boss quests only: the hero's HP, hits landed on the boss, and the latest exchange to animate.
  const [battle, setBattle] = useState(freshBattle);
  const timers = useRef([]);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // A knocked-down hero gets back up with full HP after a short pause.
  useEffect(() => {
    if (!battle.event?.ko) return undefined;
    const seq = battle.seq;
    const t = setTimeout(() => {
      setBattle((b) => (b.seq === seq ? { ...b, hero: HERO_MAX_HP, event: { type: "revive" }, seq: b.seq + 1 } : b));
    }, KO_MS);
    return () => clearTimeout(t);
  }, [battle.event, battle.seq]);

  const snapshots = useMemo(() => result?.snapshots || [], [result]);

  useEffect(() => {
    if (ready && !activeSave) navigate({ to: "/" });
    else if (ready && !activeSave.hero) navigate({ to: "/start" });
  }, [ready, activeSave, navigate]);

  // Opening a quest: a boss quest resumes at its first unsolved program.
  useEffect(() => {
    if (!mission || !activeSave) return;
    const done = progress?.bossParts?.[mission.id] || [];
    const firstOpen = parts && !progress?.missions?.[mission.id] ? parts.findIndex((_, i) => !done.includes(i)) : 0;
    setPartIndex(Math.max(0, firstOpen));
    setTally({ attempts: 0, hints: 0 });
    setVictory(null);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // A replayed boss starts at full health; otherwise every solved program has already landed a hit.
    setBattle(freshBattle(progress?.missions?.[mission.id] ? 0 : done.length));
    setTab(typeof window !== "undefined" && window.innerWidth < 1024 ? "brief" : "code");
    // Only when the quest or the save changes, not on every progress update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission?.id, activeSave?.id]);

  useEffect(() => {
    if (!active || !activeSave) return;
    let cancelled = false;
    const starter = active.starter;
    setCode(starter);
    // The saved draft arrives from Supabase a moment later; keep any typing done meanwhile.
    readDraft(activeSave.id, draftKey).then((draft) => {
      if (!cancelled && draft) setCode((current) => (current === starter ? draft : current));
    });
    setResult(null);
    setEvaluation(null);
    setFeedback(null);
    setAttempts(0);
    setHintsUsed(0);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, activeSave?.id]);

  const finishQuest = (stars, totalAttempts, totalHints) => {
    const replay = Boolean(progress?.missions?.[mission.id]);
    const xp = replay ? Math.round(mission.reward.xp * 0.2) : mission.reward.xp + stars * 5;
    const coins = replay ? 0 : mission.reward.coins + (stars === 3 ? 10 : 0);
    const { newly } = completeMission(mission.id, {
      stars,
      xp,
      coins,
      attempts: totalAttempts,
      hints: totalHints,
    });
    sfx.success();
    setFeedback(null);
    const show = () => setVictory({ stars, xp, coins, newly: newly || [] });
    // In a boss quest the final blow plays out before the victory screen.
    if (parts) later(show, FINAL_BLOW_MS);
    else show();
  };

  const handleRun = () => {
    if (!mission || !activeSave) return;
    sfx.run();
    const res = runC(code);
    const ev = evaluateChecks(active, res, code);
    setResult(res);
    setEvaluation(ev);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    writeDraft(activeSave.id, draftKey, code);

    if (!ev.passed) {
      sfx.fail();
      if (parts) {
        const reason = res.error ? "error" : "wrong";
        setBattle((b) => {
          const hero = Math.max(0, b.hero - BOSS_STRIKE);
          return { ...b, hero, event: { type: "boss", damage: BOSS_STRIKE, reason, ko: hero === 0 }, seq: b.seq + 1 };
        });
      }
      setFeedback(buildTutorFeedback({ result: res, evaluation: ev, mission: active, attempts: nextAttempts }));
      setTab("code");
      return;
    }

    if (!parts) {
      const stars = hintsUsed === 0 && attempts === 0 ? 3 : hintsUsed <= 1 && attempts <= 2 ? 2 : 1;
      finishQuest(stars, nextAttempts, hintsUsed);
      return;
    }

    // Boss quest: every program has to pass before the boss is beaten.
    const totals = { attempts: tally.attempts + nextAttempts, hints: tally.hints + hintsUsed };
    setTally(totals);
    const solved = new Set([...solvedParts, partIndex]);
    const last = partIndex === parts.length - 1;
    const remaining = parts.map((_, i) => i).filter((i) => !solved.has(i));
    // A replayed boss counts as beaten again when its last program passes.
    const beaten = bossDone ? last : remaining.length === 0;
    setBattle((b) => {
      const hits = Math.min(parts.length, beaten ? parts.length : b.hits + 1);
      // Landing a hit also pulls a knocked-down hero back to their feet.
      const hero = b.hero === 0 ? HERO_MAX_HP : b.hero;
      return { ...b, hero, hits, event: { type: "hero", damage: 20, final: beaten }, seq: b.seq + 1 };
    });
    if (beaten) {
      const extra = Math.max(0, totals.attempts - parts.length);
      const stars = totals.hints === 0 && extra === 0 ? 3 : totals.hints <= 2 && extra <= parts.length ? 2 : 1;
      finishQuest(stars, totals.attempts, totals.hints);
      return;
    }
    if (!bossDone) completeBossPart(mission.id, partIndex);
    const next = bossDone ? partIndex + 1 : remaining.find((i) => i > partIndex) ?? remaining[0];
    sfx.success();
    setFeedback(null);
    toast.success(`Program ${partIndex + 1} of ${parts.length} solved`, {
      description: `Next up: ${parts[next].title}`,
    });
    setPartIndex(next);
  };

  const revealHint = () => {
    if (!active) return;
    setHintsUsed((h) => Math.min(h + 1, active.hints.length));
    sfx.click();
  };

  const handleReset = () => {
    if (!mission || !activeSave) return;
    setCode(active.starter);
    setResult(null);
    setEvaluation(null);
    setFeedback(null);
    writeDraft(activeSave.id, draftKey, active.starter);
    sfx.click();
  };

  if (!ready || !activeSave) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Loading your quest…</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="max-w-sm rounded-[28px] border-2 border-frame bg-card p-6 text-center shadow-[0_5px_0_hsl(var(--frame))]">
          <p className="text-lg font-extrabold text-ink">Quest not found</p>
          <p className="mt-1.5 text-[12.5px] font-semibold text-ink-soft">That quest isn't part of this campaign.</p>
          <Link to="/map" className="btn-game mt-4 inline-flex h-11 items-center px-5 text-[13px]">
            Back to the map
          </Link>
        </div>
      </div>
    );
  }

  if (!isMissionUnlocked(mission.id, progress)) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
        <AmbientBackground />
        <div className="relative z-10 max-w-sm rounded-[28px] border-2 border-frame bg-card p-6 text-center shadow-[0_5px_0_hsl(var(--frame))]">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tile text-ink-faint">
            <Lock className="h-6 w-6" strokeWidth={3} />
          </div>
          <p className="mt-3 text-lg font-extrabold text-ink">Quest locked</p>
          <p className="mt-1.5 text-[12.5px] font-semibold leading-relaxed text-ink-soft">
            Clear the quest before this one to open the path.
          </p>
          <Link to="/map" className="btn-game mt-4 inline-flex h-11 items-center px-5 text-[13px]">
            Back to the map
          </Link>
        </div>
      </div>
    );
  }

  const upcoming = nextMission(mission.id);
  const next = upcoming && isMissionUnlocked(upcoming.id, progress) ? upcoming : null;
  const art = WORLD_ART[mission.world] || WORLD_ART_FALLBACK;
  const tabs = parts ? BOSS_TABS : TABS;

  return (
    <div className="quest-theme relative min-h-screen overflow-hidden bg-background text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-cover bg-center opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:opacity-15"
        style={{ backgroundImage: `url(${art.image})` }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-3 pb-16 pt-3 sm:px-5">
        <QuestBanner
          mission={mission}
          art={art}
          onReset={handleReset}
          onRun={handleRun}
        />

        {parts ? (
          <BossProgress
            parts={parts}
            current={partIndex}
            solved={solvedParts}
            open={bossDone}
            onSelect={(i) => {
              if (i === partIndex) return;
              sfx.click();
              setTally((t) => ({ attempts: t.attempts + attempts, hints: t.hints + hintsUsed }));
              setPartIndex(i);
            }}
          />
        ) : null}

        <div className="quest-card mt-3 flex gap-1 p-1 lg:hidden">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2 text-[12px] font-extrabold transition-all",
                tab === id ? "btn-gold" : "text-ink-soft"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,340px)] lg:gap-4">
          <div className={cn("space-y-3", tab !== "brief" && "hidden lg:block")}>
            <BriefingPanel
              mission={active}
              hintsUsed={hintsUsed}
              onRevealHint={revealHint}
              skippable={canSkipMission(mission.id, progress)}
              onSkip={() =>
                navigate({ to: "/mastery/$challengeId", params: { challengeId: `topic-${mission.id}` } })
              }
            />
          </div>

          <div className={cn("space-y-3", tab !== "code" && "hidden lg:block")}>
            <CodeEditor value={code} onChange={setCode} onRun={handleRun} />
            <Terminal result={result} />
            <TutorPanel
              feedback={feedback}
              hints={active.hints}
              hintsUsed={hintsUsed}
              onRevealHint={revealHint}
            />
          </div>

          <div className={cn("space-y-3", tab !== "memory" && "hidden lg:block")}>
            {parts ? (
              <BossBattle
                heroId={activeSave.hero}
                worldId={mission.world}
                backdrop={art.image}
                total={parts.length}
                current={partIndex}
                solved={solvedParts}
                hits={battle.hits}
                heroHp={battle.hero}
                event={battle.event}
                seq={battle.seq}
              />
            ) : (
              <MemoryViewer snapshots={snapshots} />
            )}
            <ChecksPanel mission={active} evaluation={evaluation} />
          </div>
        </div>
      </div>

      <VictoryOverlay
        victory={victory}
        mission={mission}
        next={next}
        onNext={() => {
          if (!next) return;
          setVictory(null);
          navigate({ to: "/mission/$missionId", params: { missionId: next.id } });
        }}
        onMap={() => navigate({ to: "/map" })}
      />
    </div>
  );
}
function CrestIcon({ className }) {
  return (
    <svg viewBox="0 0 48 54" className={className} aria-hidden>
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.55" stopColor="#f0a82a" />
          <stop offset="1" stopColor="#a8650c" />
        </linearGradient>
        <linearGradient id="crest-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a1a" />
          <stop offset="1" stopColor="#1c130b" />
        </linearGradient>
      </defs>
      <path d="M24 1 L46 8 L44 30 Q40 46 24 53 Q8 46 4 30 L2 8Z" fill="url(#crest-gold)" />
      <path d="M24 6 L41 11.5 L39.5 29.5 Q36 42 24 48 Q12 42 8.5 29.5 L7 11.5Z" fill="url(#crest-face)" />
      <path
        d="M31 18.5 Q28 15 23.5 15.5 Q16 16.5 16 27 Q16 37 24 37.5 Q28.5 37.5 31 34"
        stroke="url(#crest-gold)"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function QuestBanner({ mission, art, onReset, onRun }) {
  return (
    <header className="sticky top-2 z-30 overflow-hidden rounded-[22px] border-2 border-[#c99a3b]/45 bg-[#140f0a] shadow-[0_4px_0_rgb(0_0_0/0.35),0_18px_40px_-24px_rgb(0_0_0/0.9)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${art.image})`, backgroundPosition: art.thumb?.position || "50% 30%" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#120c07]/95 via-[#120c07]/55 to-[#120c07]/90" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[#e2b450] to-transparent" />

      <div className="relative flex items-center gap-2.5 px-2.5 py-2.5 sm:gap-3 sm:px-3.5">
        <Link
          to="/map"
          className="banner-btn grid h-10 w-10 shrink-0 place-items-center rounded-full"
          aria-label="Back to the map"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={3} />
        </Link>

        <CrestIcon className="hidden h-12 w-11 shrink-0 drop-shadow-[0_3px_4px_rgb(0_0_0/0.6)] sm:block" />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-white/75">
            {mission.boss ? <Crown className="h-3 w-3 text-[#ffd45a]" fill="currentColor" strokeWidth={0} /> : null}
            {mission.worldName} · {mission.boss ? "boss quest" : `quest ${mission.order}`}
          </p>
          <p className="truncate font-display text-[16px] font-extrabold text-white [text-shadow:0_2px_4px_rgb(0_0_0/0.7)] sm:text-[19px]">
            {mission.title}
          </p>
        </div>

        <ThemeToggle className="banner-btn hidden rounded-full border-[1.5px] sm:grid" />

        <button
          type="button"
          onClick={onReset}
          className="banner-btn hidden h-10 items-center gap-1.5 rounded-full px-4 text-[12px] font-extrabold sm:flex"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={3} />
          Reset
        </button>

        <button type="button" onClick={onRun} className="btn-gold flex h-10 items-center gap-1.5 px-5 text-[14px]">
          Run
          <Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </header>
  );
}

function BossProgress({ parts, current, solved, open, onSelect }) {
  const done = new Set(solved);
  const firstOpen = parts.findIndex((_, i) => !done.has(i));
  // Solved programs and the next two are open; the rest stay sealed until the boss weakens.
  const reachable = (i) => open || firstOpen === -1 || done.has(i) || i <= firstOpen + 1;
  return (
    <div className="quest-card mt-3 px-3 py-3 sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-ink">
          <Crown className="h-3.5 w-3.5 shrink-0 text-gold" fill="currentColor" strokeWidth={0} />
          <span className="truncate">
            Program {current + 1} of {parts.length} · {parts[current].title}
          </span>
        </p>
        <p className="shrink-0 text-[11px] font-extrabold text-ink-soft">
          {done.size}/{parts.length} solved
        </p>
      </div>
      <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {parts.map((part, i) => {
          const locked = !reachable(i) && i !== current;
          return (
            <button
              key={part.title}
              type="button"
              disabled={locked}
              onClick={() => onSelect(i)}
              title={locked ? "Solve the earlier programs first" : part.title}
              aria-label={`Program ${i + 1}: ${part.title}${done.has(i) ? " (solved)" : locked ? " (locked)" : ""}`}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "flex h-10 items-center justify-center gap-1 rounded-2xl border-2 text-[14px] font-extrabold transition-all",
                i === current
                  ? "step-current border-[#a3e635] bg-[#a3e635]/10 text-ink"
                  : done.has(i)
                    ? "border-gold/50 bg-gold/12 text-gold-ink hover:bg-gold/20"
                    : locked
                      ? "cursor-not-allowed border-frame bg-tile text-ink-faint"
                      : "border-frame bg-tile text-ink-soft hover:bg-hover hover:text-ink"
              )}
            >
              {done.has(i) && i !== current ? <Check className="h-3.5 w-3.5" strokeWidth={4} /> : null}
              {locked ? <Lock className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
