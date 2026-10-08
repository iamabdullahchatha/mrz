"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import kit from "@/components/common/PageKit.module.css";
import { Arrow, Close, Mail, Phone, Plus, Search } from "@/components/common/kitIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./Faqs.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/* --------------------------------------------------------- topic glyphs */
type GlyphProps = { size?: number };

function IconAbout({ size = 22 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V21" />
      <path d="M15 9h3.5A1.5 1.5 0 0 1 20 10.5V21" />
      <path d="M8.5 7h3M8.5 11h3M8.5 15h3" />
    </svg>
  );
}

function IconWorking({ size = 22 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.4" />
      <path d="M17.5 14.2a5.5 5.5 0 0 1 3 4.9" />
    </svg>
  );
}

function IconStart({ size = 22 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 22V3" />
      <path d="M5 4h12l-2.5 3.5L17 11H5" />
    </svg>
  );
}

function IconHelp({ size = 22 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.6 9.2a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.4" />
      <path d="M12 16.4h.01" />
    </svg>
  );
}

const GROUP_ICONS: Record<string, (p: GlyphProps) => ReactNode> = {
  about: IconAbout,
  working: IconWorking,
  starting: IconStart,
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
        a: "Ten specialist services under one team: commercial brokerage, general trading, IT consultancy, cyber security architecture, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision, manpower & workforce solutions and HR compliance & risk management.",
      },
      {
        q: "Where is MRZ based, and which areas do you serve?",
        a: "Our office is at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates. We coordinate support for businesses across the country.",
      },
      {
        q: "Is MRZ really one team, or separate companies?",
        a: "MRZ Management Services FZE LLC is a single, accountable team. Trade, technology, engineering, people and operations all sit under one roof — not separate vendors you have to line up and manage yourself.",
      },
    ],
  },
  {
    id: "working",
    label: "Working with MRZ",
    items: [
      {
        q: "Can you handle several services together, or just one at a time?",
        a: "Both. You get a single accountable team and one point of contact, so trade, technology, engineering, people and operations work can run end to end together instead of across separate providers.",
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
        a: "We read your message, work out which parts of MRZ apply — trade, technology, engineering, people or operations — and come back with a clear next step and one named contact to take it forward.",
      },
      {
        q: "Is the first consultation really free?",
        a: "Yes. The initial consultation is free and no-obligation — a genuine conversation to understand what you need, with a documented plan before any work starts.",
      },
    ],
  },
] as const;

const TOTAL = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/* running number of each topic's first question, so numbering survives filtering */
const OFFSETS = CATEGORIES.reduce<Record<string, number>>((acc, c, i) => {
  acc[c.id] = i === 0 ? 0 : acc[CATEGORIES[i - 1].id] + CATEGORIES[i - 1].items.length;
  return acc;
}, {});

type Item = { q: string; a: string };

const matches = (item: Item, q: string) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);

