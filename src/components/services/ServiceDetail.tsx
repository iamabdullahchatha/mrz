"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import kit from "@/components/common/PageKit.module.css";
import { Arrow, Check, Mail, Phone, Pin, Plus } from "@/components/common/kitIcons";
import { useSpotlight } from "@/components/common/useSpotlight";
import { MenuIcon } from "@/components/header/menuIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { industries } from "@/data/industries";
import { industryDetails } from "@/data/industryContent";
import { PROCESS_STEPS, accentStyle, type ServiceDetail as ServiceDetailContent } from "@/data/serviceContent";
import { services } from "@/data/services";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./ServiceDetail.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

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

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

/* Why MRZ — grounded differentiators drawn from the firm's positioning. */
const WHY_MRZ: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <MenuIcon name="people" width={22} height={22} />,
    title: "One accountable team",
    text: "Trade, technology, engineering, people and operations handled under a single team.",
  },
  {
    icon: <MenuIcon name="doc" width={22} height={22} />,
    title: "Documentation-led",
    text: "Checklists and readiness reviews are built into every engagement from day one.",
  },
  {
    icon: <MenuIcon name="person" width={22} height={22} />,
    title: "A single point of contact",
    text: "No juggling providers — one relationship, coordinated from start to finish.",
  },
  {
    icon: <Pin size={22} />,
    title: "Ajman to all the UAE",
    text: "Based at Amber Gem Tower on Sheikh Khalifa Street, supporting businesses right across the Emirates.",
  },
];

/** "General Trading" → ["General ", "Trading"] so the last word carries the accent. */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(" ");
  return i < 0 ? ["", title] : [title.slice(0, i + 1), title.slice(i + 1)];
}

function SectionHead({
  id,
  kicker,
  lead,
  start,
  children,
  reduce,
}: {
  id: string;
  kicker: string;
  lead?: string;
  start?: boolean;
  children: ReactNode;
  reduce: boolean;
}) {
  return (
    <motion.header
      className={start ? `${kit.sectionHead} ${kit.sectionHeadStart} ${styles.headStart}` : kit.sectionHead}
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
      {lead ? <p className={kit.sectionLead}>{lead}</p> : null}
    </motion.header>
  );
}

interface ServiceDetailProps {
  service: MenuEntry;
  detail: ServiceDetailContent;
}

/**
 * Service detail page, in the same visual language as the Industry, About and
 * FAQs pages: a blueprint-grid hero with a layered photo stage, the overview
 * beside a live-bordered "What you get" card, a photo-led bento of what's
 * included, an editorial "Why MRZ" sheet, the shared engagement rail, a
 * two-column FAQ with a contact card and photo cards for related services.
 * Every service carries its own accent; copy, figures and routes all come from
 * the vetted data — nothing is invented.
 */
