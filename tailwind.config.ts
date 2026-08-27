import type { Config } from "tailwindcss";

/**
 * "Operator's Manual" — the portfolio's single visual system.
 *
 * Source of truth for every value lives in app/globals.css `:root`. This file
 * only maps utility names onto those variables, so a token can be re-tuned in
 * one place and the whole site follows.
 *
 * Deliberately NOT Avernek's palette: the company site is dark charcoal with a
 * champagne-bronze accent. This is paper, ink, and Lalitpur brick.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
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
        // One fluid scale, a major-third ratio at the top end. Every size on
        // the site comes from here — there are no arbitrary font sizes.
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
        meta: ["clamp(0.72rem, 0.7rem + 0.1vw, 0.8rem)", { lineHeight: "1.45", letterSpacing: "0.1em" }],
        body: ["clamp(1rem, 0.96rem + 0.22vw, 1.12rem)", { lineHeight: "1.68" }],
        lead: ["clamp(1.12rem, 1.02rem + 0.5vw, 1.42rem)", { lineHeight: "1.52" }],
        h3: ["clamp(1.14rem, 1.02rem + 0.55vw, 1.45rem)", { lineHeight: "1.26", letterSpacing: "-0.012em" }],
        // Serif headings need looser tracking and more leading than a grotesque.
        h2: ["clamp(1.6rem, 1.2rem + 1.9vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.027em" }],
        h1: ["clamp(2rem, 1.45rem + 2.9vw, 3.75rem)", { lineHeight: "1.04", letterSpacing: "-0.032em" }],
        display: ["clamp(2.35rem, 1.3rem + 5vw, 6.5rem)", { lineHeight: "0.94", letterSpacing: "-0.042em" }],
      },
      spacing: {
        // Sections breathe. The vertical rhythm is the main thing separating
        // a premium editorial page from a dense one.
        section: "clamp(4.5rem, 3rem + 6vw, 8.5rem)",
        "section-sm": "clamp(3.5rem, 2.5rem + 4vw, 6rem)",
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
