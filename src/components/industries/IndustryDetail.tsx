"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import kit from "@/components/common/PageKit.module.css";
import { Arrow, Check, Mail, Phone, Plus } from "@/components/common/kitIcons";
import { useSpotlight } from "@/components/common/useSpotlight";
import { MenuIcon } from "@/components/header/menuIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { industries } from "@/data/industries";
import type { IndustryContent } from "@/data/industryContent";
import { accentStyle, PROCESS_STEPS } from "@/data/serviceContent";
import { services } from "@/data/services";
import type { MenuEntry } from "@/data/types";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./IndustryDetail.module.css";

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

/** "Oil, Gas & Industrial" → ["Oil, Gas & ", "Industrial"] so the last word carries the accent. */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(" ");
  return i < 0 ? ["", title] : [title.slice(0, i + 1), title.slice(i + 1)];
}

function SectionHead({
  id,
  kicker,
  lead,
  children,
  reduce,
}: {
  id: string;
  kicker: string;
  lead?: string;
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
      {lead ? <p className={kit.sectionLead}>{lead}</p> : null}
    </motion.header>
  );
}

interface IndustryDetailProps {
  industry: MenuEntry;
  detail: IndustryContent;
}

/**
 * Industry detail page, in the same visual language as the Services, Industries,
 * About and FAQs pages: a blueprint-grid hero with a tilting photo stage, the
 * overview beside a live-bordered "What you get" card, spotlit challenge cards,
 * photo cards for every linked service, the shared engagement rail, a two-column
 * FAQ with a contact card, and a poster rail of the other sectors. Copy, services
 * and figures all come from the vetted data — nothing is invented.
 */
