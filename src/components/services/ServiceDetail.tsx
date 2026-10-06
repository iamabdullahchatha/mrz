"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { TiltCard } from "@/components/sections/TiltCard";
import { services } from "@/data/services";
import { accentStyle, type ServiceDetail as ServiceDetailContent } from "@/data/serviceContent";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./ServiceDetail.module.css";

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

/* --- small inline glyphs for the "Why MRZ" cards (kept local, never invented data) --- */
const whyGlyph = {
  team: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 19v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.9-.9L3 20l1.3-3.9A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

/* At-a-glance facts — all grounded in the firm (ten services, one team, UAE-wide,
   a free first consultation). Nothing here is invented. */
const STATS: { value: string; label: string }[] = [
  { value: "10", label: "Specialist services" },
  { value: "1", label: "Accountable team" },
  { value: "UAE", label: "Nationwide coverage" },
  { value: "Free", label: "First consultation" },
];

/* How we work — the firm's documentation-led, consultation-first approach,
   the same clear path on every engagement. */
const PROCESS_STEPS: { n: string; title: string; text: string }[] = [
  { n: "01", title: "Discovery", text: "We map your goals, constraints and timeline before any work begins." },
  { n: "02", title: "Documentation-led plan", text: "A clear, compliance-first scope and checklist you approve up front." },
  { n: "03", title: "Delivery", text: "One accountable team does the work, with a single point of contact." },
  { n: "04", title: "Follow-through", text: "Readiness reviews and clear follow-up keep approvals moving smoothly." },
];

/* Why MRZ — grounded differentiators drawn from the firm's positioning. */
const WHY_MRZ: { icon: ReactNode; title: string; text: string }[] = [
  { icon: whyGlyph.team, title: "One accountable team", text: "Trade, technology, finance, people and compliance handled under a single team." },
  { icon: whyGlyph.doc, title: "Documentation-led", text: "Checklists and readiness reviews are built into every engagement from day one." },
  { icon: whyGlyph.contact, title: "A single point of contact", text: "No juggling providers — one relationship, coordinated from start to finish." },
  { icon: whyGlyph.pin, title: "Ajman to all the UAE", text: "Based in Ajman Free Zone, supporting businesses right across the Emirates." },
];

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

interface ServiceDetailProps {
  service: MenuEntry;
  detail: ServiceDetailContent;
}

/**
 * Service detail page — a bright hero photo in a glass frame with a travelling
 * accent border, an at-a-glance strip, an image-free overview, a "what's
 * included" grid, a "how we work" path, a "why MRZ" grid, a consultation CTA and
 * related services. Every service carries its own accent colour (set inline on
 * the root). 3D tilt, travelling-colour borders and rotating aurora supply the
 * motion; copy and routes come from the vetted data — nothing is invented.
 */
export function ServiceDetail({ service, detail }: ServiceDetailProps) {
  const reduce = useReducedMotion() ?? false;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroImg = service.menuImage?.src ?? service.image;

  const related = [
    ...services.filter((s) => s.id !== service.id && s.category === service.category),
    ...services.filter((s) => s.id !== service.id && s.category !== service.category),
  ].slice(0, 3);

  return (
    <div className={styles.page} style={accentStyle(service.accent)}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="service-title">
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blob} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link href={ROUTES.home}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={ROUTES.services}>Services</Link>
              <span aria-hidden="true">/</span>
              <span className={styles.crumbCurrent}>{service.title}</span>
            </nav>

            <p className={styles.kicker}>
              <span className={styles.iconChip} aria-hidden="true">
                <MenuIcon name={service.icon} width={18} height={18} />
              </span>
              {service.category}
            </p>

            <h1 id="service-title" className={styles.title}>
              {service.title}
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

          <div className={styles.heroMediaWrap}>
            <TiltCard className={styles.heroMedia} max={8} lift={0} glare>
              <span className={styles.travel} aria-hidden="true" />
              <Image
                src={heroImg}
                alt={service.menuImage?.alt ?? service.imageAlt}
                fill
                className={styles.heroImg}
                sizes="(max-width: 960px) 92vw, 540px"
                quality={88}
                priority
                style={service.menuImage?.position ? { objectPosition: service.menuImage.position } : undefined}
              />
              <span className={styles.heroMediaShade} aria-hidden="true" />
            </TiltCard>
          </div>
        </div>

        {/* at-a-glance strip with a travelling-colour border */}
        <div className={styles.heroStatsWrap}>
          <motion.ul
            className={styles.heroStats}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "shown"}
            viewport={{ once: true, amount: 0.4 }}
            variants={reduce ? undefined : listVariants}
          >
            <span className={styles.travel} aria-hidden="true" />
            {STATS.map((s) => (
              <motion.li key={s.label} className={styles.statItem} variants={reduce ? undefined : itemVariants}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.li>
            ))}
          </motion.ul>
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
              <div className={styles.overviewCopy}>
                <p className={styles.eyebrow}>Overview</p>
                <h2 id="overview-title" className={styles.overviewTitle}>
                  What this service covers
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

        {/* ----------------------------------------------------- included */}
        <section className={styles.included} aria-labelledby="included-title">
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>What&apos;s included</p>
            <h2 id="included-title" className={styles.sectionTitle}>
              How we support {service.title.toLowerCase()}
            </h2>
          </header>

          <motion.ul
            className={styles.incGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : listVariants}
          >
            {detail.included.map((inc, i) => (
              <motion.li key={inc.title} className={styles.incCell} variants={reduce ? undefined : itemVariants}>
                <TiltCard className={styles.incCard} max={7} lift={6} glare={false}>
                  <span className={styles.travel} aria-hidden="true" />
                  <span className={styles.incNum} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.incTitle}>{inc.title}</h3>
                  <p className={styles.incText}>{inc.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* ------------------------------------------------------ process */}
        <section className={styles.process} aria-labelledby="process-title">
          <span className={styles.sideAurora} aria-hidden="true" />
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>How we work</p>
            <h2 id="process-title" className={styles.sectionTitle}>
              A clear path from first call to follow-up
            </h2>
          </header>

          <motion.ol
            className={styles.procGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : listVariants}
          >
            {PROCESS_STEPS.map((step) => (
              <motion.li key={step.n} className={styles.procCell} variants={reduce ? undefined : itemVariants}>
                <TiltCard className={styles.procCard} max={8} lift={6} glare={false}>
                  <span className={styles.travel} aria-hidden="true" />
                  <span className={styles.procNum} aria-hidden="true">
                    {step.n}
                  </span>
                  <h3 className={styles.procTitle}>{step.title}</h3>
                  <p className={styles.procText}>{step.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* ---------------------------------------------------------- why */}
        <section className={styles.why} aria-labelledby="why-title">
          <span className={styles.sideAuroraB} aria-hidden="true" />
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Why MRZ</p>
            <h2 id="why-title" className={styles.sectionTitle}>
              Why businesses choose MRZ for {service.category.toLowerCase()}
            </h2>
          </header>

          <motion.ul
            className={styles.whyGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : listVariants}
          >
            {WHY_MRZ.map((w) => (
              <motion.li key={w.title} className={styles.whyCell} variants={reduce ? undefined : itemVariants}>
                <TiltCard className={styles.whyCard} max={7} lift={5} glare={false}>
                  <span className={styles.travel} aria-hidden="true" />
                  <span className={styles.whyIcon} aria-hidden="true">
                    {w.icon}
                  </span>
                  <h3 className={styles.whyTitle}>{w.title}</h3>
                  <p className={styles.whyText}>{w.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* --------------------------------------------------------- faqs */}
        <section className={styles.faqs} aria-labelledby="faqs-title">
          <span className={styles.sideAurora} aria-hidden="true" />
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Good to know</p>
            <h2 id="faqs-title" className={styles.sectionTitle}>
              {service.title} — frequently asked questions
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
              const panelId = `svc-faq-panel-${i}`;
              const btnId = `svc-faq-btn-${i}`;
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
        <section className={styles.ctaSection} aria-labelledby="service-cta-title">
          <div className={styles.ctaPanel}>
            <span className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaCopy}>
              <p className={styles.kicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                Ready when you are
              </p>
              <h2 id="service-cta-title" className={styles.ctaTitle}>
                Let&apos;s talk about your {service.category.toLowerCase()} needs.
              </h2>
              <p className={styles.ctaLead}>
                Book a free consultation and we&apos;ll outline a clear, documentation-led plan before
                any work begins — no obligation.
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

        {/* ----------------------------------------------------- related */}
        <section className={styles.related} aria-labelledby="related-title">
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Keep exploring</p>
            <h2 id="related-title" className={styles.sectionTitle}>
              Related services
            </h2>
          </header>

          <ul className={styles.relGrid}>
            {related.map((r) => (
              <li key={r.id} className={styles.relCell} style={accentStyle(r.accent)}>
                <Link href={r.href} className={styles.relCard}>
                  <span className={styles.relIcon} aria-hidden="true">
                    <MenuIcon name={r.icon} width={20} height={20} />
                  </span>
                  <span className={styles.relText}>
                    <span className={styles.relCat}>{r.category}</span>
                    <span className={styles.relTitle}>{r.title}</span>
                  </span>
                  <span className={styles.relArrow} aria-hidden="true">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.allLinkWrap}>
            <Link href={ROUTES.services} className={styles.allLink}>
              View all services
              <Arrow />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
