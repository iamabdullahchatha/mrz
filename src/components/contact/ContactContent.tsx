"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { services } from "@/data/services";
import { CONTACT, ROUTES } from "@/lib/routes";
import { TiltCard } from "@/components/sections/TiltCard";
import { HeroOrbit } from "@/components/common/HeroOrbit";
import styles from "./Contact.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------- icons */
function Phone() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function Mail() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10.5c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.8" />
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

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Chat() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.7L3 20.5l1.3-4.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
    </svg>
  );
}

function Headset() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
      <path d="M18 18a4 4 0 0 1-4 3h-2" />
    </svg>
  );
}

/* ---------------------------------------------------------------- data */
const ASSURANCES = [
  "No obligation — a genuine conversation first",
  "A clear, documentation-led plan before any work begins",
  "One accountable point of contact from start to finish",
];

const STEPS = [
  {
    title: "We read your message",
    text: "Your enquiry reaches the team in Ajman directly — no call centre, no forms lost in a queue.",
  },
  {
    title: "We map what's needed",
    text: "We work out which parts of MRZ apply — trade, technology, engineering, people or compliance — and who should lead.",
  },
  {
    title: "We come back with a plan",
    text: "You get a clear, documented next step and one named contact to take it forward across the UAE.",
  },
];

/* ------------------------------------------------------------- variants */
function makeVariants(reduce: boolean) {
  const head: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26, rotateX: reduce ? 0 : 9, transformPerspective: 900 },
    shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const panel: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 42, rotateX: reduce ? 0 : 10, transformPerspective: 1000 },
    shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: EASE } },
  };
  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 34, rotateX: reduce ? 0 : 14, transformPerspective: 900 },
    shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
  };
  return { head, panel, container, card };
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", phone: "", company: "", service: "", message: "" };

