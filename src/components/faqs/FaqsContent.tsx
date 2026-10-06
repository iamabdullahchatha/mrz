"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { CONTACT, ROUTES } from "@/lib/routes";
import { TiltCard } from "@/components/sections/TiltCard";
import styles from "./Faqs.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------- icons */
function Plus() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function Search() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
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
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* category glyphs */
function IconAbout() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V21" />
      <path d="M15 9h3.5A1.5 1.5 0 0 1 20 10.5V21" />
      <path d="M8.5 7h3M8.5 11h3M8.5 15h3" />
    </svg>
  );
}

function IconWorking() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.4" />
      <path d="M17.5 14.2a5.5 5.5 0 0 1 3 4.9" />
    </svg>
  );
}

function IconStart() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 22V3" />
      <path d="M5 4h12l-2.5 3.5L17 11H5" />
    </svg>
  );
}

const GROUP_ICONS: Record<string, ReactNode> = {
  about: <IconAbout />,
  working: <IconWorking />,
  starting: <IconStart />,
};

/* ----------------------------------------------------------------- data
   Answers paraphrased from the live MRZ positioning and the vetted services
   data — no invented pricing, timelines or claims. Kept grounded. */
const CATEGORIES = [
  {
    id: "about",
    label: "About MRZ",
    items: [
      {
        q: "What services does MRZ provide?",
        a: "Ten specialist services under one team: commercial brokerage, general trading, IT consultancy, cyber security architecture, accounting & bookkeeping, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision and UAE documents clearing.",
      },
      {
        q: "Where is MRZ based, and which areas do you serve?",
        a: "Our office is at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates. We coordinate support for businesses across the country.",
      },
      {
        q: "Is MRZ really one team, or separate companies?",
        a: "MRZ Management Services FZE LLC is a single, accountable team. Trade, technology, finance, people, engineering and compliance all sit under one roof — not separate vendors you have to line up and manage yourself.",
      },
    ],
  },
  {
    id: "working",
    label: "Working with MRZ",
    items: [
      {
        q: "Can you handle several services together, or just one at a time?",
        a: "Both. You get a single accountable team and one point of contact, so trade, technology, finance, people and compliance work can run end to end together instead of across separate providers.",
      },
      {
        q: "Who will I deal with day to day?",
        a: "One accountable point of contact stays with you from the first plan through to day-to-day operations, pulling in the right specialists behind the scenes so you never have to chase several vendors.",
      },
      {
        q: "How does MRZ keep UAE approvals and paperwork on track?",
        a: "Every engagement is documentation-led and compliance-first — checklists, readiness reviews and clear follow-up are built in, so approvals move smoothly with fewer delays.",
      },
    ],
  },
  {
    id: "starting",
    label: "Getting started",
    items: [
      {
        q: "How do I get started with MRZ?",
        a: "Book a free consultation. We review your requirements, outline what's needed and give you a clear, documentation-led plan before any work begins.",
      },
      {
        q: "What happens after I get in touch?",
        a: "We read your message, work out which parts of MRZ apply — trade, technology, finance, people or compliance — and come back with a clear next step and one named contact to take it forward.",
      },
      {
        q: "Is the first consultation really free?",
        a: "Yes. The initial consultation is free and no-obligation — a genuine conversation to understand what you need, with a documented plan before any work starts.",
      },
    ],
  },
] as const;

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const headVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function FaqsContent() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState<string>("about-0");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return CATEGORIES.map((c) => ({ ...c, items: [...c.items] }));
    return CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter((it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)),
    })).filter((c) => c.items.length > 0);
  }, [q]);

  const totalMatches = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="faqs-hero-title">
        <span className={`${styles.blob} ${styles.blobRoyal}`} style={{ top: "-14%", left: "-8%" }} aria-hidden="true" />
        <span className={`${styles.blob} ${styles.blobGold}`} style={{ top: "4%", right: "-8%" }} aria-hidden="true" />
        <div className={styles.inner}>
          <motion.div
            className={styles.heroInner}
            initial={reduce ? false : "hidden"}
            animate="shown"
            variants={headVariants}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Help &amp; answers
            </p>
            <h1 id="faqs-hero-title" className={styles.title}>
              Frequently asked <span className={styles.titleAccent}>questions</span>
            </h1>
            <p className={styles.lead}>
              The essentials about working with MRZ — what we do, how we work and how to get started.
              Can&apos;t find your answer? Our team is one message away.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- body */}
      <section className={styles.body} aria-label="Questions and answers">
        <span className={`${styles.blob} ${styles.blobRoyal}`} style={{ bottom: "2%", right: "-12%" }} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.layout}>
            {/* sticky aside */}
            <motion.aside
              className={styles.aside}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
              variants={headVariants}
            >
              <TiltCard className={styles.asideCard} max={6} lift={0}>
                <h2 className={styles.asideTitle}>Still have questions?</h2>
                <p className={styles.asideText}>
                  Talk to the team directly — you&apos;ll always be speaking to the people who do the work.
                </p>
                <div className={styles.asideActions}>
                  <a href={CONTACT.phoneHref} className={styles.asideBtn}>
                    <span className={styles.asideBtnIcon} aria-hidden="true"><Phone /></span>
                    {CONTACT.phoneDisplay}
                  </a>
                  <a href={`mailto:${CONTACT.email}`} className={styles.asideBtn}>
                    <span className={styles.asideBtnIcon} aria-hidden="true"><Mail /></span>
                    {CONTACT.email}
                  </a>
                </div>
                <Link href={ROUTES.contact} className={styles.asidePrimary}>
                  Contact us
                  <span className={styles.asidePrimaryIcon} aria-hidden="true"><Arrow /></span>
                </Link>
              </TiltCard>
            </motion.aside>

            {/* main column */}
            <div className={styles.main}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon} aria-hidden="true"><Search /></span>
                <input
                  type="search"
                  className={styles.search}
                  placeholder="Search questions…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search frequently asked questions"
                />
              </div>

              {totalMatches === 0 ? (
                <div className={styles.noResults}>
                  <p className={styles.noResultsTitle}>No questions match &ldquo;{query}&rdquo;</p>
                  <p className={styles.noResultsText}>
                    Try a different word, or{" "}
                    <Link href={ROUTES.contact} className={styles.inlineLink}>
                      ask us directly
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                filtered.map((cat) => (
                  <div key={cat.id} className={styles.group} id={`faq-${cat.id}`}>
                    <div className={styles.groupHead}>
                      <span className={styles.groupIcon} aria-hidden="true">{GROUP_ICONS[cat.id]}</span>
                      <div className={styles.groupMeta}>
                        <h2 className={styles.groupLabel}>{cat.label}</h2>
                        <p className={styles.groupCount}>
                          {cat.items.length} {cat.items.length === 1 ? "question" : "questions"}
                        </p>
                      </div>
                    </div>
                    <motion.ul
                      className={styles.list}
                      initial={reduce ? false : "hidden"}
                      whileInView="shown"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={reduce ? undefined : listVariants}
                    >
                      {cat.items.map((item, i) => {
                        const key = `${cat.id}-${i}`;
                        const isOpen = open === key;
                        const panelId = `faq-panel-${key}`;
                        const btnId = `faq-btn-${key}`;
                        return (
                          <motion.li
                            key={key}
                            className={styles.itemCell}
                            variants={reduce ? undefined : itemVariants}
                          >
                            <TiltCard className={styles.item} dataOpen={isOpen} max={5} lift={4} glare={false}>
                              <h3 className={styles.qHead}>
                                <button
                                  id={btnId}
                                  type="button"
                                  className={styles.trigger}
                                  aria-expanded={isOpen}
                                  aria-controls={panelId}
                                  onClick={() => setOpen(isOpen ? "" : key)}
                                >
                                  <span className={styles.qText}>{item.q}</span>
                                  <span className={styles.icon} aria-hidden="true">
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
                                    className={styles.panel}
                                    initial={reduce ? false : { height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                    transition={{ duration: 0.36, ease: EASE }}
                                  >
                                    <p className={styles.answer}>{item.a}</p>
                                  </motion.div>
                                ) : null}
                              </AnimatePresence>
                            </TiltCard>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- closing */}
      <section className={styles.closing} aria-labelledby="faqs-closing-title">
        <div className={styles.inner}>
          <motion.div
            className={styles.closingReveal}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            variants={headVariants}
          >
            <TiltCard className={styles.closingPanel} max={5} lift={0}>
              <h2 id="faqs-closing-title" className={styles.closingTitle}>
                Ready to put one team on it?
              </h2>
              <p className={styles.closingText}>
                Book a free, no-obligation consultation and we&apos;ll map out exactly what&apos;s needed before any
                work begins.
              </p>
              <div className={styles.closingActions}>
                <Link href={ROUTES.contact} className={styles.primary}>
                  Book a free consultation
                  <span className={styles.primaryIcon} aria-hidden="true"><Arrow /></span>
                </Link>
                <a href={CONTACT.phoneHref} className={styles.secondary}>
                  <Phone />
                  Call {CONTACT.phoneDisplay}
                </a>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}
