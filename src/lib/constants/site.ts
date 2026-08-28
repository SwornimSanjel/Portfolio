import { archive } from "@/content/archive";
import { visibleNotes } from "@/content/notes";

export const siteUrl =
  import.meta.env.VITE_SITE_URL ?? "https://swornimsanjel.com";

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
  // Notes hides on the same rule. Every note is still `status: "draft"`, and
  // `visibleNotes` filters drafts out in production, so the live page was a
  // headline, a standfirst and an empty rule — reachable from the primary nav
  // and the footer, and listed in the sitemap. An empty page one click from
  // the homepage is worse than no link. Publish a note and it returns.
  ...(visibleNotes.length > 0 ? [{ label: "Notes", href: "/notes" }] : []),
];
