import { unverified } from "@/content/verify";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swornim.avernek.com";

/** TODO: confirm the domain before launch — canonical URLs and OG tags depend on it. */
export const domainQuestion = unverified(
  siteUrl,
  "What domain will this ship on? Canonical URLs, the sitemap and OpenGraph tags all depend on it.",
);

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
  { label: "Notes", href: "/notes" },
] as const;
