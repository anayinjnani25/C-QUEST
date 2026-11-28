// Original SVG sprites for the bosses, who all face left toward the player's hero.
// Each sprite draws inside its own viewBox and leaves movement to the CSS classes in index.css.

// World 1: a stone sentinel with a cracked old terminal for a head.
function FlickerSentinel() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="b1-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5ff3ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5ff3ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* legs */}
      <rect x="58" y="112" width="18" height="34" rx="4" fill="#4b5263" />
      <rect x="88" y="112" width="18" height="34" rx="4" fill="#3d4352" />
      <rect x="54" y="140" width="26" height="10" rx="3" fill="#2c313c" />
      <rect x="84" y="140" width="26" height="10" rx="3" fill="#2c313c" />
      {/* back arm */}
      <rect x="108" y="66" width="20" height="50" rx="8" fill="#3d4352" />
      <rect x="106" y="110" width="24" height="18" rx="5" fill="#2c313c" />
      {/* torso */}
      <path d="M48 60 L116 60 L112 118 L52 118Z" fill="#5a6274" />
      <path d="M56 70 L108 70 L105 108 L59 108Z" fill="#4b5263" />
      <circle cx="82" cy="89" r="13" fill="url(#b1-glow)" />
      <circle cx="82" cy="89" r="6" fill="#bffbff" />
      <path d="M62 76 L70 84 M100 96 L94 104" stroke="#2c313c" strokeWidth="3" />
      {/* front arm, raised claw */}
      <rect x="26" y="64" width="22" height="46" rx="8" fill="#5a6274" />
      <path d="M22 106 L50 106 L46 124 L26 124Z" fill="#3d4352" />
      <path d="M24 124 L20 134 M33 124 L31 136 M42 124 L44 134" stroke="#5ff3ff" strokeWidth="3" strokeLinecap="round" />
      {/* monitor head */}
      <rect x="46" y="14" width="72" height="50" rx="8" fill="#c7c1ad" />
      <rect x="53" y="20" width="58" height="36" rx="5" fill="#0d2a30" />
      <rect x="53" y="20" width="58" height="36" rx="5" fill="url(#b1-glow)" opacity="0.35" />
      <path d="M60 30 L72 36 L60 40 Z M104 30 L92 36 L104 40 Z" fill="#5ff3ff" />
      <path d="M66 48 h32" stroke="#5ff3ff" strokeWidth="3" strokeDasharray="4 3" />
      <path d="M96 20 L88 34 L94 36 L86 56" stroke="#c7c1ad" strokeWidth="2" fill="none" />
      <rect x="76" y="64" width="12" height="6" fill="#8d8878" />
      {/* antenna */}
      <path d="M100 14 L108 2" stroke="#8d8878" strokeWidth="3" />
      <circle cx="108" cy="2" r="3.5" fill="#5ff3ff" />
    </svg>
  );
}

// World 2: a horned warden in plate armour that guards the branching gate.
function GateWarden() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="b2-armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b3a6e" />
          <stop offset="1" stopColor="#241a38" />
        </linearGradient>
      </defs>
      {/* cape */}
      <path d="M56 50 Q40 100 46 150 L124 150 Q126 100 110 50Z" fill="#1a1328" />
      {/* legs */}
      <path d="M62 112 L78 112 L76 148 L58 148Z" fill="#2c2142" />
      <path d="M88 112 L104 112 L108 148 L90 148Z" fill="#2c2142" />
      <path d="M54 144 h26 v6 h-28z M88 144 h24 l2 6 h-26z" fill="#160f22" />
      {/* torso */}
      <path d="M52 52 Q82 40 112 52 L106 116 Q82 124 58 116Z" fill="url(#b2-armor)" />
      <path d="M66 62 Q82 92 98 62" stroke="#c46bff" strokeWidth="3" fill="none" />
      <path d="M82 70 L82 108" stroke="#c46bff" strokeWidth="2.5" />
      <path d="M72 96 L82 108 L92 96" stroke="#c46bff" strokeWidth="2.5" fill="none" />
      {/* pauldrons */}
      <ellipse cx="54" cy="56" rx="16" ry="11" fill="#5a4683" />
      <ellipse cx="110" cy="56" rx="16" ry="11" fill="#3e2f5c" />
      <path d="M44 50 L36 40 M118 50 L128 40" stroke="#5a4683" strokeWidth="5" strokeLinecap="round" />
      {/* halberd held forward */}
      <path d="M30 22 L42 140" stroke="#5c4a34" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 22 Q14 30 20 48 L34 40Z" fill="#b9b3cc" />
      <path d="M31 22 L26 6 L35 20Z" fill="#b9b3cc" />
      <rect x="34" y="78" width="22" height="14" rx="6" fill="#3e2f5c" />
      {/* helm with horns */}
      <path d="M64 28 Q82 8 100 28 L100 46 Q82 54 64 46Z" fill="#3e2f5c" />
      <path d="M66 26 Q50 18 46 2 Q60 10 72 18Z" fill="#d9cfb8" />
      <path d="M98 26 Q114 18 118 2 Q104 10 92 18Z" fill="#c4b99e" />
      <path d="M68 34 L96 34 L94 40 L70 40Z" fill="#0c0814" />
      <path d="M72 37 L80 37 M86 37 L92 37" stroke="#e7a3ff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// World 3: a great serpent that loops back on itself.
