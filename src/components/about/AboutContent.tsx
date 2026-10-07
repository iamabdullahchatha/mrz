"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "@/components/header/icons";
import { MenuIcon } from "@/components/header/menuIcons";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import { TiltCard } from "@/components/sections/TiltCard";
import { HeroOrbit } from "@/components/common/HeroOrbit";
import styles from "./About.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const DISCIPLINES = new Set(services.map((s) => s.category)).size;

const STATS = [
  { to: services.length, suffix: "", label: "Specialist services" },
  { to: DISCIPLINES, suffix: "", label: "Core disciplines" },
  { to: industries.length, suffix: "", label: "Industries served" },
  { to: 1, suffix: "", label: "Accountable team, end to end" },
];

const STORY_POINTS = [
  { icon: "building", text: "Based at Amber Gem Tower on Sheikh Khalifa Street in Ajman, serving businesses across the United Arab Emirates." },
  { icon: "layers", text: `${services.length} specialist services coordinated under one roof — not ${services.length} separate vendors.` },
  { icon: "person", text: "One accountable contact, from the first plan through to day-to-day operations." },
];

/** Core disciplines, grouped from the vetted services data — titles/links stay data-true. */
const CATEGORY_META: Record<string, { icon: string; tagline: string }> = {
  Trade: { icon: "exchange", tagline: "Brokerage, sourcing and import/export, coordinated end to end." },
  Technology: { icon: "chip", tagline: "IT consultancy and security-first cyber architecture." },
  People: { icon: "people", tagline: "HR consultancy and dependable workforce provision." },
  Corporate: { icon: "office", tagline: "Management services that keep operations moving." },
  Compliance: { icon: "doc", tagline: "Documents clearing and regulatory paperwork, handled." },
  Engineering: { icon: "flame", tagline: "Petroleum and gas engineering consultancy." },
};

const DISCIPLINE_LIST = (() => {
  const order: string[] = [];
  const byCat = new Map<string, MenuEntry[]>();
  for (const s of services) {
    if (!byCat.has(s.category)) {
      byCat.set(s.category, []);
      order.push(s.category);
    }
    byCat.get(s.category)!.push(s);
  }
  return order.map((category) => {
    const items = byCat.get(category)!;
    return {
      category,
      icon: CATEGORY_META[category]?.icon ?? items[0].icon,
      tagline: CATEGORY_META[category]?.tagline ?? items[0].blurb,
      items,
    };
  });
})();

const PROCESS = [
  {
    title: "Understand the goal",
    text: "We start by listening — what you're trying to achieve, your timeline and the constraints you're working within.",
  },
  {
    title: "Agree a documented plan",
    text: "Before any work begins we map out exactly what's needed and put it in writing, so expectations are clear on both sides.",
  },
  {
    title: "Coordinate one team",
    text: "Every workstream — trade, technology, engineering, people and compliance — is run by one coordinated team, not a chain of vendors.",
  },
  {
    title: "Deliver and keep supporting",
    text: "We deliver, then stay on for the day-to-day — one accountable contact for whatever comes next.",
  },
];

const VALUES = [
  {
    icon: "layers",
    title: "Everything under one roof",
    text: "Trade, technology, engineering, people and compliance — coordinated by a single team instead of a dozen disconnected vendors.",
  },
  {
    icon: "person",
    title: "One accountable contact",
    text: "You work with one point of contact who keeps every workstream moving together, from first plan to day-to-day operations.",
  },
  {
    icon: "shield",
    title: "Documentation-led, always",
    text: "A clear, compliant plan is agreed and documented before any work begins — so there are no surprises, only progress.",
  },
  {
    icon: "building",
    title: "Rooted in Ajman, serving the UAE",
    text: "On-the-ground support from Ajman Free Zone setup to everyday operations for businesses right across the Emirates.",
  },
];

/* --------------------------------------------------------------- variants */

const headVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: 10, transformPerspective: 1100 },
  shown: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1100, transition: { duration: 0.6, ease: EASE } },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, y: 46, rotateX: 12, transformPerspective: 1300 },
  shown: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1300, transition: { duration: 0.75, ease: EASE } },
};

const containerVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 38, rotateX: 16, transformPerspective: 1000 },
  shown: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000, transition: { duration: 0.6, ease: EASE } },
};

/* ---------------------------------------------------------- count-up stat */

