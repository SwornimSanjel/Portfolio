import { Img as Image } from "@/components/ui/Img";
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
        {/* macOS window chrome.

            The three controls are the actual system colours, at the actual
            12px with the actual 8px gutter between them, each with the faint
            darker rim macOS draws so a light button does not dissolve into a
            light titlebar. These are the one saturated thing on the site that
            is not the accent — deliberately, because they are not decoration:
            they are a quotation of an interface, and a half-remembered
            version of a mark everyone knows reads as a mistake.

            The bar itself is glass, which is also literal. A real window
            titlebar is translucent over its own content. */}
        <div className="glass-bar flex items-center gap-2 border-b border-rule px-4 py-3">
          <span aria-hidden="true" className="flex shrink-0 gap-2">
            <i className="block h-3 w-3 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)]" />
            <i className="block h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)]" />
            <i className="block h-3 w-3 rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)]" />
          </span>
          {cover.label && (
            <span className="mx-auto truncate rounded-md bg-ink/[0.055] px-4 py-1 font-mono text-[0.62rem] text-muted shadow-[inset_0_0_0_0.5px_rgba(18,18,15,0.06)]">
              {cover.label}
            </span>
          )}
          {/* Balances the controls so the address field sits truly centred. */}
          <span aria-hidden="true" className="w-[52px] shrink-0" />
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
