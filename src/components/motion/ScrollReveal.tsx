"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Entrance used for whole sections below the hero: a light lift + subtle 3D tilt
 * that fades in as the section scrolls into view. Reveal-once (`once: true`) — it
 * plays on the way down and then stays put, so scrolling back up never re-hides
 * or re-animates a section (that re-triggering is what read as "stuck"). Kept
 * deliberately gentle — these sections contain glass (backdrop-filter) cards, so
 * a big transform/opacity swing is expensive to composite. Honours reduced
 * motion by rendering the children untouched.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 38, rotateX: 5, transformPerspective: 1200 },
  shown: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 1200,
    transition: { duration: 0.6, ease: EASE },
  },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const reduce = useReducedMotion() ?? false;
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      /* `amount: "some"` + a positive bottom root-margin fires the reveal ~140px
         before the section reaches the fold, so it is already easing in by the
         time it is visible — no tall empty gap, no un-revealed sliver at the edge.
         `once: true` makes it play once and stay (no reverse on scroll-up). */
      viewport={{ once: true, amount: "some", margin: "0px 0px 140px 0px" }}
      variants={variants}
      style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
    >
      {children}
    </motion.div>
  );
}
