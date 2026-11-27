import { Heart, Skull, Swords } from "lucide-react";
import { bossForWorld, HeroSprite } from "@/components/arena/battleSprites";
import { cn } from "@/lib/utils";

export const HERO_MAX_HP = 100;
export const BOSS_STRIKE = 25;

function HpBar({ label, value, max, tone, align = "left", icon: Icon }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const low = pct <= 35;
  return (
    <div className={cn("min-w-0 flex-1", align === "right" && "text-right")}>
      <div
        className={cn(
          "flex items-center gap-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.8)]",
          align === "right" && "justify-end"
        )}
      >
        <Icon className="h-3 w-3" fill="currentColor" strokeWidth={0} />
        <span className="truncate">{label}</span>
        <span className="text-white/60">{Math.round(value)}</span>
      </div>
      <div
        className="mt-1 h-2.5 overflow-hidden rounded-full border border-black/50 bg-black/55 shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)]"
        role="meter"
        aria-label={`${label} health`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
      >
        <div
          className={cn("bt-hp h-full rounded-full", align === "right" && "ml-auto")}
          style={{
            width: `${pct}%`,
            background:
              tone === "boss"
                ? "linear-gradient(90deg,#ff7a59,#e0243a)"
                : low
                  ? "linear-gradient(90deg,#ffb347,#ff4b4b)"
                  : "linear-gradient(90deg,#8ee64a,#46b302)",
          }}
        />
      </div>
    </div>
  );
}

function caption(event, boss, defeated) {
  if (!event) {
    return defeated
      ? `${boss.name} is beaten. Replay any program to keep your skills sharp.`
      : `Solve each program to strike ${boss.name}!`;
  }
  if (event.type === "hero") {
    return event.final
      ? `${boss.name} falls! The way forward is open.`
      : `Direct hit! ${boss.short} loses ${event.damage} HP.`;
  }
  if (event.type === "boss") {
    const why = event.reason === "error" ? "Your spell fizzled" : "Wrong output";
    return event.ko
      ? `${why}, and you are knocked down! Catch your breath…`
      : `${why}! ${boss.short} strikes you for ${event.damage} HP.`;
  }
  return "Back on your feet with full HP. Try again!";
}

export default function BossBattle({ worldId, backdrop, total, current, solved, hits, heroHp, event, seq }) {
  const boss = bossForWorld(worldId);
  const Boss = boss.Sprite;
  const bossMax = total * 20;
  const bossHp = Math.max(0, bossMax - hits * 20);
  const defeated = hits >= total;
  const done = new Set(solved);
  const type = event?.type || null;

  const heroMotion =
    type === "hero" ? "bt-hero-lunge" : type === "boss" ? (event.ko ? "bt-hero-ko" : "bt-hero-hurt") : type === "revive" ? "bt-hero-revive" : "";
  const bossMotion =
    type === "boss" ? "bt-boss-lunge" : type === "hero" ? (event.final ? "bt-boss-defeat" : "bt-boss-hurt") : defeated ? "bt-boss-down" : "";

  return (
    <section className="quest-card p-3.5" aria-label="Boss battle">
      <div className="flex items-center gap-2.5 px-0.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold">
          <Swords className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <p className="font-display text-[16px] font-extrabold text-ink">Boss Battle</p>
        <span className="ml-auto text-[13px] font-extrabold text-ink">
          {Math.min(current + 1, total)} / {total}
        </span>
      </div>

      <div
        className="relative mt-3 h-[230px] overflow-hidden rounded-2xl border-2 border-frame bg-[#120c1c]"
        style={{ "--boss-color": boss.color }}
      >
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-[1px] saturate-[0.7]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d0f33]/80 via-[#1d0f33]/40 to-[#0b0712]/95" />
        <div
          className="absolute -right-6 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
          style={{ background: boss.color }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute inset-x-3 top-2.5 z-20 flex gap-4">
          <HpBar label="You" value={heroHp} max={HERO_MAX_HP} tone="hero" icon={Heart} />
          <HpBar label={boss.short} value={bossHp} max={bossMax} tone="boss" align="right" icon={Skull} />
        </div>

        {/* hero */}
        <div className="absolute bottom-[6%] left-[6%] z-10 aspect-[110/120] h-[52%]">
          <div className="absolute -bottom-1 left-[18%] h-2.5 w-[60%] rounded-full bg-black/50 blur-[2px]" />
          <div key={`hero-${seq}`} className={cn("h-full w-full", heroMotion)}>
            <div className="bt-idle h-full w-full">
              <HeroSprite />
            </div>
          </div>
        </div>

        {/* boss */}
        <div className="absolute bottom-[4%] right-[2%] z-10 aspect-square h-[76%]">
          <div className="absolute -bottom-1 left-[14%] h-3 w-[76%] rounded-full bg-black/55 blur-[2px]" />
          <div key={`boss-${seq}`} className={cn("h-full w-full", bossMotion)}>
            <div className={cn("h-full w-full", !defeated && "bt-idle-boss")}>
              <Boss />
            </div>
          </div>
        </div>

        {/* effects, re-mounted on every exchange so they replay */}
        {type === "hero" ? (
          <div key={`fx-${seq}`} className="pointer-events-none absolute inset-0 z-20">
            <svg viewBox="0 0 100 100" className="absolute bottom-[12%] right-[10%] h-[60%] w-[34%]" aria-hidden>
              <path className="bt-slash" d="M18 12 Q70 30 84 92" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path className="bt-slash bt-slash-2" d="M30 6 Q82 34 90 80" stroke="#ffe27a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <span className="bt-dmg absolute right-[22%] top-[26%] font-display text-[22px] font-extrabold text-[#ffe27a] [text-shadow:0_2px_0_#7a2a00,0_0_10px_rgb(0_0_0/0.8)]">
              -{event.damage}
            </span>
          </div>
        ) : null}
        {type === "boss" ? (
          <div key={`fx-${seq}`} className="pointer-events-none absolute inset-0 z-20">
            <span
              className="bt-orb absolute bottom-[34%] h-6 w-6 rounded-full"
              style={{ background: `radial-gradient(circle, #fff 0%, ${boss.color} 45%, transparent 72%)`, boxShadow: `0 0 18px 6px ${boss.color}` }}
            />
            <span className="bt-dmg absolute left-[12%] top-[30%] font-display text-[22px] font-extrabold text-[#ff6b6b] [text-shadow:0_2px_0_#4a0000,0_0_10px_rgb(0_0_0/0.8)]">
              -{event.damage}
            </span>
            <span className="bt-flash absolute inset-0 bg-[#ff2a2a]" />
          </div>
        ) : null}

        {defeated ? (
          <p className="absolute inset-x-0 bottom-3 z-20 text-center font-display text-[15px] font-extrabold uppercase tracking-[0.2em] text-[#ffe27a] [text-shadow:0_2px_0_#000]">
            Victory
          </p>
        ) : null}
      </div>

      <p className="mx-auto mt-3 min-h-[36px] max-w-[260px] text-center text-[12.5px] font-bold leading-snug text-ink" aria-live="polite">
        {caption(event, boss, defeated)}
      </p>

      <div className="mt-2 flex items-center justify-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border-2 transition-all",
              done.has(i)
                ? "border-gold bg-gold"
                : i === current
                  ? "border-grape bg-grape shadow-[0_0_8px_hsl(var(--grape))]"
                  : "border-ink-faint bg-transparent"
            )}
            title={`Program ${i + 1}${done.has(i) ? " solved" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
