import { heroById } from "@/lib/game/heroes";
import { cn } from "@/lib/utils";

// A square portrait cropped around the hero's face. The art is drawn as a background so the crop
// works at any size: the image is `zoom` times the box's width, and positioned so the face lands
// in the middle.
export default function HeroAvatar({ heroId, className, label }) {
  const hero = heroById(heroId);
  const { x, y } = hero.face;
  const z = hero.zoom;
  const ratio = hero.ratio;
  const px = clamp((0.5 - x * z) / (1 - z));
  const py = clamp((0.5 - y * z * ratio) / (1 - z * ratio));

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block shrink-0 overflow-hidden bg-no-repeat", className)}
      style={{
        backgroundColor: `${hero.color}26`,
        backgroundImage: `url(${hero.image})`,
        backgroundSize: `${z * 100}% auto`,
        backgroundPosition: `${px * 100}% ${py * 100}%`,
      }}
    />
  );
}

function clamp(n) {
  return Math.max(0, Math.min(1, n));
}
