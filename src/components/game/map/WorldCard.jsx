import { ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORLD_ART } from "@/lib/game/worldArt";

export default function WorldCard({ world, progress, unlocked, onOpenWorlds, compact = false }) {
  // The bar counts cleared quests, like the mockups ("0 / 5").
  const clearedCount = world.missions.filter((mission) => progress?.missions?.[mission.id]).length;
  const art = WORLD_ART[world.id];

  return (
    <div
      className={cn(
        "pointer-events-auto w-full rounded-[22px] bg-card/95 p-3 shadow-[0_8px_22px_rgba(30,50,80,0.22)] sm:w-[330px] sm:p-4",
        compact && "p-2.5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] shadow-[0_4px_10px_rgba(30,50,80,0.25)] sm:h-[92px] sm:w-[110px]">
          <img
            src={art?.image || "/images/world-1.jpg"}
            alt=""
            className="h-full w-full object-cover"
            style={{
              objectPosition: art?.thumb?.position || "50% 50%",
              transform: `scale(${art?.thumb?.zoom || 1})`,
              transformOrigin: art?.thumb?.position || "50% 50%",
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className={cn("text-[13px] font-extrabold sm:text-[17px]", unlocked ? "text-[#4CAF0A]" : "text-ink-faint")}>
            World {world.index}
          </p>
          <h2 className="truncate text-[18px] font-extrabold leading-tight text-ink sm:text-[23px]">
            {world.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-ink-soft sm:text-[13px]">
            {unlocked ? world.blurb : "Clear the world before this one to open the trail."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenWorlds}
        className="mt-3 flex w-full items-center gap-2.5 rounded-[14px] bg-[#3A4656] px-3 py-2.5 text-left transition-colors hover:bg-[#323D4B]"
        aria-label="Switch world"
      >
        <Star className="h-6 w-6 text-[#FFC800] drop-shadow-[0_1px_0_#C99400]" fill="currentColor" strokeWidth={0} />
        <span className="text-[15px] font-extrabold text-white">
          {clearedCount} / {world.missions.length}
        </span>
        <ChevronRight className="ml-auto h-4 w-4 text-white/70" strokeWidth={3} />
      </button>
    </div>
  );
}
