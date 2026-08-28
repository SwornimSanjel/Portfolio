import { archive } from "@/content/archive";

export const siteUrl =
  import.meta.env.VITE_SITE_URL ?? "https://swornim.avernek.com";

type NavItem = { label: string; href: string };

/**
 * Primary navigation.
 *
 * Archive only appears once there is an archive. Its content list is empty
 * pending an authorship check (see `content/archive.ts`), and until then the
 * page is a stub that says it is being rebuilt — so linking to it from the
 * header and the footer advertised the one unfinished thing on the site. The
 * route still resolves for anyone holding the URL; it simply is not offered.
 * Add entries to `archive` and it returns on its own, here and in the footer.
 */
export const nav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  ...(archive.length > 0 ? [{ label: "Archive", href: "/archive" }] : []),
  { label: "Notes", href: "/notes" },
];
