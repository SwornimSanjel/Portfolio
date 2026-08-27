import { unverified, type Fact } from "./verify";

/**
 * Case-study content model.
 *
 * Chapters are a discriminated union so a page can render any project without
 * knowing which shapes it contains, and adding a new chapter kind is a compile
 * error everywhere it needs handling rather than a silent gap.
 */
export type Chapter =
  | { kind: "prose"; heading?: string; body: string[] }
  | { kind: "voice"; text: string; attribution?: string }
  | {
      kind: "figure";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
      /** Defaults to "artifact" — a mat. Use "site" for browser chrome. */
      frame?: "site" | "artifact";
      label?: string;
      wide?: boolean;
    }
  | { kind: "decisions"; heading: string; items: { title: string; body: string }[] }
  | { kind: "diagram"; heading: string; intro?: string; steps: DiagramStep[] }
  | { kind: "spec"; heading: string; rows: { label: string; value: string }[] };

export type DiagramStep = {
  label: string;
  detail: string;
  /** Marks the step Swornim's system owns, as opposed to the surrounding world. */
  owned?: boolean;
};

/**
 * Intrinsic dimensions are required, not optional: they let the browser
 * reserve exact space, and they let `Frame` show the whole image at its own
 * ratio instead of cropping it into a container.
 */
export type Cover = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** `site` gets browser chrome; `artifact` gets a mat. */
  kind: "site" | "artifact";
  /** Address shown in the browser chrome, for `site`. */
  label?: string;
};

export type ProjectStatus = "Live" | "Internal" | "Delivered" | "Ongoing";

export type Project = {
  slug: string;
  /** Plate number. Sequence is real here — it's a curated running order. */
  index: string;
  title: string;
  /** One line, on the index and the plate caption. */
  premise: string;
  discipline: string;
  year: string;
  role: string[];
  stack: string[];
  status: ProjectStatus;
  external?: { label: string; href: string };
  /** Shown on the homepage as one of four plates. */
  featured: boolean;
  /**
   * A real screenshot of the real thing. Left undefined until one exists —
   * `Plate` then renders a typographic panel, which is honest, rather than an
   * abstract drawing pretending to be evidence.
   */
  cover?: Cover;
  /** Standfirst on the case-study page. */
  summary: string;
  chapters: Chapter[];
  /** Anything not cleared for publication yet. */
  clearance?: Fact;
};

