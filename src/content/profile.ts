import { unverified, type Fact } from "./verify";

/**
 * Everything factual lives here and is imported, never retyped.
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

  location: "Lalitpur, Nepal",
  locationShort: "Lalitpur, Nepal",

  claim:
    "I design the products, handle the sales, and lead the team that delivers them.",

  // `effort` used to sit here: "Eighteen months, most days", the games going
  // first, and "if you are wondering whether the work on this site is real".
  // Cut. It asked the reader to weigh how hard the work was instead of the
  // work, which is on the page and stands by itself, and raising the doubt
  // was the thing that planted it. The overlapping dates on the timeline make
  // the same point without arguing for it.
  hero: {
    eyebrow: "Founder & Managing Director at Avernek Technologies",
    statement: ["Started with design.", "Ended up running", "a company."],
    support:
      "I run Avernek Technologies Pvt. Ltd., a three-person company in Lalitpur. The business side is mine: finding the clients, working out what they actually need, pricing it and closing it. I build the client websites myself, and my team owns the AI automation and the performance marketing.",
  },

  currently: {
    label: "Currently",
    value: "Avernek Technologies Pvt. Ltd., Lalitpur",
  },




  /** The long version, for the About page. Same register: plain, sequential. */
  story: [
    {
      heading: "Graphic design, briefly",
      body: [
        "After SEE I spent a few months on Photoshop and Illustrator. Grade 11 started, there wasn't time for both, and I stopped. I don't claim either tool now.",
        "What stuck was the habit of picking apart something finished to see the decisions inside it.",
      ],
    },
    {
      heading: "Then interfaces, and those stayed",
      body: [
        "In my first year at Herald I learned HTML, CSS and JavaScript and built things with them. At the same time I started teaching myself UI properly, in Figma, and did that nearly every day for about two years.",
        "I built a lot of screens. Product pages, mobile apps, dashboards, component sets, wireframes. Most of it was never briefed by anyone. I picked a problem, designed it, and posted the result. That's still where most of it lives.",
        "The internship at Herald was the first time it was somebody else's requirement with somebody else's deadline. I was the only designer on it.",
      ],
    },
    {
      heading: "A year of customers",
      body: [
        "At Scalestro I was client success and organic growth manager for a year, full-time, while studying. Client calls, project management, retention, and the content side of growth.",
        "It was the hardest I had worked to that point and it changed how I design. On a call with an owner you stop asking what a product should have and start asking what should stop happening. That's still the first question I ask in a requirements meeting.",
      ],
    },
    {
      heading: "Design work alongside all of it",
      body: [
        "Fourteen months of brand and social content for SOPdrafts Nepal. Content strategy and short-form video for Mountain Routes, a trekking company whose customers are almost all overseas, making reels in volume, week after week.",
        "Most of it overlapped, which is why the dates run into each other.",
      ],
    },
    {
      heading: "Avernek",
      body: [
        "I registered Avernek Technologies in 2026 and run it as Founder and Managing Director. I find the clients and sit in the meetings. I work out what a business is actually asking for, which is rarely what they said first. I price it, close it, and design what we deliver.",
        "Inside the company I lead the team, set how we work, and take the problems that don't have an owner yet. We are three people. Most of what I know about running a company I have learned in the last year and a half, in public, on live clients.",
      ],
    },
  ],

  // `origin` and `method` lived here and were rendered on the home page.
  // Both are gone: `story` below covers the same ground on About, at more
  // length and better written, and having both meant a reader who went Home
  // then About read the same account twice in different words.
  contact: {
    headline: "Open to conversations.",
    body: "If you run a business that gets its customers through messages, that's the conversation I'm most useful in. Email is best.",
    // A personal portfolio takes a personal address. The company inbox was
    // a placeholder and it made the site read as Avernek's, which it is not:
    // this is one person's record, and the company is somewhere he works.
    email: "sanjelswornim1@gmail.com" as Fact,
  },

  footer: {
    // Was "Designing, selling and shipping" — which read as though the
    // design itself was the thing being sold. It never was. The design years
    // were self-directed practice posted publicly; the selling is Avernek's
    // services, and the two should not be run together in one line.
    tagline: "Building and running Avernek Technologies from Lalitpur, Nepal.",
    disclosure: "Designed by Swornim. Built with an AI-assisted workflow.",
  },
} as const;
