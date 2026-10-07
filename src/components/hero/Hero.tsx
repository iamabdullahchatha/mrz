"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { services } from "@/data/services";
import { ROUTES } from "@/lib/routes";
import { ArrowRight, ArrowUpRight } from "@/components/header/icons";
import { MenuIcon } from "@/components/header/menuIcons";
import { EASE_OUT, pad2 } from "@/components/header/motion";
import { ChevronLeft, ChevronRight } from "./heroIcons";
import { heroSlides } from "./heroSlides";
import styles from "./Hero.module.css";

const COUNT = heroSlides.length;
const AUTOPLAY_MS = 5600;
const SWIPE_PX = 44;

/**
 * Pose of a card by its depth in the deck (0 = front). The two cards behind fan
 * up and to the right; the rest wait hidden at the back. The last slot is the
 * "just left" position — the old front card flies out toward the viewer.
 */
function poseAt(depth: number) {
  if (depth === 0) return { x: "0%", y: "0%", z: 0, rotateY: 0, rotateZ: 0, opacity: 1 };
  if (depth === COUNT - 1) return { x: "-82%", y: "8%", z: 160, rotateY: 26, rotateZ: -10, opacity: 0 };
  const k = Math.min(depth, 3);
  return { x: `${k * 9}%`, y: `${k * -6.5}%`, z: k * -95, rotateY: 0, rotateZ: k * 3.2, opacity: depth >= 3 ? 0 : 1 };
}

