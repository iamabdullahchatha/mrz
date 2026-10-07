"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSpotlight } from "@/components/common/useSpotlight";
import { MenuIcon } from "@/components/header/menuIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { services } from "@/data/services";
import { PROCESS_STEPS, accentStyle } from "@/data/serviceContent";
import type { MenuEntry } from "@/data/types";
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

function ArrowDown() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
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

function Mail() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
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
    a: "Nine specialist services under one team: commercial brokerage, general trading, IT consultancy, cyber security architecture, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision and UAE documents clearing.",
  },
  {
    q: "Can I combine several services, or do I have to choose one?",
    a: "You can combine as many as you need. One accountable team and a single point of contact means trade, technology, engineering, people and compliance work can run end to end together, instead of across separate providers.",
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

/** Disciplines in data order, each with its service count — drives the filter bar. */
const CATEGORIES = Array.from(new Set(services.map((s) => s.category)));
const FILTERS = [
  { id: "all", label: "All", count: services.length },
  ...CATEGORIES.map((c) => ({ id: c, label: c, count: services.filter((s) => s.category === c).length })),
];

const STATS = [
  { value: String(services.length), label: "Specialist services" },
  { value: String(CATEGORIES.length), label: "Core disciplines" },
  { value: "1", label: "Accountable team" },
  { value: "Free", label: "First consultation" },
];

/* The hero wall deals the services into three drifting columns. It uses each
   service's detail-page photo, so nothing repeats the card photos further down. */
const WALL_COLUMNS: MenuEntry[][] = [0, 1, 2].map((c) => services.filter((_, i) => i % 3 === c));

const heroVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE, delay: Math.min(i, 8) * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.25, ease: EASE } },
};

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/**
 * Services index. A split hero pairs the headline with a tilted 3D "wall" of
 * service photos drifting in opposite directions; a ticker of every service runs
 * beneath it. The catalogue can be filtered by discipline (cards re-flow with
 * layout animation) and a cursor spotlight lights the borders of nearby cards.
 * A four-step "how we work" timeline, a two-column FAQ and a closing CTA follow.
 * Every animation is transform/opacity only and stills under reduced motion.
 * All copy and routes come from the vetted services data — nothing invented.
 */