export function IndustryDetail({ industry, detail }: IndustryDetailProps) {
  const reduce = useReducedMotion() ?? false;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const challenges = useSpotlight<HTMLUListElement>();
  const svc = useSpotlight<HTMLUListElement>();
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });

  const linked = detail.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is MenuEntry => Boolean(s));
  const others = industries.filter((i) => i.id !== industry.id);
  const [titleLead, titleLast] = splitTitle(industry.title);

  const stats = [
    { value: String(linked.length), label: linked.length === 1 ? "Specialist service" : "Specialist services" },
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
    <div className={kit.page} style={accentStyle(industry.accent)}>
      {/* ---------------------------------------------------------- hero */}
      <section className={kit.hero} aria-labelledby="industry-title">
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
              <Link href={ROUTES.industries}>Industries</Link>
              <span aria-hidden="true">/</span>
              <span className={kit.crumbCurrent} aria-current="page">
                {industry.title}
              </span>
            </motion.nav>

            <motion.p className={`${kit.kicker} ${styles.heroKicker}`} variants={reduce ? undefined : riseVariants}>
              <span className={styles.kickerIcon} aria-hidden="true">
                <MenuIcon name={industry.icon} width={16} height={16} />
              </span>
              {industry.category}
            </motion.p>

            <motion.h1 id="industry-title" className={kit.title} variants={reduce ? undefined : riseVariants}>
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

          {/* tilting photo stage; the chips float in front of it */}
          <motion.div
            className={styles.stage}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          >
            <span className={styles.ring} aria-hidden="true" />
            <span className={styles.ringInner} aria-hidden="true" />

            <TiltCard className={styles.media} max={7} lift={0} glare={false}>
              <span className={styles.frame}>
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  preload
                  quality={85}
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className={styles.img}
                  style={industry.imagePosition ? { objectPosition: industry.imagePosition } : undefined}
                />
                <span className={styles.shade} aria-hidden="true" />
              </span>
              <span className={kit.liveBorder} aria-hidden="true" />
              <span className={styles.caption} aria-hidden="true">
                <span className={styles.captionDot} />
                {industry.title} · UAE
              </span>
            </TiltCard>

            <div className={`${kit.chip} ${styles.chipA}`} aria-hidden="true">
              <span className={kit.chipIcon}>
                <MenuIcon name={industry.icon} width={20} height={20} />
              </span>
              <span className={kit.chipText}>
                <span className={kit.chipLabel}>Sector</span>
                <span className={kit.chipValue}>{industry.category}</span>
              </span>
            </div>
            <div className={`${kit.chip} ${styles.chipB}`} aria-hidden="true">
              <span className={kit.chipStat}>{linked.length}</span>
              <span className={kit.chipStatLabel}>
                specialist {linked.length === 1 ? "service" : "services"},
                <br />
                one team
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
              Support built for <span className={kit.titleAccent}>{industry.title}</span>
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
            <motion.div className={styles.overviewLinks} variants={reduce ? undefined : riseVariants}>
              {linked.map((s) => (
                <Link key={s.id} href={s.href} className={styles.pill} style={accentStyle(s.accent)}>
                  <span className={styles.pillIcon} aria-hidden="true">
                    <MenuIcon name={s.icon} width={15} height={15} />
                  </span>
                  {s.title}
                </Link>
              ))}
            </motion.div>
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
                  <MenuIcon name="shield" width={22} height={22} />
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
                      <Check />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------- challenges */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="challenges-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <SectionHead id="challenges-title" kicker="Common challenges" reduce={reduce}>
            Where {industry.category.toLowerCase()} teams <span className={kit.titleAccent}>need support</span>
          </SectionHead>

          <motion.ul
            ref={challenges.ref}
            className={`${styles.chGrid} ${kit.spotHost}`}
            onPointerMove={challenges.onPointerMove}
            {...gridMotion}
          >
            {detail.challenges.map((c, i) => (
              <motion.li key={c.title} data-spot="" className={kit.cell} variants={reduce ? undefined : cardVariants}>
                <TiltCard className={`${kit.glass} ${styles.chCard}`} max={6} lift={6} glare={false}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />
                  <span className={styles.chTop} aria-hidden="true">
                    <span className={styles.chNum}>{pad2(i + 1)}</span>
                    <span className={styles.chLine} />
                  </span>
                  <h3 className={kit.cardTitle}>{c.title}</h3>
                  <p className={kit.cardText}>{c.text}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ---------------------------------------------------- services */}
      <section className={kit.section} aria-labelledby="serving-title">
        <div className={kit.inner}>
          <SectionHead
            id="serving-title"
            kicker="Services for this sector"
            lead={`${linked.length} specialist ${linked.length === 1 ? "service" : "services"} for ${industry.title}, coordinated by one accountable team.`}
            reduce={reduce}
          >
            The services behind <span className={kit.titleAccent}>{industry.title}</span>
          </SectionHead>

          <motion.ul
            ref={svc.ref}
            className={`${styles.svcGrid} ${kit.spotHost}`}
            data-count={linked.length}
            onPointerMove={svc.onPointerMove}
            {...gridMotion}
          >
            {linked.map((s) => (
              <motion.li
                key={s.id}
                data-spot=""
                className={kit.cell}
                style={accentStyle(s.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.svcCard}`} max={7} lift={8} glare={false}>
                  <span className={kit.spotFill} aria-hidden="true" />
                  <span className={kit.spot} aria-hidden="true" />
                  <span className={kit.glow} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />

                  <div className={styles.svcMedia}>
                    <span className={styles.svcFrame}>
                      <Image
                        src={`/images/services/${s.id}.card.webp`}
                        alt=""
                        fill
                        className={styles.svcImg}
                        sizes="(max-width: 620px) 92vw, (max-width: 1024px) 46vw, 400px"
                      />
                    </span>
                    <span className={styles.svcShade} aria-hidden="true" />
                    <span className={styles.svcCat}>{s.category}</span>
                  </div>

                  <div className={styles.svcBody}>
                    <span className={`${kit.iconTile} ${styles.svcIcon}`} aria-hidden="true">
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
      <section className={kit.section} aria-labelledby="industry-faqs-title">
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
                id="industry-faqs-title"
                className={kit.sectionTitle}
                variants={reduce ? undefined : riseVariants}
              >
                {industry.title} <span className={kit.titleAccent}>FAQs</span>
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
              const panelId = `ind-faq-panel-${i}`;
              const btnId = `ind-faq-btn-${i}`;
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

      {/* ------------------------------------------------ other sectors */}
      <section className={`${kit.section} ${kit.band}`} aria-labelledby="others-title">
        <span className={kit.bandGlow} aria-hidden="true" />
        <div className={kit.inner}>
          <motion.header
            className={styles.othersHead}
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
            variants={reduce ? undefined : riseVariants}
          >
            <div>
              <p className={kit.kicker}>
                <span className={kit.kickerDot} aria-hidden="true" />
                Explore more
              </p>
              <h2 id="others-title" className={kit.sectionTitle}>
                Other industries <span className={kit.titleAccent}>we serve</span>
              </h2>
            </div>
            <Link href={ROUTES.industries} className={kit.secondary}>
              All industries
              <Arrow />
            </Link>
          </motion.header>

          <motion.ul className={styles.rail} {...gridMotion}>
            {others.map((ind) => (
              <motion.li
                key={ind.id}
                className={`${kit.cell} ${styles.railItem}`}
                style={accentStyle(ind.accent)}
                variants={reduce ? undefined : cardVariants}
              >
                <TiltCard className={`${kit.glass} ${styles.poster}`} max={7} lift={6} glare={false}>
                  <span className={styles.posterFrame}>
                    <Image
                      src={`/images/industries/${ind.id}.ind.webp`}
                      alt=""
                      fill
                      className={styles.posterImg}
                      sizes="(max-width: 620px) 70vw, (max-width: 1100px) 34vw, 300px"
                    />
                  </span>
                  <span className={styles.posterShade} aria-hidden="true" />
                  <span className={kit.travel} aria-hidden="true" />
                  <span className={styles.posterCat}>{ind.category}</span>
                  <span className={styles.posterBody}>
                    <span className={styles.posterIcon} aria-hidden="true">
                      <MenuIcon name={ind.icon} width={18} height={18} />
                    </span>
                    <span className={styles.posterTitle}>{ind.title}</span>
                    <span className={styles.posterArrow} aria-hidden="true">
                      <Arrow size={16} />
                    </span>
                  </span>
                  <Link href={ind.href} className={kit.cardLink} aria-label={`Explore ${ind.title}`} />
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={kit.ctaSection} aria-labelledby="industry-cta-title">
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
            <h2 id="industry-cta-title" className={kit.ctaTitle}>
              Let&apos;s plan your <span className={kit.titleAccent}>next step together</span>
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
            <Link href={ROUTES.services} className={kit.secondary}>
              Explore all services
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
