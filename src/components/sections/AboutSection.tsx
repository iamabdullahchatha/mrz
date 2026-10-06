import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/header/icons";
import { MenuIcon } from "@/components/header/menuIcons";
import { services } from "@/data/services";
import { ROUTES } from "@/lib/routes";
import { TiltCard } from "./TiltCard";
import styles from "./AboutSection.module.css";

const HIGHLIGHTS = [
  { icon: "building", title: "Based in Ajman, serving the UAE", text: "On-the-ground support from Free Zone setup to everyday operations." },
  { icon: "layers", title: `${services.length} specialist services, one contact`, text: "Trade, technology, finance, people and documents — under one roof." },
  { icon: "shield", title: "Coordinated end to end", text: "One accountable team keeps every workstream moving together." },
];

/**
 * About MRZ — a 3D tilt-hover image beside the company story. Copy paraphrases
 * the live site's own positioning; no new business facts are invented.
 */
export function AboutSection() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.inner}>
        {/* ---------------------------------------------------- 3D image card */}
        <div className={styles.mediaCol}>
          <div className={styles.stage}>
            <TiltCard className={styles.card} max={11} lift={6}>
              <span className={styles.media}>
                <Image
                  src="/images/about/team.webp"
                  alt="MRZ advisors collaborating around a table in a bright Ajman office"
                  fill
                  sizes="(max-width: 980px) 92vw, 540px"
                  quality={85}
                  className={styles.img}
                />
                <span className={styles.mediaShade} aria-hidden="true" />
              </span>
              <span className={styles.frame} aria-hidden="true" />

              {/* parallax chips — pushed forward in Z so they float over the photo */}
              <span className={styles.tag} aria-hidden="true">
                Ajman · UAE
              </span>
              <span className={styles.statChip} aria-hidden="true">
                <span className={styles.statNum}>{services.length}</span>
                <span className={styles.statText}>
                  specialist services
                  <br />
                  one UAE team
                </span>
              </span>
            </TiltCard>
          </div>
        </div>

        {/* ----------------------------------------------------------- copy */}
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            About MRZ
          </p>
          <h2 id="about-title" className={styles.title}>
            One UAE team behind <span className={styles.titleAccent}>every part of your business</span>
          </h2>
          <p className={styles.lead}>
            From Ajman Free Zone setup to day-to-day operations, MRZ brings commercial brokerage,
            trading, IT &amp; cyber security, accounting, HR and documents clearing under one roof —
            coordinated end to end, so you work with one accountable team instead of ten.
          </p>

          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className={styles.highlight}>
                <span className={styles.highlightIcon}>
                  <MenuIcon name={h.icon} width={20} height={20} />
                </span>
                <span className={styles.highlightBody}>
                  <span className={styles.highlightTitle}>{h.title}</span>
                  <span className={styles.highlightText}>{h.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link href={ROUTES.about} className={styles.cta}>
            <span>More about MRZ</span>
            <span className={styles.ctaIcon}>
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
