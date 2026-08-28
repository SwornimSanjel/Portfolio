import { unverified, type Fact } from "./verify";

export type SocialLink = {
  id: string;
  label: string;
  href: Fact;
  /** Shown in the contact block; the rest live in the footer only. */
  primary: boolean;
};

export const social: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/swornimsanjel/",
    primary: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: unverified(
      "https://www.instagram.com/_swornimsanjel_/",
      "Two Instagram accounts were supplied. Only one should be linked. Which is the professional one?",
    ),
    primary: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@its_swornim",
    primary: false,
  },
];

export const company = {
  /** Legal name, for the colophon. */
  name: "Avernek Technologies Pvt. Ltd.",
  /** What a link to it should say. The legal suffix wraps and orphans. */
  shortName: "Avernek Technologies",
  site: "https://avernek.com/",
  instagram: "https://www.instagram.com/avernek.system/",
  facebook: "https://www.facebook.com/avernek.system",
} as const;
