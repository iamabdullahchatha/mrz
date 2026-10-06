import { ROUTES } from "@/lib/routes";
import { industries } from "./industries";
import { services } from "./services";
import type { MenuEntry } from "./types";

export type MegaMenuId = "services" | "industries";

export type NavItem =
  | { kind: "link"; id: string; label: string; href: string; match: (path: string) => boolean }
  | {
      kind: "mega";
      id: MegaMenuId;
      label: string;
      href: string;
      entries: MenuEntry[];
      match: (path: string) => boolean;
    };

export const primaryNav: NavItem[] = [
  { kind: "link", id: "home", label: "Home", href: ROUTES.home, match: (p) => p === "/" },
  { kind: "link", id: "about", label: "About Us", href: ROUTES.about, match: (p) => p.startsWith("/about") },
  {
    kind: "mega",
    id: "services",
    label: "Services",
    href: ROUTES.services,
    entries: services,
    match: (p) => p.startsWith("/services"),
  },
  {
    kind: "mega",
    id: "industries",
    label: "Industries",
    href: ROUTES.industries,
    entries: industries,
    match: (p) => p.startsWith("/industries"),
  },
  { kind: "link", id: "faqs", label: "FAQs", href: ROUTES.faqs, match: (p) => p === "/faqs" },
];

export const contactNav = { label: "Contact", href: ROUTES.contact };
