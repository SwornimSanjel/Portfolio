import { unverified, type Fact } from "./verify";

/**
 * Everything factual about Swornim lives here and is imported, never retyped.
 *
 * Register note: plain and direct. Earlier drafts of this copy were written in
 * a literary voice — rhetorical turns, clever closing lines — and it read as
 * written-by-a-machine rather than by someone describing their own work. Short
 * sentences. Concrete nouns. Say the problem, say what was done about it.
 */
export const profile = {
  name: "Swornim Sanjel",
  shortName: "Swornim",
  initials: "SS",

  /** Stated once, professionally. No breakdown, no disclaimers. */
  role: "Founder & Managing Director, Avernek Technologies",
  roleShort: "Founder & Managing Director",

  location: "Kathmandu, Nepal",
  locationShort: "Kathmandu, Nepal",

  claim:
    "I design the products, handle the sales, and lead the team that delivers them.",

  hero: {
    eyebrow: "Swornim Sanjel — Kathmandu, Nepal",
    statement: ["Started with design.", "Ended up running", "a company."],
    support:
      "Founder & Managing Director at Avernek Technologies. I design what we build, handle the sales, and lead the team that delivers it. Studying Computer Science at Herald College Kathmandu.",
  },

  currently: {
    label: "Currently",
    value: "Avernek Technologies, Kathmandu",
  },

  /**
   * The opening narrative. He asked for this: how it started, arriving at the
   * company. Three short paragraphs, no scene-setting.
   */
  origin: {
    label: "How it started",
    heading: "Design first, for about three years.",
    body: [
      "I started with graphic design after SEE, then moved to interfaces in my first year at Herald. I learned Figma properly and used it every day — building screens nobody asked for, redrawing apps I used, posting the results. Most of that work still only exists on LinkedIn and TikTok.",
      "Alongside it I spent a year at Scalestro as a client success and organic growth manager. Full-time, while studying. That year taught me the thing design school does not: what a customer complains about, and why they leave.",
      "By early 2026 I had the two halves of a business — I could design the thing, and I could talk to the person paying for it. So I registered Avernek Technologies and started selling.",
    ],
  },

  /** The hard-work section. Stated flatly; dramatising it would weaken it. */
  effort: {
    label: "The work behind it",
    heading: "Eighteen months, most days.",
    body: [
      "University, a full-time job, freelance design work, and then a company — mostly overlapping rather than one after another. Five roles since 2025, and none of them replaced the one before it cleanly.",
      "The games went first, then most of the evenings. I am not presenting that as a virtue. But if you are wondering whether the work on this site is real, that is where it came from.",
    ],
  },

  /** How he works. One short block, no defensiveness. */
  method: {
    label: "How I work",
    heading: "Design, then build it the fastest honest way.",
    body: [
      "I learned HTML, CSS and JavaScript in my first year and built with them. I stopped writing code seriously after that — I cared more about what was being built than about writing it.",
      "So I design, and I prototype with AI when that is the quicker way to find out whether an idea works. It does not decide what to make or who it is for. It shortens the distance between a decision and something you can actually click.",
    ],
  },

  /** The long version, for the About page. Same register: plain, sequential. */
  story: [
    {
      heading: "Graphic design, briefly",
      body: [
        "After SEE I spent a few months on Photoshop and Illustrator. Grade 11 started, there was not time for both, and I stopped. I do not claim either tool now.",
        "What it left was the habit of looking at something finished and seeing the decisions inside it.",
      ],
    },
    {
      heading: "Then interfaces, and those stayed",
      body: [
        "In my first year at Herald I learned HTML, CSS and JavaScript and built things with them. At the same time I started teaching myself UI properly, in Figma, and did that nearly every day for about two years.",
        "I built a lot of screens. Product pages, mobile apps, dashboards, component sets, wireframes. Most of it was never briefed by anyone — I picked a problem, designed it, and posted the result. That is still where most of it lives.",
        "The internship at Herald was the first time it was somebody else's requirement with somebody else's deadline. I was the only designer on it.",
      ],
    },
    {
      heading: "A year of customers",
      body: [
        "At Scalestro I was client success and organic growth manager for a year, full-time, while studying. Client calls, project management, retention, and the content side of growth.",
        "It was the hardest I had worked to that point and it changed how I design. On a call with an owner you stop asking what a product should have and start asking what it should stop happening. That is still the first question I ask in a requirements meeting.",
      ],
    },
    {
      heading: "Design work alongside all of it",
      body: [
        "Fourteen months of brand and social content for SOPdrafts Nepal. Content strategy and short-form video for Mountain Routes, a trekking company whose customers are almost all overseas — reels in volume, week after week.",
        "None of this happened one thing at a time.",
      ],
    },
    {
      heading: "Avernek",
      body: [
        "I registered Avernek Technologies in 2026 and run it as Founder and Managing Director. I find the clients and sit in the meetings. I work out what a business is actually asking for, which is rarely what they said first. I price it, close it, and design what we deliver.",
        "Inside the company I lead the team, set how we work, and take the problems that do not have an owner yet. We are three people. Most of what I know about running a company I have learned in the last year and a half, in public, on live clients.",
      ],
    },
  ],

  contact: {
    headline: "Available for work and conversations.",
    body: "Design, product, or a business problem you think I can help with. Email is best.",
    email: unverified(
      "contact@avernek.com",
      "Which email should the personal site use — a personal address, or the Avernek one?",
    ) as Fact,
  },

  footer: {
    tagline: "Designing, selling and shipping from Kathmandu.",
    disclosure: "Designed by Swornim. Built with an AI-assisted workflow.",
  },
} as const;
