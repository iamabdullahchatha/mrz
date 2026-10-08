"use client";

import { useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import kit from "@/components/common/PageKit.module.css";
import { Arrow, ArrowUpRight, Check, ChevronDown, Mail, Phone, Pin } from "@/components/common/kitIcons";
import { useSpotlight } from "@/components/common/useSpotlight";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { accentStyle } from "@/data/serviceContent";
import { services } from "@/data/services";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./Contact.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const { address } = CONTACT;

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${address.building}, ${address.street}, ${address.city}, ${address.country}`,
)}`;

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
    text: "We work out which parts of MRZ apply — trade, technology, engineering, people or operations — and who should lead.",
  },
  {
    title: "We come back with a plan",
    text: "You get a clear, documented next step and one named contact to take it forward across the UAE.",
  },
];

const METHODS = [
  {
    key: "call",
    accent: "gold",
    icon: <Phone size={22} />,
    label: "Call us",
    value: CONTACT.phoneDisplay,
    sub: "Tap to call the team in Ajman",
    href: CONTACT.phoneHref,
    aria: `Call MRZ on ${CONTACT.phoneDisplay}`,
    external: false,
  },
  {
    key: "email",
    accent: "ice",
    icon: <Mail size={22} />,
    label: "Email us",
    value: CONTACT.email,
    sub: "Send us the details any time",
    href: `mailto:${CONTACT.email}`,
    aria: `Email MRZ at ${CONTACT.email}`,
    external: false,
  },
  {
    key: "visit",
    accent: "royal",
    icon: <Pin size={22} />,
    label: "Visit us",
    value: `${address.building}, ${address.floor}`,
    sub: `${address.street}, ${address.city}, ${address.country}`,
    href: DIRECTIONS_URL,
    aria: `Get directions to ${address.building}, ${address.city} (opens in a new tab)`,
    external: true,
  },
] as const;

/* ------------------------------------------------------------- variants */
const heroVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/* ---------------------------------------------------------------- form */
type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", phone: "", company: "", service: "", message: "" };

const SERVICE_OPTIONS = services.map((s) => s.title);

/**
 * Contact MRZ, in the shared Services / Industries visual language: a split
 * hero with an abstract "find us" map card, the three direct contact routes as
 * spotlit glass cards beside a mailto enquiry form, a self-drawing "what
 * happens next" rail and a closing call CTA. Every number, address and link
 * comes from routes.ts — nothing is invented.
 */
