import { Lock } from "lucide-react";

// A wooden signpost: a plank on two posts, anchored at the foot of the posts.
export default function MapSign({ x, y, text }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[6] -translate-x-1/2 -translate-y-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="anim-sway origin-bottom" style={{ "--tilt": "-1.5deg" }}>
        <div className="relative flex items-center gap-2 rounded-[10px] border-[3px] border-[#5E3B1E] bg-[linear-gradient(180deg,#9A6A3E_0%,#86592F_48%,#7A4F28_52%,#8C5E33_100%)] px-2.5 py-1.5 shadow-[0_6px_14px_rgba(40,25,10,0.4),inset_0_2px_0_rgba(255,220,170,0.25)] sm:gap-3 sm:px-3.5 sm:py-2">
          <Lock className="h-5 w-5 shrink-0 text-[#FFF4DF] drop-shadow-[0_1px_0_rgba(60,35,15,0.6)] sm:h-7 sm:w-7" strokeWidth={2.6} />
          <span className="w-[96px] text-left text-[10px] font-bold leading-[1.3] text-[#FFF4DF] [text-shadow:0_1px_0_rgba(60,35,15,0.6)] sm:w-[132px] sm:text-[12.5px]">
            {text}
          </span>
        </div>
        <div className="mx-auto flex w-[62%] justify-between">
          <span className="h-4 w-2 rounded-b-[2px] bg-[#6E4724] shadow-[1px_0_0_#4E3018] sm:h-6 sm:w-2.5" />
          <span className="h-4 w-2 rounded-b-[2px] bg-[#6E4724] shadow-[1px_0_0_#4E3018] sm:h-6 sm:w-2.5" />
        </div>
      </div>
    </div>
  );
}