export function ServiceDetail({ service, detail }: ServiceDetailProps) {
  const reduce = useReducedMotion() ?? false;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const included = useSpotlight<HTMLUListElement>();
  const related = useSpotlight<HTMLUListElement>();
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

  const [titleLead, titleLast] = splitTitle(service.title);
  // the curated header artwork leads the stage; the full-width service photo stacks beside it
  const heroImg = service.menuImage ?? { src: service.image, alt: service.imageAlt, position: service.imagePosition };
  const insetImg =
    heroImg.src !== service.image ? { src: service.image, position: service.imagePosition } : null;
  const category = service.category.toLowerCase();

  // industries whose detail pages list this service
  const sectors = industries.filter((i) => industryDetails[i.id]?.serviceIds.includes(service.id));

  // related: same category first, then the services that share the most of these industries
  const sharedSectors = (id: string) => sectors.filter((i) => industryDetails[i.id]?.serviceIds.includes(id)).length;
  const relatedServices = services
    .filter((s) => s.id !== service.id)
    .map((s, order) => ({ s, order, score: (s.category === service.category ? 10 : 0) + sharedSectors(s.id) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3)
    .map(({ s }) => s);

  const stats = [
    { value: String(detail.included.length), label: "Core areas of support" },
    { value: "1", label: "Accountable team" },
    { value: "UAE", label: "Nationwide coverage" },
    { value: "Free", label: "First consultation" },
  ];

  const gridMotion = {
    initial: reduce ? false : ("hidden" as const),
    whileInView: "shown",
    viewport: { once: true, amount: 0.12 },
    variants: reduce ? undefined : listVariants,
  };

  return (
    <div className={kit.page} style={accentStyle(service.accent)}>
      {/* ---------------------------------------------------------- hero */}
      <section className={kit.hero} aria-labelledby="service-title">
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
              <Link href={ROUTES.services}>Services</Link>
              <span aria-hidden="true">/</span>
              <span className={`${kit.crumbCurrent} ${styles.crumbCurrent}`} aria-current="page">
                {service.title}
              </span>
            </motion.nav>

            <motion.p className={`${kit.kicker} ${styles.heroKicker}`} variants={reduce ? undefined : riseVariants}>
              <span className={styles.kickerIcon} aria-hidden="true">
                <MenuIcon name={service.icon} width={16} height={16} />
              </span>
              {service.category}
            </motion.p>

            <motion.h1
              id="service-title"
              className={`${kit.title} ${styles.title}`}
              data-long={service.title.length > 28 || undefined}
              variants={reduce ? undefined : riseVariants}
            >
              {titleLead}
              <span className={kit.titleAccent}>{titleLast}</span>
            </motion.h1>

            <motion.p className={kit.lead} variants={reduce ? undefined : riseVariants}>
              {detail.tagline}
            </motion.p>

            <motion.div className={kit.heroActions} variants={reduce ? undefined : riseVariants}>
              <Link href={ROUTES.contact} className={kit.primary}>
                Book a free consultation
                <span className={kit.primaryIcon} aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <a href={CONTACT.phoneHref} className={kit.secondary}>
                <Phone />
                {CONTACT.phoneDisplay}
              </a>
            </motion.div>

            <motion.dl className={kit.stats} variants={reduce ? undefined : riseVariants}>
              {stats.map((s) => (
                <div key={s.label} className={kit.stat}>
                  <dt className={kit.statLabel}>{s.label}</dt>
                  <dd className={kit.statValue}>{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* layered photo stage: a tilting main frame, a stacked inset photo and two floating chips */}
          <motion.div
            className={styles.stage}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          >
            <span className={styles.halo} aria-hidden="true" />
            <span className={styles.dots} aria-hidden="true" />

            <TiltCard className={styles.media} max={7} lift={0} glare={false}>
              <span className={styles.frame}>
                <Image
                  src={heroImg.src}
                  alt={heroImg.alt}
                  fill
                  preload
                  quality={85}
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className={styles.img}
                  style={heroImg.position ? { objectPosition: heroImg.position } : undefined}
                />
                <span className={styles.shade} aria-hidden="true" />
              </span>
              <span className={kit.liveBorder} aria-hidden="true" />
            </TiltCard>

            {insetImg ? (
              <span className={styles.inset} aria-hidden="true">
                <span className={styles.insetFrame}>
                  <Image
                    src={insetImg.src}
                    alt=""
                    fill
                    sizes="260px"
                    className={styles.img}
                    style={insetImg.position ? { objectPosition: insetImg.position } : undefined}
                  />
                </span>
              </span>
            ) : null}

            <div className={`${kit.chip} ${styles.chipA}`} aria-hidden="true">
              <span className={kit.chipIcon}>
                <MenuIcon name={service.icon} width={20} height={20} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>Service</span>
                <span className={kit.chipValue}>{service.category}</span>
              </span>
            </div>
            <div className={`${kit.chip} ${styles.chipB}`} aria-hidden="true">
              <span className={styles.chipCheck}>
                <Check size={16} strokeWidth={2.4} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>First step</span>
                <span className={kit.chipValue}>Free consultation</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------ overview */}
      <section className={kit.section} aria-labelledby="overview-title">
        <div className={`${kit.inner} ${styles.overviewGrid}`}>
          <motion.div
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduce ? undefined : listVariants}
          >
            <motion.p className={kit.kicker} variants={reduce ? undefined : riseVariants}>
              <span className={kit.kickerDot} aria-hidden="true" />
              Overview
            </motion.p>
            <motion.h2 id="overview-title" className={kit.sectionTitle} variants={reduce ? undefined : riseVariants}>
              What this service <span className={kit.titleAccent}>covers</span>
            </motion.h2>
            {detail.overview.map((p, i) => (
              <motion.p
                key={p}
                className={i === 0 ? styles.overviewLead : styles.overviewText}
                variants={reduce ? undefined : riseVariants}
              >
                {p}
              </motion.p>
            ))}

            {sectors.length > 0 ? (
              <motion.div className={styles.sectors} variants={reduce ? undefined : riseVariants}>
                <p className={styles.sectorsLabel}>Industries we support with this service</p>
                <div className={styles.sectorPills}>
                  {sectors.map((ind) => (
                    <Link key={ind.id} href={ind.href} className={styles.pill} style={accentStyle(ind.accent)}>
                      <span className={styles.pillIcon} aria-hidden="true">
                        <MenuIcon name={ind.icon} width={15} height={15} />
                      </span>
                      {ind.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div
            className={kit.cell}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <TiltCard className={`${kit.glass} ${styles.outcomesCard}`} max={5} lift={0} glare={false}>
              <span className={kit.glow} aria-hidden="true" />
              <span className={kit.liveBorder} aria-hidden="true" />
              <div className={styles.outcomesHead}>
                <span className={kit.iconTile} aria-hidden="true">
                  <MenuIcon name={service.icon} width={22} height={22} />
                </span>
                <div>
                  <p className={styles.outcomesLabel}>What you get</p>
                  <p className={styles.outcomesSub}>One accountable team, start to finish</p>
                </div>
              </div>
              <ul className={styles.outcomes}>
                {detail.outcomes.map((o) => (
                  <li key={o} className={styles.outcome}>
                    <span className={styles.check} aria-hidden="true">
                      <Check size={15} strokeWidth={2.4} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------- included */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="included-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <SectionHead id="included-title" kicker="What's included" lead={service.description} reduce={reduce}>
            {COUNT_WORDS[detail.included.length] ?? detail.included.length} ways we{" "}
            <span className={kit.titleAccent}>support you</span>
          </SectionHead>

          <motion.ul
            ref={included.ref}
            className={`${styles.bento} ${kit.spotHost}`}
            onPointerMove={included.onPointerMove}
            {...gridMotion}
          >
            <motion.li className={`${kit.cell} ${styles.bentoPhoto}`} variants={reduce ? undefined : cardVariants}>
              <TiltCard className={`${kit.glass} ${styles.photoCard}`} max={5} lift={0} glare={false}>
                <span className={styles.photoFrame}>
                  <Image
                    src={`/images/services/${service.id}.card.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 92vw, 460px"
                    className={styles.photoImg}
                  />
                </span>
                <span className={styles.photoShade} aria-hidden="true" />
                <span className={kit.travel} aria-hidden="true" />
                <span className={styles.photoTag}>{service.category}</span>
                <span className={styles.photoBody}>
                  <span className={kit.iconTile} aria-hidden="true">
                    <MenuIcon name={service.icon} width={22} height={22} />
                  </span>
                  <span className={styles.photoTitle}>{service.title}</span>
                </span>
              </TiltCard>
            </motion.li>

            {detail.included.map((inc, i) => (
              <motion.li key={inc.title} data-spot="" className={kit.cell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={`${kit.glass} ${styles.incCard}`} max={6} lift={6} glare={false}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />
                  <span className={styles.incTop} aria-hidden="true">
                    <span className={styles.incNum}>{pad2(i + 1)}</span>
                    <span className={styles.incLine} />
                  </span>
                  <h3 className={kit.cardTitle}>{inc.title}</h3>
                  <p className={kit.cardText}>{inc.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- why */}
      <section className={kit.section} aria-labelledby="why-title">
        <div className={`${kit.inner} ${styles.whyLayout}`}>
          <div className={styles.whyIntro}>
            <SectionHead
              id="why-title"
              kicker="Why MRZ"
              lead="Trade, technology, engineering, people and operations — coordinated from our Ajman office for businesses across the Emirates."
              start
              reduce={reduce}
            >
              Why businesses choose MRZ for <span className={kit.titleAccent}>{category}</span>
            </SectionHead>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            >
              <Link href={ROUTES.about} className={kit.secondary}>
                More about MRZ
                <Arrow />
              </Link>
            </motion.div>
          </div>

          <motion.ul className={styles.whySheet} {...gridMotion}>
            {WHY_MRZ.map((w) => (
              <motion.li key={w.title} className={styles.whyItem} variants={reduce ? undefined : riseVariants}>
                <span className={styles.whyIcon} aria-hidden="true">
                  {w.icon}
                </span>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.whyText}>{w.text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ------------------------------------------------------- process */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="process-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <SectionHead
            id="process-title"
            kicker="How we work"
            lead="The same straightforward path on every engagement — so you always know what happens next."
            reduce={reduce}
          >
            A clear path from first call <span className={kit.titleAccent}>to follow-up</span>
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
              {PROCESS_STEPS.map((step) => (
                <motion.li key={step.n} className={kit.step} variants={reduce ? undefined : riseVariants}>
                  <span className={kit.stepNode} aria-hidden="true">
                    {step.n}
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

      {/* ---------------------------------------------------------- faqs */}
      <section className={kit.section} aria-labelledby="service-faqs-title">
        <div className={`${kit.inner} ${styles.faqLayout}`}>
          <div className={styles.faqAside}>
            <motion.div
              className={styles.faqIntro}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.5 }}
              variants={reduce ? undefined : listVariants}
            >
              <motion.p className={kit.kicker} variants={reduce ? undefined : riseVariants}>
                <span className={kit.kickerDot} aria-hidden="true" />
                Good to know
              </motion.p>
              <motion.h2
                id="service-faqs-title"
                className={`${kit.sectionTitle} ${styles.faqTitle}`}
                data-long={service.title.length > 28 || undefined}
                variants={reduce ? undefined : riseVariants}
              >
                {service.title} <span className={kit.titleAccent}>FAQs</span>
              </motion.h2>
            </motion.div>

            <div className={`${kit.cell} ${styles.helpWrap}`}>
              <TiltCard className={`${kit.glass} ${styles.helpCard}`} max={5} lift={0} glare={false}>
                <span className={kit.glow} aria-hidden="true" />
                <span className={kit.liveBorder} aria-hidden="true" />
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
              </TiltCard>
            </div>
          </div>

          <ul className={styles.faqList}>
            {detail.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `svc-faq-panel-${i}`;
              const btnId = `svc-faq-btn-${i}`;
              return (
                <motion.li
                  key={item.q}
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
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span className={styles.faqNum} aria-hidden="true">
                        {pad2(i + 1)}
                      </span>
                      <span className={styles.faqQ}>{item.q}</span>
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
                        <p className={styles.faqAnswer}>{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- related */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="related-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <motion.header
            className={styles.relatedHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : riseVariants}
          >
            <div>
              <p className={kit.kicker}>
                <span className={kit.kickerDot} aria-hidden="true" />
                Keep exploring
              </p>
              <h2 id="related-title" className={kit.sectionTitle}>
                Related <span className={kit.titleAccent}>services</span>
              </h2>
            </div>
            <Link href={ROUTES.services} className={kit.secondary}>
              All services
              <Arrow />
            </Link>
          </motion.header>

          <motion.ul
            ref={related.ref}
            className={`${styles.relGrid} ${kit.spotHost}`}
            onPointerMove={related.onPointerMove}
            {...gridMotion}
          >
            {relatedServices.map((s) => (
              <motion.li
                key={s.id}
                data-spot=""
                className={kit.cell}
                style={accentStyle(s.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.relCard}`} max={7} lift={8} glare={false}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />

                  <div className={styles.relMedia}>
                    <span className={styles.relFrame}>
                      <Image
                        src={`/images/services/${s.id}.card.webp`}
                        alt=""
                        fill
                        className={styles.relImg}
                        sizes="(max-width: 620px) 92vw, (max-width: 1024px) 46vw, 400px"
                      />
                    </span>
                    <span className={styles.relShade} aria-hidden="true" />
                    <span className={styles.relCat}>{s.category}</span>
                  </div>

                  <div className={styles.relBody}>
                    <span className={`${kit.iconTile} ${styles.relIcon}`} aria-hidden="true">
                      <MenuIcon name={s.icon} width={22} height={22} />
                    </span>
                    <h3 className={kit.cardTitle}>{s.title}</h3>
                    <p className={kit.cardText}>{s.blurb ?? s.description}</p>
                    <span className={kit.more}>
                      Explore service
                      <span className={kit.moreIcon} aria-hidden="true">
                        <Arrow />
                      </span>
                    </span>
                  </div>
                  <Link href={s.href} className={kit.cardLink} aria-label={`Explore ${s.title}`} />
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={kit.ctaSection} aria-labelledby="service-cta-title">
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
              Ready when you are
            </p>
            <h2 id="service-cta-title" className={kit.ctaTitle}>
              Let&apos;s talk about your <span className={kit.titleAccent}>{category} needs</span>
            </h2>
            <p className={kit.ctaLead}>
              Book a free consultation and we&apos;ll outline a clear, documentation-led plan before any work begins —
              no obligation.
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
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
