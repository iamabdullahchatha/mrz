"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  className?: string;
  children: ReactNode;
  /** Max tilt in degrees toward the pointer. */
  max?: number;
  /** Lift the card slightly while hovered. */
  lift?: number;
  /** Render a pointer-tracking glare sheen. */
  glare?: boolean;
  /** Reflects an open/active state onto the card as a `data-open` attribute. */
  dataOpen?: boolean;
}

/**
 * A card that tilts in 3D toward the pointer and settles back on a spring.
 * Mouse-only by design — touch devices keep the flat resting pose, so the heavy
 * 3D never runs on phones. Honours prefers-reduced-motion. The PARENT element
 * must set `perspective` for the tilt to read as depth; children with
 * `translateZ(...)` will parallax because the card preserves 3D.
 */
export function TiltCard({ className, children, max = 10, lift = 0, glare = true, dataOpen }: TiltCardProps) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 17, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 17, mass: 0.6 });
  // the sheen rests invisible and only fades in while a mouse is over the card
  const glareOn = useMotionValue(0);
  const glareOpacity = useSpring(glareOn, { stiffness: 180, damping: 26 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const gx = useTransform(sx, [-0.5, 0.5], [12, 88]);
  const gy = useTransform(sy, [-0.5, 0.5], [6, 94]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    glareOn.set(1);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
    glareOn.set(0);
  };

  return (
    <motion.div
      className={className}
      data-open={dataOpen ? "" : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={reduce || !lift ? undefined : { y: -lift }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {children}
      {glare && !reduce ? (
        <motion.span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 6,
            background: glareBg,
            opacity: glareOpacity,
          }}
        />
      ) : null}
    </motion.div>
  );
}
