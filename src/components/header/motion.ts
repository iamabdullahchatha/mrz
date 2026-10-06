/** Shared motion language for the header — one easing family, consistent timings. */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Hover-driven wipes: moves on the first frame, then settles like a curtain. */
export const EASE_WIPE: [number, number, number, number] = [0.35, 0.35, 0.1, 1];

export const SPRING_SOFT = { type: "spring", stiffness: 380, damping: 34, mass: 0.8 } as const;
export const SPRING_SNAPPY = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 } as const;

export const ACCENT_GLOW: Record<"gold" | "ice" | "royal" | "copper", string> = {
  gold: "rgba(236, 190, 110, 0.26)",
  ice: "rgba(140, 205, 255, 0.28)",
  royal: "rgba(80, 130, 255, 0.36)",
  copper: "rgba(232, 150, 84, 0.26)",
};

export const pad2 = (n: number) => String(n).padStart(2, "0");
