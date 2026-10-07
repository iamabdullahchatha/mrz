"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { contactNav } from "@/data/navigation";
import { ROUTES } from "@/lib/routes";
import { DesktopNavigation } from "./DesktopNavigation";
import { GlassLayers } from "./GlassPanel";
import { ArrowRight } from "./icons";
import { MegaMenu } from "./MegaMenu";
import { MobileMenuToggle, MobileNavigation, MobileScrim } from "./MobileNavigation";
import { useMegaMenu } from "./useMegaMenu";
import { usePointerLight } from "./usePointerLight";
import styles from "./Header.module.css";

/** Scroll distance over which the header settles into its compact state. */
const SCROLL_RANGE = 72;
const DESKTOP_QUERY = "(min-width: 1024px)";
const FOCUSABLE = "a[href], button:not([disabled])";

export function Header() {
  return (
    <MotionConfig reducedMotion="user">
      <HeaderInner />
    </MotionConfig>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const menu = useMegaMenu(shellRef);
  const [mobileOpen, setMobileOpen] = useState(false);
  const light = usePointerLight();

  /* ---- scroll: one smoothed 0→1 progress value drives every compact-state property */
  const { scrollY, scrollYProgress } = useScroll();
  const smoothPage = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.4 });
  const pageProgress = reduce ? scrollYProgress : smoothPage;
  const rawProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], { clamp: true });
  const smoothProgress = useSpring(rawProgress, { stiffness: 220, damping: 34, mass: 0.7 });
  const progress = reduce ? rawProgress : smoothProgress;

  const offsetY = useTransform(progress, [0, 1], [0, -8]);
  const barHeight = useTransform(progress, [0, 1], [76, 62]);
  const barHeightCss = useMotionTemplate`${barHeight}px`;
  const shadowOpacity = useTransform(progress, [0, 1], [0.4, 1]);
  const logoScale = useTransform(progress, [0, 1], [1, 0.88]);

  /* ---- subtle 3D: the bar leans toward the pointer (±0.6° / ±0.9°); disabled while a panel is open */
  const tiltOn = useSpring(1, { stiffness: 200, damping: 30 });
  useEffect(() => {
    tiltOn.set(menu.openId || mobileOpen || reduce ? 0 : 1);
  }, [menu.openId, mobileOpen, reduce, tiltOn]);
  const rotateX = useTransform([light.ny, tiltOn], ([v, on]: number[]) => v * -1.2 * on);
  const rotateY = useTransform([light.nx, tiltOn], ([v, on]: number[]) => v * 1.8 * on);

  const closeAll = useCallback(() => {
    menu.close();
    setMobileOpen(false);
  }, [menu]);

  const focusTrigger = (id: string) => document.getElementById(`nav-trigger-${id}`)?.focus();

  const panelFocusables = () =>
    Array.from(
      shellRef.current?.querySelectorAll<HTMLElement>(`.${styles.panel} :is(${FOCUSABLE})`) ?? [],
    ).filter((el) => !el.closest("[inert]"));

  const focusPanel = useCallback((id: string) => {
    shellRef.current?.querySelector<HTMLElement>(`#mega-${id} [data-mega-item]`)?.focus();
  }, []);

  /* ---- Tab out of the panel continues from the trigger, as if the panel sat right after it */
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !menu.openId) return;
    const items = panelFocusables();
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && i === 0) {
      e.preventDefault();
      focusTrigger(menu.openId);
    } else if (!e.shiftKey && i === items.length - 1) {
      e.preventDefault();
      const triggers = Array.from(shellRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]") ?? []);
      const t = triggers.findIndex((el) => el.id === `nav-trigger-${menu.openId}`);
      const next = triggers[t + 1] ?? shellRef.current?.querySelector<HTMLElement>(`.${styles.contactCta}`);
      menu.close();
      next?.focus();
    }
  };

  /* ---- Escape closes whatever is open and returns focus to its trigger */
  useEffect(() => {
    if (!menu.openId && !mobileOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu.openId) {
        const id = menu.openId;
        menu.close();
        focusTrigger(id);
      }
      if (mobileOpen) {
        setMobileOpen(false);
        shellRef.current?.querySelector<HTMLElement>(`.${styles.mobileToggle}`)?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu, mobileOpen]);

  /* ---- focus leaving the header closes the mega menu (null relatedTarget = window blur, keep open) */
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (menu.openId && next && !shellRef.current?.contains(next)) menu.close();
  };

  /* ---- route change closes everything */
  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* ---- crossing the breakpoint closes the surface that no longer exists */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => (mq.matches ? setMobileOpen(false) : menu.close());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [menu]);

  const anyOpen = Boolean(menu.openId) || mobileOpen;

  return (
    <motion.header className={styles.root} data-open={anyOpen || undefined} data-mobile-open={mobileOpen || undefined} layoutRoot>
      <AnimatePresence>
        {menu.openId ? (
          <motion.div
            key="mega-scrim"
            className={styles.megaScrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
      <MobileScrim open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <motion.span className={styles.topFade} style={{ opacity: progress }} aria-hidden="true" />

      <motion.div
        ref={shellRef}
        className={styles.shell}
        style={{ y: offsetY }}
        onPointerLeave={(e) => e.pointerType === "mouse" && menu.scheduleClose()}
        onPointerEnter={menu.cancelClose}
        onBlur={onBlur}
      >
        <div className={styles.barStage}>
          <motion.div
            className={styles.bar}
            style={{ "--bar-h": barHeightCss, rotateX, rotateY, ...light.style } as MotionStyle}
            onPointerMove={light.onPointerMove}
            onPointerLeave={light.onPointerLeave}
          >
            <motion.span className={styles.barShadow} style={{ opacity: shadowOpacity }} aria-hidden="true" />
            <GlassLayers variant="bar" density={progress} />
            <span className={styles.barTravel} aria-hidden="true" />
            <motion.span className={styles.readProgress} style={{ scaleX: pageProgress }} aria-hidden="true" />

            <div className={styles.barInner}>
              <Link href={ROUTES.home} className={styles.logo} aria-label="MRZ UAE — home" onClick={closeAll}>
                <motion.span className={styles.logoInner} style={{ scale: logoScale }}>
                  <Image
                    src="/brand/mrz-logo-dark-surface.webp"
                    alt=""
                    width={553}
                    height={222}
                    sizes="110px"
                    quality={85}
                    preload
                    className={styles.logoImg}
                  />
                </motion.span>
              </Link>

              <DesktopNavigation pathname={pathname} menu={menu} focusPanel={focusPanel} onNavigate={closeAll} />

              <div className={styles.actions}>
                <Link
                  href={contactNav.href}
                  className={styles.contactCta}
                  data-active={pathname === contactNav.href || undefined}
                  aria-current={pathname === contactNav.href ? "page" : undefined}
                  onPointerEnter={() => menu.scheduleClose(160)}
                  onClick={closeAll}
                >
                  <span className={styles.contactSheen} aria-hidden="true" />
                  <span>{contactNav.label}</span>
                  <span className={styles.contactChip} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
                <MobileMenuToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
              </div>
            </div>
          </motion.div>
        </div>

        <MegaMenu
          openId={menu.openId}
          direction={menu.direction}
          onPointerEnter={menu.cancelClose}
          onNavigate={closeAll}
          onKeyDown={onPanelKeyDown}
        />
        <MobileNavigation open={mobileOpen} pathname={pathname} onClose={() => setMobileOpen(false)} />
      </motion.div>
    </motion.header>
  );
}
