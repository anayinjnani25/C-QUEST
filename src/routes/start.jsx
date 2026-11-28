import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import ThemeToggle from "@/components/game/ThemeToggle";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useGame } from "@/lib/game/GameProvider";
import { HEROES, heroById } from "@/lib/game/heroes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/start")({
  ssr: false,
  head: () => ({ meta: [{ title: "Choose Your Character — C//QUEST" }] }),
  component: StartPage,
});

const monoLabel = "font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft";

// Onboarding: a new player types a name, then picks a hero. A player whose save predates heroes
// lands straight on the hero step.
function StartPage() {
  const { ready, activeSave, createSave, chooseHero } = useGame();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("name");
  const [name, setName] = useState("");
  const [heroId, setHeroId] = useState(null);

  const needsHeroOnly = Boolean(activeSave && !activeSave.hero);

  useEffect(() => {
    if (authLoading || !ready) return;
    if (!user) navigate({ to: "/" });
    else if (activeSave?.hero) navigate({ to: "/map" });
  }, [authLoading, ready, user, activeSave, navigate]);

  if (authLoading || !ready || !user || activeSave?.hero) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink">Loading…</p>
      </div>
    );
  }

  const showHeroes = needsHeroOnly || step === "hero";
  const playerName = needsHeroOnly ? activeSave.name : name.trim() || "Operator";

  const confirm = () => {
    if (!heroId) return;
    if (needsHeroOnly) chooseHero(heroId);
    else createSave(playerName, heroId);
    navigate({ to: "/map" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dots opacity-40" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-8 pt-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#58CC02] font-mono text-[15px] font-bold text-white shadow-[0_3px_0_#46A302]">
              C
            </span>
            <span className="text-[16px] font-extrabold tracking-tight text-ink">
              C<span className="text-[#58CC02]">//</span>QUEST
            </span>
          </Link>
          <ThemeToggle className="rounded-full" />
        </header>

        {!needsHeroOnly && (
          <ol className="mt-8 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em]" aria-label="Steps">
            <StepDot n={1} label="Your name" active={!showHeroes} done={showHeroes} />
            <span className="h-px w-8 bg-frame" />
            <StepDot n={2} label="Your character" active={showHeroes} />
          </ol>
        )}

        {showHeroes ? (
          <HeroStep
            playerName={playerName}
            heroId={heroId}
            onPick={setHeroId}
            onBack={needsHeroOnly ? null : () => setStep("name")}
            onConfirm={confirm}
            returning={needsHeroOnly}
          />
        ) : (
          <NameStep name={name} setName={setName} onNext={() => setStep("hero")} />
        )}
      </div>
    </div>
  );
}

function StepDot({ n, label, active, done }) {
  return (
    <li className={cn("flex items-center gap-2", active || done ? "text-ink" : "text-ink-faint")}>
      <span
        className={cn(
          "grid h-6 w-6 place-items-center rounded-full border-2 text-[11px] font-bold",
          done
            ? "border-[#58CC02] bg-[#58CC02] text-white"
            : active
              ? "border-[#58CC02] text-brand-ink"
              : "border-frame"
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={3.5} /> : n}
      </span>
      {label}
    </li>
  );
}

function NameStep({ name, setName, onNext }) {
  return (
    <main className="anim-fade-up mx-auto mt-10 w-full max-w-md flex-1">
      <p className={monoLabel}>new adventure · C programming</p>
      <h1 className="mt-2 text-[34px] font-extrabold leading-tight tracking-tight text-ink sm:text-[40px]">
        What should we call you?
      </h1>
      <p className="mt-2 text-[14px] font-semibold text-ink-soft">
        This is the name your hero carries through all six worlds.
      </p>

      <form
        className="mt-7 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <label htmlFor="player-name" className="sr-only">
          Your name
        </label>
        <Input
          id="player-name"
          autoFocus
          value={name}
          maxLength={18}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nova"
          className="h-14 rounded-2xl border-2 border-frame bg-card px-4 text-[17px] font-bold text-ink placeholder:font-semibold placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-0"
        />
        <button type="submit" className="btn-game group flex h-14 w-full items-center justify-center gap-2 text-[16px]">
          Choose your character
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={3} />
        </button>
      </form>
    </main>
  );
}

function HeroStep({ playerName, heroId, onPick, onBack, onConfirm, returning }) {
  const picked = heroId ? heroById(heroId) : null;

  return (
    <main className="mt-8 flex-1 pb-24 sm:pb-0">
      <div className="anim-fade-up">
      <p className={monoLabel}>{returning ? "one more thing" : `welcome, ${playerName}`}</p>
      <h1 className="mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[40px]">
        Choose your character
      </h1>
      <p className="mt-2 max-w-xl text-[14px] font-semibold text-ink-soft">
        {returning && "Heroes have arrived in C//QUEST. Pick the one who fights for you; your progress stays as it is. "}
        Your hero is yours for this whole adventure. Every hero hits just as hard and levels just as fast; only
        the fighting style changes.
      </p>

      <div role="radiogroup" aria-label="Characters" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {HEROES.map((hero, i) => {
          const selected = hero.id === heroId;
          return (
            <button
              key={hero.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onPick(hero.id)}
              className={cn(
                "group relative overflow-hidden rounded-[22px] border-2 bg-card text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58CC02]",
                selected
                  ? "-translate-y-1 border-[#58CC02] shadow-[0_5px_0_#46A302]"
                  : "border-frame shadow-[0_3px_0_hsl(var(--frame))] hover:-translate-y-0.5"
              )}
              style={{ "--hero": hero.color }}
            >
              <div
                className="relative h-[180px] overflow-hidden sm:h-[230px]"
                style={{
                  background: `radial-gradient(120% 80% at 50% 100%, ${hero.color}55, transparent 70%), linear-gradient(180deg, hsl(var(--tile)), hsl(var(--card)))`,
                }}
              >
                <img
                  src={hero.image}
                  alt=""
                  loading={i < 3 ? "eager" : "lazy"}
                  className={cn(
                    "absolute inset-x-0 bottom-0 mx-auto h-[94%] w-full object-contain object-bottom drop-shadow-[0_6px_8px_rgb(0_0_0/0.3)] transition-transform duration-300",
                    selected ? "scale-[1.04]" : "group-hover:scale-[1.03]"
                  )}
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Hero {i + 1}
                </span>
                {selected && (
                  <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-[#58CC02] text-white shadow-[0_2px_0_#46A302]">
                    <Check className="h-4 w-4" strokeWidth={3.5} />
                  </span>
                )}
              </div>
              <div className="border-t-2 border-frame px-3 py-2.5 sm:px-3.5 sm:py-3">
                <p className="text-[14px] font-extrabold leading-tight text-ink sm:text-[15px]">{hero.name}</p>
                <p className="mt-1 text-[11.5px] font-semibold leading-snug text-ink-soft sm:text-[12px]">
                  <span aria-hidden className="mr-1">
                    {hero.emoji}
                  </span>
                  {hero.style}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-frame bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0">
        {onBack && (
          <button type="button" onClick={onBack} className="btn-ghost inline-flex h-14 items-center gap-2 px-5 text-[15px]">
            <ArrowLeft className="h-4 w-4" strokeWidth={3} />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={!picked}
          className="btn-game group inline-flex h-14 flex-1 items-center justify-center gap-2 px-6 text-[16px] disabled:opacity-50 sm:flex-none"
        >
          {picked ? `Play as ${picked.name}` : "Pick a hero"}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={3} />
        </button>
      </div>
    </main>
  );
}
