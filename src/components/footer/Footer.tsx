"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { industries } from "@/data/industries";
import { services } from "@/data/services";
import { CONTACT, ROUTES } from "@/lib/routes";
import { TiltCard } from "@/components/sections/TiltCard";
import styles from "./Footer.module.css";

const COMPANY_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "About Us", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Industries", href: ROUTES.industries },
  { label: "FAQs", href: ROUTES.faqs },
  { label: "Contact", href: ROUTES.contact },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

const headVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 10, transformPerspective: 1100 },
  shown: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1100, transition: { duration: 0.6, ease: EASE } },
};

const bodyVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const colVariants: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: 18, transformPerspective: 1000 },
  shown: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000, transition: { duration: 0.6, ease: EASE } },
};

const bottomVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Site footer — styled as a full section in the site's visual language: ambient
 * royal/gold blobs, a kicker + gradient-accent title + lead header, a featured
 * brand TiltCard (the signature pointer-3D card, with a translateZ logo), and
 * clean hairline-divided directories of the full services, industries and
 * company links. The header and columns stagger-lift in 3D on scroll-in
 * (reveal-once); every href comes from routes.ts / the vetted data files.
 */
export function Footer() {
  const reduce = useReducedMotion() ?? false;
  const year = new Date().getFullYear();

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <footer className={styles.footer}>
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.header
          className={styles.head}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.6 }}
          variants={reduce ? undefined : headVariants}
        >
          <div className={styles.headLead}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              MRZ Management Services
            </p>
            <h2 className={styles.title}>
              One team for <span className={styles.titleAccent}>every move</span> in the UAE
            </h2>
          </div>
          <p className={styles.lead}>
            Trade, technology, engineering, people and operations —
            coordinated from our Ajman office for businesses across the Emirates.
          </p>
        </motion.header>

        <motion.div
          className={styles.body}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          variants={reduce ? undefined : bodyVariants}
        >
          {/* featured brand card — signature pointer-tilt 3D */}
          <motion.div className={styles.brandCell} variants={reduce ? undefined : colVariants}>
            <TiltCard className={styles.brandCard} max={7} lift={6} glare={false}>
              {/* colour halo outside the edge + travelling multi-colour frame */}
              <span className={styles.brandAura} aria-hidden="true" />
              <span className={styles.brandBorder} aria-hidden="true" />
              <Link href={ROUTES.home} className={styles.logo} aria-label="MRZ — home">
                <Image
                  src="/brand/mrz-logo-dark-surface.webp"
                  alt="MRZ Management Services FZE LLC"
                  width={553}
                  height={222}
                  sizes="180px"
                  quality={85}
                  className={styles.logoImg}
                />
              </Link>
              <p className={styles.brandLine}>
                Your single, accountable partner for doing business in the UAE.
              </p>
              <ul className={styles.contact}>
                <li>
                  <a href={CONTACT.phoneHref} className={styles.contactLink}>
                    <span className={styles.contactIcon}><PhoneIcon /></span>
                    <span className={styles.contactText}>
                      <span className={styles.contactLabel}>Call us</span>
                      {CONTACT.phoneDisplay}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`} className={styles.contactLink}>
                    <span className={styles.contactIcon}><MailIcon /></span>
                    <span className={styles.contactText}>
                      <span className={styles.contactLabel}>Email</span>
                      {CONTACT.email}
                    </span>
                  </a>
                </li>
                <li className={styles.contactStatic}>
                  <span className={styles.contactIcon}><PinIcon /></span>
                  <span className={styles.contactText}>
                    <span className={styles.contactLabel}>Visit</span>
                    {CONTACT.address.building}, {CONTACT.address.floor}
                    <span>{CONTACT.address.street}</span>
                    <span>{CONTACT.address.city}, {CONTACT.address.country}</span>
                  </span>
                </li>
              </ul>
            </TiltCard>
          </motion.div>

          {/* services directory */}
          <motion.nav className={`${styles.col} ${styles.colWide}`} aria-label="Services" variants={reduce ? undefined : colVariants}>
            <h3 className={styles.colTitle}>Services</h3>
            <ul className={`${styles.linkList} ${styles.servicesList}`}>
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={s.href} className={styles.link}>
                    <span className={styles.linkDot} aria-hidden="true" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* industries directory */}
          <motion.nav className={styles.col} aria-label="Industries" variants={reduce ? undefined : colVariants}>
            <h3 className={styles.colTitle}>Industries</h3>
            <ul className={styles.linkList}>
              {industries.map((ind) => (
                <li key={ind.id}>
                  <Link href={ind.href} className={styles.link}>
                    <span className={styles.linkDot} aria-hidden="true" />
                    {ind.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* company links */}
          <motion.nav className={`${styles.col} ${styles.colCompany}`} aria-label="Company" variants={reduce ? undefined : colVariants}>
            <h3 className={styles.colTitle}>Company</h3>
            <ul className={styles.linkList}>
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={styles.link}>
                    <span className={styles.linkDot} aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>

        <motion.div
          className={styles.bottom}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.6 }}
          variants={reduce ? undefined : bottomVariants}
        >
          <p className={styles.copy}>
            © {year} MRZ Management Services FZE LLC. <span className={styles.rights}>All rights reserved.</span>
          </p>
          <div className={styles.bottomRight}>
            <span className={styles.locale}>
              <span className={styles.localeDot} aria-hidden="true" />
              Amber Gem Tower · Ajman, UAE
            </span>
            <button type="button" className={styles.toTop} onClick={toTop}>
              Back to top
              <span className={styles.toTopIcon} aria-hidden="true"><ArrowUp /></span>
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
