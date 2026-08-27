import { unverified, type Fact } from "./verify";

export type Engagement = "Full-time" | "Part-time" | "Freelance" | "Internship";

export type ExperienceEntry = {
  id: string;
  role: Fact;
  org: Fact;
  engagement: Engagement;
  /** ISO-ish for sorting; `display` is what the page renders. */
  start: string;
  end: string | null;
  display: string;
  location: string;
  mode: "On-site" | "Remote" | "Hybrid";
  /** Two sentences maximum. The timeline is understated by design. */
  note: string;
  /** Links to a case study, when one exists. */
  project?: string;
};

/**
 * Dates and titles are taken from the LinkedIn record, which is treated as
 * the factual source. Where the supplied brief disagrees, the conflict is
 * marked rather than silently resolved.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "avernek",
    role: unverified(
      "Founder & Managing Director",
      'LinkedIn says "Founder & Managing Director"; avernek.com lists "Business Lead". Both are public right now — which is the one to show?',
    ),
    org: "Avernek Technologies Pvt. Ltd.",
    engagement: "Full-time",
    start: "2026-05",
    end: null,
    display: "May 2026 — Present",
    location: "Lalitpur, Nepal",
    mode: "On-site",
    note: "Building Avernek with a founding team across AI automation, performance marketing, AI video and digital systems. I own the business side — sales, delivery, and whether a client is glad they signed.",
    project: "avernek",
  },
  {
    id: "mountain-routes",
    role: "Content Strategy & Social Media Lead",
    org: "Mountain Routes",
    engagement: "Freelance",
    start: "2026-02",
    end: null,
    display: "Feb 2026 — Present",
    location: "Kathmandu, Nepal",
    mode: "Remote",
    note: "End-to-end organic content for a Nepali trekking company whose clients are almost entirely foreign trekkers across Europe, North America and Australia. Monthly performance reporting to the owner.",
    project: "mountain-routes",
  },
  {
    id: "sopdrafts",
    role: "Social Media & Brand Content Designer",
    org: "SOPdrafts Nepal",
    engagement: "Part-time",
    start: "2025-07",
    end: "2026-08",
    display: "Jul 2025 — Aug 2026",
    location: "Kathmandu, Nepal",
    mode: "Remote",
    note: "Fourteen months of static brand content for an SOP and visa services business — the posts and brand updates that keep a small company's presence consistent.",
  },
  {
    id: "scalestro",
    role: "CSM & Organic Growth Manager",
    org: "Scalestro",
    engagement: "Full-time",
    start: "2025-08",
    end: "2026-07",
    display: "Aug 2025 — Jul 2026",
    location: "Lalitpur, Nepal",
    mode: "Remote",
    note: "Client success and organic growth — project management, client communication, and the content side of retention. The year that taught me what customers actually complain about.",
  },
  {
    id: "hck-internship",
    role: "UI/UX Design Intern",
    org: unverified(
      "Development Platform HCK",
      'LinkedIn lists the employer as "Development Platform HCK"; the brief calls it "Herald College Kathmandu". Same institution — which name should be displayed?',
    ),
    engagement: "Internship",
    start: "2025-06",
    end: "2025-09",
    display: "Jun 2025 — Sep 2025",
    location: "Kathmandu, Nepal",
    mode: "On-site",
    note: "Sole UI/UX designer on HCK Core, a resource-sharing platform with dedicated student and teacher portals covering academic modules, extra learning resources and community features.",
    project: "hck-core",
  },
];
