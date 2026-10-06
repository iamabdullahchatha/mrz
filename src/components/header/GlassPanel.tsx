"use client";

import { motion, type MotionValue } from "framer-motion";
import styles from "./Header.module.css";

interface GlassLayersProps {
  variant: "bar" | "panel" | "sheet";
  /** 0…1 — crossfades in the dense (heavier blur, higher opacity) glass layer. */
  density?: MotionValue<number>;
}

/**
 * The layered glass stack, rendered inside any positioned surface:
 *   1. soft base glass + backdrop blur
 *   2. dense glass (stronger blur/opacity), crossfaded by `density`
 *   3. brand tint gradient
 *   4. micro-grain — a faint frosted texture so the glass isn't a flat wash
 *   5. edge highlights (inset hairlines + top specular line)
 *   6. pointer light — reads --lx/--ly/--lo from the surface (see usePointerLight)
 *   7. pointer glare — a tighter specular bloom that tracks the cursor like wet glass
 *   8. pointer edge reflection — a masked ring that brightens the border near the cursor
 *
 * The ambient shadow lives on the surface itself so it never fights with these layers.
 */
export function GlassLayers({ variant, density }: GlassLayersProps) {
  return (
    <span className={styles.glass} data-variant={variant} aria-hidden="true">
      <span className={styles.glassBase} />
      {density ? <motion.span className={styles.glassDense} style={{ opacity: density }} /> : null}
      <span className={styles.glassTint} />
      <span className={styles.glassGrain} />
      <span className={styles.glassEdge} />
      <span className={styles.glassLight} />
      <span className={styles.glassGlare} />
      <span className={styles.glassEdgeLight} />
    </span>
  );
}
