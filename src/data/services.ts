import { ROUTES } from "@/lib/routes";
import type { MenuEntry } from "./types";

/**
 * Service titles are the exact labels from the existing MRZ navigation.
 * Descriptions are the lead copy from each live service page.
 */
export const services: MenuEntry[] = [
  {
    id: "commercial-brokers",
    title: "Commercial Brokers",
    description:
      "Connect buyers and suppliers with structured brokerage support — sourcing coordination, documentation readiness and clear follow-up from inquiry to completion.",
    href: ROUTES.service.commercialBrokers,
    image: "/images/services/commercial-brokers.webp",
    imageAlt: "Two professionals shaking hands in a high-rise office overlooking the city",
    imagePosition: "center 60%",
    menuImage: {
      src: "/images/services/commercial-brokers.header.webp",
      alt: "Two brokers in tailored suits reviewing a deal together at a laptop in a bright office",
      position: "62% center",
    },
    category: "Trade",
    accent: "gold",
    icon: "exchange",
    blurb: "Match buyers and suppliers, with documentation handled throughout.",
  },
  {
    id: "general-trading",
    title: "General Trading",
    description:
      "Support for general trading operations — supplier coordination, documentation readiness, compliance guidance and structured execution across product categories.",
    href: ROUTES.service.generalTrading,
    image: "/images/services/general-trading.webp",
    imageAlt: "Aerial view of a loaded container ship beneath gantry cranes at a busy port",
    menuImage: {
      src: "/images/services/general-trading.header.webp",
      alt: "Aerial view of a container port at sunset, with gantry cranes loading a cargo ship",
      position: "44% center",
    },
    category: "Trade",
    accent: "gold",
    icon: "box",
    blurb: "Sourcing, compliance and execution across product categories.",
  },
  {
    id: "cyber-security-architecture",
    title: "Cyber Security Architecture",
    description:
      "Security-first architecture planning for modern businesses — reduce risk, strengthen posture and build reliable systems across cloud, apps and infrastructure.",
    href: ROUTES.service.cyberSecurityArchitecture,
    image: "/images/services/cyber-security-architecture.webp",
    imageAlt: "Blue-lit enterprise servers inside a secure data centre",
    menuImage: {
      src: "/images/services/cyber-security-architecture.header.webp",
      alt: "Glowing security shield and padlock on a circuit-board chip",
    },
    category: "Technology",
    accent: "ice",
    icon: "shield",
    blurb: "Security-first design across cloud, apps and infrastructure.",
  },
  {
    id: "information-technology-consultants",
    title: "Information Technology Consultants",
    description:
      "IT consulting to improve reliability, scalability and continuity — planning, guidance and implementation support for modern business systems.",
    href: ROUTES.service.itConsultancy,
    image: "/images/services/it-consultants.webp",
    imageAlt: "Two IT consultants reviewing code together on a monitor in a bright office",
    menuImage: {
      src: "/images/services/it-consultancy.header.webp",
      alt: "IT consultant presenting a system diagram on a laptop to Emirati clients, with the Dubai skyline behind",
      position: "58% center",
    },
    category: "Technology",
    accent: "ice",
    icon: "screen",
    blurb: "Planning and support for reliable, scalable IT systems.",
  },
  {
    id: "management-services",
    title: "Management Services",
    description:
      "Operational management support for businesses in the UAE — structured coordination, planning, follow-up and documentation-led execution to keep teams aligned.",
    href: ROUTES.service.managementServices,
    image: "/images/services/management-services.webp",
    imageAlt: "Executives discussing strategy around a laptop in a modern office",
    menuImage: {
      src: "/images/services/management-services.header.webp",
      alt: "Two executives in an upbeat discussion over a tablet in a modern office",
      position: "50% 35%",
    },
    category: "Corporate",
    accent: "royal",
    icon: "layers",
    blurb: "Coordination and follow-up that keep teams aligned.",
  },
  {
    id: "petroleum-gas-engineering",
    title: "Petroleum & Gas Tank Pipes Engineering Consultancy",
    description:
      "Engineering consultancy support for petroleum and gas operations — requirements alignment, documentation readiness and structured coordination for projects.",
    href: ROUTES.service.petroleumGasEngineering,
    image: "/images/services/petroleum-gas-engineering.webp",
    imageAlt: "Oil and gas refinery illuminated against the evening sky",
    menuImage: {
      src: "/images/services/petroleum-gas-engineering-consultancy.header.webp",
      alt: "Engineer reviewing a tablet beside hard hats and plans, with an illuminated refinery behind",
      position: "45% center",
    },
    category: "Engineering",
    accent: "copper",
    icon: "droplet",
    blurb: "Consultancy for petroleum, gas tank and piping projects.",
  },
  {
    id: "human-resources-consultancy",
    title: "Human Resources Consultancy",
    description:
      "HR consultancy for UAE businesses — structured HR support, people operations guidance, documentation readiness and compliance-led processes.",
    href: ROUTES.service.hrConsultancy,
    image: "/images/services/hr-consultancy.webp",
    imageAlt: "HR consultant reviewing documents with two colleagues in an office lounge",
    menuImage: {
      src: "/images/services/hr-consultancy-services.header.webp",
      alt: "Magnifying glass singling out one candidate from a line of business silhouettes",
      position: "52% center",
    },
    category: "People",
    accent: "gold",
    icon: "people",
    blurb: "People operations and compliance-led HR guidance.",
  },
  {
    id: "other-human-resources-provision",
    title: "Other Human Resources Provision",
    description:
      "Ongoing HR operational provision — coordination, documentation readiness, task follow-ups and structured support for day-to-day HR execution.",
    href: ROUTES.service.hrProvision,
    image: "/images/services/hr-provision.webp",
    imageAlt: "Two engineers in hard hats reviewing a blueprint on site",
    menuImage: {
      src: "/images/services/hr-provision.header.webp",
      alt: "Emirati client shaking hands with an HR provider in front of an assembled multi-disciplinary team",
      position: "45% center",
    },
    category: "People",
    accent: "copper",
    icon: "person",
    blurb: "Hands-on support for day-to-day HR execution.",
  },
  {
    id: "manpower-workforce-solutions",
    title: "Manpower & Workforce Solutions",
    description:
      "Workforce support for UAE businesses — staffing needs planning, candidate sourcing coordination, onboarding documentation and structured follow-up as teams scale.",
    href: ROUTES.service.manpowerWorkforceSolutions,
    image: "/images/services/manpower-workforce-solutions.webp",
    imageAlt: "Four colleagues working together on laptops and notebooks around a wooden table in a bright office",
    menuImage: {
      src: "/images/services/manpower-workforce-solutions.header.webp",
      alt: "A team reviewing paperwork at a shared desk while two colleagues confer over a tablet behind them",
      position: "58% center",
    },
    category: "People",
    accent: "royal",
    icon: "briefcase",
    blurb: "Plan, source and onboard the workforce your operations need.",
  },
  {
    id: "hr-compliance-risk-management",
    title: "HR Compliance & Risk Management",
    description:
      "HR compliance support for UAE businesses — policy and record reviews, contract and documentation checks, and practical steps that reduce people-related risk.",
    href: ROUTES.service.hrComplianceRiskManagement,
    image: "/images/services/hr-compliance-risk-management.webp",
    imageAlt: "Overhead view of two people reviewing and completing paperwork at a light wooden desk",
    menuImage: {
      src: "/images/services/hr-compliance-risk-management.header.webp",
      alt: "Close view of hands signing a document at a counter while a second file is reviewed in the foreground",
      position: "48% center",
    },
    category: "People",
    accent: "ice",
    icon: "scale",
    blurb: "Reviews and records that keep HR practices compliant.",
  },
];

/** The URL slug for a service, derived from its vetted route (never invented). */
export const serviceSlug = (s: MenuEntry): string => s.href.replace(/^\/services\//, "");

/** Look up a service by its URL slug. */
export const getServiceBySlug = (slug: string): MenuEntry | undefined =>
  services.find((s) => serviceSlug(s) === slug);
