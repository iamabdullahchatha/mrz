"use client";

import { type ReactNode } from "react";
import styles from "./HeroOrbit.module.css";

export interface OrbitItem {
  key: string;
  icon: ReactNode;
  label?: string;
}

interface HeroOrbitProps {
  center: ReactNode;
  centerLabel: string;
  centerSub?: string;
  items: OrbitItem[];
  /** Ring radius as a percentage of half the frame (default 50 — on the outer ring). */
  radius?: number;
  className?: string;
}

/**
 * A decorative orbital "constellation" — a glowing glass medallion at the centre
 * with icon chips evenly distributed around a dashed ring. Pure presentation
 * (aria-hidden): the rings drift slowly and the chips breathe, all transform/opacity
 * only (compositor-friendly, no backdrop-filter) and fully stilled under
 * prefers-reduced-motion. Reused across page heroes for a cohesive premium accent.
 */
export function HeroOrbit({ center, centerLabel, centerSub, items, radius = 50, className }: HeroOrbitProps) {
  const n = items.length;
  return (
    <div className={`${styles.wrap} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.glow} />
      <span className={`${styles.ring} ${styles.ringOuter}`} />
      <span className={`${styles.ring} ${styles.ringInner}`} />
      <span className={styles.ticks} />

      {items.map((item, i) => {
        const angle = (360 / n) * i - 90; // start at top
        const rad = (angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <span
            key={item.key}
            className={styles.chip}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${(i % 4) * -1.4}s`,
            }}
          >
            {item.icon}
          </span>
        );
      })}

      <span className={styles.center}>
        <span className={styles.centerIcon}>{center}</span>
        <span className={styles.centerLabel}>{centerLabel}</span>
        {centerSub ? <span className={styles.centerSub}>{centerSub}</span> : null}
      </span>
    </div>
  );
}
