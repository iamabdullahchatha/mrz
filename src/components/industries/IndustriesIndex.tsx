"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useSpotlight } from "@/components/common/useSpotlight";
import { MenuIcon } from "@/components/header/menuIcons";
import { pad2 } from "@/components/header/motion";
import { TiltCard } from "@/components/sections/TiltCard";
import { industries } from "@/data/industries";
import { industryDetails } from "@/data/industryContent";
import { accentStyle } from "@/data/serviceContent";
import { services } from "@/data/services";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./IndustriesIndex.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
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
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/* Where each sector sits on the hero's horizon arc (degrees from its apex). */
const ORBIT_ANGLES = [-22, -13.2, -4.4, 4.4, 13.2, 22];

const SERVICE_BY_ID = new Map(services.map((s) => [s.id, s]));

/** The core services behind each industry, straight from the vetted detail content. */
const CORE = Object.fromEntries(
  industries.map((ind) => [
    ind.id,
    (industryDetails[ind.id]?.serviceIds ?? []).flatMap((id) => SERVICE_BY_ID.get(id) ?? []),
  ]),
);

/** Coverage matrix: rows are services, columns are industries. */
const MATRIX = services.map((s) => industries.map((ind) => CORE[ind.id].some((c) => c.id === s.id)));

const STATS = [
  { value: String(industries.length), label: "Sectors served" },
  { value: String(services.length), label: "Specialist services" },
  { value: "1", label: "Accountable team" },
];

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
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/* each poster rises out of depth, rotating up into place as it scrolls in */
const cellVariants: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: 12, scale: 0.96, transformPerspective: 1200 },
  shown: { opacity: 1, y: 0, rotateX: 0, scale: 1, transformPerspective: 1200, transition: { duration: 0.75, ease: EASE } },
};

/**
 * Industries index. A centred hero rises over a glowing "horizon" arc, with each
 * sector seated on the arc as a linked node and a light sweeping slowly along it.
 * Below, a bento grid of poster cards (the first featured large) shows every
 * sector with the core services behind it, and a coverage matrix maps all
 * services against all industries, with row/column highlighting. Animations are
 * transform/opacity only and still under reduced motion. Every name, description,
 * image and service link comes from the vetted industries and services data.
 */
