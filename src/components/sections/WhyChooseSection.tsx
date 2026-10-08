import Link from "next/link";
import { MenuIcon } from "@/components/header/menuIcons";
import { industries } from "@/data/industries";
import { services } from "@/data/services";
import { ROUTES } from "@/lib/routes";
import { TiltCard } from "./TiltCard";
import styles from "./WhyChooseSection.module.css";

/** Reasons paraphrased from the live positioning — no invented claims. */
const REASONS = [
  {
    icon: "office",
    title: "Based in the UAE",
    text: "On-the-ground presence in Ajman with support coordinated across the Emirates.",
  },
  {
    icon: "layers",
    title: "Many services, one team",
    text: "Trade, technology, engineering, people and operations — run end to end together.",
  },
  {
    icon: "person",
    title: "A single point of contact",
    text: "One relationship owner keeps every workstream aligned, so nothing falls between teams.",
  },
  {
    icon: "doc",
    title: "Documentation-led",
    text: "Checklists, readiness and clear follow-up are built into every engagement.",
  },
  {
    icon: "shield",
    title: "Compliance-first",
    text: "Processes are shaped around UAE requirements so approvals move smoothly.",
  },
  {
    icon: "exchange",
    title: "Support that stays",
    text: "We stay on as your business grows, adjusting as your priorities change.",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

const STATS = [
  { num: services.length, label: "specialist services" },
  { num: industries.length, label: "industries served" },
  { num: 1, label: "accountable team" },
];

/**
 * Why choose us — a split section: a stat-backed intro beside a grid of
 * glassmorphism reason tiles that tilt in 3D toward the pointer (mouse-only).
 */
export function WhyChooseSection() {
  return (
    <section id="why-choose-us" className={styles.why} aria-labelledby="why-title">
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Why MRZ
          </p>
          <h2 id="why-title" className={styles.title}>
            One team built to make business in the UAE{" "}
            <span className={styles.titleAccent}>simpler</span>
          </h2>
          <p className={styles.lead}>
            Instead of juggling separate providers, you get a single coordinated partner across every
            part of your operation — with clear ownership from first conversation to ongoing support.
          </p>

          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statNum}>{s.num}</dt>
                <dd className={styles.statLabel}>{s.label}</dd>
              </div>
            ))}
          </dl>

          <Link href={ROUTES.contact} className={styles.cta}>
            Talk to our team
            <span className={styles.ctaIcon} aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>

        <ul className={styles.tiles}>
          {REASONS.map((r) => (
            <li key={r.title} className={styles.cell}>
              <TiltCard className={styles.tile} max={11} lift={6}>
                <span className={styles.tileGlow} aria-hidden="true" />
                <span className={styles.tileIcon} aria-hidden="true">
                  <MenuIcon name={r.icon} width={22} height={22} />
                </span>
                <h3 className={styles.tileTitle}>{r.title}</h3>
                <p className={styles.tileText}>{r.text}</p>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
