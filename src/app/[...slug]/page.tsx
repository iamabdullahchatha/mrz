import Link from "next/link";
import styles from "../demo.module.css";

/**
 * DEMO ONLY — catches the real MRZ routes (/services/…, /industries, /contact)
 * so header links can be exercised locally. The production site already has
 * these pages; do not port this file.
 */
export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  return (
    <section className={styles.placeholder}>
      <p className={styles.kicker}>Demo placeholder</p>
      <h1 className={styles.h2}>{path}</h1>
      <p className={styles.lead}>This route exists on the live site. The page body is outside the scope of the header work.</p>
      <Link href="/" className={styles.secondary}>
        Back home
      </Link>
    </section>
  );
}
