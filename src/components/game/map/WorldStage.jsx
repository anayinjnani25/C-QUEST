import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { WORLDS, isBossSkip, isMissionUnlocked } from "@/lib/game/curriculum";
import QuestStop from "@/components/game/map/QuestStop";
import MapSign from "@/components/game/map/MapSign";

export default function WorldStage({
  world,
  art,
  progress,
  current,
  onOpenMission,
}) {
  const stageRef = useRef(null);
  const scrollRef = useRef(null);
  const ratio = art.ratio;
  const [box, setBox] = useState(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const canvasW = Math.max(w, h * ratio);
      setBox({ w: Math.round(canvasW), h: Math.round(canvasW / ratio) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ratio]);

  const missions = progress?.missions || {};
  const stopList = world.missions.slice(0, art.nodes.length);
  const firstLocked = stopList.findIndex(
    (mission) => !isMissionUnlocked(mission.id, progress),
  );
  // One signpost, beside the first locked quest, at the spot traced for it in the art.
  // In a world that isn't open yet, the sign sits beside Quest 2 and names the world to finish.
  const worldLocked = firstLocked === 0;
  const signPos = firstLocked > 0 ? art.nodes[firstLocked].sign : worldLocked ? art.nodes[1]?.sign : null;
  const signText = worldLocked
    ? `Complete World ${WORLDS[WORLDS.indexOf(world) - 1]?.index} to unlock these quests!`
    : `Complete Quest ${firstLocked} to unlock the next challenge!`;
  // On screens narrower than the art, the map scrolls sideways and starts on the quest to play.
  const focusIndex = Math.max(
    0,
    stopList.findIndex((mission) => mission.id === current?.id),
  );
  const focusX = art.nodes[focusIndex]?.x ?? 50;
  const wide = Boolean(
    box && stageRef.current && box.w > stageRef.current.clientWidth + 1,
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !box) return;
    el.scrollLeft = Math.max(0, (box.w * focusX) / 100 - el.clientWidth / 2);
  }, [box, focusX, world.id]);

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden bg-[#8ED8F8]"
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            wide ? "left-0" : "left-1/2 -translate-x-1/2",
          )}
          style={
            box
              ? { width: box.w, height: box.h }
              : { width: "100%", height: "100%" }
          }
        >
          <img
            src={art.image}
            alt=""
            aria-hidden
            className={cn(
              "anim-map absolute inset-0 h-full w-full select-none object-cover",
              !art.image && "bg-[#8ED8F8]",
            )}
          />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_80%_at_50%_0%,rgba(255,255,255,0.18),transparent_45%)]" />

          {box && (
            <>
              {signPos && (
                <MapSign
                  x={signPos.x}
                  y={signPos.y}
                  text={signText}
                />
              )}

              {stopList.map((mission, i) => {
                const stop = art.nodes[i];
                const record = missions[mission.id];
                const state = record
                  ? "done"
                  : current?.id === mission.id
                    ? "current"
                    : isMissionUnlocked(mission.id, progress)
                      ? "ready"
                      : "locked";
                return (
                  <div
                    key={mission.id}
                    className="absolute"
                    style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  >
                    <QuestStop
                      mission={mission}
                      number={i + 1}
                      state={state}
                      stars={record?.stars || 0}
                      skip={state !== "locked" && isBossSkip(mission.id, progress)}
                      onOpen={() => onOpenMission(mission.id)}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
