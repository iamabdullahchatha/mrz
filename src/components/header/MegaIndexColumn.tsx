"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import type { MenuEntry } from "@/data/types";
import { ArrowUpRight } from "./icons";
import { MenuIcon } from "./menuIcons";
import { EASE_OUT, pad2, SPRING_SOFT } from "./motion";
import styles from "./Header.module.css";

// Rows cascade in once when the menu mounts, each swinging up from a shallow
// rotateX. The cascade is tightened (was stagger 0.045 / delay 0.1 / dur 0.52,
// ~1s to the last row) so the full list is settled in roughly half the time and
// the menu feels instantly responsive without losing the staggered reveal.
const listVariants: Variants = {
  show: { transition: { staggerChildren: 0.028, delayChildren: 0.04 } },
};
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 14, rotateX: -12 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.34, ease: EASE_OUT } },
};

interface MegaIndexColumnProps {
  heading: string;
  headingId: string;
  entries: MenuEntry[];
  /** Index of the first entry within the full menu (for numbering + roving focus). */
  offset: number;
  activeIndex: number;
  itemProps: (i: number) => Record<string, unknown>;
  onNavigate: () => void;
  /** Namespaces the shared-layout active card so columns don't animate into each other. */
  layoutKey: string;
  /** Optional overview link shown beside the heading (e.g. "View all services"). */
  action?: { label: string; href: string };
}

/** One labelled column of index rows: number · icon chip · title + blurb, with an active card. */
export function MegaIndexColumn({
  heading,
  headingId,
  entries,
  offset,
  activeIndex,
  itemProps,
  onNavigate,
  layoutKey,
  action,
}: MegaIndexColumnProps) {
  const reduce = useReducedMotion();

  return (
    <div className={styles.idxCol}>
      {heading ? (
        action ? (
          <div className={styles.indHeadRow}>
            <p className={styles.idxHead} id={headingId}>
              {heading}
            </p>
            <Link href={action.href} className={styles.indOverview} onClick={onNavigate}>
              {action.label}
              <ArrowUpRight />
            </Link>
          </div>
        ) : (
          <p className={styles.idxHead} id={headingId}>
            {heading}
          </p>
        )
      ) : null}
      <motion.ul
        className={styles.idxList}
        aria-labelledby={headingId}
        variants={reduce ? undefined : listVariants}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
      >
        {entries.map((entry, i) => {
          const gi = offset + i;
          const active = gi === activeIndex;
          return (
            <motion.li key={entry.id} variants={reduce ? undefined : rowVariants}>
              <Link
                href={entry.href}
                className={styles.idxRow}
                data-active={active || undefined}
                data-accent={entry.accent}
                onClick={onNavigate}
                {...itemProps(gi)}
              >
                {active ? (
                  <motion.span
                    layoutId={`${layoutKey}-active`}
                    className={styles.idxRowBg}
                    transition={reduce ? { duration: 0 } : SPRING_SOFT}
                    aria-hidden="true"
                  />
                ) : null}
                <span className={styles.idxNum} aria-hidden="true">
                  {pad2(gi + 1)}
                </span>
                <span className={styles.idxIcon} aria-hidden="true">
                  <MenuIcon name={entry.icon} />
                </span>
                <span className={styles.idxText}>
                  <span className={styles.idxTitle}>{entry.title}</span>
                  <span className={styles.idxBlurb}>{entry.blurb ?? entry.description}</span>
                </span>
                <ArrowUpRight className={styles.idxArrow} />
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
