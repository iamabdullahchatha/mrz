"use client";

import { useMotionTemplate, useMotionValue, useSpring, type MotionStyle } from "framer-motion";
import { useCallback, useMemo, type PointerEvent as ReactPointerEvent } from "react";

const FOLLOW = { stiffness: 210, damping: 30, mass: 0.6 };
const FADE = { stiffness: 140, damping: 26 };
const TILT = { stiffness: 120, damping: 22, mass: 0.7 };

/**
 * Smoothed pointer tracking for glass surfaces, driven entirely by motion values
 * (no React re-renders on pointer move).
 *
 * Exposes CSS variables for the element it's attached to:
 *   --lx / --ly  smoothed pointer position in px (for radial light gradients)
 *   --lo         light opacity (fades in on enter, out on leave)
 * and `nx` / `ny`: smoothed pointer position normalised to -0.5…0.5, for tilt/parallax.
 */
export function usePointerLight({ track3d = true }: { track3d?: boolean } = {}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);
  const visibility = useSpring(0, FADE);
  const rawNx = useMotionValue(0);
  const rawNy = useMotionValue(0);
  const nx = useSpring(rawNx, TILT);
  const ny = useSpring(rawNy, TILT);

  const lx = useMotionTemplate`${sx}px`;
  const ly = useMotionTemplate`${sy}px`;

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      // Entering from rest: jump to the pointer so the light doesn't sweep in from a corner.
      if (visibility.get() < 0.05) {
        sx.jump(px);
        sy.jump(py);
      }
      x.set(px);
      y.set(py);
      visibility.set(1);
      if (track3d) {
        rawNx.set(px / rect.width - 0.5);
        rawNy.set(py / rect.height - 0.5);
      }
    },
    [rawNx, rawNy, sx, sy, track3d, visibility, x, y],
  );

  const onPointerLeave = useCallback(() => {
    visibility.set(0);
    rawNx.set(0);
    rawNy.set(0);
  }, [rawNx, rawNy, visibility]);

  const style = useMemo(
    () => ({ "--lx": lx, "--ly": ly, "--lo": visibility }) as unknown as MotionStyle,
    [lx, ly, visibility],
  );

  return { style, nx, ny, onPointerMove, onPointerLeave };
}

export type PointerLight = ReturnType<typeof usePointerLight>;
