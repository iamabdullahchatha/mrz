"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

/** Pointer must rest this long on an item before it activates — stops diagonal fly-overs re-targeting the preview. */
const ACTIVATE_DELAY = 50;

/**
 * Shared item behaviour for a mega menu's entries: hover intent, focus activates,
 * and roving Arrow / Home / End keys that wrap at both ends.
 * `horizontal` adds Left / Right alongside Up / Down (for tiles laid out in a row).
 */
export function useMenuItems(count: number, onActivate: (index: number) => void, horizontal = false) {
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const current = items.current.indexOf(document.activeElement as HTMLAnchorElement);
    if (current < 0) return;
    const last = count - 1;
    let next: number;
    if (e.key === "ArrowDown" || (horizontal && e.key === "ArrowRight")) next = current === last ? 0 : current + 1;
    else if (e.key === "ArrowUp" || (horizontal && e.key === "ArrowLeft")) next = current === 0 ? last : current - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    items.current[next]?.focus();
  };

  const itemProps = (i: number) => ({
    ref: (el: HTMLAnchorElement | null) => {
      items.current[i] = el;
    },
    "data-mega-item": "",
    onPointerEnter: (e: PointerEvent<HTMLAnchorElement>) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => onActivate(i), ACTIVATE_DELAY);
    },
    onPointerLeave: () => window.clearTimeout(timer.current),
    onFocus: () => onActivate(i),
  });

  return { onKeyDown, itemProps };
}
