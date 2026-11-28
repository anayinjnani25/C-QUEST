import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Home, MapPin, Moon, Settings, Star, Sun, Trophy, User, Volume2, VolumeX } from "lucide-react";
import HeroAvatar from "@/components/game/HeroAvatar";
import { useGame } from "@/lib/game/GameProvider";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeProvider";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "World Map", icon: MapPin },
  { to: "/profile", label: "Achievements", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
];

function SettingsMenu({ soundOn, toggleSound }) {
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.type === "keydown" ? event.key === "Escape" : !ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const row =
    "flex w-full items-center gap-2.5 rounded-[11px] px-3 py-2 text-left text-[13px] font-extrabold text-ink transition-colors hover:bg-hover";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center rounded-full bg-card text-ink shadow-[0_4px_14px_rgba(38,60,92,0.16)] transition-transform hover:-translate-y-0.5"
      >
        <Settings className="h-[22px] w-[22px]" fill="currentColor" stroke="hsl(var(--card))" strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 rounded-[16px] bg-card p-1.5 shadow-[0_10px_28px_rgba(20,30,50,0.28)]">
          <button type="button" className={row} onClick={toggleSound}>
            {soundOn ? <Volume2 className="h-4 w-4" strokeWidth={2.6} /> : <VolumeX className="h-4 w-4" strokeWidth={2.6} />}
            Sound {soundOn ? "on" : "off"}
          </button>
          <button type="button" className={row} onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" strokeWidth={2.6} /> : <Moon className="h-4 w-4" strokeWidth={2.6} />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MapNav() {
  const { activeSave, progress, level, soundOn, toggleSound } = useGame();

  return (
    <header className="pointer-events-none relative z-40 flex items-center gap-2.5 px-3 pt-3 sm:gap-3 sm:px-4 sm:pt-4">
      <Link
        to="/"
        className="pointer-events-auto flex shrink-0 items-center gap-2.5 rounded-[16px] bg-card px-2 py-2 shadow-[0_4px_14px_rgba(38,60,92,0.16)] sm:gap-3 sm:rounded-[18px] sm:px-3"
      >
        <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#58CC02] text-[20px] font-extrabold leading-none text-white shadow-[0_3px_0_#46A302] sm:h-10 sm:w-10">
          C
        </span>
        <span className="hidden text-[17px] font-extrabold tracking-[0.02em] text-ink sm:block">C-QUEST</span>
      </Link>

      <nav className="pointer-events-auto hidden items-center gap-1 rounded-[18px] bg-card px-2 py-1.5 shadow-[0_4px_14px_rgba(38,60,92,0.16)] min-[420px]:flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.label === "World Map";
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={cn(
                "relative flex items-center gap-2 rounded-[13px] px-2.5 py-2 text-[14px] font-bold transition-colors sm:px-4",
                active ? "text-[#58CC02]" : "text-ink-soft hover:bg-hover hover:text-ink"
              )}
            >
              <Icon
                className={cn("h-[17px] w-[17px]", active && "text-[#58CC02]")}
                fill={active && tab.label !== "Home" ? "currentColor" : "none"}
                strokeWidth={active ? 0 : 2.6}
              />
              <span className="hidden lg:block">{tab.label}</span>
              {active && (
                <span className="absolute inset-x-2 -bottom-1.5 h-[5px] rounded-full bg-[#58CC02]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-auto ml-auto flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-card py-1.5 pl-2 pr-3.5 shadow-[0_4px_14px_rgba(38,60,92,0.16)]">
          <Star className="h-[26px] w-[26px] text-[#FFC800] drop-shadow-[0_1px_0_#E0A200]" fill="currentColor" strokeWidth={0} />
          <span className="text-[15px] font-extrabold text-ink">{progress?.stars || 0}</span>
        </span>

        <span className="flex items-center gap-2 rounded-full bg-card py-1.5 pl-1.5 pr-3 shadow-[0_4px_14px_rgba(38,60,92,0.16)]">
          {activeSave?.hero && (
            <HeroAvatar
              heroId={activeSave.hero}
              label={activeSave.name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-[#F2B800] bg-[radial-gradient(circle_at_40%_30%,#FFE36B,#FFC21A)] text-[10.5px] font-extrabold leading-none text-[#5C4300]">
            Lv.{level.level}
          </span>
          <span className="hidden h-3 w-24 overflow-hidden rounded-full bg-track md:block">
            <span
              className="block h-full rounded-full bg-[#58CC02]"
              style={{ width: `${Math.max(level.pct, 4)}%` }}
            />
          </span>
        </span>

        <SettingsMenu soundOn={soundOn} toggleSound={toggleSound} />
      </div>
    </header>
  );
}
