import { heroById } from "@/lib/game/heroes";
import { cn } from "@/lib/utils";

// The player's profile picture: the chosen hero's card portrait, cropped square to fit any size.
// (The full-body art is only used in the boss battle.)
export default function HeroAvatar({ heroId, className, label }) {
  const hero = heroById(heroId);

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block shrink-0 overflow-hidden bg-cover bg-no-repeat", className)}
      style={{
        backgroundColor: `${hero.color}26`,
        backgroundImage: `url(${hero.card})`,
        backgroundPosition: hero.cardFocus || "50% 40%",
      }}
    />
  );
}
