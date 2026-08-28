import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { MaskReveal } from "@/components/typography/MaskReveal";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Credentials } from "@/components/home/Credentials";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";

/**
 * The hero is the thesis, and it now closes.
 *
 * It used to be a headline, a paragraph and a "currently" line — a statement
 * with no action attached. A portfolio is a sales document: someone reads the
 * top of it and either looks at the work or gets in touch. There are two
 * actions here and they are not equal — one solid, one outlined — because a
 * reader offered several equal choices makes none of them.
 *
 * The proof strip underneath is the founder's version of a skills bar: four
 * counts, every one of them derived from the content files rather than typed,
 * so nothing here can be inflated and nothing can drift out of date.
 *
 * The hero is dark, and that is the fix for two separate complaints that
 * turned out to be the same complaint.
 *
 * Frosted glass is not a colour, it is a *relationship* to what is behind it.
 * A near-white panel on a near-white page has nothing to refract, so no amount
 * of tuning blur, opacity or saturation was ever going to make the navigation
 * read as glass — the page had to give it something to sit on. Over an inked
 * ground the same capsule finally behaves like the material it is imitating.
 *
 * And a wall of large type on flat cream with no image and no depth is,
 * literally, the layout a type foundry uses to show you a typeface. One dark
 * full-bleed field with light on it is the cheapest possible way to stop a
 * page reading as a specimen, because a specimen never has one.
 *
 * `.inverted` is the existing mechanism for this — it re-maps the same tokens
 * rather than introducing a second palette, so nothing here is a new colour.
 */
export function Hero() {
  const animate = useMotionAllowed();

  const rise = (delay: number) => ({
    initial: animate ? { opacity: 0, y: 12 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: animate ? delay : 0 },
  });

  return (
    <section
      id="intro"
      data-section-label="Intro"
      // Sized by its own padding rather than a viewport minimum, so the first
      // project is always just visible at the bottom of the fold.
      className="inverted relative isolate overflow-hidden bg-paper pb-[clamp(3.5rem,8vh,6rem)] pt-[clamp(8rem,18vh,12rem)] text-graphite"
    >
      {/* Decorative only, and pointer-transparent so it can never intercept a
          click meant for the page. On a dark ground these can carry real
          saturation without shouting — the same fields at this strength over
          cream were invisible. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[12%] -top-[35%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.32),transparent)] blur-3xl" />
        <div className="absolute -right-[18%] top-[2%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--jade-rgb)/0.28),transparent)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,rgb(var(--paper-rgb)))]" />
      </div>

      <Container>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-12">
            {/* No status dot. A pulsing indicator next to a job title is
                signalling nothing — nothing here is live, and a decoration
                that mimics a system state is the first thing that gives a
                page away as decorated rather than designed. The line says
                what it needs to on its own. */}
            <motion.p {...rise(0)} className="meta">
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
            <motion.p {...rise(0.5)} className="max-w-measure text-lead text-graphite">
              {profile.hero.support}
            </motion.p>

            <motion.div {...rise(0.62)} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/work">See the work</Button>
              <Button href="/#contact" variant="ghost" glyph="↓">
                Get in touch
              </Button>
            </motion.div>
          </div>

          <motion.div {...rise(0.76)} className="md:col-span-12">
            <Credentials />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
