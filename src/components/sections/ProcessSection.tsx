"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { MenuIcon } from "@/components/header/menuIcons";
import { TiltCard } from "./TiltCard";
import styles from "./ProcessSection.module.css";

/** How MRZ engages — a generic, accurate delivery flow (no invented claims). */
const STEPS = [
  {
    no: "01",
    icon: "people",
    title: "Discovery",
    text: "We map your goals, constraints and timeline across every service you actually need.",
  },
  {
    no: "02",
    icon: "layers",
    title: "Blueprint",
    text: "A clear scope, roadmap and single point of contact agreed before any work starts.",
  },
  {
    no: "03",
    icon: "exchange",
    title: "Delivery",
    text: "One coordinated team runs trade, technology, people and paperwork in step.",
  },
  {
    no: "04",
    icon: "shield",
    title: "Ongoing support",
    text: "We stay on as your business grows, adjusting as your priorities change.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const nodeVariants: Variants = {
  hidden: { scale: 0.2, opacity: 0 },
  shown: { scale: 1, opacity: 1, transition: { duration: 0.45, ease: EASE } },
};

interface StepItemProps {
  step: (typeof STEPS)[number];
  index: number;
  reduce: boolean;
}

/**
 * One timeline step. On a vertical layout each step scrolls into view on its own,
 * so a per-step `whileInView` (with `once: false`) is what makes them appear one
 * after another on the way down and disappear again on the way up. The card
 * slides in from its side of the centre rail with a touch of 3D rotation; the
 * node on the rail pops in alongside it.
 */
function StepItem({ step, index, reduce }: StepItemProps) {
  const right = index % 2 === 1;
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 26, x: right ? 54 : -54, rotateY: right ? -12 : 12, transformPerspective: 1100 },
    shown: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateY: 0,
      transformPerspective: 1100,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <li className={`${styles.step} ${right ? styles.right : styles.left}`}>
      <motion.div
        className={styles.cardWrap}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: false, amount: 0.4 }}
        variants={reduce ? undefined : cardVariants}
      >
        {/* Inner TiltCard adds the 3D hover tilt. lift={0}: tilt only, no rise — a
            vertical lift would pull the card's connector off its node on the rail. */}
        <TiltCard className={styles.card} max={9} lift={0}>
          <span className={styles.no} aria-hidden="true">
            {step.no}
          </span>
          <span className={styles.icon} aria-hidden="true">
            <MenuIcon name={step.icon} width={24} height={24} />
          </span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepText}>{step.text}</p>
        </TiltCard>
      </motion.div>

      <div className={styles.center} aria-hidden="true">
        <motion.span
          className={styles.node}
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: false, amount: 0.4 }}
          variants={reduce ? undefined : nodeVariants}
        />
      </div>
    </li>
  );
}

/**
 * Our process — a vertical timeline on a centre rail. The rail draws downward as
 * you scroll and each step appears in turn from its side; scrolling back up winds
 * it all out in reverse. Cards alternate left/right on desktop and stack to the
 * right of a left-hand rail on mobile. Reduced motion shows everything at once.
 */
export function ProcessSection() {
  const reduce = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.45"],
  });
  const railScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className={styles.process} aria-labelledby="process-title">
      <span className={styles.blobRoyal} aria-hidden="true" />
      <span className={styles.blobGold} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            How we work
          </p>
          <h2 id="process-title" className={styles.title}>
            A simple process, <span className={styles.titleAccent}>one accountable team</span>
          </h2>
          <p className={styles.lead}>
            Four steps from first conversation to long-term support — so you always know what happens
            next and who owns it.
          </p>
        </header>

        <div className={styles.timeline} ref={timelineRef}>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railBase} />
            <motion.span
              className={styles.railFill}
              style={reduce ? { scaleY: 1 } : { scaleY: railScaleY }}
            />
          </div>

          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <StepItem key={step.no} step={step} index={i} reduce={reduce} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
