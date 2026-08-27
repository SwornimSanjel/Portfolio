import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Cover } from "@/content/projects";

/**
 * How every image on this site is presented.
 *
 * Two kinds, because two kinds of thing are being shown:
 *
 *  - `site` — a screenshot of a working website. It sits inside a restrained
 *    browser window, at its real aspect ratio, complete. A screenshot cropped
 *    to fit a grid is worse than no screenshot: the thing being shown is a
 *    layout, and a cropped layout is not the layout.
 *
 *  - `artifact` — a finished piece of design: an itinerary sheet, a poster, a
 *    phone screen. Matted on the page ground with generous margins, again at
 *    its own ratio. Nothing is ever cropped to a container.
 *
 * Both use intrinsic width/height so the browser reserves the exact space and
 * the page never shifts as images load.
 */
export function Frame({
  cover,
  className,
  sizes = "(min-width: 1024px) 620px, 100vw",
  priority,
  zoomOnHover,
}: {
  cover: Cover;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoomOnHover?: boolean;
}) {
  const image = (
    <Image
      src={cover.src}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      priority={priority}
      className={cn(
        "h-auto w-full",
        zoomOnHover &&
          "transition-transform duration-[900ms] ease-rule group-hover:scale-[1.03]",
      )}
    />
  );

  if (cover.kind === "site") {
    return (
      <figure
        className={cn(
          "overflow-hidden rounded-lg border border-rule bg-paper-deep",
          "shadow-[0_1px_2px_rgba(18,18,15,0.04),0_16px_36px_-26px_rgba(18,18,15,0.25)]",
          "transition-all duration-500 ease-rule",
          "group-hover:-translate-y-1 group-hover:shadow-[0_2px_4px_rgba(18,18,15,0.06),0_28px_54px_-28px_rgba(18,18,15,0.34)]",
          className,
        )}
      >
        <div className="flex items-center gap-2 border-b border-rule bg-paper px-3 py-2.5">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="block h-2 w-2 rounded-full bg-ink/15" />
            <i className="block h-2 w-2 rounded-full bg-ink/15" />
            <i className="block h-2 w-2 rounded-full bg-ink/15" />
          </span>
          {cover.label && (
            <span className="mx-auto truncate rounded-sm bg-paper-deep px-3 py-0.5 font-mono text-[0.62rem] text-muted">
              {cover.label}
            </span>
          )}
        </div>
        <div className="overflow-hidden bg-paper-deep">{image}</div>
      </figure>
    );
  }

  // artifact
  return (
    <figure
      className={cn(
        "overflow-hidden border border-rule bg-paper-deep p-4 sm:p-6",
        className,
      )}
    >
      <div className="overflow-hidden">{image}</div>
    </figure>
  );
}