function Stat({ to, suffix, label, reduce }: { to: number; suffix: string; label: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) { setVal(to); return; }
    if (!inView) return;
    let raf = 0;
    const dur = 1150;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  return (
    <motion.div ref={ref} className={styles.stat} variants={reduce ? undefined : cardVariants}>
      <span className={styles.statNum}>
        {val}
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
}

/**
 * About MRZ — a full page in the site's visual language. Multiple 3D animations:
 * a pointer-tilt story image with translateZ parallax, a count-up stats band,
 * and staggered 3D-reveal grids for disciplines, values, the engagement process
 * and the industries served. Every figure, link, discipline and industry is
 * derived from the vetted services/industries data and routes.ts — nothing is
 * invented. All glass is baked (no scroll-time backdrop-filter) for smooth scroll.
 */
export function AboutContent() {
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      {/* ============================================================ hero */}
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <span className={styles.blobRoyal} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.inner}>
          <div className={styles.heroGrid}>
            <motion.div
              className={styles.heroHead}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.5 }}
              variants={reduce ? undefined : headVariants}
            >
              <p className={styles.kicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                About MRZ
              </p>
              <h1 id="about-hero-title" className={styles.heroTitle}>
                One UAE team behind <span className={styles.titleAccent}>every part of your business</span>
              </h1>
              <p className={styles.heroLead}>
                MRZ Management Services FZE LLC brings commercial brokerage, trading, IT &amp; cyber
                security, engineering, HR and documents clearing together under one roof —
                coordinated end to end from our Ajman office, so you work with one accountable team
                instead of nine.
              </p>
              <div className={styles.heroActions}>
                <Link href={ROUTES.contact} className={styles.primary}>
                  Get in touch
                  <span className={styles.primaryIcon} aria-hidden="true"><ArrowRight /></span>
                </Link>
                <Link href={ROUTES.services} className={styles.secondary}>
                  Explore our services
                </Link>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <HeroOrbit
                center={<MenuIcon name="layers" />}
                centerLabel="One team"
                centerSub="MRZ"
                items={[
                  { key: "trade", icon: <MenuIcon name="exchange" /> },
                  { key: "tech", icon: <MenuIcon name="chip" /> },
                  { key: "compliance", icon: <MenuIcon name="doc" /> },
                  { key: "corporate", icon: <MenuIcon name="office" /> },
                  { key: "engineering", icon: <MenuIcon name="flame" /> },
                  { key: "people", icon: <MenuIcon name="people" /> },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================== animation 1: count-up stats */}
      <section className={styles.statsSection} aria-label="MRZ at a glance">
        <div className={styles.inner}>
          <motion.div
            className={styles.statsGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            variants={reduce ? undefined : containerVariants}
          >
            {STATS.map((s) => (
              <Stat key={s.label} to={s.to} suffix={s.suffix} label={s.label} reduce={reduce} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ animation 2: 3D story image + narrative */}
      <section className={styles.story} aria-labelledby="about-story-title">
        <span className={styles.blobRoyalB} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.inner}>
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyMedia}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
              variants={reduce ? undefined : featureVariants}
            >
              <TiltCard className={styles.storyCard} max={7} lift={6} glare>
                <span className={styles.media}>
                  <Image
                    src="/images/about/collaboration.webp"
                    alt="The MRZ team collaborating around a laptop in a bright, modern UAE office"
                    fill
                    sizes="(max-width: 980px) 92vw, 560px"
                    quality={85}
                    priority
                    className={styles.img}
                  />
                  <span className={styles.mediaShade} aria-hidden="true" />
                </span>
                <span className={styles.frame} aria-hidden="true" />

                <span className={styles.tag} aria-hidden="true">Ajman · UAE</span>
                <span className={styles.featureChip} aria-hidden="true">
                  <span className={styles.featureChipNum}>{services.length}</span>
                  <span className={styles.featureChipText}>
                    specialist services
                    <br />
                    one accountable team
                  </span>
                </span>
              </TiltCard>
            </motion.div>

            <motion.div
              className={styles.storyText}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.4 }}
              variants={reduce ? undefined : headVariants}
            >
              <p className={styles.kicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                Who we are
              </p>
              <h2 id="about-story-title" className={styles.title}>
                A single team for the <span className={styles.titleAccent}>whole of your business</span>
              </h2>
              <p className={styles.lead}>
                MRZ was built on a simple idea: a business shouldn&apos;t need nine different vendors to
                move forward. From our Ajman office, we bring commercial brokerage, trading,
                IT and cyber security, engineering, HR and documents clearing together under
                one roof.
              </p>
              <p className={styles.lead}>
                The result is one accountable team that plans, coordinates and delivers every workstream
                together — so nothing falls between the gaps, and you always know who&apos;s answerable
                for the outcome.
              </p>

              <ul className={styles.storyPoints}>
                {STORY_POINTS.map((p) => (
                  <li key={p.text} className={styles.storyPoint}>
                    <span className={styles.storyPointIcon} aria-hidden="true">
                      <MenuIcon name={p.icon} width={18} height={18} />
                    </span>
                    {p.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================= animation 3: staggered 3D disciplines grid */}
      <section className={styles.disciplines} aria-labelledby="about-disc-title">
        <span className={styles.blobGoldB} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />

        <div className={styles.inner}>
          <motion.header
            className={styles.secHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : headVariants}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              What we do
            </p>
            <h2 id="about-disc-title" className={styles.title}>
              {services.length} specialist services across{" "}
              <span className={styles.titleAccent}>{DISCIPLINES} core disciplines</span>
            </h2>
            <p className={styles.lead}>
              One team, one point of contact — covering every discipline most UAE businesses need to
              set up, operate and grow.
            </p>
          </motion.header>

          <motion.ul
            className={styles.discGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : containerVariants}
          >
            {DISCIPLINE_LIST.map((d) => (
              <motion.li key={d.category} className={styles.discCell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={styles.discCard} max={8} lift={5} glare>
                  <span className={styles.discIcon} aria-hidden="true">
                    <MenuIcon name={d.icon} width={22} height={22} />
                  </span>
                  <h3 className={styles.discTitle}>{d.category}</h3>
                  <p className={styles.discText}>{d.tagline}</p>
                  <ul className={styles.discLinks}>
                    {d.items.map((s) => (
                      <li key={s.id}>
                        <Link href={s.href} className={styles.discLink}>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ============================ animation 4: staggered 3D values grid */}
      <section className={styles.values} aria-labelledby="about-values-title">
        <span className={styles.blobRoyalB} aria-hidden="true" />
        <span className={styles.blobGoldB} aria-hidden="true" />

        <div className={styles.inner}>
          <motion.header
            className={styles.valuesHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : headVariants}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              How we work
            </p>
            <h2 id="about-values-title" className={styles.title}>
              A single team you can <span className={styles.titleAccent}>hold accountable</span>
            </h2>
            <p className={styles.lead}>
              The way we&apos;re set up is the difference: one coordinated team, a documented plan
              before any work, and a single person answerable for the result.
            </p>
          </motion.header>

          <motion.ul
            className={styles.valuesGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            variants={reduce ? undefined : containerVariants}
          >
            {VALUES.map((v) => (
              <motion.li key={v.title} className={styles.valueCell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={styles.valueCard} max={9} lift={6} glare>
                  <span className={styles.valueIcon} aria-hidden="true">
                    <MenuIcon name={v.icon} width={22} height={22} />
                  </span>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueText}>{v.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* =========================== animation 5: staggered 3D process steps */}
      <section className={styles.process} aria-labelledby="about-process-title">
        <span className={styles.blobRoyal} aria-hidden="true" />

        <div className={styles.inner}>
          <motion.header
            className={styles.secHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : headVariants}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              How we engage
            </p>
            <h2 id="about-process-title" className={styles.title}>
              From first conversation to <span className={styles.titleAccent}>day-to-day delivery</span>
            </h2>
            <p className={styles.lead}>
              A straightforward path, the same every time — so you always know what happens next.
            </p>
          </motion.header>

          <motion.ol
            className={styles.procSteps}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            variants={reduce ? undefined : containerVariants}
          >
            {PROCESS.map((step, i) => (
              <motion.li key={step.title} className={styles.procCell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={styles.procCard} max={7} lift={5} glare>
                  <span className={styles.procNum} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.procTitle}>{step.title}</h3>
                  <p className={styles.procText}>{step.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ========================= animation 6: staggered 3D industries grid */}
      <section className={styles.industries} aria-labelledby="about-ind-title">
        <span className={styles.blobGold} aria-hidden="true" />

        <div className={styles.inner}>
          <motion.header
            className={styles.secHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : headVariants}
          >
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Who we serve
            </p>
            <h2 id="about-ind-title" className={styles.title}>
              Built for the industries that <span className={styles.titleAccent}>drive the UAE</span>
            </h2>
            <p className={styles.lead}>
              From trading floors to construction sites, energy to IT — we tailor the same accountable
              team to how your sector actually works.
            </p>
          </motion.header>

          <motion.ul
            className={styles.indGrid}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={reduce ? undefined : containerVariants}
          >
            {industries.map((ind) => (
              <motion.li key={ind.id} className={styles.indCell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={styles.indCard} max={8} lift={5} glare>
                  <span className={styles.indIcon} aria-hidden="true">
                    <MenuIcon name={ind.icon ?? "box"} width={22} height={22} />
                  </span>
                  <span className={styles.indSector}>{ind.category}</span>
                  <h3 className={styles.indTitle}>{ind.title}</h3>
                  <p className={styles.indText}>{ind.description}</p>
                  <span className={styles.indMore} aria-hidden="true">
                    Explore services
                    <ArrowRight />
                  </span>
                  <Link
                    href={ind.href}
                    className={styles.indLink}
                    aria-label={`Explore services for ${ind.title}`}
                  />
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ============================================================= CTA */}
      <section className={styles.ctaSection} aria-labelledby="about-cta-title">
        <div className={styles.inner}>
          <motion.div
            className={styles.ctaPanel}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            variants={reduce ? undefined : featureVariants}
          >
            <span className={styles.ctaGlow} aria-hidden="true" />
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Start the conversation
            </p>
            <h2 id="about-cta-title" className={styles.ctaTitle}>
              Put one accountable team <span className={styles.titleAccent}>behind your next move</span>
            </h2>
            <p className={styles.ctaLead}>
              Tell us what you&apos;re planning and we&apos;ll map out exactly what&apos;s needed —
              before any work begins.
            </p>
            <div className={styles.ctaActions}>
              <Link href={ROUTES.contact} className={styles.primary}>
                Get in touch
                <span className={styles.primaryIcon} aria-hidden="true"><ArrowRight /></span>
              </Link>
              <a href={CONTACT.phoneHref} className={styles.secondary}>
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
