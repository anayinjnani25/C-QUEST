import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { toast } from "sonner";
import MapNav from "@/components/game/map/MapNav";
import MasteryGate from "@/components/game/map/MasteryGate";
import WorldCard from "@/components/game/map/WorldCard";
import WorldPicker from "@/components/game/map/WorldPicker";
import WorldStage from "@/components/game/map/WorldStage";
import { useGame } from "@/lib/game/GameProvider";
import {
  WORLDS,
  activeWorld,
  currentMission,
  isMissionUnlocked,
  isWorldComplete,
  isWorldMastered,
  isWorldUnlocked,
} from "@/lib/game/curriculum";
import { WORLD_ART, WORLD_ART_FALLBACK } from "@/lib/game/worldArt";

export const Route = createFileRoute("/map")({
  ssr: false,
  head: () => ({ meta: [{ title: "The Campaign — C//QUEST" }] }),
  component: MapPage,
});

function TipCard({ world, locked, complete }) {
  const isFinalWorld = world.index === WORLDS[WORLDS.length - 1].index;
  const text = locked
    ? `Beat the World ${world.index - 1} boss quest to play these quests.`
    : complete
      ? isFinalWorld
        ? "World complete. You've finished the campaign!"
        : "World complete. The next world is open!"
      : isFinalWorld
        ? "Beat the boss quest's 5 programs to finish the campaign!"
        : "Beat the boss quest's 5 programs to unlock the next world!";

  return (
    <div className="pointer-events-auto flex max-w-[280px] items-center gap-3 rounded-[18px] bg-[#FBF3DF]/95 px-4 py-3 shadow-[0_8px_20px_rgba(30,40,20,0.22)]">
      <Trophy className="h-8 w-8 shrink-0 text-[#F0B400] drop-shadow-[0_1px_0_#B98400]" fill="currentColor" strokeWidth={1.5} stroke="#C99400" />
      <p className="text-[13px] font-semibold leading-snug text-[#3A3328]">{text}</p>
      {!complete && <Lock className="h-7 w-7 shrink-0 text-[#8E887C]" strokeWidth={2.6} />}
    </div>
  );
}

function MapPage() {
  const { ready, activeSave, progress } = useGame();
  const navigate = useNavigate();
  const [pickedWorldId, setPickedWorldId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Saves from before heroes existed pick one before playing on.
  useEffect(() => {
    if (ready && !activeSave) navigate({ to: "/" });
    else if (ready && !activeSave.hero) navigate({ to: "/start" });
  }, [ready, activeSave, navigate]);

  if (!ready || !activeSave || !activeSave.hero) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#8ED8F8] dark:bg-[#0F1A20]">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink">
          Loading your adventure…
        </p>
      </div>
    );
  }

  const current = currentMission(progress);
  const focus = activeWorld(progress);
  const world = WORLDS.find((w) => w.id === pickedWorldId) || focus || WORLDS[0];
  const art = WORLD_ART[world.id] || WORLD_ART_FALLBACK;
  const unlocked = isWorldUnlocked(world.id, progress);
  const mastered = isWorldMastered(world.id, progress);
  const complete = isWorldComplete(world.id, progress);

  const openMission = (id) => {
    if (!isMissionUnlocked(id, progress)) {
      toast("That quest is still locked", { description: "Clear the quest before it first." });
      return;
    }
    navigate({ to: "/mission/$missionId", params: { missionId: id } });
  };

  return (
    <div className="map-light relative min-h-screen overflow-hidden bg-[#8ED8F8]">
      <MapNav />

      <div className="relative z-20 mt-2 px-3 sm:hidden">
        <WorldCard
          world={world}
          progress={progress}
          unlocked={unlocked}
          compact
          onOpenWorlds={() => setPickerOpen(true)}
        />
      </div>

      <div className="relative z-10 mt-2 h-[78svh] min-h-[560px] sm:absolute sm:inset-0 sm:mt-0 sm:h-full sm:min-h-0">
        <WorldStage
          world={world}
          art={art}
          progress={progress}
          current={current}
          onOpenMission={openMission}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden justify-center px-4 sm:flex">
          <MasteryGate world={world} complete={complete} mastered={mastered} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden items-end justify-between px-4 sm:flex">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="pointer-events-auto flex items-center gap-3 rounded-[20px] bg-[#FBF6EA] py-3 pl-3 pr-6 text-[17px] font-extrabold text-[#2E2A22] shadow-[0_6px_16px_rgba(30,40,20,0.25)] transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={3.2} />
            Back to Worlds
          </button>

          <TipCard world={world} locked={!unlocked} complete={complete} />
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-[14px] bg-card px-3 py-2 text-[12px] font-extrabold text-ink shadow-[0_6px_16px_rgba(30,40,20,0.25)] sm:hidden"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={3.2} />
          Worlds
        </button>
      </div>

      <div className="pointer-events-none absolute left-4 top-[88px] z-20 hidden sm:block">
        <WorldCard
          world={world}
          progress={progress}
          unlocked={unlocked}
          onOpenWorlds={() => setPickerOpen(true)}
        />
      </div>

      <div className="relative z-20 mx-3 mb-6 mt-3 flex flex-col items-center gap-2 sm:hidden">
        <MasteryGate world={world} complete={complete} mastered={mastered} />
        <TipCard world={world} locked={!unlocked} complete={complete} />
      </div>

      <WorldPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        worlds={WORLDS}
        activeId={world.id}
        progress={progress}
        onSelect={setPickedWorldId}
      />
    </div>
  );
}