export function IndustriesIndex() {
  const reduce = useReducedMotion() ?? false;
  const { ref: gridRef, onPointerMove } = useSpotlight<HTMLUListElement>();

  const matrixRef = useRef<HTMLDivElement>(null);
  const matrixInView = useInView(matrixRef, { once: true, amount: 0.2 });
  const [hl, setHl] = useState<{ r: number; c: number } | null>(null);

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="industries-title">
        <span className={styles.gridBg} aria-hidden="true" />
        <span className={styles.aurora} aria-hidden="true" />
        <span className={styles.blobRoyal} aria-hidden="true" />
        <span className={styles.blobGold} aria-hidden="true" />

        <motion.div
          className={styles.heroInner}
          initial={reduce ? false : "hidden"}
          animate="shown"
          variants={reduce ? undefined : heroVariants}
        >
          <motion.nav className={styles.crumbs} aria-label="Breadcrumb" variants={reduce ? undefined : riseVariants}>
            <Link href={ROUTES.home}>Home</Link>
            <span aria-hidden="true">/</span>
            <span className={styles.crumbCurrent} aria-current="page">
              Industries
            </span>
          </motion.nav>

          <motion.p className={styles.kicker} variants={reduce ? undefined : riseVariants}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Industries we serve
          </motion.p>

          <motion.h1 id="industries-title" className={styles.title} variants={reduce ? undefined : riseVariants}>
            Sector expertise <span className={styles.titleAccent}>across the UAE</span>
          </motion.h1>

          <motion.p className={styles.lead} variants={reduce ? undefined : riseVariants}>
            From trade and construction to energy, technology and compliance — specialist support tuned to the
            realities of each sector, delivered by one accountable team.
          </motion.p>

          <motion.div className={styles.heroActions} variants={reduce ? undefined : riseVariants}>
            <a href="#industries-list" className={styles.primary}>
              Explore industries
              <span className={styles.primaryIcon} aria-hidden="true">
                <ArrowDown />
              </span>
            </a>
            <Link href={ROUTES.contact} className={styles.secondary}>
              Book a free consultation
            </Link>
          </motion.div>

          <motion.dl className={styles.stats} variants={reduce ? undefined : riseVariants}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statValue}>{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* horizon: a vast glowing arc with every sector seated on it */}
        <div className={styles.horizon}>
          <span className={styles.flare} aria-hidden="true" />
          <span className={styles.arc} aria-hidden="true">
            <span className={styles.arcLine} />
          </span>
          <span className={styles.comet} aria-hidden="true">
            <span className={styles.cometHead} />
          </span>

          <nav className={styles.orbit} aria-label="Industries">
            <ul className={styles.orbitList}>
              {industries.map((ind, i) => (
                <li
                  key={ind.id}
                  className={styles.orbitItem}
                  style={{ "--a": `${ORBIT_ANGLES[i] ?? 0}deg`, ...accentStyle(ind.accent) } as CSSProperties}
                >
                  <motion.div
                    className={styles.orbitNodeWrap}
                    initial={reduce ? false : { opacity: 0, y: 24, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.45 + Math.abs(i - 2.5) * 0.09 }}
                  >
                    <Link href={ind.href} className={styles.orbitNode}>
                      <span className={styles.orbitIcon}>
                        <MenuIcon name={ind.icon} width={22} height={22} />
                      </span>
                      <span className={styles.orbitLabel}>{ind.title}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* --------------------------------------------------------- bento */}
      <section id="industries-list" className={styles.listSection} aria-labelledby="industries-list-title">
        <header className={styles.sectionHead}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Sectors
          </p>
          <h2 id="industries-list-title" className={styles.sectionTitle}>
            Specialist support, <span className={styles.titleAccent}>tuned to your sector</span>
          </h2>
          <p className={styles.sectionLead}>
            Each sector draws on the services that matter most to it — coordinated by the same team, with the
            same documentation-led approach.
          </p>
        </header>

        <motion.ul
          ref={gridRef}
          className={styles.bento}
          onPointerMove={onPointerMove}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          variants={reduce ? undefined : listVariants}
        >
          {industries.map((ind, i) => {
            const featured = i === 0;
            const core = CORE[ind.id];
            return (
              <motion.li
                key={ind.id}
                data-spot=""
                data-featured={featured || undefined}
                className={styles.cell}
                style={accentStyle(ind.accent)}
                variants={reduce ? undefined : cellVariants}
              >
                <TiltCard className={styles.card} max={featured ? 4 : 7} lift={6}>
                  <div className={styles.frame}>
                    <Image
                      src={`/images/industries/${ind.id}.ind.webp`}
                      alt={ind.imageAlt}
                      fill
                      className={styles.img}
                      sizes={
                        featured
                          ? "(max-width: 640px) 92vw, (max-width: 960px) 92vw, 820px"
                          : "(max-width: 640px) 92vw, (max-width: 960px) 46vw, 400px"
                      }
                      quality={85}
                      preload={featured}
                    />
                    <span className={styles.shade} aria-hidden="true" />
                  </div>
                  <span className={styles.spot} aria-hidden="true" />
                  <span className={styles.travel} aria-hidden="true" />

                  <div className={styles.top} aria-hidden="true">
                    <span className={styles.iconTile}>
                      <MenuIcon name={ind.icon} width={22} height={22} />
                    </span>
                    <span className={styles.cat}>{ind.category}</span>
                    <span className={styles.index}>{pad2(i + 1)}</span>
                  </div>

                  <div className={styles.overlay}>
                    <h3 className={styles.cardTitle}>{ind.title}</h3>
                    <p className={styles.desc}>
                      {featured ? (industryDetails[ind.id]?.tagline ?? ind.description) : ind.description}
                    </p>

                    {featured ? (
                      <ul className={styles.chips} aria-label={`Core services for ${ind.title}`}>
                        {core.map((s) => (
                          <li key={s.id} className={styles.chip}>
                            <MenuIcon name={s.icon} width={14} height={14} />
                            {s.title}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className={styles.foot}>
                      {!featured ? (
                        <span className={styles.stack} aria-hidden="true">
                          {core.map((s) => (
                            <span key={s.id} className={styles.stackItem}>
                              <MenuIcon name={s.icon} width={13} height={13} />
                            </span>
                          ))}
                        </span>
                      ) : null}
                      <span className={styles.footText}>
                        {featured ? "Explore industry" : `${core.length} core services`}
                      </span>
                      <span className={styles.moreIcon} aria-hidden="true">
                        <Arrow />
                      </span>
                    </div>
                  </div>

                  <Link href={ind.href} className={styles.cardLink} aria-label={`${ind.title} — explore industry`} />
                </TiltCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* -------------------------------------------------------- matrix */}
      <section className={styles.matrixSection} aria-labelledby="industries-matrix-title">
        <span className={styles.matrixGlow} aria-hidden="true" />
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Coverage
            </p>
            <h2 id="industries-matrix-title" className={styles.sectionTitle}>
              One team across <span className={styles.titleAccent}>every sector</span>
            </h2>
            <p className={styles.sectionLead}>
              See at a glance which specialist services anchor each industry. Whatever the mix, it&apos;s delivered
              by the same coordinated team.
            </p>
          </header>

          <motion.div
            ref={matrixRef}
            className={styles.matrixPanel}
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={matrixInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className={styles.matrixScroll}>
              <table
                className={styles.matrix}
                data-shown={matrixInView || reduce || undefined}
                onMouseLeave={() => setHl(null)}
              >
                <caption className="visually-hidden">Core services for each industry</caption>
                <thead>
                  <tr>
                    <th scope="col" className={styles.corner}>
                      Service
                      <span className={styles.cornerSub}>by industry</span>
                    </th>
                    {industries.map((ind, c) => (
                      <th
                        key={ind.id}
                        scope="col"
                        className={styles.colHead}
                        data-hl={hl?.c === c || undefined}
                        style={accentStyle(ind.accent)}
                        onMouseEnter={() => setHl({ r: -1, c })}
                      >
                        <Link href={ind.href} className={styles.colLink}>
                          <span className={styles.colIcon} aria-hidden="true">
                            <MenuIcon name={ind.icon} width={18} height={18} />
                          </span>
                          <span className={styles.colTitle}>{ind.title}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, r) => (
                    <tr key={s.id} data-hl={hl?.r === r || undefined}>
                      <th scope="row" className={styles.rowHead} onMouseEnter={() => setHl({ r, c: -1 })}>
                        <Link href={s.href} className={styles.rowLink}>
                          <span className={styles.rowIcon} style={accentStyle(s.accent)} aria-hidden="true">
                            <MenuIcon name={s.icon} width={16} height={16} />
                          </span>
                          <span className={styles.rowText}>
                            <span className={styles.rowTitle}>{s.title}</span>
                            <span className={styles.rowCat}>{s.category}</span>
                          </span>
                        </Link>
                      </th>
                      {industries.map((ind, c) => {
                        const on = MATRIX[r][c];
                        return (
                          <td
                            key={ind.id}
                            className={styles.mx}
                            data-col-hl={hl?.c === c || undefined}
                            data-on={on || undefined}
                            style={accentStyle(ind.accent)}
                            onMouseEnter={() => setHl({ r, c })}
                          >
                            {on ? (
                              <>
                                <span
                                  className={styles.dot}
                                  style={{ "--d": `${(r + c) * 45}ms` } as CSSProperties}
                                  aria-hidden="true"
                                >
                                  <Check />
                                </span>
                                <span className="visually-hidden">Core service</span>
                              </>
                            ) : (
                              <>
                                <span className={styles.empty} aria-hidden="true" />
                                <span className="visually-hidden">Not core</span>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.legendDot}`} aria-hidden="true">
                  <Check />
                </span>
                Core service for the sector
              </span>
              <span className={styles.legendNote}>Select any service or industry to explore it in detail.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------- cta */}
      <section className={styles.ctaSection} aria-labelledby="industries-cta-title">
        <motion.div
          className={styles.ctaPanel}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className={styles.ctaGrid} aria-hidden="true" />
          <span className={styles.ctaGlow} aria-hidden="true" />
          <span className={styles.ctaGlowB} aria-hidden="true" />
          <span className={styles.ctaBorder} aria-hidden="true" />

          <div className={styles.ctaCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Not sure it fits?
            </p>
            <h2 id="industries-cta-title" className={styles.ctaTitle}>
              Tell us about your sector — <span className={styles.titleAccent}>we&apos;ll map the right support.</span>
            </h2>
            <p className={styles.ctaLead}>
              One conversation is enough to point you to the services that matter in your industry, with a clear,
              documentation-led plan before any work begins.
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
        </motion.div>
      </section>
    </div>
  );
}
