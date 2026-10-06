import type { SVGProps } from "react";

/**
 * Line-icon set for the mega-menu row chips. Each service / industry references
 * one by key (see data files). Clean 24-grid strokes, inheriting currentColor so
 * the chip can recolour them (muted when idle, white when the row is active).
 */

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const exchange = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9h13l-3.2-3.2" />
    <path d="M20 15H7l3.2 3.2" />
  </Svg>
);

const box = (p: IconProps) => (
  <Svg {...p}>
    <path d="m21 8-9-5-9 5 9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </Svg>
);

const shield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6z" />
    <path d="m9 11.5 2 2 4-4" />
  </Svg>
);

const screen = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
    <path d="m10 8-2 2 2 2M14 8l2 2-2 2" />
  </Svg>
);

const ledger = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h3.5" />
  </Svg>
);

const layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Svg>
);

const droplet = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10Z" />
  </Svg>
);

const people = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.1 2.7-5 6-5s6 1.9 6 5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.8" />
    <path d="M18.5 20c0-2-1-3.6-2.8-4.5" />
  </Svg>
);

const person = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10" cy="7" r="3.2" />
    <path d="M4 20c0-3.3 2.7-6 6-6 1.3 0 2.5.4 3.4 1" />
    <path d="m15 17 2 2 4-4" />
  </Svg>
);

const doc = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
    <path d="m10.3 14 1.8 1.8L16 11.8" />
  </Svg>
);

const building = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18" />
    <path d="M6 21V5l7-2v18" />
    <path d="M13 21V9l5 2v10" />
    <path d="M9 7.5h1M9 11h1M9 14.5h1" />
  </Svg>
);

const flame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c1.4 3 4.5 4.3 4.5 8.5A4.5 4.5 0 0 1 7.5 12c0-1.3.6-2.3 1.3-3C9.6 10.5 11 8.6 12 3Z" />
  </Svg>
);

const chip = (p: IconProps) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" />
  </Svg>
);

const office = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18" />
    <rect x="5" y="8" width="6" height="13" />
    <rect x="13" y="4" width="6" height="17" />
    <path d="M7 11h2M7 14.5h2M15 7h2M15 10.5h2M15 14h2" />
  </Svg>
);

const MENU_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  exchange,
  box,
  shield,
  screen,
  ledger,
  layers,
  droplet,
  people,
  person,
  doc,
  building,
  flame,
  chip,
  office,
};

/** Resolves a data `icon` key to its glyph, falling back to a neutral box. */
export function MenuIcon({ name, ...props }: IconProps & { name?: string }) {
  const Glyph = (name && MENU_ICONS[name]) || MENU_ICONS.box;
  return <Glyph {...props} />;
}