/** Wraps every case-insensitive occurrence of `q` in a <mark>. */
function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(q);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className={styles.mark}>
        {text.slice(at, at + q.length)}
      </mark>,
    );
    from = at + q.length;
    at = lower.indexOf(q, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

/* ------------------------------------------------------------- variants */
const heroVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function FaqsContent() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState<string>("about-0");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const inputRef = useRef<HTMLInputElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        items: c.items.map((item, idx) => ({ ...item, idx })).filter((item) => !q || matches(item, q)),
      })).filter((c) => c.items.length > 0),
    [q],
  );

  const totalMatches = filtered.reduce((n, c) => n + c.items.length, 0);
  const countFor = (id: string) => filtered.find((c) => c.id === id)?.items.length ?? 0;

  /* highlight the topic currently in the reading band of the viewport */
  useEffect(() => {
    const root = groupsRef.current;
    if (!root) return;
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-group]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute("data-group") ?? CATEGORIES[0].id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    groups.forEach((g) => io.observe(g));
    return () => io.disconnect();
  }, [filtered]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // open the first matching answer so a match hidden in an answer is visible
    const next = value.trim().toLowerCase();
    if (!next) return;
    for (const c of CATEGORIES) {
      const i = c.items.findIndex((item) => matches(item, next));
      if (i !== -1) {
        setOpen(`${c.id}-${i}`);
        return;
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  /* Enter jumps to the results and drops the on-screen keyboard */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.blur();
    document.getElementById("faq-results")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const v = (variants: Variants) => (reduce ? undefined : variants);

  return (
    <div className={kit.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={`${kit.hero} ${styles.hero}`} aria-labelledby="faqs-hero-title">
        <span className={kit.gridBg} aria-hidden="true" />
        <span className={kit.aurora} aria-hidden="true" />
        <span className={kit.blobRoyal} aria-hidden="true" />
        <span className={kit.blobGold} aria-hidden="true" />

        <div className={`${kit.heroInner} ${kit.heroSolo}`}>
          <motion.div
            className={kit.heroCopy}
            initial={reduce ? false : "hidden"}
            animate="shown"
            variants={v(heroVariants)}
          >
            <motion.nav className={kit.crumbs} aria-label="Breadcrumb" variants={v(riseVariants)}>
              <Link href={ROUTES.home}>Home</Link>
              <span aria-hidden="true">/</span>
              <span className={kit.crumbCurrent} aria-current="page">
                FAQs
              </span>
            </motion.nav>

            <motion.p className={kit.kicker} variants={v(riseVariants)}>
              <span className={kit.kickerDot} aria-hidden="true" />
              Help &amp; answers
            </motion.p>

            <motion.h1 id="faqs-hero-title" className={kit.title} variants={v(riseVariants)}>
              Frequently asked <span className={kit.titleAccent}>questions</span>
            </motion.h1>

            <motion.p className={kit.lead} variants={v(riseVariants)}>
              The essentials about working with MRZ — what we do, how we work and how to get started. Can&apos;t find
              your answer? Our team is one message away.
            </motion.p>

            <motion.form role="search" className={styles.searchForm} onSubmit={onSubmit} variants={v(riseVariants)}>
              <div className={styles.searchField}>
                <span className={styles.searchIcon} aria-hidden="true">
                  <Search size={20} />
                </span>
                <input
                  ref={inputRef}
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search questions…"
                  value={query}
                  onChange={onSearch}
                  enterKeyHint="search"
                  autoComplete="off"
                  aria-label="Search frequently asked questions"
                  aria-controls="faq-results"
                />
                {query ? (
                  <button type="button" className={styles.searchClear} onClick={clearSearch} aria-label="Clear search">
                    <Close />
                  </button>
                ) : null}
              </div>
            </motion.form>

            <motion.nav className={styles.topics} aria-label="FAQ topics" variants={v(riseVariants)}>
              {CATEGORIES.map((c) => {
                const Icon = GROUP_ICONS[c.id];
                const n = countFor(c.id);
                const inner = (
                  <>
                    <span className={styles.topicIcon} aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    {c.label}
                    <span className={styles.topicCount}>{n}</span>
                  </>
                );
                return n > 0 ? (
                  <a key={c.id} href={`#faq-${c.id}`} className={styles.topic}>
                    {inner}
                  </a>
                ) : (
                  <span key={c.id} className={styles.topic} data-empty="" aria-disabled="true">
                    {inner}
                  </span>
                );
              })}
            </motion.nav>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- body */}
      <section className={`${kit.section} ${styles.body}`} aria-label="Questions and answers">
        <div className={kit.inner}>
          <div className={styles.layout}>
            {/* main column */}
            <div id="faq-results" className={styles.main}>
              <div className={styles.status}>
                <p role="status" className={styles.statusText}>
                  {q ? (
                    <>
                      <strong>{totalMatches}</strong> {totalMatches === 1 ? "result" : "results"} for &ldquo;
                      {query.trim()}&rdquo;
                    </>
                  ) : (
                    <>
                      Showing all <strong>{TOTAL}</strong> questions across <strong>{CATEGORIES.length}</strong> topics
                    </>
                  )}
                </p>
                {q ? (
                  <button type="button" className={styles.statusClear} onClick={clearSearch}>
                    <Close size={14} />
                    Clear search
                  </button>
                ) : null}
              </div>

              {totalMatches === 0 ? (
                <div className={styles.noResults}>
                  <span className={styles.noResultsIcon} aria-hidden="true">
                    <Search size={24} />
                  </span>
                  <p className={styles.noResultsTitle}>No questions match &ldquo;{query}&rdquo;</p>
                  <p className={styles.noResultsText}>
                    Try a different word, or{" "}
                    <Link href={ROUTES.contact} className={styles.inlineLink}>
                      ask us directly
                    </Link>
                    .
                  </p>
                  <button type="button" className={kit.secondary} onClick={clearSearch}>
                    Show all questions
                  </button>
                </div>
              ) : (
                <div ref={groupsRef} className={styles.groups}>
                  {filtered.map((cat) => {
                    const Icon = GROUP_ICONS[cat.id];
                    const topicNo = CATEGORIES.findIndex((c) => c.id === cat.id) + 1;
                    return (
                      <div key={cat.id} id={`faq-${cat.id}`} data-group={cat.id} className={styles.group}>
                        <motion.div
                          className={styles.groupHead}
                          initial={reduce ? false : { opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.6, ease: EASE }}
                        >
                          <span className={styles.groupIcon} aria-hidden="true">
                            <Icon />
                          </span>
                          <div className={styles.groupMeta}>
                            <p className={styles.groupEyebrow}>Topic {pad2(topicNo)}</p>
                            <h2 className={styles.groupLabel}>{cat.label}</h2>
                          </div>
                          <p className={styles.groupCount}>
                            {cat.items.length} {cat.items.length === 1 ? "question" : "questions"}
                          </p>
                        </motion.div>

                        <ul className={styles.faqList}>
                          {cat.items.map((item, i) => {
                            const key = `${cat.id}-${item.idx}`;
                            const isOpen = open === key;
                            const panelId = `faq-panel-${key}`;
                            const btnId = `faq-btn-${key}`;
                            return (
                              <motion.li
                                key={key}
                                className={styles.faqItem}
                                data-open={isOpen || undefined}
                                initial={reduce ? false : { opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                              >
                                <h3 className={styles.faqQHead}>
                                  <button
                                    id={btnId}
                                    type="button"
                                    className={styles.faqTrigger}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpen(isOpen ? "" : key)}
                                  >
                                    <span className={styles.faqNum} aria-hidden="true">
                                      {pad2(OFFSETS[cat.id] + item.idx + 1)}
                                    </span>
                                    <span className={styles.faqQ}>{highlight(item.q, q)}</span>
                                    <span className={styles.faqIcon} aria-hidden="true">
                                      <Plus barClassName={styles.plusBar} />
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
                                      <p className={styles.faqAnswer}>{highlight(item.a, q)}</p>
                                    </motion.div>
                                  ) : null}
                                </AnimatePresence>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* sticky aside */}
            <aside className={styles.aside} aria-label="Browse topics and contact the team">
              {totalMatches > 0 ? (
                <nav className={styles.topicNav} aria-label="Jump to a topic">
                  <p className={styles.topicNavTitle}>Browse topics</p>
                  <ul className={styles.topicNavList}>
                    {filtered.map((c) => {
                      const Icon = GROUP_ICONS[c.id];
                      const isActive = active === c.id;
                      return (
                        <li key={c.id}>
                          <a
                            href={`#faq-${c.id}`}
                            className={styles.topicNavLink}
                            data-active={isActive || undefined}
                            aria-current={isActive ? "location" : undefined}
                          >
                            <span className={styles.topicNavIcon} aria-hidden="true">
                              <Icon size={17} />
                            </span>
                            <span className={styles.topicNavLabel}>{c.label}</span>
                            <span className={styles.topicNavCount}>{c.items.length}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ) : null}

              <div className={kit.cell}>
                <TiltCard className={`${kit.glass} ${styles.helpCard}`} max={5} lift={0}>
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.liveBorder} aria-hidden="true" />
                  <span className={kit.iconTile} aria-hidden="true">
                    <IconHelp />
                  </span>
                  <h2 className={styles.helpTitle}>Still have questions?</h2>
                  <p className={styles.helpText}>
                    Talk to the team directly — you&apos;ll always be speaking to the people who do the work.
                  </p>
                  <div className={styles.helpLinks}>
                    <a href={CONTACT.phoneHref} className={styles.helpLink}>
                      <span className={styles.helpLinkIcon} aria-hidden="true">
                        <Phone />
                      </span>
                      <span className={styles.helpLinkText}>
                        <span className={styles.helpLinkLabel}>Call us</span>
                        {CONTACT.phoneDisplay}
                      </span>
                    </a>
                    <a href={`mailto:${CONTACT.email}`} className={styles.helpLink}>
                      <span className={styles.helpLinkIcon} aria-hidden="true">
                        <Mail />
                      </span>
                      <span className={styles.helpLinkText}>
                        <span className={styles.helpLinkLabel}>Email</span>
                        {CONTACT.email}
                      </span>
                    </a>
                  </div>
                  <Link href={ROUTES.contact} className={`${kit.primary} ${styles.helpCta}`}>
                    Contact us
                    <span className={kit.primaryIcon} aria-hidden="true">
                      <Arrow />
                    </span>
                  </Link>
                </TiltCard>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={kit.ctaSection} aria-labelledby="faqs-closing-title">
        <motion.div
          className={kit.ctaPanel}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className={kit.ctaGrid} aria-hidden="true" />
          <span className={kit.ctaGlow} aria-hidden="true" />
          <span className={kit.ctaGlowB} aria-hidden="true" />
          <span className={kit.liveBorder} aria-hidden="true" />

          <div className={kit.ctaCopy}>
            <p className={kit.kicker}>
              <span className={kit.kickerDot} aria-hidden="true" />
              Free consultation
            </p>
            <h2 id="faqs-closing-title" className={kit.ctaTitle}>
              Ready to put <span className={kit.titleAccent}>one team</span> on it?
            </h2>
            <p className={kit.ctaLead}>
              Book a free, no-obligation consultation and we&apos;ll map out exactly what&apos;s needed before any work
              begins.
            </p>
          </div>
          <div className={kit.ctaActions}>
            <Link href={ROUTES.contact} className={kit.primary}>
              Book a free consultation
              <span className={kit.primaryIcon} aria-hidden="true">
                <Arrow />
              </span>
            </Link>
            <a href={CONTACT.phoneHref} className={kit.secondary}>
              <Phone />
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
