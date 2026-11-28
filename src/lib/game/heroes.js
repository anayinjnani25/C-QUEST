// The six playable heroes. A hero is purely cosmetic: it changes the player's portrait and the
// attack animation in boss battles, never damage, XP or progression.
//
// `card` is the portrait used on the Choose Your Character cards and as the player's profile
// picture; `cardFocus` (optional) is the CSS background position that keeps the face in a square
// crop. `image` is the full-body art drawn in boss battles.
// `flip` mirrors the art in battle so every hero faces the boss on the right.

const img = (name) => `${import.meta.env.BASE_URL}images/heroes/${name}`;

export const HEROES = [
  {
    id: "swordsman",
    name: "Swordsman",
    style: "Three-blade slashes",
    emoji: "⚔️",
    gender: "male",
    color: "#58CC02",
    image: img("hero-1.webp"),
    card: img("cards/hero-1.webp"),
    flip: true,
  },
  {
    id: "firekick",
    name: "Fire Kick Master",
    style: "Blazing spin kicks",
    emoji: "🔥🦵",
    gender: "male",
    color: "#FF9600",
    image: img("hero-2.webp"),
    card: img("cards/hero-2.webp"),
    cardFocus: "62% 40%",
    flip: true,
  },
  {
    id: "firemage",
    name: "Fire Mage",
    style: "Hurls fireballs",
    emoji: "🔥🙌",
    gender: "male",
    color: "#FF4B4B",
    image: img("hero-3.webp"),
    card: img("cards/hero-3.webp"),
    flip: false,
  },
  {
    id: "music",
    name: "Music Warrior",
    style: "Sonic song waves",
    emoji: "🎵",
    gender: "female",
    color: "#CE82FF",
    image: img("hero-4.webp"),
    card: img("cards/hero-4.webp"),
    flip: false,
  },
  {
    id: "multiarm",
    name: "Multi-Armed Controller",
    style: "Summons a hundred hands",
    emoji: "👋",
    gender: "female",
    color: "#1CB0F6",
    image: img("hero-5.webp"),
    card: img("cards/hero-5.webp"),
    flip: false,
  },
  {
    id: "assassin",
    name: "Assassin",
    style: "Shadow-step daggers",
    emoji: "🗡️",
    gender: "female",
    color: "#A5303A",
    image: img("hero-6.webp"),
    card: img("cards/hero-6.webp"),
    flip: false,
  },
];

const BY_ID = new Map(HEROES.map((hero) => [hero.id, hero]));

export function isHeroId(id) {
  return BY_ID.has(id);
}

// Saves made before heroes existed have none; callers prompt for one, and anything that has to
// draw a hero meanwhile falls back to the first.
export function heroById(id) {
  return BY_ID.get(id) || HEROES[0];
}
