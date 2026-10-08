import type { CSSProperties } from "react";
import type { Accent } from "./types";

/**
 * Detail-page content for each service, keyed by the service `id` in
 * `services.ts`. Copy is paraphrased from the live MRZ positioning and the
 * vetted service descriptions — grounded only, with no invented pricing,
 * timelines, certifications or guarantees. Keep it specific but honest.
 */
export interface ServiceDetail {
  /** One-line hero subtitle. */
  tagline: string;
  /** Two short overview paragraphs. */
  overview: [string, string];
  /** "What's included" — the concrete support in this service. */
  included: { title: string; text: string }[];
  /** "What you get" — the outcomes a client can expect. */
  outcomes: string[];
  /** Three grounded, service-specific FAQs for the detail page accordion. */
  faqs: { q: string; a: string }[];
}

export const serviceDetails: Record<string, ServiceDetail> = {
  "commercial-brokers": {
    tagline: "Structured brokerage that moves deals from first inquiry to clean completion.",
    overview: [
      "MRZ connects buyers and suppliers with hands-on brokerage support built around clarity and follow-through. We coordinate sourcing, keep documentation ready and stay close to every conversation so nothing stalls between inquiry and completion.",
      "You work with one accountable team that understands UAE trade — so introductions are relevant, paperwork is in order, and every stage has a clear next step.",
    ],
    included: [
      { title: "Sourcing coordination", text: "We identify and approach the right buyers or suppliers and manage the introductions on your behalf." },
      { title: "Documentation readiness", text: "Contracts, invoices and supporting paperwork are prepared and checked before they are needed." },
      { title: "Clear follow-up", text: "Every open item is tracked with a defined owner and next step, so deals keep moving." },
      { title: "Completion support", text: "We stay involved through to completion and hand over clean, organised records." },
    ],
    outcomes: ["Relevant introductions, not cold leads", "Deals that progress without paperwork delays", "One point of contact from inquiry to close", "Organised records at every milestone"],
    faqs: [
      { q: "What does MRZ's commercial brokerage actually cover?", a: "We coordinate sourcing, approach the right buyers or suppliers, keep contracts and supporting paperwork ready, and track every open item through to a clean completion — one accountable team from first inquiry to close." },
      { q: "Do I get relevant introductions or just a list of leads?", a: "Relevant introductions. We understand UAE trade, so we approach buyers and suppliers that fit your requirements and manage the conversations on your behalf, rather than handing over cold contacts." },
      { q: "How do we get started?", a: "Book a free consultation. We review what you're trading, outline what's needed and give you a clear, documentation-led plan before any brokerage work begins." },
    ],
  },

  "general-trading": {
    tagline: "Supplier coordination and compliant execution across product categories.",
    overview: [
      "We support general trading operations end to end — coordinating suppliers, preparing documentation and guiding compliance so goods move smoothly across categories.",
      "Structured execution keeps your orders on track, with readiness reviews that reduce the surprises that typically slow trading down.",
    ],
    included: [
      { title: "Supplier coordination", text: "Sourcing and liaison across product categories, managed to your requirements." },
      { title: "Documentation readiness", text: "Trade paperwork prepared, checked and kept current for each shipment." },
      { title: "Compliance guidance", text: "Practical guidance to keep operations aligned with UAE requirements." },
      { title: "Structured execution", text: "Clear stages and follow-up so orders progress predictably." },
    ],
    outcomes: ["Fewer delays at each handover", "Paperwork ready before it is required", "Compliance kept front of mind", "A predictable, repeatable process"],
    faqs: [
      { q: "Which product categories can you support?", a: "We coordinate suppliers and compliant execution across product categories, tailored to your requirements — sourcing, liaison and trade documentation handled end to end." },
      { q: "How do you keep orders from stalling?", a: "Every shipment runs to clear stages with readiness reviews, so paperwork is prepared and checked before it's required and each handover has a defined next step." },
      { q: "Can you also handle the compliance side?", a: "Yes. We give practical guidance to keep operations aligned with UAE requirements, and keep trade paperwork current for each shipment." },
    ],
  },

  "cyber-security-architecture": {
    tagline: "Security-first architecture across cloud, applications and infrastructure.",
    overview: [
      "We plan security into systems from the ground up — reviewing your posture, reducing risk and designing reliable architecture across cloud, applications and infrastructure.",
      "The goal is resilience you can trust: clear design decisions, defensible layers and systems that hold up as your business grows.",
    ],
    included: [
      { title: "Posture review", text: "A structured assessment of where risk sits across your current systems." },
      { title: "Architecture planning", text: "Security-first design for cloud, applications and infrastructure." },
      { title: "Risk reduction", text: "Prioritised, practical steps that strengthen your defences." },
      { title: "Reliable foundations", text: "Resilient layers designed to scale with the business." },
    ],
    outcomes: ["A clearer view of real risk", "Defensible, layered design", "Fewer weak points to exploit", "Architecture that scales safely"],
    faqs: [
      { q: "What does a security-first architecture engagement include?", a: "A structured review of where risk sits today, security-first design across cloud, applications and infrastructure, and prioritised, practical steps that strengthen your defences." },
      { q: "Do you work with our existing systems or start from scratch?", a: "Both. We assess your current posture first, then plan resilient, layered design that fits what you already run and scales as the business grows." },
      { q: "How do we begin?", a: "Start with a free consultation. We map your systems and risks, then set out a clear, documentation-led plan before any work begins." },
    ],
  },

  "information-technology-consultants": {
    tagline: "Planning and support for reliable, scalable business systems.",
    overview: [
      "Our IT consultants help you improve reliability, scalability and continuity — from planning and guidance through to implementation support for modern business systems.",
      "We translate business goals into practical technical decisions, so your systems support growth instead of getting in its way.",
    ],
    included: [
      { title: "Systems planning", text: "Roadmaps that align technology with where the business is heading." },
      { title: "Reliability & continuity", text: "Guidance to keep critical systems available and resilient." },
      { title: "Scalability guidance", text: "Design decisions that let systems grow without rework." },
      { title: "Implementation support", text: "Hands-on help putting the plan into practice." },
    ],
    outcomes: ["Technology aligned to business goals", "More reliable day-to-day operations", "Headroom to scale", "Support through delivery, not just advice"],
    faqs: [
      { q: "What can MRZ's IT consultants help with?", a: "Systems planning, reliability and continuity, scalability guidance and hands-on implementation support — translating business goals into practical technical decisions." },
      { q: "Do you only advise, or help deliver too?", a: "Both. You get roadmaps and guidance plus support through delivery, so the plan is actually put into practice." },
      { q: "How do we get started?", a: "Book a free consultation. We review where the business is heading and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "management-services": {
    tagline: "Coordination and follow-up that keep teams aligned.",
    overview: [
      "We provide operational management support for UAE businesses — structured coordination, planning and follow-up, with documentation-led execution that keeps teams aligned and work moving.",
      "When everyone knows the plan, the owner and the next step, operations run calmly and predictably.",
    ],
    included: [
      { title: "Operational coordination", text: "The moving parts organised and kept in sync." },
      { title: "Planning", text: "Clear plans with defined owners and milestones." },
      { title: "Follow-up", text: "Open items tracked through to resolution." },
      { title: "Documentation-led execution", text: "Decisions and actions recorded so nothing is lost." },
    ],
    outcomes: ["Teams pulling in the same direction", "Fewer dropped handovers", "Predictable delivery", "A clear record of decisions"],
    faqs: [
      { q: "What does operational management support involve?", a: "Structured coordination, planning and follow-up with documentation-led execution — the moving parts organised, owners defined and open items tracked to resolution." },
      { q: "How do you keep teams aligned?", a: "Everyone knows the plan, the owner and the next step. Decisions and actions are recorded, so handovers don't get dropped and delivery stays predictable." },
      { q: "How do we get started?", a: "Book a free consultation. We map how your operations run today and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "petroleum-gas-engineering": {
    tagline: "Consultancy for petroleum, gas tank and piping projects.",
    overview: [
      "We provide engineering consultancy support for petroleum and gas operations — aligning requirements, preparing documentation and coordinating the structured steps a project needs to progress.",
      "Clear requirements and organised paperwork keep technical projects on track and audit-ready.",
    ],
    included: [
      { title: "Requirements alignment", text: "Technical and project requirements clarified up front." },
      { title: "Documentation readiness", text: "Project paperwork prepared and kept in order." },
      { title: "Structured coordination", text: "Stages and stakeholders coordinated to a clear plan." },
      { title: "Project follow-through", text: "Progress tracked so milestones are met." },
    ],
    outcomes: ["Requirements everyone agrees on", "Audit-ready documentation", "Coordinated, orderly progress", "Milestones kept on track"],
    faqs: [
      { q: "What kind of projects do you support?", a: "Engineering consultancy for petroleum and gas operations — including gas tank and piping projects — with requirements aligned, documentation prepared and the structured steps coordinated." },
      { q: "How do you keep technical projects audit-ready?", a: "Requirements are clarified up front and project paperwork is kept in order, so stages progress in a coordinated way and milestones stay on track." },
      { q: "How do we begin?", a: "Start with a free consultation. We clarify your project requirements and set out a clear, documentation-led plan before any work begins." },
    ],
  },

  "human-resources-consultancy": {
    tagline: "People operations and compliance-led HR guidance.",
    overview: [
      "We provide HR consultancy for UAE businesses — structured HR support, people-operations guidance and documentation readiness, built around compliance-led processes.",
      "Good HR foundations protect the business and give your people a clear, fair experience.",
    ],
    included: [
      { title: "HR support", text: "Structured guidance across the employee lifecycle." },
      { title: "People operations", text: "Processes that make day-to-day HR run smoothly." },
      { title: "Documentation readiness", text: "HR records and paperwork prepared and compliant." },
      { title: "Compliance-led processes", text: "Practices aligned with UAE requirements." },
    ],
    outcomes: ["Compliant, consistent HR practices", "Smoother people operations", "Records ready when needed", "A fairer employee experience"],
    faqs: [
      { q: "What does your HR consultancy cover?", a: "Structured HR support across the employee lifecycle, people-operations guidance and documentation readiness, built around compliance-led processes." },
      { q: "How do you keep HR compliant?", a: "Practices are aligned with UAE requirements and HR records are prepared and kept in order, giving consistent processes and a fairer employee experience." },
      { q: "How do we get started?", a: "Book a free consultation. We review your current HR setup and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "other-human-resources-provision": {
    tagline: "Hands-on support for day-to-day HR execution.",
    overview: [
      "We provide ongoing HR operational provision — coordination, documentation readiness and task follow-ups that keep day-to-day HR execution moving without gaps.",
      "Think of it as dependable extra capacity for the HR work that has to get done, every day.",
    ],
    included: [
      { title: "Operational coordination", text: "HR tasks organised and kept on schedule." },
      { title: "Documentation readiness", text: "Paperwork prepared and maintained." },
      { title: "Task follow-ups", text: "Open items chased to completion." },
      { title: "Day-to-day execution", text: "Reliable hands-on support for routine HR work." },
    ],
    outcomes: ["HR work that keeps moving", "Nothing falling through the cracks", "Extra capacity when you need it", "Consistent, dependable delivery"],
    faqs: [
      { q: "How is HR provision different from HR consultancy?", a: "Provision is hands-on, ongoing capacity for day-to-day HR execution — coordination, documentation readiness and task follow-ups — rather than higher-level advisory guidance." },
      { q: "Can you cover HR work on an ongoing basis?", a: "Yes. Think of it as dependable extra capacity for the routine HR work that has to get done every day, with nothing falling through the cracks." },
      { q: "How do we start?", a: "Book a free consultation. We review the HR workload you need covered and set out a clear, documentation-led plan before any work begins." },
    ],
  },

  "manpower-workforce-solutions": {
    tagline: "Plan, source and onboard the workforce your operations need.",
    overview: [
      "We help UAE businesses build and scale their workforce — clarifying staffing needs, coordinating candidate sourcing and keeping onboarding documentation ready so new team members can start without avoidable delays.",
      "Whether you are staffing a new project or adding capacity to an existing team, one accountable team keeps the process organised from first requirement to first day.",
    ],
    included: [
      { title: "Workforce planning", text: "Roles, numbers and timing mapped against what your operations actually need." },
      { title: "Sourcing coordination", text: "Candidate sourcing and shortlisting managed to your requirements." },
      { title: "Onboarding documentation", text: "Contracts and joining paperwork prepared and checked before day one." },
      { title: "Deployment follow-up", text: "Open items tracked so new starters are placed and settled." },
    ],
    outcomes: ["Staffing plans tied to real demand", "Shortlists that fit the role", "Paperwork ready before start dates", "One point of contact as teams scale"],
    faqs: [
      { q: "What does manpower and workforce support include?", a: "Workforce planning, candidate sourcing coordination, onboarding documentation and follow-up — one accountable team from the first staffing requirement to a new starter's first day." },
      { q: "How is this different from HR provision?", a: "Workforce solutions focus on building and scaling teams — planning, sourcing and onboarding. HR provision is ongoing capacity for day-to-day HR execution once people are in place." },
      { q: "How do we get started?", a: "Book a free consultation. We review the roles and capacity you need and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "hr-compliance-risk-management": {
    tagline: "Reviews, records and practical steps that keep HR compliant.",
    overview: [
      "We help UAE businesses keep HR practices compliant and reduce people-related risk — reviewing policies, contracts and employee records against UAE requirements and setting out practical steps to close the gaps.",
      "Clear, consistent HR records protect the business, support fair treatment of employees and make reviews easier to prepare for.",
    ],
    included: [
      { title: "Compliance review", text: "HR policies and practices assessed against UAE requirements." },
      { title: "Contract and record checks", text: "Employment contracts and employee files reviewed for completeness and consistency." },
      { title: "Risk identification", text: "People-related risks surfaced and prioritised by impact." },
      { title: "Remediation plan", text: "Practical, documented steps to close gaps and keep records current." },
    ],
    outcomes: ["A clear view of HR compliance gaps", "Complete, consistent employee records", "Fewer people-related risks", "Reviews you can prepare for calmly"],
    faqs: [
      { q: "What does an HR compliance review cover?", a: "HR policies, employment contracts and employee records, assessed against UAE requirements, with people-related risks identified and prioritised." },
      { q: "Do you only point out gaps, or help close them?", a: "Both. You get a practical, documented plan to close the gaps, and support keeping records current afterwards." },
      { q: "How do we get started?", a: "Book a free consultation. We review your current HR setup and give you a clear, documentation-led plan before any work begins." },
    ],
  },
};

/* How we work — the firm's documentation-led, consultation-first approach,
   the same clear path on every engagement. Shared by the index and detail pages. */
export const PROCESS_STEPS: { n: string; title: string; text: string }[] = [
  { n: "01", title: "Discovery", text: "We map your goals, constraints and timeline before any work begins." },
  { n: "02", title: "Documentation-led plan", text: "A clear, compliance-first scope and checklist you approve up front." },
  { n: "03", title: "Delivery", text: "One accountable team does the work, with a single point of contact." },
  { n: "04", title: "Follow-through", text: "Readiness reviews and clear follow-up keep approvals moving smoothly." },
];

/** Per-accent colour pair used to tint borders, glows and highlights. */
export const ACCENTS: Record<Accent, { main: string; soft: string }> = {
  gold: { main: "#dca958", soft: "#ecc982" },
  ice: { main: "#5cc8ff", soft: "#bfe6ff" },
  royal: { main: "#3a6bf0", soft: "#8fb2ff" },
  copper: { main: "#e0894a", soft: "#f3b277" },
};

/** Inline CSS custom properties so each card/page carries its own accent. */
export const accentStyle = (accent: Accent): CSSProperties =>
  ({ "--accent": ACCENTS[accent].main, "--accent-soft": ACCENTS[accent].soft } as CSSProperties);
