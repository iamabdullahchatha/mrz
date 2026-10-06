"use client";

import { animate, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import type { Accent } from "@/data/types";
import { ACCENT_GLOW, EASE_OUT } from "./motion";

/** Eases the panel's ambient glow toward the active entry's accent colour. */
export function useAccentGlow(glow: MotionValue<string>, accent: Accent) {
  useEffect(() => {
    const controls = animate(glow, ACCENT_GLOW[accent], { duration: 0.7, ease: EASE_OUT });
    return () => controls.stop();
  }, [glow, accent]);
}
