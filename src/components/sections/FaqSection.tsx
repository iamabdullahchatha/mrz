"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import styles from "./FaqSection.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Answers paraphrased from the live MRZ positioning and the vetted services
 * data — no invented pricing, timelines or claims. Keep them grounded.
 */
const FAQS = [
  {
    q: "What services does MRZ provide?",
    a: "Nine specialist services under one team: commercial brokerage, general trading, IT consultancy, cyber security architecture, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision and UAE documents clearing.",
  },
  {
    q: "Where is MRZ based, and which areas do you serve?",
    a: "Our office is at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates. We coordinate support for businesses across the country.",
  },
  {
    q: "Can you handle several services together, or just one at a time?",
    a: "Both. You get a single accountable team and one point of contact, so trade, technology, engineering, people and compliance work can run end to end together instead of across separate providers.",
  },
  {
    q: "How does MRZ keep UAE approvals and paperwork on track?",
    a: "Every engagement is documentation-led and compliance-first — checklists, readiness reviews and clear follow-up are built in, so approvals move smoothly with fewer delays.",
  },
  {
    q: "How do I get started with MRZ?",
    a: "Book a free consultation. We review your requirements, outline what's needed and give you a clear, documentation-led plan before any work begins.",
  },
];

function Plus() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14" className={styles.plusBar} />
      <path d="M5 12h14" />
    </svg>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Frequently asked questions — an accessible single-open accordion. Items stagger
 * in once as the list scrolls into view (reveal on scroll-down only, no reverse),
 * and each panel expands/collapses with a height animation. Anchored at #faqs to
 * match the site's FAQs nav link (routes.faqs -> /#faqs).
 */
export function FaqSection() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className={styles.faqs} aria-labelledby="faqs-title">
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Answers
          </p>
          <h2 id="faqs-title" className={styles.title}>
            Frequently asked <span className={styles.titleAccent}>questions</span>
          </h2>
          <p className={styles.lead}>
            The essentials about working with MRZ. Still have a question?{" "}
            <Link href={ROUTES.contact} className={styles.leadLink}>
              Talk to our team
            </Link>
            .
          </p>
        </header>

        <motion.ul
          className={styles.list}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
          variants={reduce ? undefined : listVariants}
        >
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <motion.li
                key={item.q}
                className={styles.item}
                data-open={isOpen || undefined}
                variants={reduce ? undefined : itemVariants}
              >
                <h3 className={styles.qHead}>
                  <button
                    id={btnId}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
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
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
