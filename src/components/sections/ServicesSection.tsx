import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "@/components/header/menuIcons";
import { services } from "@/data/services";
import { ROUTES } from "@/lib/routes";
import { TiltCard } from "./TiltCard";
import styles from "./ServicesSection.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/**
 * Card photos are deliberately different from each service's detail-page image
 * (and from the hero), so no single photo repeats across the site. These alts
 * describe the card photo specifically.
 */
const CARD_ALT: Record<string, string> = {
  "commercial-brokers": "Two business partners reviewing a document together in a bright modern office",
  "general-trading": "Aerial view of shipping containers and trucks at a logistics terminal",
  "cyber-security-architecture": "A secure cloud and padlock representing layered cyber security architecture",
  "information-technology-consultants": "Fibre-optic network cables connected to a server rack in a data centre",
  "management-services": "A diverse management team collaborating around a table in a modern office",
  "petroleum-gas-engineering": "An offshore oil and gas platform silhouetted against a sunset sky",
  "human-resources-consultancy": "Two HR professionals in conversation at a bright office table",
  "other-human-resources-provision": "A team working together on laptops in a bright collaborative workspace",
  "documents-clearing-services": "A professional signing official documents with a colleague assisting",
};

/**
 * Our services — a grid of glassmorphism cards that tilt in 3D toward the
 * pointer. Each card shows a bright, uncropped 16:9 photo for its service, a
 * frosted info panel and a real link. Copy and routes come straight from the
 * vetted services data — nothing invented. Motion is mouse-only (TiltCard).
 */
export function ServicesSection() {
  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      {/* static colour blobs give the frosted glass something to refract */}
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              What we do
            </p>
            <h2 id="services-title" className={styles.title}>
              Our <span className={styles.titleAccent}>services</span>
            </h2>
          </div>
          <p className={styles.lead}>
            Nine specialist services — trade, technology, engineering, people and compliance —
            delivered by one coordinated UAE team.
          </p>
        </header>

        <ul className={styles.grid}>
          {services.map((s) => (
            <li key={s.id} className={styles.cell}>
              <TiltCard className={styles.card} max={9} lift={8}>
                <span className={styles.glow} aria-hidden="true" />

                <div className={styles.media}>
                  <Image
                    src={`/images/services/${s.id}.card.webp`}
                    alt={CARD_ALT[s.id] ?? s.imageAlt}
                    fill
                    className={styles.img}
                    sizes="(max-width: 560px) 92vw, (max-width: 960px) 46vw, 400px"
                    quality={85}
                  />
                  <span className={styles.mediaShade} aria-hidden="true" />
                  <span className={styles.cat}>{s.category}</span>
                </div>

                <div className={styles.body}>
                  <span className={styles.iconTile} aria-hidden="true">
                    <MenuIcon name={s.icon} width={22} height={22} />
                  </span>
                  <h3 className={styles.cardTitle}>
                    {s.title}
                  </h3>
                  <p className={styles.blurb}>{s.blurb ?? s.description}</p>
                  <span className={styles.more}>
                    Explore
                    <span className={styles.moreIcon} aria-hidden="true">
                      <Arrow />
                    </span>
                  </span>
                </div>
                <Link href={s.href} className={styles.cardLink} aria-label={`View ${s.title} service`} />
              </TiltCard>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link href={ROUTES.services} className={styles.allCta}>
            View all services
            <span className={styles.allCtaIcon} aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
