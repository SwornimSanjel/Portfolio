"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { MaskReveal } from "@/components/typography/MaskReveal";
import { Container } from "@/components/layout/Container";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";

/**
 * The hero is the thesis. The order in the headline is the argument — most
 * technical portfolios open at "build"; his sequence starts at the sales call,
 * which is why the work lands.
 *
 * No typing effect, no rotating job titles, no floating icons. The only thing
 * that moves is the headline arriving, and it arrives once.
 */
export function Hero() {
  const animate = useMotionAllowed();

  return (
    <section
      id="intro"
      data-section-label="Intro"
      // Sized by its own padding rather than a viewport minimum. `min-h` plus
      // bottom alignment leaves a growing void on tall screens, and pushes the
      // work below the fold on every screen. This way the first project is
      // always just visible at the bottom, which is the point of leading with
      // the work.
      className="relative pb-[clamp(3rem,7vh,5rem)] pt-[clamp(7.5rem,17vh,11rem)]"
    >
      <Container>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <motion.p
              className="meta"
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {profile.hero.eyebrow}
            </motion.p>

            <MaskReveal
              lines={profile.hero.statement}
              as="h1"
              delay={0.12}
              className="mt-6 max-w-[15ch] font-sans text-display font-bold text-ink sm:mt-8"
            />
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <motion.p
              className="max-w-measure text-lead text-graphite"
              initial={animate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: animate ? 0.5 : 0 }}
            >
              {profile.hero.support}
            </motion.p>
          </div>

          {/* One editable line that proves the site is tended. Worth more for
              credibility than any animation on the page. */}
          <motion.div
            className="md:col-span-12"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: animate ? 0.72 : 0 }}
          >
            <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-rule pt-5">
              <dt className="meta text-accent">{profile.currently.label}</dt>
              <dd className="text-body text-graphite">{profile.currently.value}</dd>
            </dl>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
