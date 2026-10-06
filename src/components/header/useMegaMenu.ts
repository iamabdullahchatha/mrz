"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { MegaMenuId } from "@/data/navigation";

/** Delay before a hover opens a closed menu — filters out pointer fly-bys. */
const OPEN_DELAY = 90;
/** Grace period after the pointer leaves the header before closing. */
const CLOSE_DELAY = 240;
/** A click this soon after a hover-open keeps the menu open instead of toggling it shut. */
const HOVER_CLICK_GRACE = 450;

const ORDER: MegaMenuId[] = ["services", "industries"];

/**
 * Open/close state for the desktop mega menus with hover intent.
 *
 * - Hovering a trigger opens after a short delay; when a menu is already open,
 *   hovering the other trigger switches instantly (no close/reopen).
 * - Leaving the header region closes after a grace period, cancelled on re-entry.
 * - Clicking toggles, except right after a hover-open (prevents open→close flicker).
 * - Pointer-down outside `rootRef` closes.
 */
export function useMegaMenu(rootRef: RefObject<HTMLElement | null>) {
  const [openId, setOpenIdState] = useState<MegaMenuId | null>(null);
  const [direction, setDirection] = useState(1);
  const openRef = useRef<MegaMenuId | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);

  const setOpenId = useCallback((id: MegaMenuId | null) => {
    const prev = openRef.current;
    if (prev && id && prev !== id) {
      setDirection(ORDER.indexOf(id) > ORDER.indexOf(prev) ? 1 : -1);
    }
    openRef.current = id;
    setOpenIdState(id);
  }, []);

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  const hoverTrigger = useCallback(
    (id: MegaMenuId) => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(openTimer.current);
      if (openRef.current) {
        setOpenId(id);
        return;
      }
      openTimer.current = window.setTimeout(() => {
        hoverOpenedAt.current = performance.now();
        setOpenId(id);
      }, OPEN_DELAY);
    },
    [setOpenId],
  );

  const cancelPendingOpen = useCallback(() => {
    window.clearTimeout(openTimer.current);
  }, []);

  const scheduleClose = useCallback(
    (delay = CLOSE_DELAY) => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      if (!openRef.current) return;
      closeTimer.current = window.setTimeout(() => setOpenId(null), delay);
    },
    [setOpenId],
  );

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
  }, []);

  const toggle = useCallback(
    (id: MegaMenuId) => {
      clearTimers();
      if (openRef.current === id) {
        if (performance.now() - hoverOpenedAt.current < HOVER_CLICK_GRACE) return;
        setOpenId(null);
      } else {
        hoverOpenedAt.current = 0;
        setOpenId(id);
      }
    },
    [clearTimers, setOpenId],
  );

  const open = useCallback(
    (id: MegaMenuId) => {
      clearTimers();
      setOpenId(id);
    },
    [clearTimers, setOpenId],
  );

  const close = useCallback(() => {
    clearTimers();
    setOpenId(null);
  }, [clearTimers, setOpenId]);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openId, rootRef, close]);

  useEffect(() => clearTimers, [clearTimers]);

  return { openId, direction, hoverTrigger, cancelPendingOpen, scheduleClose, cancelClose, toggle, open, close };
}

export type MegaMenuController = ReturnType<typeof useMegaMenu>;
