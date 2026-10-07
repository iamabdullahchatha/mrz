"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import kit from "@/components/common/PageKit.module.css";
import { Arrow, Phone } from "@/components/common/kitIcons";
import { useSpotlight } from "@/components/common/useSpotlight";
import { MenuIcon } from "@/components/header/menuIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { industries } from "@/data/industries";
import { accentStyle } from "@/data/serviceContent";
import { services } from "@/data/services";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./About.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const DISCIPLINES = new Set(services.map((s) => s.category)).size;

const STATS = [
  { to: services.length, label: "Specialist services" },
  { to: DISCIPLINES, label: "Core disciplines" },
  { to: industries.length, label: "Industries served" },
  { to: 1, label: "Accountable team, end to end" },
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
      accent: items[0].accent,
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
    accent: "gold",
    title: "Everything under one roof",
    text: "Trade, technology, engineering, people and compliance — coordinated by a single team instead of a dozen disconnected vendors.",
  },
  {
    icon: "person",
    accent: "ice",
    title: "One accountable contact",
    text: "You work with one point of contact who keeps every workstream moving together, from first plan to day-to-day operations.",
  },
  {
    icon: "shield",
    accent: "royal",
    title: "Documentation-led, always",
    text: "A clear, compliant plan is agreed and documented before any work begins — so there are no surprises, only progress.",
  },
  {
    icon: "building",
    accent: "copper",
    title: "Rooted in Ajman, serving the UAE",
    text: "On-the-ground support from Ajman Free Zone setup to everyday operations for businesses right across the Emirates.",
  },
] as const;

/* --------------------------------------------------------------- variants */

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
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/* ---------------------------------------------------------- count-up stat */