function CoilSerpent() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="b3-scale" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4fbf6a" />
          <stop offset="1" stopColor="#1f6b3a" />
        </linearGradient>
      </defs>
      {/* coils on the ground */}
      <ellipse cx="96" cy="138" rx="50" ry="14" fill="#1f6b3a" />
      <ellipse cx="96" cy="132" rx="44" ry="12" fill="url(#b3-scale)" />
      <ellipse cx="98" cy="120" rx="34" ry="10" fill="#2a8a4a" />
      <path d="M62 132 Q96 142 138 130" stroke="#e8d27a" strokeWidth="3" fill="none" opacity="0.7" />
      {/* rising neck */}
      <path d="M118 120 Q132 80 104 62 Q80 46 66 44" stroke="url(#b3-scale)" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d="M114 116 Q124 84 100 68 Q82 56 70 54" stroke="#e8d27a" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.75" />
      {/* hood */}
      <path d="M50 26 Q72 8 92 30 Q96 54 76 62 Q56 60 50 26Z" fill="#2a8a4a" />
      <path d="M58 30 Q72 18 86 32 Q86 50 74 54 Q62 52 58 30Z" fill="#7be08f" opacity="0.35" />
      {/* head */}
      <path d="M66 34 Q48 30 30 40 Q26 46 32 50 Q48 54 66 50Z" fill="#3aa65a" />
      <circle cx="54" cy="40" r="3.6" fill="#ffe14d" />
      <path d="M54 37 v6" stroke="#10301a" strokeWidth="1.6" />
      {/* fangs and tongue */}
      <path d="M34 49 L36 57 L39 50 M42 50 L44 57 L46 50" fill="#fff" />
      <path d="M30 46 L18 46 L12 42 M18 46 L12 50" stroke="#ff4b6b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* tail tip */}
      <path d="M140 128 Q156 122 150 108" stroke="#2a8a4a" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// World 4: a molten titan swinging a forge hammer.
function ForgeTitan() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="b4-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2a8" />
          <stop offset="0.5" stopColor="#ff9a1f" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* legs */}
      <path d="M56 110 L80 110 L78 148 L52 148Z" fill="#3a2a24" />
      <path d="M90 110 L112 110 L116 148 L92 148Z" fill="#33241f" />
      <path d="M60 124 L72 130 M98 128 L108 122" stroke="#ff8a1f" strokeWidth="2.5" />
      {/* back arm */}
      <path d="M116 58 Q138 72 132 112 L116 112 Q118 80 106 68Z" fill="#33241f" />
      <circle cx="124" cy="116" r="11" fill="#2b1e19" />
      {/* torso */}
      <path d="M46 56 Q82 34 118 56 L112 114 Q82 124 52 114Z" fill="#4a352c" />
      <circle cx="82" cy="84" r="22" fill="url(#b4-core)" />
      <path d="M62 66 L72 76 L66 88 M104 70 L96 80 L102 96 M80 104 L84 116" stroke="#ff8a1f" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* hammer arm, raised */}
      <path d="M50 60 Q30 56 28 42" stroke="#4a352c" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M22 44 L20 16" stroke="#6b4a2a" strokeWidth="6" strokeLinecap="round" />
      <rect x="2" y="2" width="36" height="18" rx="3" fill="#5d5f66" />
      <rect x="2" y="2" width="36" height="5" rx="2" fill="#8a8d95" />
      <circle cx="28" cy="42" r="10" fill="#33241f" />
      {/* head */}
      <path d="M66 26 Q82 12 98 26 L98 46 Q82 54 66 46Z" fill="#3a2a24" />
      <path d="M70 34 L80 38 M94 34 L84 38" stroke="#ffd24d" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72 46 Q82 42 92 46" stroke="#ff8a1f" strokeWidth="2.5" fill="none" />
      {/* embers */}
      <circle className="bt-ember" cx="100" cy="18" r="2" fill="#ffb02e" />
      <circle className="bt-ember bt-ember-2" cx="64" cy="14" r="1.6" fill="#ff8a1f" />
    </svg>
  );
}

