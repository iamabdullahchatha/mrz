"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { KeyboardEvent, PointerEvent } from "react";
import type { NavItem as NavItemData } from "@/data/navigation";
import { Chevron } from "./icons";
import { SPRING_SNAPPY, SPRING_SOFT } from "./motion";
import styles from "./Header.module.css";

interface NavItemProps {
  item: NavItemData;
  active: boolean;
  expanded: boolean;
  highlighted: boolean;
  onHover: () => void;
  onTriggerPointerEnter: (e: PointerEvent<HTMLButtonElement>) => void;
  onTriggerPointerLeave: () => void;
  onTriggerClick: () => void;
  onTriggerKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onLinkPointerEnter: () => void;
  onNavigate: () => void;
}

const lift = { y: -1.5, scale: 1.02 };

export function NavItem({
  item,
  active,
  expanded,
  highlighted,
  onHover,
  onTriggerPointerEnter,
  onTriggerPointerLeave,
  onTriggerClick,
  onTriggerKeyDown,
  onLinkPointerEnter,
  onNavigate,
}: NavItemProps) {
  const inner = (
    <>
      {highlighted ? (
        <motion.span layoutId="nav-hover" className={styles.hoverPill} transition={SPRING_SOFT} aria-hidden="true" />
      ) : null}
      <span className={styles.navLabel}>{item.label}</span>
      {item.kind === "mega" ? (
        <motion.span
          className={styles.navChevron}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={SPRING_SNAPPY}
          aria-hidden="true"
        >
          <Chevron />
        </motion.span>
      ) : null}
      {active ? (
        <motion.span layoutId="nav-active" className={styles.activeMark} transition={SPRING_SOFT} aria-hidden="true" />
      ) : null}
    </>
  );

  return (
    <li className={styles.navItem} onPointerEnter={onHover}>
      {item.kind === "mega" ? (
        <motion.button
          type="button"
          id={`nav-trigger-${item.id}`}
          className={styles.navLink}
          aria-expanded={expanded}
          aria-controls={`mega-${item.id}`}
          data-nav-item=""
          data-active={active || undefined}
          data-expanded={expanded || undefined}
          whileHover={lift}
          transition={SPRING_SNAPPY}
          onPointerEnter={onTriggerPointerEnter}
          onPointerLeave={onTriggerPointerLeave}
          onClick={onTriggerClick}
          onKeyDown={onTriggerKeyDown}
        >
          {inner}
        </motion.button>
      ) : (
        <motion.span className={styles.navLinkWrap} whileHover={lift} transition={SPRING_SNAPPY}>
          <Link
            href={item.href}
            className={styles.navLink}
            data-nav-item=""
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            onPointerEnter={onLinkPointerEnter}
            onClick={onNavigate}
          >
            {inner}
          </Link>
        </motion.span>
      )}
    </li>
  );
}