const STATS = [
  { value: String(services.length), label: "Specialist services" },
  { value: "1", label: "Coordinated UAE team" },
  { value: "UAE", label: "One partner nationwide" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const paused = hovered || focused || !inView;

  const next = useCallback(() => setActive((a) => (a + 1) % COUNT), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + COUNT) % COUNT), []);

  // Stop every hero animation + autoplay while the section is scrolled out of view.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.04 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer tilt + glare — mouse only; touch keeps the flat resting pose.
  // Ranges are symmetric so the front card sits perfectly square (crisp) at rest
  // and only tilts while the pointer moves over it.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.7 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-13, 13]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const glareX = useTransform(sx, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 80]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.26), rgba(255,255,255,0) 52%)`;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  // Swipe / drag to change card; a real drag must not also follow the link.
  const dragStart = useRef(0);
  const dragged = useRef(false);
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStart.current = e.clientX;
    dragged.current = false;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) < SWIPE_PX) return;
    dragged.current = true;
    if (dx < 0) next();
    else prev();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const current = heroSlides[active];

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="Introduction" data-inview={inView || undefined}>
      {/* ---------------------------------------------------------- backdrop */}
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.aurora} />
        <span className={styles.beam} />
        <span className={styles.floorWrap}>
          <span className={styles.floor} />
        </span>
        <span className={styles.noise} />
        <span className={styles.vignette} />
      </div>

      <div className={styles.inner}>
        {/* -------------------------------------------------------------- copy */}
        <div className={styles.copy}>
          <p className={styles.badge}>
            <span className={styles.badgeDot} />
            From Ajman-based support to multi-service delivery
          </p>

          <h1 className={styles.title}>
            Start &amp; Scale in the UAE
            <span className={styles.titleAccent}>With One Trusted Partner</span>
          </h1>

          <p className={styles.sub}>
            Commercial brokerage, trading, IT &amp; cyber security, HR and documents
            clearing — coordinated end to end by one UAE team.
          </p>

          <div className={styles.actions}>
            <Link href={ROUTES.services} className={styles.primary}>
              <span>Explore services</span>
              <span className={styles.primaryIcon}>
                <ArrowRight />
              </span>
            </Link>
            <Link href={ROUTES.contact} className={styles.secondary}>
              Talk to our team
            </Link>
          </div>

          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statValue}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ----------------------------------------------------------- 3D deck */}
        <div className={styles.visual}>
          <div
            className={styles.scene}
            role="group"
            aria-roledescription="carousel"
            aria-label="MRZ services"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerMove={onPointerMove}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => {
              px.set(0);
              py.set(0);
              setHovered(false);
            }}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className={styles.float}>
              <motion.div className={styles.rig} style={reduce ? { rotateX: 0, rotateY: 0 } : { rotateX, rotateY }}>
                <span className={styles.halo} />
                <span className={styles.platform}>
                  <span className={styles.ringOuter} />
                  <span className={styles.ringDash} />
                  <span className={styles.ringInner} />
                </span>

                <div className={styles.deck}>
                  {heroSlides.map((slide, i) => {
                    const depth = (i - active + COUNT) % COUNT;
                    const isFront = depth === 0;
                    return (
                      <motion.div
                        key={slide.id}
                        className={styles.card}
                        data-accent={slide.accent}
                        data-depth={Math.min(depth, 3)}
                        initial={false}
                        animate={poseAt(depth)}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 120,
                                damping: 22,
                                mass: 1,
                                opacity: { duration: 0.55, ease: EASE_OUT },
                              }
                        }
                      >
                        <Link
                          href={slide.href}
                          className={styles.cardLink}
                          aria-hidden={!isFront}
                          tabIndex={isFront ? 0 : -1}
                          draggable={false}
                          onClick={(e) => {
                            if (dragged.current) e.preventDefault();
                          }}
                        >
                          <span className={styles.media}>
                            <Image
                              src={slide.image}
                              alt={isFront ? slide.alt : ""}
                              fill
                              preload={i === 0}
                              draggable={false}
                              sizes="(max-width: 600px) 64vw, (max-width: 1080px) 42vw, 370px"
                              quality={85}
                              className={styles.img}
                              style={slide.focus ? { objectPosition: slide.focus } : undefined}
                            />
                            <span className={styles.scrim} />
                            <span className={styles.veil} />
                            {isFront && !reduce ? <motion.span className={styles.glare} style={{ background: glare }} /> : null}
                          </span>
                          <span className={styles.edge} />

                          <span className={styles.caption}>
                            <span className={styles.capCat}>{slide.category}</span>
                            <span className={styles.capTitle}>{slide.title}</span>
                            <span className={styles.capBlurb}>{slide.blurb}</span>
                            <span className={styles.capOpen}>
                              Explore
                              <ArrowUpRight />
                            </span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Floating glass chips — set forward in Z so they parallax over the cards */}
                  <div className={`${styles.chip} ${styles.chipSector}`} aria-hidden="true">
                    <span className={styles.chipIcon} data-accent={current.accent}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={current.id}
                          className={styles.chipIconGlyph}
                          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                          transition={{ duration: 0.3, ease: EASE_OUT }}
                        >
                          <MenuIcon name={current.icon} />
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className={styles.chipText}>
                      <span className={styles.chipLabel}>Sector</span>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={current.id}
                          className={styles.chipValue}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.28, ease: EASE_OUT }}
                        >
                          {current.category}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <p className="visually-hidden" aria-live={paused ? "polite" : "off"}>
              {`Card ${active + 1} of ${COUNT}: ${current.title}`}
            </p>
          </div>

          {/* ------------------------------------------------------- controls */}
          <div className={styles.controls}>
            <span className={styles.counter}>
              <span className={styles.counterNow}>{pad2(active + 1)}</span>
              <span className={styles.counterSep}>/</span>
              {pad2(COUNT)}
            </span>
            <button type="button" className={styles.nav} onClick={prev} aria-label="Previous service">
              <ChevronLeft />
            </button>
            <div className={styles.progress} role="tablist" aria-label="Choose a service">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={slide.title}
                  className={styles.seg}
                  data-active={i === active || undefined}
                  onClick={() => setActive(i)}
                >
                  {i === active ? (
                    <span
                      key={active}
                      className={styles.segFill}
                      data-run={!reduce || undefined}
                      data-paused={paused || undefined}
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                      onAnimationEnd={next}
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <button type="button" className={styles.nav} onClick={next} aria-label="Next service">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ service ribbon */}
      <div className={styles.ribbon} aria-hidden="true">
        <div className={styles.ribbonTrack}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.ribbonList}>
              {services.map((s) => (
                <li key={s.id} className={styles.ribbonItem}>
                  <MenuIcon name={s.icon} width={16} height={16} />
                  {s.title}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
