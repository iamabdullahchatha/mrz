"use client";

import { useCallback, useRef, type PointerEvent } from "react";

/**
 * Grid-wide "spotlight": as the mouse moves over a grid, every child marked
 * `data-spot` receives `--mx` / `--my` (pointer position in its own box), so
 * each card can paint a soft light on its border that follows the cursor —
 * neighbours included. All rects are read before any style is written, so a
 * move costs one layout read, not one per card. Mouse-only; touch is ignored.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const cells = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-spot]"));
    const rects = cells.map((c) => c.getBoundingClientRect());
    cells.forEach((c, i) => {
      c.style.setProperty("--mx", `${e.clientX - rects[i].left}px`);
      c.style.setProperty("--my", `${e.clientY - rects[i].top}px`);
    });
  }, []);

  return { ref, onPointerMove };
}