export function ServicesIndex() {
  const reduce = useReducedMotion() ?? false;
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { ref: gridRef, onPointerMove } = useSpotlight<HTMLUListElement>();
  const inView = useInView(gridRef, { once: true, amount: 0.08 });
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

  const visible = filter === "all" ? services : services.filter((s) => s.category === filter);

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="services-title">
        <span className={styles.gridBg} aria-hidden="true" />
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroCopy}
            initial={reduce ? false : "hidden"}
            animate="shown"
            variants={reduce ? undefined : heroVariants}
          >
            <motion.nav className={styles.crumbs} aria-label="Breadcrumb" variants={reduce ? undefined : riseVariants}>
              <Link href={ROUTES.home}>Home</Link>
              <span aria-hidden="true">/</span>
              <span className={styles.crumbCurrent} aria-current="page">
                Services
              </span>
            </motion.nav>

            <motion.p className={styles.kicker} variants={reduce ? undefined : riseVariants}>
              <span className={styles.kickerDot} aria-hidden="true" />
              What we do
            </motion.p>

            <motion.h1 id="services-title" className={styles.title} variants={reduce ? undefined : riseVariants}>
              Specialist services, <span className={styles.titleAccent}>one trusted team</span>
            </motion.h1>

            <motion.p className={styles.lead} variants={reduce ? undefined : riseVariants}>
              Trade, technology, engineering, people and compliance — delivered by one coordinated UAE team,
              documentation-led from the first conversation to completion.
            </motion.p>

            <motion.div className={styles.heroActions} variants={reduce ? undefined : riseVariants}>
              <a href="#services-list" className={styles.primary}>
                Explore services
                <span className={styles.primaryIcon} aria-hidden="true">
                  <ArrowDown />
                </span>
              </a>
              <Link href={ROUTES.contact} className={styles.secondary}>
                Book a free consultation
              </Link>
            </motion.div>

            <motion.dl className={styles.stats} variants={reduce ? undefined : riseVariants}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <dt className={styles.statLabel}>{s.label}</dt>
                  <dd className={styles.statValue}>{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* decorative 3D photo wall — the real, linked list is below */}
          <motion.div
            className={styles.wallWrap}
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          >
            <div className={styles.wall}>
              <div className={styles.wallPlane}>
                {WALL_COLUMNS.map((col, ci) => (
                  <div key={ci} className={styles.wallCol}>
                    <div className={styles.wallTrack} data-dir={ci % 2 ? "down" : "up"}>
                      {[...col, ...col].map((s, i) => (
                        <div key={`${s.id}-${i}`} className={styles.tile} style={accentStyle(s.accent)}>
                          <Image
                            src={s.image}
                            alt=""
                            fill
                            className={styles.tileImg}
                            sizes="(max-width: 1024px) 30vw, 210px"
                            style={{ objectPosition: s.imagePosition ?? "center" }}
                          />
                          <span className={styles.tileShade} />
                          <span className={styles.tileMeta}>
                            <span className={styles.tileIcon}>
                              <MenuIcon name={s.icon} width={16} height={16} />
                            </span>
                            {s.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatA}`}>
              <span className={styles.floatIcon}>
                <MenuIcon name="building" width={20} height={20} />
              </span>
              <span className={styles.floatText}>
                <span className={styles.floatLabel}>Based in</span>
                <span className={styles.floatValue}>Ajman · UAE</span>
              </span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatB}`}>
              <span className={styles.floatStatValue}>{services.length}</span>
              <span className={styles.floatStatLabel}>
                services,
                <br />
                one contact
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------- ticker */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...services, ...services].map((s, i) => (
            <span key={`${s.id}-${i}`} className={styles.tickerItem}>
              <span className={styles.tickerIcon}>
                <MenuIcon name={s.icon} width={16} height={16} />
              </span>
              {s.title}
              <span className={styles.tickerSep} />
            </span>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- grid */}
      <section id="services-list" className={styles.listSection} aria-labelledby="services-list-title">
        <header className={styles.listHead}>
          <div className={styles.listHeadCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              The full range
            </p>
            <h2 id="services-list-title" className={styles.listTitle}>
              Every service, <span className={styles.titleAccent}>one coordinated team</span>
            </h2>
          </div>

          <div className={styles.filters} role="group" aria-label="Filter services by discipline">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={styles.filter}
                  aria-pressed={on}
                  data-on={on || undefined}
                  onClick={() => setFilter(f.id)}
                >
                  {on ? (
                    <motion.span
                      layoutId="services-filter-pill"
                      className={styles.filterPill}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className={styles.filterLabel}>{f.label}</span>
                  <span className={styles.filterCount}>{f.count}</span>
                </button>
              );
            })}
          </div>
        </header>

        <p className="visually-hidden" aria-live="polite">
          {filter === "all" ? `Showing all ${services.length} services` : `Showing ${visible.length} ${filter} services`}
        </p>

        <ul ref={gridRef} className={styles.grid} onPointerMove={onPointerMove}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((s, i) => (
              <motion.li
                key={s.id}
                layout={!reduce}
                data-spot=""
                className={styles.cell}
                style={accentStyle(s.accent)}
                custom={i}
                variants={reduce ? undefined : cardVariants}
                initial={reduce ? false : "hidden"}
                animate={inView ? "shown" : "hidden"}
                exit={reduce ? undefined : "exit"}
              >
                <TiltCard className={styles.card} max={8} lift={8}>
                  <span className={styles.spotFill} aria-hidden="true" />
                  <span className={styles.spot} aria-hidden="true" />
                  <span className={styles.glow} aria-hidden="true" />
                  <span className={styles.travel} aria-hidden="true" />

                  <div className={styles.media}>
                    <div className={styles.mediaFrame}>
                      <Image
                        src={`/images/services/${s.id}.card.webp`}
                        alt={s.imageAlt}
                        fill
                        className={styles.img}
                        sizes="(max-width: 620px) 92vw, (max-width: 960px) 46vw, 400px"
                        quality={85}
                      />
                    </div>
                    <span className={styles.mediaShade} aria-hidden="true" />
                    <span className={styles.cat}>{s.category}</span>
                    <span className={styles.index} aria-hidden="true">
                      {pad2(services.indexOf(s) + 1)}
                    </span>
                  </div>

                  <div className={styles.body}>
                    <span className={styles.iconTile} aria-hidden="true">
                      <MenuIcon name={s.icon} width={22} height={22} />
                    </span>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.blurb}>{s.blurb ?? s.description}</p>
                    <span className={styles.more}>
                      Explore service
                      <span className={styles.moreIcon} aria-hidden="true">
                        <Arrow />
                      </span>
                    </span>
                  </div>
                  <Link href={s.href} className={styles.cardLink} aria-label={`View ${s.title} service`} />
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      {/* -------------------------------------------------------- process */}
      <section className={styles.process} aria-labelledby="services-process-title">
        <span className={styles.processGlow} aria-hidden="true" />
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              How we work
            </p>
            <h2 id="services-process-title" className={styles.sectionTitle}>
              One clear path, <span className={styles.titleAccent}>whichever service you choose</span>
            </h2>
            <p className={styles.sectionLead}>
              Every engagement follows the same documentation-led approach, so you always know what happens next
              and who is accountable for it.
            </p>
          </header>

          <div ref={stepsRef} className={styles.stepsWrap} data-shown={stepsInView || reduce || undefined}>
            <span className={styles.stepsRail} aria-hidden="true">
              <span className={styles.stepsRailFill} />
            </span>
            <motion.ol
              className={styles.steps}
              initial={reduce ? false : "hidden"}
              animate={stepsInView ? "shown" : "hidden"}
              variants={reduce ? undefined : listVariants}
            >
              {PROCESS_STEPS.map((step) => (
                <motion.li key={step.n} className={styles.step} variants={reduce ? undefined : riseVariants}>
                  <span className={styles.stepNode} aria-hidden="true">
                    {step.n}
                  </span>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
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
              The essentials about working with MRZ across every service. Still have a question? Our team is a call
              or an email away.
            </p>

            <div className={styles.contactCard}>
              <a href={CONTACT.phoneHref} className={styles.contactRow}>
                <span className={styles.contactIcon}>
                  <Phone />
                </span>
                <span className={styles.contactText}>
                  <span className={styles.contactLabel}>Call us</span>
                  <span className={styles.contactValue}>{CONTACT.phoneDisplay}</span>
                </span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className={styles.contactRow}>
                <span className={styles.contactIcon}>
                  <Mail />
                </span>
                <span className={styles.contactText}>
                  <span className={styles.contactLabel}>Email us</span>
                  <span className={styles.contactValue}>{CONTACT.email}</span>
                </span>
              </a>
            </div>
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
                  variants={reduce ? undefined : riseVariants}
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
                      <span className={styles.faqNum} aria-hidden="true">
                        {pad2(i + 1)}
                      </span>
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
        <motion.div
          className={styles.ctaPanel}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className={styles.ctaGrid} aria-hidden="true" />
          <span className={styles.ctaGlow} aria-hidden="true" />
          <span className={styles.ctaGlowB} aria-hidden="true" />
          <span className={styles.ctaBorder} aria-hidden="true" />

          <div className={styles.ctaCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Not sure where to start?
            </p>
            <h2 id="services-cta-title" className={styles.ctaTitle}>
              Tell us what you need — <span className={styles.titleAccent}>we&apos;ll map the right services.</span>
            </h2>
            <p className={styles.ctaLead}>
              One conversation is enough to point you in the right direction, with a clear, documentation-led plan
              before any work begins.
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
        </motion.div>
      </section>
    </div>
  );
}
