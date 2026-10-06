"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { TiltCard } from "@/components/sections/TiltCard";
import { services } from "@/data/services";
import { accentStyle } from "@/data/serviceContent";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./ServicesIndex.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

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

function Plus() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14" className={styles.plusBar} />
      <path d="M5 12h14" />
    </svg>
  );
}

/* Services-page FAQs — grounded in the firm's positioning and the vetted
   services data; no invented pricing, timelines or guarantees. */
const FAQS = [
  {
    q: "How many services does MRZ offer, and what are they?",
    a: "Ten specialist services under one team: commercial brokerage, general trading, IT consultancy, cyber security architecture, accounting & bookkeeping, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision and UAE documents clearing.",
  },
  {
    q: "Can I combine several services, or do I have to choose one?",
    a: "You can combine as many as you need. One accountable team and a single point of contact means trade, technology, finance, people and compliance work can run end to end together, instead of across separate providers.",
  },
  {
    q: "Where is MRZ based, and which areas do you cover?",
    a: "Our office is at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates. We coordinate support for businesses across the country.",
  },
  {
    q: "How does MRZ keep UAE approvals and paperwork on track?",
    a: "Every engagement is documentation-led and compliance-first — checklists, readiness reviews and clear follow-up are built in, so approvals move smoothly with fewer delays.",
  },
  {
    q: "I'm not sure which service I need — can you help me decide?",
    a: "Yes. Book a free consultation and we'll review your requirements, point you to the right services and outline a clear, documentation-led plan before any work begins.",
  },
];

const STATS = [
  { value: "10", label: "specialist services" },
  { value: "1", label: "accountable team" },
  { value: "UAE", label: "coverage, Ajman-based" },
];

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Services index — a full page listing all ten services as glassmorphism cards
 * that tilt in 3D toward the pointer, each carrying its own accent colour and a
 * travelling-colour border that lights up on hover. A slow conic "aurora" washes
 * colour behind the hero (transform-only, so it is composited, not repainted).
 * All copy and routes come from the vetted services data — nothing invented.
 */
export function ServicesIndex() {
  const reduce = useReducedMotion() ?? false;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="services-title">
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            What we do
          </p>
          <h1 id="services-title" className={styles.title}>
            Our <span className={styles.titleAccent}>services</span>
          </h1>
          <p className={styles.lead}>
            Ten specialist services — trade, technology, engineering, finance, people and compliance —
            delivered by one coordinated UAE team, documentation-led from first conversation to completion.
          </p>

          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statValue}>{s.value}</dt>
                <dd className={styles.statLabel}>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- grid */}
      <section className={styles.listSection} aria-labelledby="services-list-title">
        <header className={styles.listHead}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            The full range
          </p>
          <h2 id="services-list-title" className={styles.listTitle}>
            Ten specialist services, <span className={styles.titleAccent}>one coordinated team</span>
          </h2>
        </header>

        <motion.ul
          className={styles.grid}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.08 }}
          variants={reduce ? undefined : listVariants}
        >
          {services.map((s) => (
            <motion.li
              key={s.id}
              className={styles.cell}
              style={accentStyle(s.accent)}
              variants={reduce ? undefined : itemVariants}
            >
              <TiltCard className={styles.card} max={9} lift={8}>
                <span className={styles.glow} aria-hidden="true" />
                <span className={styles.travel} aria-hidden="true" />

                <div className={styles.media}>
                  <Image
                    src={`/images/services/${s.id}.card.webp`}
                    alt={s.imageAlt}
                    fill
                    className={styles.img}
                    sizes="(max-width: 560px) 92vw, (max-width: 960px) 46vw, 380px"
                    quality={85}
                  />
                  <span className={styles.mediaShade} aria-hidden="true" />
                  <span className={styles.cat}>{s.category}</span>
                </div>

                <div className={styles.body}>
                  <span className={styles.iconTile} aria-hidden="true">
                    <MenuIcon name={s.icon} width={22} height={22} />
                  </span>
                  <h2 className={styles.cardTitle}>
                    <Link href={s.href} className={styles.cardLink}>
                      {s.title}
                    </Link>
                  </h2>
                  <p className={styles.blurb}>{s.blurb ?? s.description}</p>
                  <span className={styles.more}>
                    Explore
                    <span className={styles.moreIcon} aria-hidden="true">
                      <Arrow />
                    </span>
                  </span>
                </div>
              </TiltCard>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ---------------------------------------------------------- faqs */}
      <section className={styles.faqSection} aria-labelledby="services-faqs-title">
        <span className={styles.faqAurora} aria-hidden="true" />
        <div className={styles.faqInner}>
          <header className={styles.faqHead}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Answers
            </p>
            <h2 id="services-faqs-title" className={styles.faqTitle}>
              Frequently asked <span className={styles.titleAccent}>questions</span>
            </h2>
            <p className={styles.faqLead}>
              The essentials about working with MRZ across all ten services. Still have a question?{" "}
              <Link href={ROUTES.contact} className={styles.faqLeadLink}>
                Talk to our team
              </Link>
              .
            </p>
          </header>

          <motion.ul
            className={styles.faqList}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : listVariants}
          >
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `services-faq-panel-${i}`;
              const btnId = `services-faq-btn-${i}`;
              return (
                <motion.li
                  key={item.q}
                  className={styles.faqItem}
                  data-open={isOpen || undefined}
                  variants={reduce ? undefined : itemVariants}
                >
                  <h3 className={styles.faqQHead}>
                    <button
                      id={btnId}
                      type="button"
                      className={styles.faqTrigger}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span className={styles.faqQ}>{item.q}</span>
                      <span className={styles.faqIcon} aria-hidden="true">
                        <Plus />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className={styles.faqPanel}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: EASE }}
                      >
                        <p className={styles.faqAnswer}>{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={styles.ctaSection} aria-labelledby="services-cta-title">
        <div className={styles.ctaPanel}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.ctaCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Not sure where to start?
            </p>
            <h2 id="services-cta-title" className={styles.ctaTitle}>
              Tell us what you need — we&apos;ll map the right services.
            </h2>
            <p className={styles.ctaLead}>
              One conversation is enough to point you in the right direction, with a clear,
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
