"use client";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { KeyboardEvent, ReactNode, Ref } from "react";
import { contactNav, type MegaMenuId } from "@/data/navigation";
import { industries } from "@/data/industries";
import { services } from "@/data/services";
import type { MenuEntry } from "@/data/types";
import { CONTACT } from "@/lib/routes";
import { GlassLayers } from "./GlassPanel";
import { ArrowRight, Mail, Phone } from "./icons";
import { IndustriesMegaMenu } from "./IndustriesMegaMenu";
import { ACCENT_GLOW, EASE_OUT } from "./motion";
import { ServicesMegaMenu } from "./ServicesMegaMenu";
import { usePointerLight, type PointerLight } from "./usePointerLight";
import styles from "./Header.module.css";

// The panel unfolds from its top edge (transform-origin 50% 0) with a shallow
// rotateX, so it reads like a pane of glass tilting down into place beneath the
// bar. It animates transform + opacity only (all GPU-composited): a clip-path
// reveal was dropped because animating a clip over a live backdrop-filter forced
// the panel to re-blur every frame — the single biggest cause of open-jank.
const panelVariants: Variants = {
  closed: {
    opacity: 0,
    y: -14,
    scale: 0.965,
    rotateX: -9,
    transformPerspective: 2200,
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transformPerspective: 2200,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
      rotateX: { duration: 0.44, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.985,
    rotateX: -4,
    transformPerspective: 2200,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

const reducedPanelVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Content rises in on opacity + y only. A blur() filter here used to repaint the
// entire panel body (index column + preview image) every frame of the reveal;
// the staggered rows and preview wipe already supply the depth, so it's dropped.
const contentVariants: Variants = {
  closed: { opacity: 0, y: 8 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: 0.04, ease: EASE_OUT },
  },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

// Services ⇄ Industries: the panel stays put while its content slides in the direction of travel.
const switchVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 32 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: (dir: number) => ({ opacity: 0, x: -32 * dir, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }),
};

const ENTRIES: Record<MegaMenuId, MenuEntry[]> = { services, industries };

interface MegaMenuProps {
  openId: MegaMenuId | null;
  direction: number;
  onPointerEnter: () => void;
  onNavigate: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export function MegaMenu({ openId, direction, onPointerEnter, onNavigate, onKeyDown }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {openId ? (
        <Panel
          key="mega-panel"
          openId={openId}
          direction={direction}
          onPointerEnter={onPointerEnter}
          onNavigate={onNavigate}
          onKeyDown={onKeyDown}
        />
      ) : null}
    </AnimatePresence>
  );
}

function Panel({ openId, direction, onPointerEnter, onNavigate, onKeyDown }: MegaMenuProps & { openId: MegaMenuId }) {
  const reduce = useReducedMotion();
  const isPresent = useIsPresent();
  const pathname = usePathname();
  const light = usePointerLight();
  const glow = useMotionValue(ACCENT_GLOW.gold);

  return (
    <div
      className={styles.panelWrap}
      style={{ pointerEvents: isPresent ? undefined : "none" }}
      onPointerEnter={onPointerEnter}
    >
      <motion.div
        className={styles.panel}
        variants={reduce ? reducedPanelVariants : panelVariants}
        initial="closed"
        animate="open"
        exit="exit"
        style={light.style}
        onPointerMove={light.onPointerMove}
        onPointerLeave={light.onPointerLeave}
        onKeyDown={onKeyDown}
      >
        <GlassLayers variant="panel" />
        <motion.span className={styles.panelGlow} style={{ backgroundColor: glow }} aria-hidden="true" />
        <span className={styles.panelGrid} aria-hidden="true" />

        <motion.div className={styles.panelContent} variants={reduce ? undefined : contentVariants}>
          <div className={styles.panelStage}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <PanelSlide key={openId} id={openId} direction={direction} reduce={Boolean(reduce)}>
                <PanelBody
                  id={openId}
                  entries={ENTRIES[openId]}
                  pathname={pathname}
                  light={light}
                  glow={glow}
                  onNavigate={onNavigate}
                />
              </PanelSlide>
            </AnimatePresence>
          </div>
          <PanelFooter onNavigate={onNavigate} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** One menu's content. While it slides out during a switch it is inert and loses its id, so focus and aria-controls only ever resolve to the incoming menu. */
function PanelSlide({
  id,
  direction,
  reduce,
  children,
  ref,
}: {
  id: MegaMenuId;
  direction: number;
  reduce: boolean;
  children: ReactNode;
  /** Forwarded from popLayout, which measures and lifts the exiting slide out of flow. */
  ref?: Ref<HTMLDivElement>;
}) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      ref={ref}
      id={isPresent ? `mega-${id}` : undefined}
      role="group"
      aria-labelledby={`nav-trigger-${id}`}
      className={styles.panelSlide}
      custom={direction}
      variants={reduce ? undefined : switchVariants}
      initial="enter"
      animate="center"
      exit="exit"
      inert={!isPresent}
    >
      {children}
    </motion.div>
  );
}

function PanelBody({
  id,
  entries,
  pathname,
  light,
  glow,
  onNavigate,
}: {
  id: MegaMenuId;
  entries: MenuEntry[];
  pathname: string;
  light: PointerLight;
  glow: MotionValue<string>;
  onNavigate: () => void;
}): ReactNode {
  // Open on the entry for the current page, so the menu reflects where you are.
  const initialIndex = Math.max(0, entries.findIndex((e) => e.href === pathname));
  return id === "services" ? (
    <ServicesMegaMenu
      entries={entries}
      initialIndex={initialIndex}
      nx={light.nx}
      ny={light.ny}
      glow={glow}
      onNavigate={onNavigate}
    />
  ) : (
    <IndustriesMegaMenu
      entries={entries}
      initialIndex={initialIndex}
      nx={light.nx}
      ny={light.ny}
      glow={glow}
      onNavigate={onNavigate}
    />
  );
}

/** Persistent assist strip — sits outside the sliding content, so it holds still while menus switch. */
function PanelFooter({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className={styles.panelFooter}>
      <p className={styles.panelFooterLead}>
        <span className={styles.frameMetaDot} aria-hidden="true" />
        Not sure which service fits?
        <strong>Talk to the MRZ team.</strong>
      </p>
      <div className={styles.panelFooterActions}>
        <a href={CONTACT.phoneHref} className={styles.panelFooterLink}>
          <span className={styles.panelFooterIcon}>
            <Phone />
          </span>
          {CONTACT.phoneDisplay}
        </a>
        <a href={`mailto:${CONTACT.email}`} className={styles.panelFooterLink}>
          <span className={styles.panelFooterIcon}>
            <Mail />
          </span>
          {CONTACT.email}
        </a>
        <Link href={contactNav.href} className={styles.panelFooterCta} onClick={onNavigate}>
          {contactNav.label}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
