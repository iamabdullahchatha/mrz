import Image from "next/image";
import Link from "next/link";
import { CONTACT, ROUTES } from "@/lib/routes";
import styles from "./ConsultationSection.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
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

const ASSURANCES = [
  "No obligation — a genuine conversation first",
  "A clear, documentation-led plan before any work",
  "One accountable point of contact throughout",
];

/**
 * Book a free consultation — a full-bleed call-to-action band set over an aerial
 * of the Dubai skyline. The content sits in a frosted glass panel for legibility
 * and a premium, layered feel; the primary CTA goes to the contact page with a
 * tap-to-call fallback. The scroll reveal is applied by the ScrollReveal wrapper
 * on the home page.
 */
export function ConsultationSection() {
  return (
    <section id="book-consultation" className={styles.consult} aria-labelledby="consult-title">
      <div className={styles.bg} aria-hidden="true">
        <Image
          src="/images/consultation/bg.webp"
          alt=""
          fill
          className={styles.bgImg}
          sizes="100vw"
          quality={85}
        />
        <span className={styles.scrim} />
        <span className={styles.vignette} />
      </div>

      <div className={styles.inner}>
        <span className={styles.glow} aria-hidden="true" />

        <div className={styles.panel}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Free consultation
          </p>
          <h2 id="consult-title" className={styles.title}>
            Let&apos;s build your next move in the{" "}
            <span className={styles.titleAccent}>UAE</span>
          </h2>
          <p className={styles.lead}>
            Tell us what you&apos;re planning and we&apos;ll map out exactly what&apos;s needed —
            trade, technology, finance, people or compliance — before any work begins.
          </p>

          <ul className={styles.assurances}>
            {ASSURANCES.map((a) => (
              <li key={a} className={styles.assurance}>
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                </span>
                {a}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link href={ROUTES.contact} className={styles.primary}>
              Book a free consultation
              <span className={styles.primaryIcon} aria-hidden="true">
                <Arrow />
              </span>
            </Link>
            <a href={CONTACT.phoneHref} className={styles.secondary}>
              <Phone />
              Call {CONTACT.phoneDisplay}
            </a>
          </div>

          <p className={styles.locale}>
            <span className={styles.localeDot} aria-hidden="true" />
            Based in Ajman Free Zone · Serving businesses across the UAE
          </p>
        </div>
      </div>
    </section>
  );
}
