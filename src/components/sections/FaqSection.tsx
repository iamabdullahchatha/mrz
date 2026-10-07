"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Arrow, Mail, Phone, Plus } from "@/components/common/kitIcons";
import { CONTACT, ROUTES } from "@/lib/routes";
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

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Frequently asked questions — the intro and a direct-contact card sit in a
 * sticky column beside an accessible single-open accordion. Items stagger in
 * once as the list scrolls into view (reveal on scroll-down only, no reverse),
 * and each panel expands/collapses with a height animation. Anchored at #faqs
 * to match the site's FAQs nav link (routes.faqs -> /#faqs). Below 960px the
 * column unwraps so the contact card follows the questions.
 */
export function FaqSection() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className={styles.faqs} aria-labelledby="faqs-title">
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.aside}>
          <motion.header
            className={styles.head}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.5 }}
            variants={reduce ? undefined : listVariants}
          >
            <motion.p className={styles.kicker} variants={reduce ? undefined : itemVariants}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Answers
            </motion.p>
            <motion.h2 id="faqs-title" className={styles.title} variants={reduce ? undefined : itemVariants}>
              Frequently asked <span className={styles.titleAccent}>questions</span>
            </motion.h2>
            <motion.p className={styles.lead} variants={reduce ? undefined : itemVariants}>
              The essentials about working with MRZ — one team, one point of contact, and a clear plan
              before any work begins.
            </motion.p>
          </motion.header>

          <motion.div
            className={styles.helpWrap}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className={styles.help}>
              <h3 className={styles.helpTitle}>Still have questions?</h3>
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
              <Link href={ROUTES.contact} className={styles.helpCta}>
                Talk to our team
                <span className={styles.helpCtaIcon} aria-hidden="true">
                  <Arrow size={16} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

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
                    <span className={styles.num} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.qText}>{item.q}</span>
                    <span className={styles.icon} aria-hidden="true">
                      <Plus size={20} barClassName={styles.plusBar} />
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