// World 5: a hovering archivist lich with an open tome.
function IndexLich() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="b5-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c4a8a" />
          <stop offset="1" stopColor="#2c4a8a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="b5-orb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e6f4ff" />
          <stop offset="1" stopColor="#4aa8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* robe fading into mist */}
      <path d="M58 48 Q82 36 108 48 L124 148 Q100 138 92 150 Q82 136 72 150 Q62 138 44 148Z" fill="url(#b5-robe)" />
      <path d="M62 50 Q82 42 104 50 L110 110 Q82 118 56 110Z" fill="#203766" />
      <path d="M82 52 L82 112" stroke="#8fc6ff" strokeWidth="2" opacity="0.6" />
      {/* staff */}
      <path d="M128 18 L120 140" stroke="#4a3a2a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="128" cy="16" r="14" fill="url(#b5-orb)" />
      <circle cx="128" cy="16" r="5" fill="#cfe9ff" />
      <path d="M112 76 Q122 70 124 60" stroke="#1a2c52" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* open tome held forward */}
      <path d="M56 70 Q40 74 30 66" stroke="#1a2c52" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M10 62 L30 56 L32 82 L12 88Z" fill="#e8dcc0" />
      <path d="M30 56 L50 62 L48 88 L32 82Z" fill="#d6c8a6" />
      <path d="M15 66 L26 63 M15 71 L26 68 M15 76 L24 74 M35 63 L45 66 M35 68 L45 71" stroke="#4aa8ff" strokeWidth="1.5" />
      <circle cx="30" cy="54" r="10" fill="url(#b5-orb)" opacity="0.8" />
      {/* hood and skull */}
      <path d="M60 46 Q62 10 84 10 Q104 12 106 46 Q84 56 60 46Z" fill="#1a2c52" />
      <path d="M68 40 Q70 22 84 22 Q98 22 98 40 Q84 48 68 40Z" fill="#0b1224" />
      <circle cx="76" cy="33" r="3.2" fill="#8fe0ff" />
      <circle cx="91" cy="33" r="3.2" fill="#8fe0ff" />
      <path d="M78 42 h10" stroke="#8fe0ff" strokeWidth="1.6" strokeDasharray="2 2" />
      {/* floating index runes */}
      <text x="132" y="62" fill="#8fc6ff" fontSize="11" fontFamily="monospace" fontWeight="700" opacity="0.8">[0]</text>
      <text x="40" y="118" fill="#8fc6ff" fontSize="10" fontFamily="monospace" fontWeight="700" opacity="0.6">[4]</text>
    </svg>
  );
}

// World 6: a rust-red wyrm of the wastes, with a hollow where its heart should point.
function NullWyrm() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="b6-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c2412f" />
          <stop offset="1" stopColor="#6b1d1a" />
        </linearGradient>
      </defs>
      {/* far wing */}
      <path d="M100 60 Q120 6 158 10 Q140 24 150 40 Q132 40 138 58 Q120 54 112 72Z" fill="#5a1816" />
      {/* tail */}
      <path d="M116 126 Q150 130 156 108 Q160 96 150 92" stroke="#7a221d" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M150 92 L158 80 L144 88Z" fill="#e0b25a" />
      {/* legs */}
      <path d="M68 112 L84 112 L80 146 L62 146Z" fill="#7a221d" />
      <path d="M98 112 L114 112 L118 146 L100 146Z" fill="#6b1d1a" />
      <path d="M58 146 L66 140 L70 148 Z M76 146 L80 140 L84 148Z M98 146 L104 140 L108 148Z" fill="#e8e0cc" />
      {/* body */}
      <ellipse cx="92" cy="98" rx="34" ry="26" fill="url(#b6-body)" />
      <path d="M68 92 Q84 116 108 112" stroke="#e0b25a" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />
      <circle cx="96" cy="94" r="7" fill="#1a0a0a" stroke="#ff6a4a" strokeWidth="2" />
      {/* near wing */}
      <path d="M86 74 Q78 22 112 6 Q106 26 120 34 Q104 40 114 56 Q98 56 98 78Z" fill="#8f2a22" />
      <path d="M90 72 Q90 40 108 14 M96 74 Q104 50 116 38" stroke="#5a1816" strokeWidth="2" fill="none" />
      {/* neck and head */}
      <path d="M72 86 Q56 66 52 46" stroke="url(#b6-body)" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M60 32 Q40 28 18 40 L16 46 Q30 52 40 52 L20 56 Q36 62 58 56 Q66 46 60 32Z" fill="#b13a2b" />
      <path d="M58 30 L66 14 L64 32 M52 30 L54 16 L48 30" fill="#e8e0cc" />
      <circle cx="46" cy="40" r="3.4" fill="#ffe14d" />
      <path d="M22 46 L26 50 L28 45 M30 48 L33 52 L35 47" fill="#fff" />
      <circle cx="18" cy="42" r="1.6" fill="#3a0d0b" />
    </svg>
  );
}

export const BOSSES = {
  w1: { name: "The Flicker Sentinel", short: "Sentinel", color: "#5ff3ff", Sprite: FlickerSentinel },
  w2: { name: "The Gate Warden", short: "Warden", color: "#c46bff", Sprite: GateWarden },
  w3: { name: "The Coil Serpent", short: "Serpent", color: "#5fdc7c", Sprite: CoilSerpent },
  w4: { name: "The Forge Titan", short: "Titan", color: "#ff9a1f", Sprite: ForgeTitan },
  w5: { name: "The Index Lich", short: "Lich", color: "#6cb8ff", Sprite: IndexLich },
  w6: { name: "The Null Wyrm", short: "Wyrm", color: "#ff5a3c", Sprite: NullWyrm },
};

export function bossForWorld(worldId) {
  return BOSSES[worldId] || BOSSES.w1;
}
