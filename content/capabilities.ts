/**
 * Capabilities, not skill bars. No percentages, no proficiency claims.
 *
 * Ordered by what he actually spends his time on. Design first because it is
 * the deepest skill; automation and ads are deliberately absent because other
 * people at Avernek own them.
 */
export type CapabilityGroup = {
  id: string;
  title: string;
  premise: string;
  items: string[];
};

export const capabilities: CapabilityGroup[] = [
  {
    id: "design",
    title: "Design",
    premise: "The deepest thing I do. Mostly UI, mostly in Figma, for a long time.",
    items: [
      "Interface design",
      "User flows and information architecture",
      "Prototyping",
      "Design systems and components",
      "Responsive layout",
      "Brand and social content design",
    ],
  },
  {
    id: "business",
    title: "Business & sales",
    premise: "Founder-led. I find the lead, sit in the meeting, and close it.",
    items: [
      "Lead generation and outreach",
      "Client meetings and discovery",
      "Requirements gathering",
      "Pricing and proposals",
      "Closing and follow-up",
      "Positioning and messaging",
    ],
  },
  {
    id: "leading",
    title: "Leading & delivery",
    premise: "The problems that don't have an owner yet are mine by default.",
    items: [
      "Leading a small team",
      "Delegation and accountability",
      "Internal process and systems",
      "Client communication",
      "Solving delivery problems",
      "Operations",
    ],
  },
  {
    id: "growth",
    title: "Growth & content",
    premise: "A year of customer success, and a lot of organic content since.",
    items: [
      "Organic growth",
      "Content strategy",
      "Short-form video in volume",
      "Customer success and retention",
      "Social design",
      "Monthly client reporting",
    ],
  },
];

/**
 * Tools, listed separately from capability and implying no mastery.
 *
 * Kept honest: Figma is the one he is genuinely strong in. The web languages
 * were learned in first year and built with. Claude Code is how he prototypes
 * now. Nothing here claims backend, infrastructure or automation work — other
 * people at Avernek do that.
 */
export const tools = [
  { name: "Figma", group: "Design", note: "Primary tool" },
  { name: "Adobe XD", group: "Design" },
  { name: "Photoshop", group: "Design", note: "Basics, from early on" },
  { name: "Claude Code", group: "Prototyping" },
  { name: "Claude", group: "Prototyping" },
  { name: "ChatGPT", group: "Prototyping" },
  { name: "HTML", group: "Learned & built with" },
  { name: "CSS", group: "Learned & built with" },
  { name: "JavaScript", group: "Learned & built with" },
] as const;

export const toolGroups = ["Design", "Prototyping", "Learned & built with"] as const;

/** The honest sentence that sits under the tools list. */
export const toolsNote =
  "I'm not a developer and don't present myself as one. I learned the web languages in my first year and built with them; these days I design, and prototype with AI when that's the faster way to see if an idea works.";
