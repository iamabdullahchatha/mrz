/**
 * Single source of truth for site routes used by navigation.
 *
 * Every path below was verified against the live site (https://www.mrzuae.com)
 * — they return 200 and match the hrefs in the existing navigation bundle.
 *
 * FAQs: a dedicated `/faqs` page now ships in this app (src/app/faqs). The
 * home page also keeps a `#faqs` section; nav points at the full page.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  industries: "/industries",
  faqs: "/faqs",
  contact: "/contact",
  service: {
    commercialBrokers: "/services/commercial-brokers",
    generalTrading: "/services/general-trading",
    cyberSecurityArchitecture: "/services/cyber-security-architecture",
    itConsultancy: "/services/it-consultancy",
    accountingBookkeeping: "/services/accounting-bookkeeping",
    managementServices: "/services/management-services",
    petroleumGasEngineering: "/services/petroleum-gas-engineering-consultancy",
    hrConsultancy: "/services/hr-consultancy",
    hrProvision: "/services/hr-provision",
    documentsClearing: "/services/documents-clearing",
  },
} as const;

export const CONTACT = {
  phoneDisplay: "06 808 8888",
  phoneHref: "tel:+97168088888",
  email: "info@mrzuae.com",
} as const;
