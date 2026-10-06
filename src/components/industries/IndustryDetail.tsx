"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { TiltCard } from "@/components/sections/TiltCard";
import { services } from "@/data/services";
import { accentStyle } from "@/data/serviceContent";
import type { IndustryContent } from "@/data/industryContent";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./Industries.module.css";

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

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5L20 7" />
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

const GLOW: Record<string, string> = {
  gold: "rgba(220, 169, 88, 0.45)",
  royal: "rgba(36, 83, 214, 0.52)",
  copper: "rgba(201, 124, 74, 0.48)",
  ice: "rgba(120, 170, 255, 0.46)",
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 10 },
  shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
};

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 12 },
  shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: EASE } },
};

interface IndustryDetailProps {
  industry: MenuEntry;
  detail: IndustryContent;
}

/**
 * Industry detail page with ultra-3D depth: the hero photo sits on a tilting glass
 * plane with floating layers (chip, title card, stat) pushed toward the viewer;
 * challenge and service cards rise in with rotateX and tilt toward the pointer;
 * the FAQ accordion uses the travelling accent border. Copy and services come from
 * the vetted data — nothing is invented.
 */
export function IndustryDetail({ industry, detail }: IndustryDetailProps) {
  const reduce = useReducedMotion() ?? false;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const linked = detail.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is MenuEntry => Boolean(s));

  return (
    <div
      className={styles.page}
      style={{ "--glow": GLOW[industry.accent] ?? GLOW.gold, ...accentStyle(industry.accent) } as CSSProperties}
    >
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="industry-title">
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />

        <div className={`${styles.heroInner} ${styles.heroSplit}`}>
          <div className={styles.heroCopy}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link href={ROUTES.home}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={ROUTES.industries}>Industries</Link>
              <span aria-hidden="true">/</span>
              <span className={styles.crumbCurrent}>{industry.title}</span>
            </nav>

            <p className={styles.kicker}>
              <span className={styles.iconChip} aria-hidden="true">
                <MenuIcon name={industry.icon} width={18} height={18} />
              </span>
              {industry.category}
            </p>

            <h1 id="industry-title" className={styles.title}>
              {industry.title}
            </h1>
            <p className={styles.tagline}>{detail.tagline}</p>

            <div className={styles.heroActions}>
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

          {/* 3D stage: the photo tilts as one plane; floating layers sit in front */}
          <div className={styles.stage}>
            <TiltCard className={styles.heroMedia} max={9} lift={0} glare>
              <span className={styles.travel} aria-hidden="true" />
              <Image
                src={industry.image}
                alt={industry.imageAlt}
                fill
                className={styles.heroImg}
                sizes="(max-width: 960px) 92vw, 560px"
                quality={88}
                priority
              />
              <span className={styles.heroShade} aria-hidden="true" />
            </TiltCard>

            <motion.div
              className={styles.floatChip}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              aria-hidden="true"
            >
              <span className={styles.floatIcon}>
                <MenuIcon name={industry.icon} width={20} height={20} />
              </span>
              <span className={styles.floatText}>
                <span className={styles.floatLabel}>Sector</span>
                <span className={styles.floatValue}>{industry.category}</span>
              </span>
            </motion.div>

            <motion.div
              className={styles.floatStat}
              initial={reduce ? false : { opacity: 0, y: -20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              aria-hidden="true"
            >
              <span className={styles.floatStatValue}>{linked.length}</span>
              <span className={styles.floatStatLabel}>
                specialist {linked.length === 1 ? "service" : "services"}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        {/* ------------------------------------------------------ overview */}
        <section className={styles.overview} aria-labelledby="overview-title">
          <motion.div
            className={styles.overviewPanel}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "shown"}
            viewport={{ once: true, amount: 0.2 }}
            variants={reduce ? undefined : sectionReveal}
          >
            <span className={styles.overviewAurora} aria-hidden="true" />
            <div className={styles.overviewGrid}>
              <div>
                <p className={styles.eyebrow}>Overview</p>
                <h2 id="overview-title" className={styles.sectionTitle}>
                  Support built for {industry.title.toLowerCase()}
                </h2>
                {detail.overview.map((p) => (
                  <p key={p} className={styles.paragraph}>
                    {p}
                  </p>
                ))}
              </div>

              <div className={styles.outcomesCard}>
                <p className={styles.outcomesLabel}>What you get</p>
                <ul className={styles.outcomes}>
                  {detail.outcomes.map((o) => (
                    <li key={o} className={styles.outcome}>
                      <span className={styles.check} aria-hidden="true">
                        <Check />
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* -------------------------------------------------- challenges */}
        <section className={styles.block} aria-labelledby="challenges-title">
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Common challenges</p>
            <h2 id="challenges-title" className={styles.sectionTitle}>
              Where {industry.title.toLowerCase()} need support
            </h2>
          </header>

          <motion.ul
            className={styles.depthGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : listVariants}
          >
            {detail.challenges.map((c, i) => (
              <motion.li key={c.title} className={styles.depthCell} variants={reduce ? undefined : itemVariants}>
                <TiltCard className={styles.depthCard} max={9} lift={8} glare={false}>
                  <span className={styles.travel} aria-hidden="true" />
                  <span className={styles.depthNum} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.depthTitle}>{c.title}</h3>
                  <p className={styles.depthText}>{c.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* ---------------------------------------------------- services */}
        <section className={styles.block} aria-labelledby="serving-title">
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Services for this sector</p>
            <h2 id="serving-title" className={styles.sectionTitle}>
              The services that serve {industry.title.toLowerCase()}
            </h2>
          </header>

          <motion.ul
            className={styles.svcGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.12 }}
            variants={reduce ? undefined : listVariants}
          >
            {linked.map((s) => (
              <motion.li key={s.id} className={styles.depthCell} style={accentStyle(s.accent)} variants={reduce ? undefined : itemVariants}>
                <TiltCard className={styles.svcCard} max={8} lift={7} glare={false}>
                  <span className={styles.travel} aria-hidden="true" />
                  <span className={styles.svcIcon} aria-hidden="true">
                    <MenuIcon name={s.icon} width={20} height={20} />
                  </span>
                  <span className={styles.svcCat}>{s.category}</span>
                  <h3 className={styles.svcTitle}>{s.title}</h3>
                  <p className={styles.svcText}>{s.blurb ?? s.description}</p>
                  <Link href={s.href} className={styles.svcLink}>
                    Explore service
                    <Arrow />
                  </Link>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* ------------------------------------------------------- faqs */}
        <section className={styles.faqs} aria-labelledby="industry-faqs-title">
          <span className={styles.sideAurora} aria-hidden="true" />
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Good to know</p>
            <h2 id="industry-faqs-title" className={styles.sectionTitle}>
              {industry.title} — frequently asked questions
            </h2>
          </header>

          <motion.ul
            className={styles.faqList}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            variants={reduce ? undefined : listVariants}
          >
            {detail.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `ind-faq-panel-${i}`;
              const btnId = `ind-faq-btn-${i}`;
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
        </section>

        {/* ---------------------------------------------------------- cta */}
        <section className={styles.ctaSection} aria-labelledby="industry-cta-title">
          <div className={styles.ctaPanel}>
            <span className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaCopy}>
              <p className={styles.kicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                Ready when you are
              </p>
              <h2 id="industry-cta-title" className={styles.ctaTitle}>
                Let&apos;s talk about your {industry.title.toLowerCase()} needs.
              </h2>
              <p className={styles.ctaLead}>
                Book a free consultation and we&apos;ll outline a clear, documentation-led plan before any work begins —
                no obligation.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href={ROUTES.contact} className={styles.primary}>
                Book a free consultation
                <span className={styles.primaryIcon} aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <Link href={ROUTES.services} className={styles.secondary}>
                Explore all services
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.backWrap}>
          <Link href={ROUTES.industries} className={styles.backLink}>
            <Arrow />
            All industries
          </Link>
        </div>
      </div>
    </div>
  );
}