function CountUp({ to, reduce }: { to: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const dur = 1150;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  return <span ref={ref}>{val}</span>;
}

/** Section head shared by the centred sections below. */
function SectionHead({
  id,
  kicker,
  lead,
  children,
  reduce,
}: {
  id: string;
  kicker: string;
  lead: string;
  children: ReactNode;
  reduce: boolean;
}) {
  return (
    <motion.header
      className={kit.sectionHead}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      variants={reduce ? undefined : riseVariants}
    >
      <p className={kit.kicker}>
        <span className={kit.kickerDot} aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className={kit.sectionTitle}>
        {children}
      </h2>
      <p className={kit.sectionLead}>{lead}</p>
    </motion.header>
  );
}

/**
 * About MRZ, in the same visual language as the Services and Industries index
 * pages. A split hero pairs the headline and count-up stats with a layered
 * photo collage; then the story, the six disciplines (cursor-spotlit glass
 * cards linking every service), the values, a self-drawing engagement rail,
 * the industries served and a closing CTA. Every figure, link, discipline and
 * industry is derived from the vetted data and routes.ts — nothing is invented.
 */
export function AboutContent() {
  const reduce = useReducedMotion() ?? false;
  const disc = useSpotlight<HTMLUListElement>();
  const vals = useSpotlight<HTMLUListElement>();
  const inds = useSpotlight<HTMLUListElement>();
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

  const gridMotion = {
    initial: reduce ? false : ("hidden" as const),
    whileInView: "shown",
    viewport: { once: true, amount: 0.12 },
    variants: reduce ? undefined : listVariants,
  };

  return (
    <div className={kit.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={kit.hero} aria-labelledby="about-title">
        <span className={kit.gridBg} aria-hidden="true" />
        <span className={kit.aurora} aria-hidden="true" />
        <span className={kit.blobRoyal} aria-hidden="true" />
        <span className={kit.blobGold} aria-hidden="true" />

        <div className={kit.heroInner}>
          <motion.div
            className={kit.heroCopy}
            initial={reduce ? false : "hidden"}
            animate="shown"
            variants={reduce ? undefined : heroVariants}
          >
            <motion.nav className={kit.crumbs} aria-label="Breadcrumb" variants={reduce ? undefined : riseVariants}>
              <Link href={ROUTES.home}>Home</Link>
              <span aria-hidden="true">/</span>
              <span className={kit.crumbCurrent} aria-current="page">
                About
              </span>
            </motion.nav>

            <motion.p className={kit.kicker} variants={reduce ? undefined : riseVariants}>
              <span className={kit.kickerDot} aria-hidden="true" />
              About MRZ
            </motion.p>

            <motion.h1 id="about-title" className={kit.title} variants={reduce ? undefined : riseVariants}>
              One UAE team behind <span className={kit.titleAccent}>every part of your business</span>
            </motion.h1>

            <motion.p className={kit.lead} variants={reduce ? undefined : riseVariants}>
              MRZ Management Services FZE LLC brings commercial brokerage, trading, IT &amp; cyber security,
              engineering, HR and documents clearing together under one roof — coordinated end to end from our Ajman
              office, so you work with one accountable team instead of nine.
            </motion.p>

            <motion.div className={kit.heroActions} variants={reduce ? undefined : riseVariants}>
              <Link href={ROUTES.contact} className={kit.primary}>
                Get in touch
                <span className={kit.primaryIcon} aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <Link href={ROUTES.services} className={kit.secondary}>
                Explore our services
              </Link>
            </motion.div>

            <motion.dl className={kit.stats} variants={reduce ? undefined : riseVariants}>
              {STATS.map((s) => (
                <div key={s.label} className={kit.stat}>
                  <dt className={kit.statLabel}>{s.label}</dt>
                  <dd className={kit.statValue}>
                    <CountUp to={s.to} reduce={reduce} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* decorative photo collage — the story section carries the real content */}
          <motion.div
            className={styles.collage}
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          >
            <span className={styles.ring} />
            <span className={styles.ringInner} />

            <div className={`${styles.shot} ${styles.shotMain}`}>
              <Image
                src="/images/about/team.webp"
                alt=""
                fill
                preload
                className={styles.shotImg}
                sizes="(max-width: 1024px) 86vw, 520px"
                quality={85}
              />
              <span className={styles.shotShade} />
              <span className={kit.liveBorder} />
            </div>

            <div className={`${styles.shot} ${styles.shotSide}`}>
              <Image
                src="/images/hero/uae-dubai-night.webp"
                alt=""
                fill
                className={styles.shotImg}
                sizes="(max-width: 1024px) 46vw, 270px"
              />
              <span className={styles.shotShade} />
              <span className={styles.shotCaption}>
                <span className={styles.shotDot} />
                Across the UAE
              </span>
            </div>

            <div className={`${kit.chip} ${styles.chipA}`}>
              <span className={kit.chipIcon}>
                <MenuIcon name="building" width={20} height={20} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>Based in</span>
                <span className={kit.chipValue}>Ajman · UAE</span>
              </span>
            </div>
            <div className={`${kit.chip} ${styles.chipB}`}>
              <span className={kit.chipStat}>{DISCIPLINES}</span>
              <span className={kit.chipStatLabel}>
                disciplines,
                <br />
                one team
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------------- story */}
      <section className={kit.section} aria-labelledby="about-story-title">
        <div className={`${kit.inner} ${styles.storyGrid}`}>
          <motion.div
            className={styles.storyMedia}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <TiltCard className={styles.storyCard} max={6} lift={6}>
              <span className={styles.storyFrame}>
                <Image
                  src="/images/about/collaboration.webp"
                  alt="The MRZ team collaborating around a laptop in a bright, modern UAE office"
                  fill
                  sizes="(max-width: 960px) 92vw, 580px"
                  quality={85}
                  className={styles.storyImg}
                />
                <span className={styles.storyShade} aria-hidden="true" />
              </span>
              <span className={kit.liveBorder} aria-hidden="true" />
              <span className={styles.storyTag} aria-hidden="true">
                <span className={styles.shotDot} />
                {CONTACT.address.building} · {CONTACT.address.city}
              </span>
              <span className={styles.storyChip} aria-hidden="true">
                <span className={kit.chipStat}>{services.length}</span>
                <span className={kit.chipStatLabel}>
                  specialist services,
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
            viewport={{ once: true, amount: 0.3 }}
            variants={reduce ? undefined : listVariants}
          >
            <motion.p className={kit.kicker} variants={reduce ? undefined : riseVariants}>
              <span className={kit.kickerDot} aria-hidden="true" />
              Who we are
            </motion.p>
            <motion.h2 id="about-story-title" className={kit.sectionTitle} variants={reduce ? undefined : riseVariants}>
              A single team for the <span className={kit.titleAccent}>whole of your business</span>
            </motion.h2>
            <motion.p className={styles.storyLead} variants={reduce ? undefined : riseVariants}>
              MRZ was built on a simple idea: a business shouldn&apos;t need nine different vendors to move forward.
              From our Ajman office, we bring commercial brokerage, trading, IT and cyber security, engineering, HR
              and documents clearing together under one roof.
            </motion.p>
            <motion.p className={styles.storyLead} variants={reduce ? undefined : riseVariants}>
              The result is one accountable team that plans, coordinates and delivers every workstream together — so
              nothing falls between the gaps, and you always know who&apos;s answerable for the outcome.
            </motion.p>

            <ul className={styles.points}>
              {STORY_POINTS.map((p) => (
                <motion.li key={p.text} className={styles.point} variants={reduce ? undefined : riseVariants}>
                  <span className={styles.pointIcon} aria-hidden="true">
                    <MenuIcon name={p.icon} width={18} height={18} />
                  </span>
                  {p.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------- disciplines */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="about-disc-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <SectionHead
            id="about-disc-title"
            kicker="What we do"
            lead="One team, one point of contact — covering every discipline most UAE businesses need to set up, operate and grow."
            reduce={reduce}
          >
            {services.length} specialist services across{" "}
            <span className={kit.titleAccent}>{DISCIPLINES} core disciplines</span>
          </SectionHead>

          <motion.ul
            ref={disc.ref}
            className={`${styles.discGrid} ${kit.spotHost}`}
            onPointerMove={disc.onPointerMove}
            {...gridMotion}
          >
            {DISCIPLINE_LIST.map((d, i) => (
              <motion.li
                key={d.category}
                data-spot=""
                className={kit.cell}
                style={accentStyle(d.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.discCard}`} max={6} lift={6}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />
                  <span className={kit.numeral} aria-hidden="true">
                    {pad2(i + 1)}
                  </span>

                  <span className={kit.iconTile} aria-hidden="true">
                    <MenuIcon name={d.icon} width={22} height={22} />
                  </span>
                  <h3 className={kit.cardTitle}>{d.category}</h3>
                  <p className={kit.cardText}>{d.tagline}</p>
                  <ul className={styles.discLinks}>
                    {d.items.map((s) => (
                      <li key={s.id}>
                        <Link href={s.href} className={styles.discLink}>
                          <span>{s.title}</span>
                          <Arrow size={16} />
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

      {/* -------------------------------------------------------- values */}
      <section className={kit.section} aria-labelledby="about-values-title">
        <div className={`${kit.inner} ${styles.valuesLayout}`}>
          <motion.div
            className={styles.valuesIntro}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduce ? undefined : listVariants}
          >
            <motion.p className={kit.kicker} variants={reduce ? undefined : riseVariants}>
              <span className={kit.kickerDot} aria-hidden="true" />
              How we work
            </motion.p>
            <motion.h2 id="about-values-title" className={kit.sectionTitle} variants={reduce ? undefined : riseVariants}>
              A single team you can <span className={kit.titleAccent}>hold accountable</span>
            </motion.h2>
            <motion.p className={styles.storyLead} variants={reduce ? undefined : riseVariants}>
              The way we&apos;re set up is the difference: one coordinated team, a documented plan before any work,
              and a single person answerable for the result.
            </motion.p>

            <motion.div className={styles.valuesPhoto} variants={reduce ? undefined : riseVariants}>
              <Image
                src="/images/hero/management-meeting.webp"
                alt="A business team meeting around a table in a modern office"
                fill
                className={styles.valuesImg}
                sizes="(max-width: 960px) 92vw, 480px"
              />
              <span className={styles.valuesShade} aria-hidden="true" />
              <span className={styles.valuesCaption}>
                <span className={styles.valuesCaptionIcon} aria-hidden="true">
                  <MenuIcon name="shield" width={18} height={18} />
                </span>
                One plan · one team · one contact
              </span>
            </motion.div>
          </motion.div>

          <motion.ul
            ref={vals.ref}
            className={`${styles.valuesGrid} ${kit.spotHost}`}
            onPointerMove={vals.onPointerMove}
            {...gridMotion}
          >
            {VALUES.map((v, i) => (
              <motion.li
                key={v.title}
                data-spot=""
                className={kit.cell}
                style={accentStyle(v.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.valueCard}`} max={7} lift={6}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />
                  <span className={kit.numeral} aria-hidden="true">
                    {pad2(i + 1)}
                  </span>

                  <span className={kit.iconTile} aria-hidden="true">
                    <MenuIcon name={v.icon} width={22} height={22} />
                  </span>
                  <h3 className={kit.cardTitle}>{v.title}</h3>
                  <p className={kit.cardText}>{v.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ------------------------------------------------------- process */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="about-process-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <SectionHead
            id="about-process-title"
            kicker="How we engage"
            lead="A straightforward path, the same every time — so you always know what happens next."
            reduce={reduce}
          >
            From first conversation to <span className={kit.titleAccent}>day-to-day delivery</span>
          </SectionHead>

          <div ref={stepsRef} className={kit.stepsWrap} data-shown={stepsInView || reduce || undefined}>
            <span className={kit.stepsRail} aria-hidden="true">
              <span className={kit.stepsRailFill} />
            </span>
            <motion.ol
              className={kit.steps}
              initial={reduce ? false : "hidden"}
              animate={stepsInView ? "shown" : "hidden"}
              variants={reduce ? undefined : listVariants}
            >
              {PROCESS.map((step, i) => (
                <motion.li key={step.title} className={kit.step} variants={reduce ? undefined : riseVariants}>
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

      {/* ---------------------------------------------------- industries */}
      <section className={kit.section} aria-labelledby="about-ind-title">
        <div className={kit.inner}>
          <SectionHead
            id="about-ind-title"
            kicker="Who we serve"
            lead="From trading floors to construction sites, energy to IT — we tailor the same accountable team to how your sector actually works."
            reduce={reduce}
          >
            Built for the industries that <span className={kit.titleAccent}>drive the UAE</span>
          </SectionHead>

          <motion.ul
            ref={inds.ref}
            className={`${styles.indGrid} ${kit.spotHost}`}
            onPointerMove={inds.onPointerMove}
            {...gridMotion}
          >
            {industries.map((ind) => (
              <motion.li
                key={ind.id}
                data-spot=""
                className={kit.cell}
                style={accentStyle(ind.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.indCard}`} max={7} lift={8}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />

                  <div className={styles.indMedia}>
                    <span className={styles.indFrame}>
                      <Image
                        src={`/images/industries/${ind.id}.ind.webp`}
                        alt={ind.imageAlt}
                        fill
                        className={styles.indImg}
                        sizes="(max-width: 620px) 92vw, (max-width: 960px) 46vw, 400px"
                      />
                    </span>
                    <span className={styles.indShade} aria-hidden="true" />
                    <span className={styles.indCat}>{ind.category}</span>
                  </div>

                  <div className={styles.indBody}>
                    <span className={`${kit.iconTile} ${styles.indIcon}`} aria-hidden="true">
                      <MenuIcon name={ind.icon} width={22} height={22} />
                    </span>
                    <h3 className={kit.cardTitle}>{ind.title}</h3>
                    <p className={kit.cardText}>{ind.description}</p>
                    <span className={kit.more}>
                      {ind.cta ?? "Explore industry"}
                      <span className={kit.moreIcon} aria-hidden="true">
                        <Arrow />
                      </span>
                    </span>
                  </div>
                  <Link href={ind.href} className={kit.cardLink} aria-label={`Explore ${ind.title}`} />
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={kit.ctaSection} aria-labelledby="about-cta-title">
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
              Start the conversation
            </p>
            <h2 id="about-cta-title" className={kit.ctaTitle}>
              Put one accountable team <span className={kit.titleAccent}>behind your next move</span>
            </h2>
            <p className={kit.ctaLead}>
              Tell us what you&apos;re planning and we&apos;ll map out exactly what&apos;s needed — before any work
              begins.
            </p>
          </div>
          <div className={kit.ctaActions}>
            <Link href={ROUTES.contact} className={kit.primary}>
              Get in touch
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
