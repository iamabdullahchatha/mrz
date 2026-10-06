"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { TiltCard } from "@/components/sections/TiltCard";
import { industries } from "@/data/industries";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./Industries.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Accent -> glow colour used behind each poster card on hover. */
const GLOW: Record<string, string> = {
  gold: "rgba(220, 169, 88, 0.45)",
  royal: "rgba(36, 83, 214, 0.52)",
  copper: "rgba(201, 124, 74, 0.48)",
  ice: "rgba(120, 170, 255, 0.46)",
};

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Phone() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/* each poster rises out of depth, rotating up into place as it scrolls in */
const cellVariants: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: 13, scale: 0.955 },
  shown: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Industries index — a full page of poster cards, one per sector, each linking to
 * its own detail page. Cards tilt in 3D toward the pointer with a travelling
 * accent border and glow on hover; a slow conic aurora (transform-only) washes the
 * hero. Every name, description and image comes from the vetted industries data.
 */
export function IndustriesIndex() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="industries-title">
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Who we serve
          </p>
          <h1 id="industries-title" className={styles.title}>
            Industries <span className={styles.titleAccent}>we serve</span>
          </h1>
          <p className={styles.lead}>
            From trade and construction to energy, technology and compliance — specialist support tuned to the
            realities of each sector across the UAE.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- grid */}
      <section className={styles.listSection} aria-label="All industries">
        <motion.ul
          className={styles.grid}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.12 }}
          variants={reduce ? undefined : listVariants}
        >
          {industries.map((ind) => (
            <motion.li
              key={ind.id}
              className={styles.cell}
              style={{ "--glow": GLOW[ind.accent] ?? GLOW.gold } as CSSProperties}
              variants={reduce ? undefined : cellVariants}
            >
              <TiltCard className={styles.card} max={9} lift={9}>
                <span className={styles.glow} aria-hidden="true" />
                <span className={styles.travel} aria-hidden="true" />

                <div className={styles.frame}>
                  <Image
                    src={`/images/industries/${ind.id}.ind.webp`}
                    alt={ind.imageAlt}
                    fill
                    className={styles.img}
                    sizes="(max-width: 720px) 92vw, (max-width: 1240px) 46vw, 600px"
                    quality={85}
                  />
                  <span className={styles.shade} aria-hidden="true" />
                </div>

                <div className={styles.topRow} aria-hidden="true">
                  <span className={styles.iconTile}>
                    <MenuIcon name={ind.icon} width={22} height={22} />
                  </span>
                  <span className={styles.cat}>{ind.category}</span>
                </div>

                <div className={styles.overlay}>
                  <h2 className={styles.cardTitle}>{ind.title}</h2>
                  <p className={styles.desc}>{ind.description}</p>
                  <span className={styles.more} aria-hidden="true">
                    Explore industry
                    <span className={styles.moreIcon}>
                      <Arrow />
                    </span>
                  </span>
                </div>

                <Link href={ind.href} className={styles.cardLink} aria-label={`${ind.title} — explore industry`} />
              </TiltCard>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={styles.ctaSection} aria-labelledby="industries-cta-title">
        <div className={styles.ctaPanel}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.ctaCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Not sure it fits?
            </p>
            <h2 id="industries-cta-title" className={styles.ctaTitle}>
              Tell us about your sector — we&apos;ll map the right support.
            </h2>
            <p className={styles.ctaLead}>
              One conversation is enough to point you to the services that matter in your industry, with a clear,
              documentation-led plan before any work begins.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link href={ROUTES.contact} className={styles.primary}>
              Book a free consultation
              <span className={styles.primaryIcon} aria-hidden="true">
                <Arrow />
              </span>
            </Link>
            <a href={CONTACT.phoneHref} className={styles.secondary}>
              <Phone />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
