"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { contactNav, primaryNav } from "@/data/navigation";
import { CONTACT } from "@/lib/routes";
import { GlassLayers } from "./GlassPanel";
import { ArrowRight, ArrowUpRight, Plus } from "./icons";
import { EASE_OUT } from "./motion";
import styles from "./Header.module.css";

export const MOBILE_NAV_ID = "mobile-nav";

/* ---------------------------------------------------------------- toggle */

export function MobileMenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={styles.mobileToggle}
      aria-expanded={open}
      aria-controls={MOBILE_NAV_ID}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
    >
      <span className={styles.mobileToggleIcon} aria-hidden="true">
        <motion.span
          animate={open ? { y: 0, rotate: 45 } : { y: -3.5, rotate: 0 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
        />
        <motion.span
          animate={open ? { y: 0, rotate: -45, scaleX: 1 } : { y: 3.5, rotate: 0, scaleX: 0.7 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
        />
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------- sheet */

const sheetVariants: Variants = {
  closed: { opacity: 0, y: -10, scale: 0.985 },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: EASE_OUT, staggerChildren: 0.04, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

const rowVariants: Variants = {
  closed: { opacity: 0, y: 8 },
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

interface MobileNavigationProps {
  open: boolean;
  pathname: string;
  onClose: () => void;
}

export function MobileNavigation({ open, pathname, onClose }: MobileNavigationProps) {
  return <AnimatePresence>{open ? <Sheet key="sheet" pathname={pathname} onClose={onClose} /> : null}</AnimatePresence>;
}

/** Dims the page behind the sheet. Rendered outside the transformed shell so `position: fixed` covers the viewport. */
export function MobileScrim({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="scrim"
          className={styles.mobileScrim}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
    </AnimatePresence>
  );
}

function Sheet({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  // Single-open accordion; starts on the section you're in.
  const [expanded, setExpanded] = useState<string | null>(() => {
    const current = primaryNav.find((i) => i.kind === "mega" && i.match(pathname));
    return current?.id ?? null;
  });

  // Lock page scroll behind the sheet (the sheet scrolls internally).
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  return (
    <motion.nav
      id={MOBILE_NAV_ID}
      aria-label="Primary"
      className={styles.sheet}
      variants={sheetVariants}
      initial="closed"
      animate="open"
      exit="exit"
    >
      <GlassLayers variant="sheet" />
      <div className={styles.sheetScroll}>
        <ul className={styles.sheetList}>
          {primaryNav.map((item) => {
            const active = item.match(pathname);
            if (item.kind === "link") {
              return (
                <motion.li key={item.id} variants={rowVariants} className={styles.sheetItem}>
                  <Link
                    href={item.href}
                    className={styles.sheetLink}
                    data-active={active || undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              );
            }
            return (
              <motion.li key={item.id} variants={rowVariants} className={styles.sheetItem}>
                <Accordion
                  label={item.label}
                  active={active}
                  expanded={expanded === item.id}
                  onToggle={() => setExpanded((v) => (v === item.id ? null : item.id))}
                >
                  <ul className={styles.sheetSubList}>
                    {item.entries.map((entry) => (
                      <li key={entry.id}>
                        <Link
                          href={entry.href}
                          className={styles.sheetSubLink}
                          aria-current={entry.href === pathname ? "page" : undefined}
                          onClick={onClose}
                        >
                          <span className={styles.sheetThumb}>
                            <Image
                              src={entry.menuImage?.src ?? entry.image}
                              alt=""
                              fill
                              sizes="52px"
                              quality={75}
                              style={entry.menuImage?.position ? { objectPosition: entry.menuImage.position } : undefined}
                            />
                          </span>
                          <span className={styles.sheetSubText}>
                            <span className={styles.sheetSubTitle}>{entry.title}</span>
                            <span className={styles.sheetSubMeta}>{entry.category}</span>
                          </span>
                          <ArrowRight className={styles.sheetSubArrow} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={item.href} className={styles.sheetOverview} onClick={onClose}>
                    {item.id === "services" ? "All services" : "Industries overview"}
                    <ArrowUpRight />
                  </Link>
                </Accordion>
              </motion.li>
            );
          })}
        </ul>

        <motion.div variants={rowVariants} className={styles.sheetFooter}>
          <Link href={contactNav.href} className={styles.contactCta} data-size="block" onClick={onClose}>
            <span className={styles.contactSheen} aria-hidden="true" />
            <span>{contactNav.label}</span>
            <span className={styles.contactChip} aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
          <div className={styles.sheetContact}>
            <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            <span aria-hidden="true" />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

function Accordion({
  label,
  active,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const panelId = useId();
  return (
    <>
      <button
        type="button"
        className={styles.sheetLink}
        data-active={active || undefined}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {label}
        <span className={styles.sheetPlus} aria-hidden="true">
          <motion.span
            style={{ display: "grid" }}
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <Plus />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={panelId}
            key="panel"
            className={styles.accordionPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.42, ease: EASE_OUT } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.26, ease: EASE_OUT } }}
          >
            <div className={styles.accordionInner}>{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
