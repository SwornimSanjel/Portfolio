/**
 * Founder notes — "Things I'm learning while building".
 *
 * ⚠ REVIEW BEFORE LAUNCH. These are drafted from decisions and mistakes that
 * are documented elsewhere in this repo's source material (the pricing anchor
 * and the surveillance rule are both recorded in project docs). They are
 * accurate, but they are not yet written in Swornim's own voice, and a
 * founder's notes should be. Rewrite or replace before the site goes public —
 * his existing LinkedIn posts on sales, rejection and follow-ups are the
 * obvious source. `status: "draft"` keeps them out of production until then.
 */
export type Note = {
  slug: string;
  title: string;
  date: string;
  display: string;
  /** First line, used on the index. */
  standfirst: string;
  body: string[];
  status: "draft" | "published";
};

export const notes: Note[] = [
  {
    slug: "the-price-you-set-first",
    title: "The price you set first is the price you argue with later",
    date: "2026-07-14",
    display: "14 July 2026",
    standfirst:
      "I discounted early work to get signatures. Then I spent months trying to climb back out of the number I'd set.",
    body: [
      "The first few deals felt like a win. Get the logo, get the case study, worry about margin later. What actually happened is that I set an anchor, not just with those clients, but in my own head about what the work was worth.",
      "Raising a price with an existing client is a conversation about you. Setting it correctly at the start is a conversation about the work. Those are very different meetings and only one of them is comfortable.",
      "What I'd tell myself: a discount is fine if it's visible and temporary. Write the real price down, then show the reduction. A quiet low price isn't a discount, it's just your price.",
    ],
    status: "draft",
  },
  {
    slug: "deciding-what-it-wont-do",
    title: "The most useful hour I spent on a product was deciding what it would refuse to do",
    date: "2026-06-28",
    display: "28 June 2026",
    standfirst:
      "Our internal system could easily track hours, activity and who was online. We wrote a rule saying it never will.",
    body: [
      "When you're building an accountability tool for your own team, surveillance is the obvious next feature. It's easy to build, it feels like rigour, and everybody's software does it.",
      "We wrote the opposite into the project's own rules: no hours logged, no activity heatmaps, no last-seen, no screenshots. The board shows the deadline and the state, and never when someone was working. The note says that if a future version of me asks for it, refuse and point back at the reason.",
      "The thinking is simple. Measuring presence tells you who is at their desk. Measuring commitments tells you who does what they said. Only one of those is the thing I actually care about, and building the first would have quietly replaced the second.",
    ],
    status: "draft",
  },
  {
    slug: "what-they-asked-for",
    title: "Clients describe the feature. They rarely describe the problem",
    date: "2026-06-02",
    display: "2 June 2026",
    standfirst:
      "Everyone asked for automatic replies. Nobody wanted automatic replies.",
    body: [
      "Every business that came to us asked for the same thing in the same words: reply to messages automatically. If you build exactly that, you produce a wall that says 'thanks for your message' and the customer leaves faster than before.",
      "What they wanted was to stop losing people they'd already paid to reach. Automatic replies are one possible shape of that. Knowing which enquiries are urgent is another. Knowing which ones a machine must never answer turned out to matter more than either.",
      "The interview is the work. If I take the brief literally I build the thing they described; if I take it seriously I build the thing they meant.",
    ],
    status: "draft",
  },
  {
    slug: "shipping-before-ready",
    title: "I spent too long making the website good before there was anyone to send it to",
    date: "2026-05-19",
    display: "19 May 2026",
    standfirst: "Building is comfortable. Selling isn't. Guess which one I did first.",
    body: [
      "The company website went through several rounds before a single prospect had seen it. It's a good website. It was also, for about a month, the most sophisticated way of avoiding sales calls I've ever built.",
      "There's a version of founder work that looks productive and isn't. Polishing something nobody has asked to see is at the top of that list, and it's especially seductive when you're the person who can build it.",
      "Now the test is simple: is there someone specific who will see this within a week? If not, it's not the thing to be doing today.",
    ],
    status: "draft",
  },
];

export const publishedNotes = notes.filter((n) => n.status === "published");
/** In development the drafts render, so the section can be designed against real content. */
export const visibleNotes = process.env.NODE_ENV === "production" ? publishedNotes : notes;
export const getNote = (slug: string) => notes.find((n) => n.slug === slug);
