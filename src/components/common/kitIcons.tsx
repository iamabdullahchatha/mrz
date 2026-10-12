import type { SVGProps } from "react";

/* Stroke glyphs shared by the About, Contact and FAQs pages and the footer. All
   decorative — callers label the surrounding control, so every icon is aria-hidden. */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, strokeWidth = 1.8, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Arrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const ArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);

export const Phone = (p: IconProps) => (
  <Svg size={17} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  </Svg>
);

export const Mail = (p: IconProps) => (
  <Svg size={17} {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 6.5 9 6 9-6" />
  </Svg>
);

export const Pin = (p: IconProps) => (
  <Svg size={17} {...p}>
    <path d="M20 10.5c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.5" r="2.8" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg size={13} strokeWidth={2.8} {...p}>
    <path d="m20 6-11 11-5-5" />
  </Svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg size={16} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const Plus = ({ barClassName, ...p }: IconProps & { barClassName?: string }) => (
  <Svg size={20} strokeWidth={1.9} {...p}>
    <path d="M12 5v14" className={barClassName} />
    <path d="M5 12h14" />
  </Svg>
);

export const Search = (p: IconProps) => (
  <Svg strokeWidth={1.9} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg size={16} strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const LinkedIn = (p: IconProps) => (
  <Svg size={17} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Svg>
);

export const Facebook = (p: IconProps) => (
  <Svg size={17} {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg size={17} {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4Z" />
    <path d="M17.5 6.5h.01" />
  </Svg>
);

export const SOCIAL_ICONS = { linkedin: LinkedIn, facebook: Facebook, instagram: Instagram } as const;
