/**
 * Detail-page content for each industry, keyed by the industry `id` in
 * `industries.ts`. Copy stays grounded in the firm's vetted service descriptions:
 * no invented pricing, timelines, certifications or client names. Each industry
 * links to the real services (by `services.ts` id) that support it.
 */
export interface IndustryContent {
  /** One-line hero subtitle. */
  tagline: string;
  /** Two short overview paragraphs. */
  overview: [string, string];
  /** Typical challenges in this sector and how MRZ supports them. */
  challenges: { title: string; text: string }[];
  /** Outcomes a client in this sector can expect. */
  outcomes: string[];
  /** Service ids (from services.ts) that serve this industry. */
  serviceIds: string[];
  /** Three grounded FAQs for the detail page accordion. */
  faqs: { q: string; a: string }[];
}

export const industryDetails: Record<string, IndustryContent> = {
  "trading-companies": {
    tagline: "Brokerage, supplier coordination and clean paperwork for trading businesses.",
    overview: [
      "Trading moves fast, and every introduction, contract and shipment needs its paperwork in order. MRZ supports trading companies across general trade and commercial brokerage, coordinating suppliers and buyers while keeping documentation ready at each stage.",
      "From operational setup to structured execution, one accountable team keeps your trading activity organised, compliant and easy to follow.",
    ],
    challenges: [
      { title: "Sourcing and introductions", text: "Finding the right buyers and suppliers, and managing the conversations around them." },
      { title: "Documentation under pressure", text: "Contracts, invoices and trade paperwork that must be right before they are needed." },
      { title: "Compliance guidance", text: "Practical guidance that keeps trading operations aligned with UAE requirements." },
    ],
    outcomes: ["Relevant introductions, not cold leads", "Paperwork ready before it is required", "Organised records at every milestone", "One point of contact across trade and paperwork"],
    serviceIds: ["commercial-brokers", "general-trading"],
    faqs: [
      { q: "Can you support both brokerage and general trading?", a: "Yes. Commercial brokerage and general trading are both delivered by the same accountable team, so introductions, supplier coordination and paperwork stay joined up." },
      { q: "How do you keep trade paperwork from slowing deals?", a: "Documentation is prepared and checked before it is needed, and every open item has a defined owner and next step, so deals keep moving." },
      { q: "How do we get started?", a: "Book a free consultation. We review what you trade, outline what's needed and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "construction-engineering": {
    tagline: "Engineering consultancy, compliance and documentation that keep projects moving.",
    overview: [
      "Construction and engineering projects depend on the right requirements, the right approvals and the right paperwork at the right time. MRZ provides engineering consultancy support and documentation-led coordination so each stage has a clear path forward.",
      "We work with one accountable team across technical consultancy and management support, so project delays are caught early and follow-up never falls between providers.",
    ],
    challenges: [
      { title: "Technical requirements", text: "Clarifying project requirements up front so everyone works from the same brief." },
      { title: "Documentation readiness", text: "Project paperwork prepared and kept in order so each stage can move forward." },
      { title: "Coordinated progress", text: "Stages and stakeholders kept in step against a clear plan." },
    ],
    outcomes: ["Requirements everyone agrees on", "Audit-ready documentation", "Fewer dropped handovers", "Milestones kept on track"],
    serviceIds: ["petroleum-gas-engineering", "management-services", "manpower-workforce-solutions"],
    faqs: [
      { q: "Do you provide engineering consultancy for construction projects?", a: "We provide engineering consultancy support — aligning requirements, preparing project documentation and coordinating the structured steps a project needs to progress." },
      { q: "How do you keep a project's stages coordinated?", a: "Everyone knows the plan, the owner and the next step. Open items are followed up to resolution and decisions are recorded, so handovers don't get dropped and milestones stay on track." },
      { q: "How do we begin?", a: "Book a free consultation. We clarify the scope and set out a clear, documentation-led plan before any work begins." },
    ],
  },

  "oil-gas-industrial": {
    tagline: "Petroleum, gas tank, piping and industrial consultancy, documented from start to finish.",
    overview: [
      "Oil, gas and industrial operations demand precise requirements and audit-ready records. MRZ provides consultancy for petroleum and gas projects, including gas tanks and piping, with documentation prepared and kept in order at every step.",
      "Our team coordinates the technical, administrative and compliance sides together, so your projects stay orderly and your records hold up to scrutiny.",
    ],
    challenges: [
      { title: "Precise requirements", text: "Technical and project requirements clarified before the work starts." },
      { title: "Audit-ready records", text: "Project paperwork kept in order so it stands up to review." },
      { title: "Multi-stakeholder projects", text: "Stages and parties coordinated to one clear plan." },
    ],
    outcomes: ["Requirements agreed before work starts", "Audit-ready documentation", "Coordinated, orderly progress", "Milestones kept on track"],
    serviceIds: ["petroleum-gas-engineering", "management-services"],
    faqs: [
      { q: "What industrial projects do you support?", a: "Petroleum and gas engineering consultancy, including gas tank and piping projects, with requirements aligned and project documentation prepared and coordinated." },
      { q: "How do you keep projects audit-ready?", a: "Requirements are clarified up front and paperwork is maintained as the project moves, so records stay complete and organised." },
      { q: "How do we start?", a: "Book a free consultation. We review your project requirements and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "it-technology": {
    tagline: "Security-first architecture and planning for reliable, scalable business systems.",
    overview: [
      "Technology underpins every modern business. MRZ helps organisations plan reliable, scalable systems and design security into cloud, applications and infrastructure from the ground up.",
      "Our IT consultants translate business goals into practical technical decisions, with implementation support through to delivery, so your systems grow with the business rather than holding it back.",
    ],
    challenges: [
      { title: "Security exposure", text: "Reviewing where risk sits and designing defensible layers across systems." },
      { title: "Reliability and scale", text: "Keeping critical systems available while leaving room to grow." },
      { title: "Planning to delivery", text: "Turning a technology roadmap into hands-on, delivered change." },
    ],
    outcomes: ["A clearer view of real risk", "Technology aligned to business goals", "Architecture that scales safely", "Support through delivery, not just advice"],
    serviceIds: ["cyber-security-architecture", "information-technology-consultants"],
    faqs: [
      { q: "What is the difference between your IT consultancy and cyber security work?", a: "IT consultancy focuses on planning, reliability, scalability and implementation support. Cyber security architecture focuses on reviewing risk and designing security into cloud, applications and infrastructure. Both can be delivered by one team." },
      { q: "Do you work with systems we already run?", a: "Yes. We start by understanding your current posture and systems, then plan improvements that fit what you already have and scale as you grow." },
      { q: "How do we get started?", a: "Book a free consultation. We review your systems and goals, then outline a clear, documentation-led plan before any work begins." },
    ],
  },

  "corporate-smes": {
    tagline: "Practical back-office support for SMEs and growing organisations across the UAE.",
    overview: [
      "Growing businesses need dependable back-office support without the overhead of building every function in-house. MRZ supports SMEs and established organisations with management services and people operations, all coordinated by one team.",
      "We keep operations coordinated and HR compliant, so leadership can focus on growth while the essentials run predictably.",
    ],
    challenges: [
      { title: "Operational coordination", text: "Plans, owners and follow-ups that keep teams pulling in the same direction." },
      { title: "People compliance", text: "HR practices and records that are consistent, fair and compliant." },
      { title: "Day-to-day HR capacity", text: "Hands-on provision with task follow-ups, so routine HR work keeps moving." },
    ],
    outcomes: ["Teams pulling in the same direction", "Compliant, consistent HR practices", "Extra HR capacity when you need it", "One point of contact for the back office"],
    serviceIds: ["management-services", "human-resources-consultancy", "other-human-resources-provision"],
    faqs: [
      { q: "Do you support smaller businesses as well as larger organisations?", a: "Yes. We work with SMEs and growing organisations across the UAE, scaling our support to match what the business needs." },
      { q: "Can operations and HR be handled by one provider?", a: "Yes. Management services, HR consultancy and HR provision are coordinated by one accountable team with a single point of contact." },
      { q: "How do we get started?", a: "Book a free consultation. We review your current back-office setup and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "government-public-sector": {
    tagline: "Structured coordination, careful records and compliant people support for public-sector work.",
    overview: [
      "Public-sector work runs on clear requirements, careful records and accountable follow-up. MRZ supports public-sector bodies and the organisations that deliver for them with documentation-led coordination, management support and compliance-focused HR.",
      "One accountable team keeps each stage organised and traceable, so approvals, handovers and reporting always have the paperwork behind them.",
    ],
    challenges: [
      { title: "Documentation and traceability", text: "Records prepared, organised and kept current so every stage can be reviewed." },
      { title: "Structured coordination", text: "Plans, owners and follow-ups that keep multi-party work moving in step." },
      { title: "Workforce compliance", text: "HR practices, contracts and records aligned with UAE requirements." },
    ],
    outcomes: ["Records that stand up to review", "Clear owners and next steps", "Compliant, consistent HR practices", "One point of contact across the engagement"],
    serviceIds: ["management-services", "hr-compliance-risk-management", "manpower-workforce-solutions"],
    faqs: [
      { q: "How does MRZ support public-sector work?", a: "Through documentation-led coordination, management support and compliance-focused HR — keeping requirements clear, records organised and follow-up accountable at each stage." },
      { q: "Do you also support contractors and suppliers to the public sector?", a: "Yes. Organisations delivering public-sector work face the same documentation and compliance demands, and we support them with the same structured, documentation-led approach." },
      { q: "How do we get started?", a: "Book a free consultation. We review your requirements and give you a clear, documentation-led plan before any work begins." },
    ],
  },

  "logistics-transportation": {
    tagline: "Coordination, documentation and workforce support that keep goods moving.",
    overview: [
      "Logistics depends on every handover going right — suppliers, shipments, paperwork and people all have to line up. MRZ supports logistics and transportation businesses with trade coordination, documentation readiness and operational follow-up.",
      "With management support and workforce solutions from the same team, operations stay organised as volumes grow and schedules tighten.",
    ],
    challenges: [
      { title: "Shipment documentation", text: "Trade paperwork prepared, checked and kept current for each movement." },
      { title: "Operational handovers", text: "Clear stages, owners and follow-up so nothing stalls between parties." },
      { title: "Workforce capacity", text: "Planning and onboarding support for the teams that keep operations running." },
    ],
    outcomes: ["Paperwork ready before it is required", "Fewer delays at each handover", "Teams sized to the workload", "A predictable, repeatable process"],
    serviceIds: ["general-trading", "management-services", "manpower-workforce-solutions"],
    faqs: [
      { q: "What does MRZ do for logistics and transportation businesses?", a: "We support the work around your operations — supplier coordination, trade documentation, operational follow-up and workforce planning — so shipments and teams stay organised." },
      { q: "Can you help when we need more people on the ground?", a: "Yes. Our manpower and workforce solutions cover staffing needs planning, sourcing coordination and onboarding documentation, alongside the operational support." },
      { q: "How do we get started?", a: "Book a free consultation. We review how your operations run today and give you a clear, documentation-led plan before any work begins." },
    ],
  },
};
