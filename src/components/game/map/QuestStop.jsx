import { Check, ChevronDown, Crown, Lock, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Quest titles are stored in sentence case; the map shows them in title case.
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);

function titleCase(text) {
  return text
    .split(" ")
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word.toLowerCase()) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

// A grey stone disc the quest button sits on, like the pedestals painted in the art.
function Pedestal({ className }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-1/2 -z-10 -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-[#C9C4BA] to-[#8F897E] shadow-[0_4px_0_#6E685E,0_8px_14px_rgba(30,30,20,0.35)]",
        className
      )}
    />
  );
}

// The button is anchored on the centre of its circle; the label hangs below it.
export default function QuestStop({ mission, number, state, stars = 0, skip = false, onOpen }) {
  const boss = Boolean(mission.boss);
  const title = titleCase(mission.title.replace(/^BOSS:\s*/, ""));
  const locked = state === "locked";
  const current = state === "current";
  const done = state === "done";

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={locked}
      aria-label={`${mission.title}${locked ? " (locked)" : skip ? " (beat it to skip this world)" : ""}`}
      className={cn(
        "group absolute left-0 top-0 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center transition-transform duration-200",
        current ? "z-20" : "",
        locked ? "cursor-not-allowed" : "hover:-translate-y-[calc(50%+4px)]"
      )}
    >
      {current && (
        <>
          <span
            aria-hidden
            className="anim-rays pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(255,246,170,0.9)_0deg,rgba(255,255,255,0)_14deg,rgba(255,244,150,0.85)_28deg,rgba(255,255,255,0)_42deg,rgba(255,249,190,0.9)_58deg,rgba(255,255,255,0)_72deg,rgba(255,244,150,0.8)_88deg,rgba(255,255,255,0)_104deg,rgba(255,246,170,0.85)_120deg,rgba(255,255,255,0)_136deg,rgba(255,244,150,0.8)_152deg,rgba(255,255,255,0)_168deg)] opacity-80 blur-[2px] [mask-image:radial-gradient(circle,black_35%,transparent_70%)] sm:h-[210px] sm:w-[210px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,200,0.85),rgba(255,240,150,0)_70%)] sm:h-[130px] sm:w-[130px]"
          />
          <span className="anim-bob absolute bottom-[calc(100%+6px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-[#F2C200] bg-[#FFD833] px-2.5 py-[1px] text-[10px] font-extrabold uppercase tracking-[0.04em] text-[#5C4300] shadow-[0_3px_8px_rgba(120,90,0,0.35)] sm:px-3.5 sm:py-[3px] sm:text-[13px]">
            Current
          </span>
        </>
      )}

      {boss ? (
        <span className="relative grid place-items-center">
          <span
            aria-hidden
            className={cn(
              "absolute left-1/2 top-[58%] -z-10 h-[34px] w-[86px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(214,120,255,0.9),rgba(140,60,230,0.55)_55%,rgba(120,40,220,0)_75%)] blur-[1px] sm:h-[46px] sm:w-[120px]",
              locked && "opacity-70"
            )}
          />
          <span
            aria-hidden
            className={cn(
              "absolute inset-[-8px] -z-10 rounded-full bg-[#B57BFF]/40 blur-[8px]",
              locked && "opacity-60"
            )}
          />
          <span
            className={cn(
              "relative grid h-[54px] w-[54px] place-items-center rounded-full border-[4px] border-[#E6D3FF] bg-gradient-to-b from-[#A672F0] to-[#6B37C4] shadow-[0_0_18px_rgba(170,100,255,0.75),0_5px_0_#4F2596] sm:h-[74px] sm:w-[74px] sm:border-[5px]",
              done && "border-[#FFE27A]"
            )}
          >
            <Crown
              className="h-7 w-7 text-[#FFD233] drop-shadow-[0_2px_0_rgba(120,70,0,0.55)] sm:h-10 sm:w-10"
              fill="currentColor"
              strokeWidth={1.4}
              stroke="#C98A00"
            />
            {locked && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#8E887C] text-white sm:h-6 sm:w-6">
                <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3.5} />
              </span>
            )}
          </span>
        </span>
      ) : locked ? (
        <span className="relative grid place-items-center">
          <Pedestal className="top-[46%] h-[34px] w-[64px] sm:h-[44px] sm:w-[84px]" />
          <span className="relative grid h-[46px] w-[46px] place-items-center rounded-full bg-white/45 shadow-[0_0_0_3px_rgba(255,255,255,0.55),0_4px_10px_rgba(30,30,20,0.3)] backdrop-blur-[2px] sm:h-[62px] sm:w-[62px]">
            <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-gradient-to-b from-[#8A8F99] to-[#5E636C] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] sm:h-[48px] sm:w-[48px]">
              <Lock className="h-4 w-4 sm:h-[22px] sm:w-[22px]" strokeWidth={3.2} />
            </span>
          </span>
        </span>
      ) : (
        <span className={cn("relative grid place-items-center", current && "anim-bob")}>
          <Pedestal
            className={
              current
                ? "top-[52%] h-[40px] w-[84px] sm:h-[54px] sm:w-[116px]"
                : "top-[48%] h-[34px] w-[64px] sm:h-[44px] sm:w-[84px]"
            }
          />
          <span
            className={cn(
              "relative grid place-items-center rounded-full border-[3px] border-[#C6F28F] bg-[radial-gradient(circle_at_50%_30%,#7EE21F,#4DB802_70%)] text-white shadow-[0_6px_0_#2F8A00,0_10px_18px_rgba(40,90,0,0.35)]",
              current
                ? "h-[62px] w-[62px] shadow-[0_0_24px_rgba(140,230,40,0.7),0_6px_0_#2F8A00] sm:h-[88px] sm:w-[88px] sm:border-[4px]"
                : "h-[46px] w-[46px] sm:h-[62px] sm:w-[62px]"
            )}
          >
            {done ? (
              <Check className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={4} />
            ) : (
              <Play
                className={cn("ml-1", current ? "h-7 w-7 sm:h-10 sm:w-10" : "h-5 w-5 sm:h-7 sm:w-7")}
                fill="currentColor"
                strokeWidth={0}
              />
            )}
          </span>
        </span>
      )}

      <span
        className={cn(
          "absolute left-1/2 top-[calc(100%+4px)] w-max min-w-[104px] max-w-[160px] -translate-x-1/2 rounded-[12px] px-3 py-1 text-center shadow-[0_5px_12px_rgba(38,50,25,0.3)] sm:top-[calc(100%+6px)] sm:min-w-[170px] sm:max-w-[240px] sm:rounded-[18px] sm:px-5 sm:py-2",
          current ? "bg-[#FFF6D2] ring-2 ring-[#FFE07A]" : "bg-[#FBF6EA]/95"
        )}
      >
        <span className="block text-[11px] font-extrabold leading-tight text-[#2E2A22] sm:text-[15px]">
          {boss ? "Boss Quest" : `Quest ${number}`}
        </span>
        <span
          className={cn(
            "block font-extrabold leading-tight text-[#2E2A22]",
            current ? "text-[11.5px] sm:text-[16px]" : "text-[10px] sm:text-[13.5px]"
          )}
        >
          {title}
        </span>
        {skip && (
          <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#8A4FD0] sm:text-[10.5px]">
            Beat it to skip this world
          </span>
        )}
        {stars > 0 && (
          <span className="mt-0.5 flex justify-center gap-0.5">
            {[1, 2, 3].map((n) => (
              <Star
                key={n}
                className={cn("h-3 w-3", n <= stars ? "text-[#FFC800]" : "text-[#D9D0BC]")}
                fill="currentColor"
                strokeWidth={0}
              />
            ))}
          </span>
        )}
        {current && (
          <ChevronDown
            className="absolute left-1/2 top-[calc(100%-6px)] h-5 w-5 -translate-x-1/2 text-[#5CC40A] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
            strokeWidth={4}
          />
        )}
      </span>
    </button>
  );
}
