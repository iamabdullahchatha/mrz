"use client";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode, type Ref } from "react";
import type { MenuEntry } from "@/data/types";
import { ArrowUpRight } from "./icons";
import { EASE_OUT, EASE_WIPE, pad2 } from "./motion";
import type { Direction } from "./useActiveIndex";
import styles from "./Header.module.css";

const FULL = "inset(0% 0% 0% 0%)";

const layerVariants: Variants = {
  // Incoming image wipes in along the direction of travel, settling from a slight zoom.
  active: (dir: Direction) => ({
    opacity: 1,
    scale: [1.07, 1],
    clipPath: [dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", FULL],
    filter: ["blur(6px)", "blur(0px)"],
    transition: { duration: 0.44, ease: EASE_OUT, clipPath: { duration: 0.4, ease: EASE_WIPE } },
    transitionEnd: { filter: "none" },
  }),
  previous: { opacity: 1, scale: 1.02, clipPath: FULL, transition: { duration: 0.6, ease: EASE_OUT } },
  idle: { opacity: 0, scale: 1, transition: { duration: 0.2 } },
};

const reducedLayer: Variants = {
  active: { opacity: 1, transition: { duration: 0.2 } },
  previous: { opacity: 1 },
  idle: { opacity: 0, transition: { duration: 0.2 } },
};

// Caption + foot copy re-staggers on every change, in the direction of travel.
const copyContainer: Variants = { enter: {}, center: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } }, exit: {} };
const copyItem: Variants = {
  enter: (dir: Direction) => ({ opacity: 0, y: dir * 12 }),
  center: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } },
  exit: (dir: Direction) => ({ opacity: 0, y: dir * -8, transition: { duration: 0.14, ease: "easeIn" } }),
};

interface MegaPreviewCardProps {
  entries: MenuEntry[];
  activeIndex: number;
  direction: Direction;
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  sizes: string;
  /** Brand label in the card badge, e.g. "Service" / "Sector". */
  label: string;
  onNavigate: () => void;
}

/**
 * Reference-style preview: a single image card with the title laid over its foot,
 * and the description + "Open" link beneath. Every image is mounted once (stacked),
 * so switching is an instant directional wipe, never a fetch. The card tilts toward
 * the pointer with the media drifting further for depth behind glass.
 */
export function MegaPreviewCard({ entries, activeIndex, direction, nx, ny, sizes, label, onNavigate }: MegaPreviewCardProps) {
  const reduce = useReducedMotion();
  const [previous, setPrevious] = useState(activeIndex);
  const [last, setLast] = useState(activeIndex);
  if (activeIndex !== last) {
    setPrevious(last);
    setLast(activeIndex);
  }

  const rotateY = useTransform(nx, (v) => (reduce ? 0 : v * 7));
  const rotateX = useTransform(ny, (v) => (reduce ? 0 : v * -5));
  const shiftX = useTransform(nx, (v) => (reduce ? 0 : v * -22));
  const shiftY = useTransform(ny, (v) => (reduce ? 0 : v * -14));

  const entry = entries[activeIndex];
  const cta = entry.cta ?? `Open ${entry.title}`;

  return (
    <div className={styles.pv}>
      <p className={styles.pvHead}>Preview</p>

      <div className={styles.pvCardStage}>
        <motion.div className={styles.pvCard} style={{ rotateX, rotateY }}>
          <motion.div className={styles.pvMedia} style={{ x: shiftX, y: shiftY }}>
            {entries.map((e, i) => {
              const state = i === activeIndex ? "active" : i === previous ? "previous" : "idle";
              const src = e.menuImage?.src ?? e.image;
              const alt = e.menuImage?.alt ?? e.imageAlt;
              const position = e.menuImage ? e.menuImage.position : e.imagePosition;
              return (
                <motion.div
                  key={e.id}
                  className={styles.pvLayer}
                  custom={direction}
                  variants={reduce ? reducedLayer : layerVariants}
                  initial={false}
                  animate={state}
                  style={{ zIndex: state === "active" ? 3 : state === "previous" ? 2 : 1 }}
                >
                  <motion.div
                    className={styles.pvZoom}
                    initial={{ scale: 1 }}
                    animate={{ scale: reduce || state === "idle" ? 1 : 1.08 }}
                    transition={state === "idle" ? { duration: 0 } : { duration: 16, ease: "linear" }}
                  >
                    <Image
                      src={src}
                      alt={state === "active" ? alt : ""}
                      fill
                      sizes={sizes}
                      quality={85}
                      className={styles.pvImg}
                      style={position ? { objectPosition: position } : undefined}
                      fetchPriority={i === activeIndex ? "high" : "low"}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          <span className={styles.pvShade} aria-hidden="true" />
          {!reduce ? (
            <motion.span
              key={entry.id}
              className={styles.pvSheen}
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "120%", opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              aria-hidden="true"
            />
          ) : null}
          <span className={styles.pvEdge} aria-hidden="true" />

          <div className={styles.pvBadge} aria-hidden="true">
            <span className={styles.pvBadgeBrand}>
              <span className={styles.pvBadgeDot} />
              MRZ · {label}
            </span>
            <span className={styles.pvBadgeIndex}>
              {pad2(activeIndex + 1)}
              <span className={styles.pvBadgeTotal}> / {pad2(entries.length)}</span>
            </span>
          </div>

          <div className={styles.pvCaption}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <CopyBlock key={entry.id} className={styles.pvCaptionInner} direction={direction}>
                <motion.span className={styles.pvKicker} variants={copyItem} custom={direction}>
                  <span>{label} {pad2(activeIndex + 1)}</span>
                  <span className={styles.pvKickerRule} aria-hidden="true" />
                  <span className={styles.pvKickerCat}>{entry.category}</span>
                </motion.span>
                <motion.span className={styles.pvTitle} variants={copyItem} custom={direction}>
                  {entry.title}
                </motion.span>
              </CopyBlock>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className={styles.pvFoot}>
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <CopyBlock key={entry.id} className={styles.pvFootInner} direction={direction}>
            <motion.span className={styles.pvDesc} variants={copyItem} custom={direction}>
              {entry.description}
            </motion.span>
            <motion.span variants={copyItem} custom={direction}>
              <Link href={entry.href} className={styles.pvOpen} onClick={onNavigate}>
                <span>{cta}</span>
                <span className={styles.pvOpenIcon}>
                  <ArrowUpRight />
                </span>
              </Link>
            </motion.span>
          </CopyBlock>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Exiting copy stays mounted while it animates out — keep it inert and out of the tab order. */
function CopyBlock({
  className,
  direction,
  children,
  ref,
}: {
  className: string;
  direction: Direction;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      ref={ref}
      className={className}
      custom={direction}
      variants={copyContainer}
      initial="enter"
      animate="center"
      exit="exit"
      inert={!isPresent}
    >
      {children}
    </motion.div>
  );
}
