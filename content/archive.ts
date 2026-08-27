/**
 * Curated interface and visual studies.
 *
 * ⚠ EMPTY ON PURPOSE — AUTHORSHIP NOT ESTABLISHED.
 *
 * The images previously here came from `~/Documents/figma posts/all posted`,
 * which turns out to be a mix of Swornim's own work and saved reference from
 * other designers. Two of the pieces that had made it onto the page carried
 * another creator's branding outright — "Xettri Sreations" and the Instagram
 * handle @xettri_sreations — and there is no way to tell from the filenames
 * which of the remaining 140-odd files are his.
 *
 * Publishing another designer's work on someone's portfolio is the single
 * worst thing this site could do, so all of it is pulled until Swornim
 * confirms which pieces are his. The gallery components are still in place;
 * re-enabling is only a matter of adding entries here.
 *
 * See README, "Images still needed".
 */
export type ArchiveItem = {
  id: string;
  title: string;
  /** What the study was working out. Never "a design I made". */
  note: string;
  src: string;
  /** Intrinsic ratio, so the grid reserves space and never shifts on load. */
  ratio: "portrait" | "landscape" | "square";
  year: string;
  tags: string[];
};

export const archive: ArchiveItem[] = [];