export function ContactContent() {
  const reduce = useReducedMotion() ?? false;
  const V = useMemo(() => makeVariants(reduce), [reduce]);
  const serviceOptions = useMemo(() => services.map((s) => s.title), []);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please add your name, email and a short message so we can reply.");
      return;
    }
    const interest = form.service || "General enquiry";
    const subject = `Website enquiry — ${interest}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone.trim() ? `Phone: ${form.phone}` : null,
      form.company.trim() ? `Company: ${form.company}` : null,
      `Interest: ${interest}`,
      "",
      form.message,
    ]
      .filter((l): l is string => l !== null)
      .join("\n");

    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }
    setSent(true);
  };

  const reset = () => {
    setForm(EMPTY);
    setSent(false);
    setError("");
  };

  const viewport = { once: true, amount: 0.3 } as const;

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="contact-hero-title">
        <span className={`${styles.blob} ${styles.blobRoyal}`} style={{ top: "-14%", right: "-8%" }} aria-hidden="true" />
        <span className={`${styles.blob} ${styles.blobGold}`} style={{ bottom: "-26%", left: "-10%" }} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.heroGrid}>
            <motion.div
              className={styles.heroInner}
              initial={reduce ? false : "hidden"}
              animate="shown"
              variants={V.head}
            >
              <p className={styles.kicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                Contact MRZ
              </p>
              <h1 id="contact-hero-title" className={styles.title}>
                Let&apos;s put <span className={styles.titleAccent}>one UAE team</span> behind your next move
              </h1>
              <p className={styles.lead}>
                Tell us what you&apos;re planning — trade, technology, engineering, people or compliance — and we&apos;ll
                point it to the right part of the team. Our office is on Sheikh Khalifa Street in Ajman, and we work with businesses across the UAE.
              </p>

              <div className={styles.heroChips}>
                <a href={CONTACT.phoneHref} className={styles.chip}>
                  <span className={styles.chipIcon} aria-hidden="true"><Phone /></span>
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className={styles.chip}>
                  <span className={styles.chipIcon} aria-hidden="true"><Mail /></span>
                  {CONTACT.email}
                </a>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <HeroOrbit
                center={<Headset />}
                centerLabel="Let's talk"
                centerSub="MRZ"
                items={[
                  { key: "phone", icon: <Phone /> },
                  { key: "mail", icon: <Mail /> },
                  { key: "pin", icon: <Pin /> },
                  { key: "chat", icon: <Chat /> },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ main split */}
      <section className={styles.main} aria-labelledby="contact-reach-title">
        <span className={`${styles.blob} ${styles.blobRoyal}`} style={{ top: "6%", left: "-14%" }} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.contactGrid}>
            {/* info column */}
            <div className={styles.infoCol}>
              <motion.div
                className={styles.secHead}
                initial={reduce ? false : "hidden"}
                whileInView="shown"
                viewport={viewport}
                variants={V.head}
              >
                <p className={styles.kicker}>
                  <span className={styles.kickerDot} aria-hidden="true" />
                  Talk to us
                </p>
                <h2 id="contact-reach-title" className={styles.title}>
                  Reach the team directly
                </h2>
                <p className={styles.lead}>
                  Prefer to skip the form? Call, email or visit us — you&apos;ll always be speaking to the people who
                  do the work.
                </p>
              </motion.div>

              <motion.div
                className={styles.methods}
                initial={reduce ? false : "hidden"}
                whileInView="shown"
                viewport={viewport}
                variants={V.container}
              >
                <motion.div className={styles.methodCell} variants={V.card}>
                  <TiltCard className={styles.method} max={10} lift={6}>
                    <span className={styles.methodIcon} aria-hidden="true"><Phone /></span>
                    <div className={styles.methodBody}>
                      <span className={styles.methodLabel}>Call us</span>
                      <p className={styles.methodValue}>{CONTACT.phoneDisplay}</p>
                      <p className={styles.methodSub}>Tap to call the team in Ajman</p>
                    </div>
                    <a href={CONTACT.phoneHref} className={styles.methodLink} aria-label={`Call MRZ on ${CONTACT.phoneDisplay}`} />
                  </TiltCard>
                </motion.div>

                <motion.div className={styles.methodCell} variants={V.card}>
                  <TiltCard className={styles.method} max={10} lift={6}>
                    <span className={styles.methodIcon} aria-hidden="true"><Mail /></span>
                    <div className={styles.methodBody}>
                      <span className={styles.methodLabel}>Email us</span>
                      <p className={styles.methodValue}>{CONTACT.email}</p>
                      <p className={styles.methodSub}>Send us the details any time</p>
                    </div>
                    <a href={`mailto:${CONTACT.email}`} className={styles.methodLink} aria-label={`Email MRZ at ${CONTACT.email}`} />
                  </TiltCard>
                </motion.div>

                <motion.div className={styles.methodCell} variants={V.card}>
                  <TiltCard className={styles.method} max={10} lift={6}>
                    <span className={styles.methodIcon} aria-hidden="true"><Pin /></span>
                    <div className={styles.methodBody}>
                      <span className={styles.methodLabel}>Visit us</span>
                      <p className={styles.methodValue}>{CONTACT.address.building}, {CONTACT.address.floor}</p>
                      <p className={styles.methodSub}>
                        {CONTACT.address.street}, {CONTACT.address.city}, {CONTACT.address.country}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              </motion.div>

              <motion.ul
                className={styles.assurances}
                initial={reduce ? false : "hidden"}
                whileInView="shown"
                viewport={viewport}
                variants={V.head}
              >
                {ASSURANCES.map((a) => (
                  <li key={a} className={styles.assurance}>
                    <span className={styles.check} aria-hidden="true"><Check /></span>
                    {a}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* form column */}
            <motion.div
              className={styles.formCol}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={viewport}
              variants={V.panel}
            >
              <div className={styles.formPanel}>
                {sent ? (
                  <div className={styles.sentPanel} role="status" aria-live="polite">
                    <span className={styles.sentIcon} aria-hidden="true"><Check /></span>
                    <h2 className={styles.sentTitle}>Your message is on its way</h2>
                    <p className={styles.sentText}>
                      We&apos;ve opened your email app with the details filled in — just press send. Prefer another
                      way? Call {CONTACT.phoneDisplay} or email {CONTACT.email} and we&apos;ll take it from there.
                    </p>
                    <button type="button" className={styles.resetBtn} onClick={reset}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className={styles.formTitle}>Send us a message</h2>
                    <p className={styles.formIntro}>
                      A few details is all we need. Fields marked <span className={styles.req}>*</span> are required.
                    </p>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.label} htmlFor="cf-name">
                            Full name <span className={styles.req}>*</span>
                          </label>
                          <input
                            id="cf-name"
                            className={styles.input}
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            value={form.name}
                            onChange={update("name")}
                            required
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label} htmlFor="cf-email">
                            Email <span className={styles.req}>*</span>
                          </label>
                          <input
                            id="cf-email"
                            className={styles.input}
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={update("email")}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.label} htmlFor="cf-phone">
                            Phone
                          </label>
                          <input
                            id="cf-phone"
                            className={styles.input}
                            type="tel"
                            autoComplete="tel"
                            placeholder="Optional"
                            value={form.phone}
                            onChange={update("phone")}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label} htmlFor="cf-company">
                            Company
                          </label>
                          <input
                            id="cf-company"
                            className={styles.input}
                            type="text"
                            autoComplete="organization"
                            placeholder="Optional"
                            value={form.company}
                            onChange={update("company")}
                          />
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="cf-service">
                          What can we help with?
                        </label>
                        <div className={styles.selectWrap}>
                          <select
                            id="cf-service"
                            className={styles.select}
                            value={form.service}
                            onChange={update("service")}
                          >
                            <option value="">General enquiry</option>
                            {serviceOptions.map((title) => (
                              <option key={title} value={title}>
                                {title}
                              </option>
                            ))}
                            <option value="Something else">Something else</option>
                          </select>
                          <span className={styles.selectArrow} aria-hidden="true"><ChevronDown /></span>
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="cf-message">
                          Message <span className={styles.req}>*</span>
                        </label>
                        <textarea
                          id="cf-message"
                          className={styles.textarea}
                          placeholder="Tell us a little about what you're planning…"
                          value={form.message}
                          onChange={update("message")}
                          required
                        />
                      </div>

                      {error ? <p className={styles.errorMsg}>{error}</p> : null}

                      <button type="submit" className={styles.submit}>
                        Send message
                        <span className={styles.submitIcon} aria-hidden="true"><Arrow /></span>
                      </button>
                      <p className={styles.formNote}>
                        This opens your email app pre-filled to {CONTACT.email}. Your details are never shared with
                        anyone else.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ what happens next */}
      <section className={styles.steps} aria-labelledby="contact-steps-title">
        <span className={`${styles.blob} ${styles.blobGold}`} style={{ top: "0%", right: "-12%" }} aria-hidden="true" />
        <div className={styles.inner}>
          <motion.div
            className={styles.stepsHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={viewport}
            variants={V.head}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              What happens next
            </p>
            <h2 id="contact-steps-title" className={styles.title}>
              Three steps, no runaround
            </h2>
          </motion.div>

          <motion.ol
            className={styles.stepsGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={viewport}
            variants={V.container}
          >
            {STEPS.map((step, i) => (
              <motion.li key={step.title} className={styles.stepCell} variants={V.card}>
                <TiltCard className={styles.stepCard} max={10} lift={7}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ------------------------------------------------------- closing */}
      <section className={styles.closing} aria-labelledby="contact-closing-title">
        <div className={styles.inner}>
          <motion.div
            className={styles.closingPanel}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={viewport}
            variants={V.panel}
          >
            <h2 id="contact-closing-title" className={styles.closingTitle}>
              Prefer to talk it through?
            </h2>
            <p className={styles.closingText}>
              Pick up the phone and speak to the team directly. One call is often all it takes to work out the
              right next step for your business in the UAE.
            </p>
            <div className={styles.closingActions}>
              <a href={CONTACT.phoneHref} className={styles.primary}>
                Call {CONTACT.phoneDisplay}
                <span className={styles.primaryIcon} aria-hidden="true"><Arrow /></span>
              </a>
              <Link href={ROUTES.services} className={styles.secondary}>
                Explore our services
              </Link>
            </div>
            <p className={styles.locale}>
              <span className={styles.localeDot} aria-hidden="true" />
              Amber Gem Tower, Ajman · Serving businesses across the UAE
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
