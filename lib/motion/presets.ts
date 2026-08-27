import type { Transition, Variants } from "framer-motion";

/**
 * The site's entire motion vocabulary — five primitives, one easing.
 *
 * Every animation on the site is one of these. If something needs a sixth,
 * that's a signal the design is asking motion to rescue it.
 *
 * Rule: information never lives in the animation. Every reveal below has a
 * reduced-motion form that shows the final state immediately, and nothing is
 * lost when it does.
 */

/** One easing for the whole site. Matches `ease-rule` in Tailwind. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const durations = {
  quick: 0.32,
  base: 0.52,
  reveal: 0.64,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 190,
  damping: 26,
  mass: 0.9,
};

/**
 * 1 — Rule draw. A section is beginning.
 * Replaces fade-up as the default reveal, so the site never has the
 * repeating "everything drifts upward" signature of a generated page.
 */
export const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: durations.base, ease: EASE },
  },
};

/**
 * 2 — Mask reveal. Headline arrival.
 * Lines wipe out from under a fixed edge; the text itself never translates,
 * so nothing drifts and the baseline stays put.
 */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: durations.reveal, ease: EASE },
  },
};

export const maskGroup = (stagger = 0.04, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/**
 * 3 — Plate open. Handled by `layoutId` + AnimatePresence at the call site;
 * this is the transition it uses.
 */
export const plateOpen: Transition = spring;

/** 4 — Metadata settle. Detail arrives after its subject, never before. */
export const settleItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.quick, ease: EASE },
  },
};

export const settleGroup = (stagger = 0.03, delay = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** 5 — Diagram build lives in GSAP (scroll-scrubbed timeline). See SystemDiagram. */

/** Applied to every whileInView so reveals fire once, slightly before the edge. */
export const viewport = { once: true, margin: "-12% 0px -8% 0px" } as const;

/** The reduced-motion form of any of the above: final state, no transition. */
export const still: Variants = {
  hidden: { opacity: 1, y: 0, scaleX: 1 },
  visible: { opacity: 1, y: 0, scaleX: 1, transition: { duration: 0 } },
};
