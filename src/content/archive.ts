/**
 * Curated interface and visual studies.
 *
 * Empty pending an authorship pass. The original source folder mixed
 * self-directed work with saved reference from other designers, and there is
 * no reliable way to tell them apart from filenames alone, so none of it
 * ships until each piece is confirmed.
 *
 * The gallery components are still in place; re-enabling is only a matter of
 * adding entries here.
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