export function ContactContent() {
  const reduce = useReducedMotion() ?? false;
  const methods = useSpotlight<HTMLUListElement>();
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (error) setError("");
    };

  const handleSubmit = (e: FormEvent) => {
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

  /** Marks a required field invalid only after a failed submit. */
  const invalid = (key: "name" | "email" | "message") => (error && !form[key].trim() ? true : undefined);

  const v = (variants: Variants) => (reduce ? undefined : variants);
  const inViewMotion = {
    initial: reduce ? false : ("hidden" as const),
    whileInView: "shown",
    viewport: { once: true, amount: 0.25 },
  };

  return (
    <div className={kit.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={kit.hero} aria-labelledby="contact-title">
        <span className={kit.gridBg} aria-hidden="true" />
        <span className={kit.aurora} aria-hidden="true" />
        <span className={kit.blobRoyal} aria-hidden="true" />
        <span className={kit.blobGold} aria-hidden="true" />

        <div className={kit.heroInner}>
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
                Contact
              </span>
            </motion.nav>

            <motion.p className={kit.kicker} variants={v(riseVariants)}>
              <span className={kit.kickerDot} aria-hidden="true" />
              Contact MRZ
            </motion.p>

            <motion.h1 id="contact-title" className={kit.title} variants={v(riseVariants)}>
              Let&apos;s put <span className={kit.titleAccent}>one UAE team</span> behind your next move
            </motion.h1>

            <motion.p className={kit.lead} variants={v(riseVariants)}>
              Tell us what you&apos;re planning — trade, technology, engineering, people or operations — and we&apos;ll
              point it to the right part of the team. Our office is on {address.street} in {address.city}, and we work
              with businesses across the UAE.
            </motion.p>

            <motion.div className={kit.heroActions} variants={v(riseVariants)}>
              <a href="#contact-form" className={kit.primary}>
                Send a message
                <span className={kit.primaryIcon} aria-hidden="true">
                  <Arrow />
                </span>
              </a>
              <a href={CONTACT.phoneHref} className={kit.secondary}>
                <Phone />
                Call {CONTACT.phoneDisplay}
              </a>
            </motion.div>

            <motion.ul className={styles.assurances} variants={v(riseVariants)}>
              {ASSURANCES.map((a) => (
                <li key={a} className={styles.assurance}>
                  <span className={styles.check} aria-hidden="true">
                    <Check size={11} />
                  </span>
                  {a}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* "find us" card — the art is decorative, the address panel is real content */}
          <motion.div
            className={styles.visual}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          >
            <div className={styles.mapCard}>
              <div className={styles.mapArt} aria-hidden="true">
                <MapArt />
                <span className={styles.radar} />
                <span className={styles.pulse} />
                <span className={`${styles.pulse} ${styles.pulseLate}`} />
                <span className={styles.pin}>
                  <span className={styles.pinShadow} />
                  <span className={styles.pinHead}>
                    <span className={styles.pinCore} />
                  </span>
                </span>
                <span className={styles.mapTag}>
                  <span className={styles.mapTagDot} />
                  Find us · {address.city}, UAE
                </span>
              </div>

              <div className={styles.address}>
                <span className={styles.addressIcon} aria-hidden="true">
                  <Pin size={20} />
                </span>
                <p className={styles.addressText}>
                  <strong>{address.building}</strong>
                  <span>
                    {address.floor} · {address.street}, {address.city}
                  </span>
                </p>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directions}
                  aria-label={`Get directions to ${address.building} (opens in a new tab)`}
                >
                  Directions
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <span className={kit.liveBorder} aria-hidden="true" />
            </div>

            <div className={`${kit.chip} ${styles.chipA}`} aria-hidden="true">
              <span className={kit.chipIcon}>
                <Phone size={19} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>Call us</span>
                <span className={kit.chipValue}>{CONTACT.phoneDisplay}</span>
              </span>
            </div>
            <div className={`${kit.chip} ${styles.chipB}`} aria-hidden="true">
              <span className={kit.chipIcon}>
                <Mail size={19} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>Email</span>
                <span className={kit.chipValue}>{CONTACT.email}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------- reach + form */}
      <section className={kit.section} aria-labelledby="contact-reach-title">
        <div className={`${kit.inner} ${styles.contactGrid}`}>
          <div className={styles.infoCol}>
            <motion.header className={`${kit.sectionHeadStart} ${styles.infoHead}`} {...inViewMotion} variants={v(listVariants)}>
              <motion.p className={kit.kicker} variants={v(riseVariants)}>
                <span className={kit.kickerDot} aria-hidden="true" />
                Talk to us
              </motion.p>
              <motion.h2 id="contact-reach-title" className={kit.sectionTitle} variants={v(riseVariants)}>
                Reach the team <span className={kit.titleAccent}>directly</span>
              </motion.h2>
              <motion.p className={kit.sectionLead} variants={v(riseVariants)}>
                Prefer to skip the form? Call, email or visit us — you&apos;ll always be speaking to the people who do
                the work.
              </motion.p>
            </motion.header>

            <motion.ul
              ref={methods.ref}
              className={`${styles.methods} ${kit.spotHost}`}
              onPointerMove={methods.onPointerMove}
              {...inViewMotion}
              variants={v(listVariants)}
            >
              {METHODS.map((m) => (
                <motion.li
                  key={m.key}
                  data-spot=""
                  className={kit.cell}
                  style={accentStyle(m.accent)}
                  variants={v(cardVariants)}
                >
                  <TiltCard className={`${kit.glass} ${styles.method}`} max={5} lift={4}>
                    <span className={kit.spotFill} aria-hidden="true" />
                    <span className={kit.spot} aria-hidden="true" />
                    <span className={kit.glow} aria-hidden="true" />
                    <span className={kit.travel} aria-hidden="true" />

                    <span className={kit.iconTile} aria-hidden="true">
                      {m.icon}
                    </span>
                    <span className={styles.methodBody}>
                      <span className={styles.methodLabel}>{m.label}</span>
                      <span className={styles.methodValue}>{m.value}</span>
                      <span className={styles.methodSub}>{m.sub}</span>
                    </span>
                    <span className={`${kit.moreIcon} ${styles.methodGo}`} aria-hidden="true">
                      {m.external ? <ArrowUpRight /> : <Arrow />}
                    </span>
                    <a
                      href={m.href}
                      className={kit.cardLink}
                      aria-label={m.aria}
                      {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    />
                  </TiltCard>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* form */}
          <motion.div
            id="contact-form"
            className={styles.formPanel}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className={styles.formGlow} aria-hidden="true" />
            <span className={kit.liveBorder} aria-hidden="true" />

            {sent ? (
              <div className={styles.sent} role="status" aria-live="polite">
                <span className={styles.sentIcon} aria-hidden="true">
                  <Check size={28} />
                </span>
                <h2 className={styles.sentTitle}>Your message is on its way</h2>
                <p className={styles.sentText}>
                  We&apos;ve opened your email app with the details filled in — just press send. Prefer another way?
                  Call <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> or email{" "}
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we&apos;ll take it from there.
                </p>
                <button type="button" className={kit.secondary} onClick={reset}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className={styles.formHead}>
                  <span className={styles.formIcon} aria-hidden="true">
                    <Mail size={22} />
                  </span>
                  <div>
                    <h2 className={styles.formTitle}>Send us a message</h2>
                    <p className={styles.formIntro}>
                      A few details is all we need. Fields marked <span className={styles.req}>*</span> are required.
                    </p>
                  </div>
                </div>

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
                        aria-invalid={invalid("name")}
                        aria-describedby={invalid("name") ? "cf-error" : undefined}
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
                        inputMode="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={update("email")}
                        aria-invalid={invalid("email")}
                        aria-describedby={invalid("email") ? "cf-error" : undefined}
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
                      <select id="cf-service" className={styles.select} value={form.service} onChange={update("service")}>
                        <option value="">General enquiry</option>
                        {SERVICE_OPTIONS.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                        <option value="Something else">Something else</option>
                      </select>
                      <span className={styles.selectArrow} aria-hidden="true">
                        <ChevronDown />
                      </span>
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
                      aria-invalid={invalid("message")}
                      aria-describedby={invalid("message") ? "cf-error" : undefined}
                      required
                    />
                  </div>

                  {error ? (
                    <p id="cf-error" className={styles.error} role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button type="submit" className={`${kit.primary} ${styles.submit}`}>
                    Send message
                    <span className={kit.primaryIcon} aria-hidden="true">
                      <Arrow />
                    </span>
                  </button>
                  <p className={styles.formNote}>
                    This opens your email app pre-filled to {CONTACT.email}. Your details are never shared with anyone
                    else.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------- what happens next */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="contact-steps-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <motion.header className={kit.sectionHead} {...inViewMotion} variants={v(riseVariants)}>
            <p className={kit.kicker}>
              <span className={kit.kickerDot} aria-hidden="true" />
              What happens next
            </p>
            <h2 id="contact-steps-title" className={kit.sectionTitle}>
              Three steps, <span className={kit.titleAccent}>no runaround</span>
            </h2>
            <p className={kit.sectionLead}>
              From the moment your message arrives to a documented plan with one named contact.
            </p>
          </motion.header>

          <div
            ref={stepsRef}
            className={`${kit.stepsWrap} ${styles.stepsWrap}`}
            style={{ "--steps": STEPS.length } as CSSProperties}
            data-shown={stepsInView || reduce || undefined}
          >
            <span className={kit.stepsRail} aria-hidden="true">
              <span className={kit.stepsRailFill} />
            </span>
            <motion.ol
              className={kit.steps}
              initial={reduce ? false : "hidden"}
              animate={stepsInView ? "shown" : "hidden"}
              variants={v(listVariants)}
            >
              {STEPS.map((step, i) => (
                <motion.li key={step.title} className={kit.step} variants={v(riseVariants)}>
                  <span className={kit.stepNode} aria-hidden="true">
                    {pad2(i + 1)}
                  </span>
                  <div className={kit.stepBody}>
                    <h3 className={kit.stepTitle}>{step.title}</h3>
                    <p className={kit.stepText}>{step.text}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={kit.ctaSection} aria-labelledby="contact-cta-title">
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
              Speak to the team
            </p>
            <h2 id="contact-cta-title" className={kit.ctaTitle}>
              Prefer to <span className={kit.titleAccent}>talk it through?</span>
            </h2>
            <p className={kit.ctaLead}>
              Pick up the phone and speak to the team directly. One call is often all it takes to work out the right
              next step for your business in the UAE.
            </p>
            <p className={styles.locale}>
              <span className={styles.localeDot} aria-hidden="true" />
              {address.building}, {address.city} · Serving businesses across the UAE
            </p>
          </div>
          <div className={kit.ctaActions}>
            <a href={CONTACT.phoneHref} className={kit.primary}>
              Call {CONTACT.phoneDisplay}
              <span className={kit.primaryIcon} aria-hidden="true">
                <Phone />
              </span>
            </a>
            <Link href={ROUTES.services} className={kit.secondary}>
              Explore our services
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/** Abstract city-block map — coastline, streets and a route to the pin. Not to scale. */
function MapArt() {
  return (
    <svg className={styles.mapSvg} viewBox="0 0 560 440" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cm-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d4fd0" stopOpacity="0.34" />
          <stop offset="1" stopColor="#0d2a7a" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="cm-route" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#bfe6ff" />
          <stop offset="1" stopColor="#ecc982" />
        </linearGradient>
      </defs>

      {/* sea */}
      <path
        d="M0 0H330C300 40 262 66 238 118 212 174 168 208 112 228 64 246 26 270 0 300Z"
        fill="url(#cm-water)"
      />
      <path
        d="M330 0C300 40 262 66 238 118 212 174 168 208 112 228 64 246 26 270 0 300"
        fill="none"
        stroke="rgba(191,230,255,0.28)"
        strokeWidth="1.5"
      />
      <path
        d="M286 0C258 34 226 58 204 104 180 154 140 184 92 202 54 216 24 236 0 258"
        fill="none"
        stroke="rgba(191,230,255,0.12)"
        strokeWidth="1"
        strokeDasharray="3 7"
      />

      {/* city blocks */}
      <g fill="rgba(143,178,255,0.06)" stroke="rgba(191,230,255,0.1)">
        <rect x="372" y="28" width="74" height="54" rx="6" />
        <rect x="462" y="28" width="82" height="54" rx="6" />
        <rect x="300" y="108" width="62" height="70" rx="6" />
        <rect x="462" y="98" width="82" height="80" rx="6" />
        <rect x="218" y="250" width="70" height="60" rx="6" />
        <rect x="140" y="262" width="62" height="48" rx="6" />
        <rect x="390" y="266" width="66" height="64" rx="6" />
        <rect x="472" y="266" width="72" height="64" rx="6" />
        <rect x="58" y="330" width="96" height="56" rx="6" />
        <rect x="236" y="340" width="70" height="82" rx="6" />
        <rect x="390" y="350" width="154" height="72" rx="6" />
      </g>

      {/* streets */}
      <g fill="none" stroke="rgba(255,255,255,0.12)" strokeLinecap="round">
        <path d="M372 96H560" strokeWidth="9" />
        <path d="M200 240C300 236 380 236 560 250" strokeWidth="9" />
        <path d="M376 0V440" strokeWidth="8" />
        <path d="M460 0V440" strokeWidth="6" />
        <path d="M20 320H560" strokeWidth="7" />
        <path d="M310 250V440" strokeWidth="6" />
        <path d="M212 250V440" strokeWidth="6" />
      </g>

      {/* main boulevard */}
      <path
        d="M60 440C150 380 230 330 300 290 380 244 470 196 560 170"
        fill="none"
        stroke="rgba(236,201,130,0.22)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M60 440C150 380 230 330 300 290 380 244 470 196 560 170"
        fill="none"
        stroke="rgba(236,201,130,0.5)"
        strokeWidth="1.5"
        strokeDasharray="10 10"
      />

      {/* route to the pin */}
      <path
        className={styles.route}
        d="M150 440C170 400 200 372 250 352 300 332 312 300 336 262 348 244 356 236 364 232"
        fill="none"
        stroke="url(#cm-route)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <circle cx="150" cy="430" r="5" fill="#bfe6ff" />
    </svg>
  );
}
