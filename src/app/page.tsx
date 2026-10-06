import { Hero } from "@/components/hero/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ConsultationSection } from "@/components/sections/ConsultationSection";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import styles from "./Home.module.css";

/**
 * DEMO ONLY — a stand-in home page so the header + hero can be judged over real
 * scrolled content. Copy is taken from the live site; nothing here is new
 * business content. Do not port this file into the production repo.
 */
export default function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />

      {/* Sections below the hero rise in with a smooth 3D reveal on scroll-down
          only (ScrollReveal is reveal-once — no reverse on scroll-up). Industries,
          Process and FAQs animate their own cards internally, so they are not
          wrapped here. Process is the one section that re-animates both ways. */}
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal>
        <ServicesSection />
      </ScrollReveal>

      <ScrollReveal>
        <WhyChooseSection />
      </ScrollReveal>

      <IndustriesSection />

      <ProcessSection />

      <FaqSection />

      <ScrollReveal>
        <ConsultationSection />
      </ScrollReveal>
    </div>
  );
}
