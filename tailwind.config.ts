import type { Config } from "tailwindcss";

/**
 * "Operator's Manual" — the portfolio's single visual system.
 *
 * Source of truth for every value lives in src/styles/globals.css `:root`. This file
 * only maps utility names onto those variables, so a token can be re-tuned in
 * one place and the whole site follows.
 *
 * Deliberately NOT Avernek's palette: the company site is dark charcoal with a
 * champagne-bronze accent. This is paper, ink, and Lalitpur brick.
 */
const config: Config = {
  // One narrow glob. Tailwind rescans every matching file on each build, so
  // pointing it at the whole project (and therefore at node_modules) is the
  // usual reason a Tailwind build crawls.
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
          deep: "rgb(var(--paper-deep-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)",
        },
        graphite: "rgb(var(--graphite-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        jade: "rgb(var(--jade-rgb) / <alpha-value>)",
        rule: "rgb(var(--rule-rgb) / var(--rule-alpha))",
      },
      fontFamily: {
        // One family. Weight and tracking carry the hierarchy.
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // One fluid scale. Every size on the site comes from here — there are
        // no arbitrary font sizes.
        //
        // The top of this scale used to run 60 / 44 / 23px, which left a 20px
        // hole in the middle and no size at all between "section heading" and
        // "bold body". Anything that needed to sit between them was set at 44,
        // so a page ended up with four or five headings all at title size and
        // no hierarchy — which is what a type specimen looks like, and what
        // this site had started to look like. The ladder is now continuous:
        // 104 / 50 / 34 / 26 / 21 / 18.
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
        meta: ["clamp(0.72rem, 0.7rem + 0.1vw, 0.8rem)", { lineHeight: "1.45", letterSpacing: "0.1em" }],
        body: ["clamp(1rem, 0.96rem + 0.22vw, 1.12rem)", { lineHeight: "1.68" }],
        lead: ["clamp(1.08rem, 1rem + 0.4vw, 1.3rem)", { lineHeight: "1.56" }],
        h3: ["clamp(1.14rem, 1rem + 0.7vw, 1.6rem)", { lineHeight: "1.28", letterSpacing: "-0.014em" }],
        h2: ["clamp(1.5rem, 1.15rem + 1.3vw, 2.1rem)", { lineHeight: "1.14", letterSpacing: "-0.022em" }],
        h1: ["clamp(1.9rem, 1.4rem + 2.2vw, 3.1rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        display: ["clamp(2.35rem, 1.3rem + 5vw, 6.5rem)", { lineHeight: "0.94", letterSpacing: "-0.042em" }],
      },
      spacing: {
        // Sections breathe. The vertical rhythm is the main thing separating
        // a premium editorial page from a dense one.
        // 136px of padding top and bottom put 272px of nothing between two
        // sections on a wide screen. Breathing room, not a vacuum.
        section: "clamp(4rem, 2.9rem + 4.4vw, 6.75rem)",
        "section-sm": "clamp(3rem, 2.3rem + 3vw, 4.75rem)",
        gutter: "clamp(1.5rem, 0.5rem + 3.2vw, 5rem)",
      },
      maxWidth: {
        container: "1280px",
        measure: "68ch",
        narrow: "54ch",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          // Half, because the row is rendered twice — one full pass of the
          // duplicate lands exactly where the original started.
          to: { transform: "translateX(calc(-50% - 1.25rem))" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
      },
      transitionTimingFunction: {
        // One easing for the whole site. Motion presets reuse it verbatim.
        rule: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
