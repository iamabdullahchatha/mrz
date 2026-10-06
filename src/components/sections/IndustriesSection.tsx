"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { industries } from "@/data/industries";
import { ROUTES } from "@/lib/routes";
import { TiltCard } from "./TiltCard";
import styles from "./IndustriesSection.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/** Accent -> the glow colour used behind each card's title block / hover ring. */
const GLOW: Record<string, string> = {
  gold: "rgba(220, 169, 88, 0.45)",
  royal: "rgba(36, 83, 214, 0.52)",
  copper: "rgba(201, 124, 74, 0.48)",
  ice: "rgba(120, 170, 255, 0.46)",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Each card rises and tilts up out of the page as its row scrolls into view, then
 * stays put (`once: true` on the element — reveal on scroll-down only). The grid
 * sets the perspective, so the rotateX reads as real depth stacked in front of
 * the pointer-driven TiltCard tilt inside each card.
 */
const cellVariants: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: 13, scale: 0.955 },
  shown: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

/**
 * Industries we serve — large image-forward poster cards that tilt in 3D toward
 * the pointer, with the category chip, icon and title floated on deep parallax
 * planes, and a scroll reveal that lifts each card in on its own. Every name,
 * description, image and link comes from the vetted industries data (all CTAs
 * point to /services, matching the live site).
 */
export function IndustriesSection() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="industries" className={styles.industries} aria-labelledby="industries-title">
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Who we serve
            </p>
            <h2 id="industries-title" className={styles.title}>
              Industries <span className={styles.titleAccent}>we serve</span>
            </h2>
          </div>
          <p className={styles.lead}>
            From trade and construction to energy, technology and compliance — specialist support
            tuned to the realities of each sector across the UAE.
          </p>
        </header>

        <ul className={styles.grid}>
          {industries.map((ind) => (
            <motion.li
              key={ind.id}
              className={styles.cell}
              style={{ "--glow": GLOW[ind.accent] ?? GLOW.gold } as CSSProperties}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.22 }}
              variants={reduce ? undefined : cellVariants}
            >
              <TiltCard className={styles.card} max={10} lift={10}>
                <span className={styles.glow} aria-hidden="true" />

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
                  <h3 className={styles.cardTitle}>{ind.title}</h3>
                  <p className={styles.desc}>{ind.description}</p>
                  <span className={styles.more} aria-hidden="true">
                    {ind.cta ?? "Explore services"}
                    <span className={styles.moreIcon}>
                      <Arrow />
                    </span>
                  </span>
                </div>

                <Link
                  href={ind.href}
                  className={styles.cardLink}
                  aria-label={`${ind.title} — explore services`}
                />
              </TiltCard>
            </motion.li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link href={ROUTES.industries} className={styles.allCta}>
            View all industries
            <span className={styles.allCtaIcon} aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
