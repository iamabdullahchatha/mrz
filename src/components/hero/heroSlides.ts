import { services } from "@/data/services";
import type { Accent } from "@/data/types";
import { ROUTES } from "@/lib/routes";

/** One card in the hero's 3D deck: an HD scene tied to a real MRZ offering. */
export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  /** Short sector label shown above the title. */
  category: string;
  title: string;
  /** One-line summary shown on the front card. */
  blurb: string;
  /** Where the card links — a verified route, never invented. */
  href: string;
  accent: Accent;
  /** Icon key resolved by MenuIcon. */
  icon: string;
  /** Optional CSS object-position focal point. */
  focus?: string;
}

/**
 * Reuse the vetted service copy so nothing is invented. Artwork is hero-specific:
 * sharp 1200×1500 (4:5) crops that match the card exactly, so no cover-crop upscaling.
 */
function fromService(id: string, image: string, alt: string): HeroSlide {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`heroSlides: unknown service id "${id}"`);
  return {
    id: s.id,
    image,
    alt,
    category: s.category,
    title: s.title,
    blurb: s.blurb ?? s.description,
    href: s.href,
    accent: s.accent,
    icon: s.icon ?? "box",
  };
}

/**
 * Six HD cards that together tell MRZ's story — the UAE base plus five
 * offerings spanning trade, technology, engineering, corporate and people.
 * Distinct categories keep the deck visually and thematically varied.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "uae",
    image: "/images/hero/uae-dubai-night.webp",
    alt: "Dubai skyline lit up at night with the Burj Khalifa",
    category: "Ajman · UAE",
    title: "One partner across the UAE",
    blurb: "Business setup, trade, technology and people support — coordinated by one team.",
    href: ROUTES.services,
    accent: "gold",
    icon: "building",
  },
  fromService("general-trading", "/images/hero/trade-port.webp", "Aerial view of a container port with cranes at dusk"),
  fromService("cyber-security-architecture", "/images/hero/cyber-circuit.webp", "Illuminated circuit board with glowing data pathways"),
  fromService("petroleum-gas-engineering", "/images/hero/petroleum-refinery.webp", "Oil and gas refinery lit up at night"),
  fromService("management-services", "/images/hero/management-meeting.webp", "Business team meeting around a table in a modern office"),
  fromService("human-resources-consultancy", "/images/hero/hr-consultancy.webp", "Two business professionals talking in a bright modern office lobby"),
];
