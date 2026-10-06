import { ROUTES } from "@/lib/routes";
import type { MenuEntry } from "./types";

/**
 * Industry names and descriptions match the live /industries page. Each industry
 * now has its own detail page at /industries/<id>, so cards and the mega-menu
 * link there; every detail page carries a clear CTA through to /services.
 */
export const industries: MenuEntry[] = [
  {
    id: "trading-companies",
    title: "Trading Companies",
    description: "Support for general trading, commercial brokerage and operational setup.",
    href: `${ROUTES.industries}/trading-companies`,
    image: "/images/industries/trading-companies.webp",
    imageAlt: "Aerial view of colourful container rows at an international trade terminal",
    category: "Commerce",
    accent: "gold",
    cta: "Explore industry",
    icon: "box",
  },
  {
    id: "construction-engineering",
    title: "Construction & Engineering",
    description: "Engineering consultancy, compliance and documentation support.",
    href: `${ROUTES.industries}/construction-engineering`,
    image: "/images/industries/construction-engineering.webp",
    imageAlt: "Construction site in Dubai with the Burj Khalifa on the skyline",
    category: "Infrastructure",
    accent: "royal",
    cta: "Explore industry",
    icon: "building",
  },
  {
    id: "oil-gas-industrial",
    title: "Oil, Gas & Industrial",
    description: "Petroleum, gas tanks, piping and industrial consultancy services.",
    href: `${ROUTES.industries}/oil-gas-industrial`,
    image: "/images/industries/oil-gas-industrial.webp",
    imageAlt: "Offshore oil platform silhouetted against a sunset sky",
    category: "Energy",
    accent: "copper",
    cta: "Explore industry",
    icon: "flame",
  },
  {
    id: "it-technology",
    title: "IT & Technology",
    description: "IT consultancy and cyber security architecture services.",
    href: `${ROUTES.industries}/it-technology`,
    image: "/images/industries/it-technology.webp",
    imageAlt: "Close detail of a blue enterprise circuit board",
    category: "Digital",
    accent: "ice",
    cta: "Explore industry",
    icon: "chip",
  },
  {
    id: "corporate-smes",
    title: "Corporate & SMEs",
    description: "Business services for SMEs and growing organisations in the UAE.",
    href: `${ROUTES.industries}/corporate-smes`,
    image: "/images/industries/corporate-smes.webp",
    imageAlt: "Aerial view of Downtown Dubai and the Burj Khalifa above the city's highways",
    category: "Enterprise",
    accent: "royal",
    cta: "Explore industry",
    icon: "office",
  },
  {
    id: "documentation-compliance",
    title: "Documentation & Compliance",
    description: "Documents clearing and regulatory support across Ajman & UAE.",
    href: `${ROUTES.industries}/documentation-compliance`,
    image: "/images/industries/documentation-compliance.webp",
    imageAlt: "Hands signing a formal contract with a gold fountain pen",
    category: "Regulatory",
    accent: "ice",
    cta: "Explore industry",
    icon: "doc",
  },
];