export const projects: Project[] = [
  /* ---------------------------------------------------------------- 01 */
  {
    slug: "avernek",
    index: "01",
    title: "Building an AI company from zero",
    premise: "Registering a company, finding the first clients, and learning the business while running it.",
    discipline: "Company · Product · Sales",
    year: "2026",
    role: ["Founder", "Sales", "Team lead", "Design direction"],
    stack: ["Founder-led sales", "Client discovery", "Design direction", "Delivery"],
    status: "Live",
    external: { label: "avernek.com", href: "https://avernek.com/" },
    featured: true,
    cover: { src: "/projects/avernek-desktop.jpg", alt: "The live avernek.com homepage — the hero, positioning line and the three-stage system diagram", width: 1600, height: 1000, kind: "site", label: "avernek.com" },
    summary:
      "Avernek Technologies is a registered Nepali company building AI inquiry systems for businesses that lose customers between an advert and a reply. I started it, sell it, direct its design, and answer for it when something breaks.",
    chapters: [
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Businesses here spend real money getting people to message them. A message arrives at 9pm on a Saturday. Nobody sees it until Monday. By then the customer has booked somewhere else.",
          "The ads worked. The business still lost the sale. Nothing owns the gap between an enquiry arriving and someone being ready to deal with it, and that gap is what Avernek sells a fix for.",
        ],
      },
      {
        kind: "prose",
        heading: "My role",
        body: [
          "Founder and Managing Director. In a three-person company that means sales, requirements, design and delivery.",
          "I find the clients and run the meetings. I work out what a business is actually asking for, which is rarely what they said first, and turn it into something we can quote and build. I price it, close it, and design what we ship. Then I lead the team through delivering it.",
          "Pragyan is our CTO and builds the automation. Sushant runs the creative and ad side.",
        ],
      },
      {
        kind: "decisions",
        heading: "Four decisions I made early",
        items: [
          {
            title: "Sell the outcome, never the technology",
            body: "The site does not open with the word AI. It opens with turning enquiries into tracked sales opportunities, because that is the sentence an owner repeats to their partner. The technology is how we do it, not what they are buying.",
          },
          {
            title: "Promise handling, not revenue",
            body: "Our footer says we improve enquiry handling, tracking and reporting, and that we do not guarantee sales. It costs us a few deals. It also removes every argument six months in, which is worth more.",
          },
          {
            title: "Testimonials in the client's own words",
            body: "Every quote on our site is the client's own message, tidied for grammar and nothing else. One of them opens by saying they were not convinced at first. That one performs better than the polished ones.",
          },
          {
            title: "Three packages, one recommended",
            body: "Core, Growth and Scale, with Growth marked as recommended. Owners do not want a configurator. They want to know which one businesses like theirs pick.",
          },
        ],
      },
      {
        kind: "prose",
        heading: "The website",
        body: [
          "The site is dark, typographic and deliberately not playful — the audience is a business owner deciding whether a small Nepali company can be trusted with their enquiries, and warmth is not what reassures them. The design direction, the positioning and most of the words are mine.",
          "It was built with AI in the loop. That isn't a confession, it's the point: the distance between deciding something and having it live was days rather than months, which for a company with no runway is the whole advantage.",
        ],
      },
      {
        kind: "figure",
        src: "/projects/avernek-mobile.jpg",
        alt: "The Avernek homepage on a phone-width viewport, showing the same hero and system diagram stacked.",
        width: 430,
        height: 932,
        caption:
          "The same page at 430px. Most of the audience is a business owner reading a message on their phone, so the mobile layout is the one that actually has to work.",
      },
      {
        kind: "spec",
        heading: "Under it",
        rows: [
          { label: "My part", value: "Positioning, copy, design direction, the build" },
          { label: "Not my part", value: "The AI automation engine behind it — that's our CTO" },
          { label: "Approach", value: "AI-assisted, so a decision reached the live site in days" },
        ],
      },
      {
        kind: "prose",
        heading: "What I got wrong",
        body: [
          "I under-priced the first few deals to get signatures, and then had to argue my way back out of the number I had set. I built features clients described rather than the ones they would use. I spent too long polishing the website before there was anyone to send it to.",
          "We are eight months in. Most of this is being learned on live clients.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 02 */
  {
    slug: "avernek-os",
    index: "02",
    title: "A commitment ledger, not a to-do app",
    premise: "An internal product with opinions strong enough to make it deliberately worse at some things.",
    discipline: "Product design · Systems",
    year: "2026",
    role: ["Product definition", "Interface design", "Rules and behaviour"],
    stack: ["Figma", "Product definition", "AI-assisted prototype"],
    status: "Internal",
    featured: false,
    // TODO: needs a real screenshot — see README "Images still needed".
    summary:
      "Avernek OS is the internal system a three-person agency runs on. Adding a task is free; missing a deadline is expensive and public — and the founder is on the same scoreboard as everyone else.",
    chapters: [
      {
        kind: "prose",
        heading: "Why not just use Trello",
        body: [
          "Because a board tells you what exists, not what was promised. Small agencies don't fail because nobody wrote the task down. They fail because a date quietly moved, twice, and the client found out last.",
          "So the unit isn't a task. It's a commitment: something someone said they would do by a date, with a record of every time that date changed and who changed it.",
        ],
      },
      {
        kind: "decisions",
        heading: "The rules that make it a product",
        items: [
          {
            title: "Never build surveillance",
            body: "No hours logged. No activity heatmaps. No 'last seen', no online status, no screenshots, no location. The board shows the deadline and the state, never when someone was working. This is written into the project's own instructions with a note telling any future session to refuse a request for it, and point back at the reason.",
          },
          {
            title: "Punish silence, not humanity",
            body: "Declaring a task at risk more than 24 hours before it's due carries zero penalty — it's the behaviour the system wants. A silent miss, or a flag raised inside the final 24 hours, is penalised. People are allowed to be late. They're not allowed to be quiet about it.",
          },
          {
            title: "Nobody edits their own past",
            body: "Deadline changes and accountability events are append-only, enforced at the database level rather than in the interface. History that can be rewritten isn't history.",
          },
          {
            title: "The founder is on the same scoreboard",
            body: "Only the founder role can edit or delete a deadline — enforced in row-level security, not just hidden in the UI — but the founder's own misses appear exactly like everyone else's. A ledger that exempts the person who built it isn't a ledger.",
          },
          {
            title: "Saturday is the weekend, Sunday is a working day",
            body: "The Nepali working week is built into the date arithmetic, in one pure, unit-tested module that all scheduling goes through. Every delivery pack scheduled when a client signs lands on a day the team actually works.",
          },
        ],
      },
      {
        kind: "prose",
        heading: "What it does that a board can't",
        body: [
          "It schedules a delivery pack automatically the moment a client signs, using the working calendar rather than raw dates. It refuses overload out loud — an intake gate that says no when the week is full, and drafts the message to the client explaining the delay. And it learns behaviour over time: who slips, who goes quiet, and nudges before the miss rather than after it.",
          "Milestone 1 is built and running: auth, people, tasks, the calendar, permissions and row-level security, the Today and Board screens, Telegram notifications and the daily log.",
        ],
      },
      {
        kind: "spec",
        heading: "Under it",
        rows: [
          { label: "Framework", value: "Next.js 15, App Router, TypeScript" },
          { label: "Data", value: "Supabase Postgres, RLS on every table, Realtime" },
          { label: "Notifications", value: "Telegram Bot API behind a channel interface" },
          { label: "Scheduling", value: "Vercel Cron, Asia/Kathmandu (UTC+05:45) throughout" },
          { label: "Discipline", value: "Every schema change is a migration file; calendar logic is pure and unit-tested" },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 03 */
  {
    slug: "inquiry-systems",
    index: "03",
    title: "Answering every enquiry in under a minute",
    premise: "The architecture behind a system that reads intent, qualifies a buyer, and knows when to hand over to a human.",
    discipline: "AI automation · Systems design",
    year: "2026",
    role: ["Client discovery", "Requirements", "Knowledge architecture", "Delivery"],
    stack: ["Discovery interviews", "Knowledge design", "Escalation rules", "Client delivery"],
    status: "Delivered",
    featured: false,
    cover: { src: "/projects/avernek-system.jpg", alt: "The Avernek site's lead-response decay chart and the typical-setup versus with-Avernek comparison table", width: 1600, height: 1150, kind: "site", label: "avernek.com" },
    summary:
      "Businesses running ads collect messages across Facebook, Instagram, WhatsApp, web forms and marketplace listings. The hard part was never the reply — it was knowing which answer is true for this branch, this service, this customer.",
    clearance: unverified(
      "Client names withheld pending permission",
      "Avernek's clients gave testimonials to the company. May they be named on a personal portfolio, and may any performance figures be published?",
    ),
    chapters: [
      {
        kind: "prose",
        heading: "The problem underneath the problem",
        body: [
          "Every business asked for the same thing — 'reply to messages automatically' — and every business meant something different by it. A clinic needs to know which treatment, which branch, and whether it's urgent. A showroom needs to know the model, the budget and whether the person can actually visit. A property business needs the location and whether the enquiry is a buyer or a broker.",
          "A single generic auto-reply is worse than no auto-reply, because it tells the customer they're talking to a wall. The system had to hold a specific business's actual knowledge and behave differently depending on what was being asked.",
        ],
      },
      {
        kind: "diagram",
        heading: "How a message becomes a qualified lead",
        intro:
          "Five of these steps are the world the business already lives in. The middle four are the system.",
        steps: [
          { label: "Customer", detail: "Sees an advert or a post and sends a message." },
          { label: "Channel", detail: "Facebook, Instagram, WhatsApp, web form, or a marketplace listing." },
          { label: "Capture", detail: "Every message is recorded the moment it lands — nothing depends on someone noticing.", owned: true },
          { label: "Intent", detail: "What is this person actually asking for, and how urgent is it?", owned: true },
          { label: "Knowledge", detail: "The business's own answers — services, branches, prices, hours — not general knowledge.", owned: true },
          { label: "Qualify", detail: "Serious buyer or browser. Scored, so the team knows who to call first.", owned: true },
          { label: "CRM", detail: "One structured pipeline the owner can actually see." },
          { label: "Human", detail: "Escalated to a person with the context already gathered." },
          { label: "Report", detail: "Response speed, lead quality, follow-up status — back to the owner." },
        ],
      },
      {
        kind: "prose",
        heading: "Where I come into this",
        body: [
          "Our CTO builds the engine. My part is everything in front of it: sitting with the owner, working out what the business actually knows, and turning what's in their head into a structure the system can answer from.",
          "That is most of the delivery time on every build. Which questions have exactly one correct answer. Which change by branch, service or season. And which must never be answered by a machine at all.",
          "That last category is the one I care about most. Anything touching a medical opinion, a firm price commitment or a complaint goes to a person immediately. A system that knows what it is not allowed to say is worth more than one that answers everything.",
        ],
      },
      {
        kind: "prose",
        heading: "Honest limits",
        body: [
          "This is presented as architecture rather than results. The performance figures belong to the clients who paid for the systems, and they haven't been cleared for publication here. Nothing in this case study contains a client's private workflow, credentials, or data.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 04 */
  {
    slug: "nepal-comfort",
    index: "04",
    title: "A 1999 tour company, rebuilt",
    premise: "A full-stack rebuild for a Kathmandu vehicle rental and tour operator — client, API, database and deployment.",
    discipline: "Full-stack · Delivery",
    year: "2026",
    role: ["Requirements", "Design", "AI-assisted build"],
    stack: ["Figma", "Claude Code", "React", "Node"],
    status: "Delivered",
    featured: true,
    cover: {
      src: "/projects/nepal-comfort.jpg",
      alt: "The Nepal Comfort Tour Service homepage — a full-bleed photograph of the company's own fleet behind the headline, with the since-1999 and NTVA-registered credentials called out",
      width: 1600,
      height: 1100,
      kind: "site",
      label: "nepalcomfort.com",
    },
    summary:
      "Nepal Comfort Tour Service has run vehicle rental and tour transportation out of Kathmandu since 1999. The rebuild is a complete MERN application — not a template with their logo on it.",
    chapters: [
      {
        kind: "prose",
        heading: "Why not a brochure site",
        body: [
          "Nepal Comfort has run vehicle rental and tour transport out of Kathmandu since 1999. Their fleet, routes and pricing change constantly, and every change was going through whoever could edit the site that week.",
          "So the fleet, routes and rates are database-backed and editable by them, not hardcoded into pages. The site itself leads with their own photographs — twenty-six years of vehicles and drivers is the credential, and stock imagery would have thrown that away.",
        ],
      },
      {
        kind: "spec",
        heading: "Under it",
        rows: [
          { label: "Client", value: "React 18, Vite, Tailwind, Motion" },
          { label: "Server", value: "Node, Express, MongoDB with Mongoose, JWT auth" },
          { label: "Local", value: "Docker Compose — mongo, server, client; in-memory Mongo fallback for machines without either" },
          { label: "Data", value: "Seed and fresh-seed scripts, so the database is reproducible" },
        ],
      },
      {
        kind: "prose",
        heading: "Handover",
        body: [
          "The whole thing comes up with one command, and the setup notes cover the things that actually trip people up locally. It is a small amount of writing that saves the next person an hour.",
          "A project is not delivered until someone else can run it.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 05 */
  {
    slug: "hck-core",
    index: "05",
    title: "Designing a college's resource platform",
    premise: "Sole UI/UX designer on a student and teacher platform, during a four-month internship.",
    discipline: "UI/UX",
    year: "2025",
    role: ["Sole UI/UX designer", "Flows", "Interface design"],
    stack: ["Figma", "Adobe XD"],
    status: "Delivered",
    featured: false,
    // TODO: needs a real screenshot — see README "Images still needed".
    summary:
      "HCK Core is a resource-sharing platform with separate student and teacher portals, covering academic modules, extra learning resources and community features. I was the only person doing UI/UX on it.",
    chapters: [
      {
        kind: "prose",
        heading: "Two portals, one system",
        body: [
          "Students and teachers want opposite things from the same content. A student wants to find one specific resource for tomorrow's class as fast as possible. A teacher wants to see everything they've put into a module and whether it's complete.",
          "The temptation is to build two products. What I designed was one system with two entry points — the same modules, the same resources, arranged around a different question.",
        ],
      },
      {
        kind: "prose",
        heading: "The internship was formal recognition of something I'd already been doing",
        body: [
          "By the time this started I had been teaching myself UI in Figma every day for a long time — building interfaces nobody asked for, redrawing apps I used, posting the results. Most of that work only ever lived on LinkedIn and TikTok.",
          "This was the first time it was a job with someone else's requirements attached, and a deadline that wasn't mine to move.",
        ],
      },
      {
        kind: "prose",
        heading: "What being the only designer taught me",
        body: [
          "Nobody was going to catch my mistakes. There was no second designer to say a flow didn't make sense, so I had to build the habit of arguing with my own work — walking a screen as a student who was late and stressed, then again as a teacher uploading at midnight.",
          "It's the reason I now design flows before screens. A pretty screen in the wrong place in a flow is just a nicer way to be lost.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 06 */
  {
    slug: "mountain-routes",
    index: "06",
    title: "Organic content for foreign trekkers",
    premise: "Running end-to-end organic content for a Nepali trekking company whose customers are almost all overseas.",
    discipline: "Growth · Content strategy",
    year: "2026",
    role: ["Content strategy", "Short-form video", "Design", "Monthly reporting"],
    stack: ["Instagram", "Facebook", "Figma", "CapCut"],
    status: "Ongoing",
    featured: false,
    cover: { src: "/projects/mountain-routes-1.jpg", alt: "An Everest Base Camp with Gokyo Lakes itinerary designed for Mountain Routes — route map, day-by-day breakdown and trip statistics", width: 1400, height: 1400, kind: "artifact" },
    summary:
      "Mountain Routes sells treks in Nepal to people in Europe, North America and Australia. The whole problem is that the audience has never been here and is deciding whether to trust a company they found on a phone.",
    clearance: unverified(
      "Performance figures withheld pending permission",
      "Mountain Routes monthly performance reports contain client metrics. Are any figures cleared for publication?",
    ),
    chapters: [
      {
        kind: "prose",
        heading: "Content for people who haven't been here",
        body: [
          "A trekking company's local audience already knows what Everest Base Camp involves. A foreign audience is asking quieter questions: is this safe, are these people real, what happens if something goes wrong at altitude, and can I actually do this.",
          "So the content answers those instead of posting mountains. Itineraries laid out clearly. The guides, as people. The practical detail nobody puts on a poster because it isn't beautiful.",
          "Most of it is short-form video, produced in volume — reels week after week rather than an occasional polished piece. Consistency is what makes a small account look like a real company, and volume is the only way to get consistency.",
        ],
      },
      {
        kind: "figure",
        src: "/projects/mountain-routes-1.jpg",
        alt: "Everest Base Camp with Gokyo Lakes itinerary — a route map with named stops and altitudes, a seventeen-day breakdown, and a trip statistics bar.",
        width: 1400,
        height: 1400,
        caption:
          "The itinerary format. A route map with every stop and altitude named, the full day-by-day underneath, and the questions a foreign trekker actually asks — duration, max altitude, difficulty, season, accommodation, walking hours — answered in one strip along the bottom.",
        wide: true,
      },
      {
        kind: "prose",
        heading: "Why the itineraries look like this",
        body: [
          "A trekking post that is just a photograph of a mountain competes with every other photograph of a mountain. Someone deciding whether to spend three weeks and a lot of money in a country they have never visited is not short of scenery — they are short of specifics.",
          "So the format leads with the map and the numbers. Altitudes on every stop, acclimatisation days marked, the flight legs drawn separately from the walking. It is denser than a normal social post on purpose: density reads as competence, and competence is the thing being sold.",
        ],
      },
      {
        kind: "figure",
        src: "/projects/mountain-routes-2.jpg",
        alt: "A second Mountain Routes trek itinerary in the same visual system.",
        width: 1400,
        height: 1400,
        caption: "The same system applied to another route — one format, so the account starts to look like a company rather than a feed.",
        wide: true,
      },
      {
        kind: "prose",
        heading: "Reporting to the owner every month",
        body: [
          "Every month the owner gets a written performance report. Not a screenshot of a dashboard — an actual account of what was posted, what worked, what didn't, and what changes next month.",
          "That habit came out of the customer-success year. The reporting is often what keeps the relationship, not the work itself.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
