/** Accent drives the subtle background lighting behind a mega-menu preview. */
export type Accent = "gold" | "ice" | "royal" | "copper";

export interface MenuImage {
  src: string;
  alt: string;
  /** CSS object-position focal point for the portrait preview crop; defaults to center. */
  position?: string;
}

export interface MenuEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  /** Optional CSS object-position focal point; defaults to center. */
  imagePosition?: string;
  /** Header-only artwork (mega-menu preview + mobile sheet); falls back to `image`. */
  menuImage?: MenuImage;
  /** Short label shown in the preview frame's metadata strip. */
  category: string;
  accent: Accent;
  /** CTA text; defaults to `Explore ${title}` when omitted. */
  cta?: string;
  /** Icon key for the index-row chip; resolved by menuIcons. */
  icon?: string;
  /** Short one-line summary for dense index rows; falls back to description. */
  blurb?: string;
}
