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
    cover: { src: "/projects/avernek-desktop.jpg", alt: "The live avernek.com homepage showing the hero, positioning line and the three-stage system diagram", width: 1600, height: 1000, kind: "site", label: "avernek.com" },
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
          "The site is dark, typographic and deliberately not playful. The audience is a business owner deciding whether a small Nepali company can be trusted with their enquiries, and warmth is not what reassures them. The design direction, the positioning and most of the words are mine.",
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
          { label: "Not my part", value: "The AI automation engine behind it, which is our CTO" },
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
    slug: "roshi-international",
    index: "02",
    title: "Thirty-nine years of sauce, put online",
    premise:
      "A manufacturer's first real website: product range, trade enquiries and the credentials a dealer checks before ordering.",
    discipline: "Full-stack · Delivery",
    year: "2026",
    // Same shape as every Avernek website engagement: the client arrives for
    // automation and marketing, the site is added, and the site is mine.
    role: ["Sales", "Requirements", "Design", "AI-assisted build"],
    stack: ["Next.js", "Claude Code", "Figma"],
    status: "Delivered",
    featured: true,
    cover: {
      src: "/projects/roshi-international.jpg",
      alt: "The Roshi International homepage: the bilingual headline beside a photograph of a 2.5kg tomato ketchup container, over a strip of trade credentials",
      // 16:10, the same as every other site plate. Frames are shown at their
      // own ratio rather than cropped to a box, so two screenshots of
      // different proportions in one row end at different heights and the
      // grid looks misaligned. The ratio is settled at capture time instead.
      width: 1600,
      height: 1000,
      kind: "site",
      label: "roshiinternational.com",
    },
    external: { label: "Preview build", href: "https://demo.avernek.com/" },
    summary:
      "Roshi International has manufactured sauces and condiments in Kathmandu since 1987: soya sauce, chilli, ketchup, mayonnaise and vinegar, sold through homes, retailers, dealers and food service. The site is finished and running on a preview domain; roshiinternational.com is bought and waiting on the hosting cutover.",
    chapters: [
      {
        kind: "prose",
        heading: "Two audiences, one page",
        body: [
          "A person buying a 320gm bottle for their kitchen and a dealer pricing a 5kg carton want completely different things, and a manufacturer's site usually gets built for whichever one the owner thought of first.",
          "So the product range leads with the sizes, 370gm through 5kg on the same card, because the size list is the fastest way for a trade buyer to work out whether this supplier is relevant to them, and it costs a home cook nothing to read past it.",
        ],
      },
      {
        kind: "prose",
        heading: "The credentials are the product",
        body: [
          "Thirty-nine years, established 2044 BS, DFTQC licensed, government registered, a growing dealer network. For a food manufacturer selling into shops and restaurants, those four facts do more work than any amount of copy about quality.",
          "They sit in a strip directly under the fold rather than on an About page, because a dealer deciding whether to make contact checks them first and leaves if they cannot find them.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 03 */
  {
    slug: "nepal-comfort",
    index: "03",
    title: "A 1999 tour company, rebuilt",
    premise: "A full-stack rebuild for a Kathmandu vehicle rental and tour operator: client, API, database and deployment.",
    discipline: "Full-stack · Delivery",
    year: "2026",
    // An Avernek engagement, not freelance. The client came for automation
    // and marketing and asked for the site as well; the site is the part I
    // take myself, end to end.
    role: ["Sales", "Requirements", "Design", "AI-assisted build"],
    stack: ["Figma", "Claude Code", "React", "Node"],
    status: "Delivered",
    featured: true,
    cover: {
      src: "/projects/nepal-comfort.jpg",
      alt: "The Nepal Comfort Tour Service homepage: a full-bleed photograph of the company's own fleet behind the headline, with the since-1999 and NTVA-registered credentials called out",
      // The file is 1600x1000. This said 1100, so the browser reserved a box
      // 100px taller than the image that arrived — the plate settled short
      // once it loaded, and sat lower than its neighbour in the row.
      width: 1600,
      height: 1000,
      kind: "site",
      // The client is Nepal Comfort Tour Service (P) Ltd.; the domain is
      // nepaltourservice.com. The chrome label said nepalcomfort.com, which
      // is not a site that exists.
      label: "nepaltourservice.com",
    },
    summary:
      "Nepal Comfort Tour Service has run vehicle rental and tour transportation out of Kathmandu since 1999. The rebuild is a complete MERN application, not a template with their logo on it. It came to Avernek as an automation and marketing engagement; the website was added to it, and the build is mine.",
    // The rebuild is finished but not yet cut over — nepaltourservice.com
    // still serves the old site until hosting moves. Deliberately not linked
    // as `external`, because a link labelled with this case study that opens
    // the site it replaced is worse than no link.
    chapters: [
      {
        kind: "prose",
        heading: "Why not a brochure site",
        body: [
          "Nepal Comfort Tour Service has run vehicle rental and tour transport out of Kathmandu since 1999. Their fleet, routes and pricing change constantly, and every change was going through whoever could edit the site that week.",
          "So the fleet, routes and rates are database-backed and editable by them, not hardcoded into pages. The site itself leads with their own photographs. Twenty-six years of vehicles and drivers is the credential, and stock imagery would have thrown that away.",
        ],
      },
      {
        kind: "spec",
        heading: "Under it",
        rows: [
          { label: "Client", value: "React 18, Vite, Tailwind, Motion" },
          { label: "Server", value: "Node, Express, MongoDB with Mongoose, JWT auth" },
          { label: "Local", value: "Docker Compose running mongo, server and client, with an in-memory Mongo fallback for machines without either" },
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

  /* ---------------------------------------------------------------- 04 */
  {
    slug: "inquiry-systems",
    index: "04",
    title: "The product I built the company around",
    // A correction of a correction.
    //
    // This first over-claimed: "the architecture behind a system that reads
    // intent", as though the engineering were his. Fixing that, it swung to
    // "Selling a system I do not build" — which is accurate about the code
    // and wrong about everything else. He is the founder. The product is his
    // idea, he defines what it does and refuses to do, he sells it, and he
    // leads the people who build it. A title that opens by naming what he is
    // not is a strange thing to put on a portfolio, and it reads as smaller
    // than the truth.
    //
    // Founders are not judged on who typed the code. The claim is ownership
    // of the product, stated plainly, with the build credited where it
    // belongs inside the case study rather than in the headline.
    premise: "The inquiry system Avernek sells. What it does, what it refuses to do, who it is sold to, and the team that builds it.",
    discipline: "Product · Founder-led sales",
    year: "2026",
    role: ["Product definition", "Client discovery", "Pricing and closing", "Team lead"],
    stack: ["Discovery interviews", "Knowledge design", "Escalation rules", "Client delivery"],
    status: "Delivered",
    featured: false,
    // No screenshot yet. `/projects/avernek-system.jpg` was referenced here
    // but has never existed, so the plate rendered a broken-image box with the
    // alt text spilled across it. Coverless is a state the design already
    // handles — `PendingPlate` — and a designed placeholder beats a broken
    // one. Restore this line the day the file lands.
    // cover: { src: "/projects/avernek-system.jpg", alt: "The Avernek site's lead-response decay chart and the typical-setup versus with-Avernek comparison table", width: 1600, height: 1150, kind: "site", label: "avernek.com" },
    summary:
      "Businesses running ads collect messages across Facebook, Instagram, WhatsApp, web forms and marketplace listings. Avernek sells the system that answers them. I decide what it does and what it must never do, I sit with the client to find out what the business actually knows, I price it and close it, and our CTO builds it.",
    clearance: unverified(
      "Client names withheld pending permission",
      "Avernek's clients gave testimonials to the company. May they be named on a personal portfolio, and may any performance figures be published?",
    ),
    chapters: [
      {
        kind: "prose",
        heading: "The problem underneath the problem",
        body: [
          "Every business asked for the same thing, 'reply to messages automatically', and every business meant something different by it. A clinic needs to know which treatment, which branch, and whether it's urgent. A showroom needs to know the model, the budget and whether the person can actually visit. A property business needs the location and whether the enquiry is a buyer or a broker.",
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
          { label: "Capture", detail: "Every message is recorded the moment it lands, so nothing depends on someone noticing.", owned: true },
          { label: "Intent", detail: "What is this person actually asking for, and how urgent is it?", owned: true },
          { label: "Knowledge", detail: "The business's own answers: services, branches, prices and hours, not general knowledge.", owned: true },
          { label: "Qualify", detail: "Serious buyer or browser. Scored, so the team knows who to call first.", owned: true },
          { label: "CRM", detail: "One structured pipeline the owner can actually see." },
          { label: "Human", detail: "Escalated to a person with the context already gathered." },
          { label: "Report", detail: "Response speed, lead quality and follow-up status, back to the owner." },
        ],
      },
      {
        kind: "prose",
        heading: "Where the product comes from",
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
    // The design was delivered; the build was the college's. That
    // distinction lives in the summary rather than being smuggled into a
    // status the type system has four legitimate values for.
    status: "Delivered",
    featured: false,
    // TODO: needs a screenshot — the Figma board exists (student portal,
    // moderator portal, and the final combined frame). See README.
    external: {
      label: "Development Platform HCK on LinkedIn",
      href: "https://www.linkedin.com/posts/development-platform-hck_%F0%9D%90%81%F0%9D%90%AE%F0%9D%90%A2%F0%9D%90%A5%F0%9D%90%AD-%F0%9D%90%9F%F0%9D%90%A8%F0%9D%90%AB-%F0%9D%90%9E%F0%9D%90%9D%F0%9D%90%AE%F0%9D%90%9C%F0%9D%90%9A%F0%9D%90%AD%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%AC-%F0%9D%90%9D%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%A2%F0%9D%90%A0%F0%9D%90%A7%F0%9D%90%9E%F0%9D%90%9D-activity-7408386834533376000-J7Vx",
    },
    summary:
      "HCK Core is a resource-sharing platform with separate student and moderator portals, covering academic modules, extra learning resources and community features. I was the only person doing UI/UX on it. The college's development team later built it, with modifications, and published it.",
    chapters: [
      {
        kind: "prose",
        heading: "Two portals, one system",
        body: [
          "Students and teachers want opposite things from the same content. A student wants to find one specific resource for tomorrow's class as fast as possible. A teacher wants to see everything they've put into a module and whether it's complete.",
          "The temptation is to build two products. What I designed was one system with two entry points: the same modules, the same resources, arranged around a different question.",
        ],
      },
      {
        kind: "prose",
        heading: "The internship was formal recognition of something I'd already been doing",
        body: [
          "By the time this started I had been teaching myself UI in Figma every day for a long time, building interfaces nobody asked for, redrawing apps I used, posting the results. Most of that work only ever lived on LinkedIn and TikTok.",
          "This was the first time it was a job with someone else's requirements attached, and a deadline that wasn't mine to move.",
        ],
      },
      {
        kind: "prose",
        heading: "What being the only designer taught me",
        body: [
          "Nobody was going to catch my mistakes. There was no second designer to say a flow didn't make sense, so I had to build the habit of arguing with my own work, walking a screen as a student who was late and stressed, then again as a teacher uploading at midnight.",
          "It's the reason I now design flows before screens. A pretty screen in the wrong place in a flow is just a nicer way to be lost.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 06 */
  {
    slug: "sopdrafts",
    index: "06",
    title: "Fourteen months of one company's voice",
    premise:
      "Static brand and social content for an SOP and visa services business, run long enough that consistency became the product.",
    discipline: "Brand · Content design",
    year: "2025/26",
    role: ["Brand content design", "Social design", "Visual consistency"],
    stack: ["Figma", "Canva", "AI-assisted imagery"],
    status: "Delivered",
    featured: false,
    // TODO: needs plates. The work is posted publicly on the SOPdrafts Nepal
    // and personal LinkedIn/TikTok accounts — pick four or five and export
    // them at a consistent ratio. See README, "Images still needed".
    summary:
      "Fourteen months designing the static content for SOPdrafts Nepal, an SOP and visa services business in Kathmandu. Posts, brand updates, and the small pieces that make a small company look like the same company every week.",
    chapters: [
      {
        kind: "prose",
        heading: "The job was consistency, not posts",
        body: [
          "Anyone can make one good post. The reason this ran for fourteen months is that a services business selling something as consequential as a visa application is judged on whether it looks like it has its act together, and a feed that changes character every fortnight says the opposite.",
          "So the work was mostly restraint: one type treatment, one colour behaviour, one way of handling a headline, applied week after week until the account was recognisable without the logo.",
        ],
      },
      {
        kind: "prose",
        heading: "Figma, Canva, and AI where it earned its place",
        body: [
          "Figma for anything that had to be exact or reused. Canva when the client needed to edit something themselves after I had handed it over. A template somebody can actually maintain is worth more than a file only I can open.",
          "AI for imagery and variations, never for the decision about what the post was for. It shortens the distance between an idea and something you can look at, which on a weekly cadence is most of the work.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 07 */
  {
    slug: "mountain-routes",
    index: "07",
    title: "Organic content for foreign trekkers",
    premise: "Running end-to-end organic content for a Nepali trekking company whose customers are almost all overseas.",
    discipline: "Growth · Content strategy",
    year: "2026",
    role: ["Content strategy", "Short-form video", "Design", "Monthly reporting"],
    stack: ["Instagram", "Facebook", "Figma", "CapCut"],
    status: "Ongoing",
    featured: false,
    cover: { src: "/projects/mountain-routes-1.jpg", alt: "An Everest Base Camp with Gokyo Lakes itinerary designed for Mountain Routes, showing the route map, day-by-day breakdown and trip statistics", width: 1400, height: 1400, kind: "artifact" },
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
          "Most of it is short-form video, produced in volume: reels week after week rather than an occasional polished piece. Consistency is what makes a small account look like a real company, and volume is the only way to get consistency.",
        ],
      },
      {
        kind: "figure",
        src: "/projects/mountain-routes-1.jpg",
        alt: "Everest Base Camp with Gokyo Lakes itinerary: a route map with named stops and altitudes, a seventeen-day breakdown, and a trip statistics bar.",
        width: 1400,
        height: 1400,
        caption:
          "The itinerary format. A route map with every stop and altitude named, the full day-by-day underneath, and the questions a foreign trekker actually asks about duration, max altitude, difficulty, season, accommodation and walking hours, answered in one strip along the bottom.",
        wide: true,
      },
      {
        kind: "prose",
        heading: "Why the itineraries look like this",
        body: [
          "A trekking post that is just a photograph of a mountain competes with every other photograph of a mountain. Someone deciding whether to spend three weeks and a lot of money in a country they have never visited is not short of scenery. They are short of specifics.",
          "So the format leads with the map and the numbers. Altitudes on every stop, acclimatisation days marked, the flight legs drawn separately from the walking. It is denser than a normal social post on purpose: density reads as competence, and competence is the thing being sold.",
        ],
      },
      {
        kind: "figure",
        src: "/projects/mountain-routes-2.jpg",
        alt: "A second Mountain Routes trek itinerary in the same visual system.",
        width: 1400,
        height: 1400,
        caption: "The same system applied to another route. One format, so the account starts to look like a company rather than a feed.",
        wide: true,
      },
      {
        kind: "prose",
        heading: "Reporting to the owner every month",
        body: [
          "Every month the owner gets a written performance report. Not a screenshot of a dashboard, but an actual account of what was posted, what worked, what did not, and what changes next month.",
          "That habit came out of the customer-success year. The reporting is often what keeps the relationship, not the work itself.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
