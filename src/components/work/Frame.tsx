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
  boxed,
}: {
  cover: Cover;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoomOnHover?: boolean;
  /**
   * Mat the cover into one fixed 16:10 footprint.
   *
   * Used by the index grid, and only there. Covers are authored at whatever
   * proportion the thing actually is: browser screenshots at 16:10, a Figma
   * board at 16:9, a square contact sheet, a square itinerary. Shown at their
   * own ratio side by side, the rows end at different heights and the grid
   * looks accidental.
   *
   * The ratio is set on the PICTURE AREA, not on the outer window.
   *
   * Setting it on the window was the first attempt and it was wrong: the
   * title bar is a fixed 50px, so the picture got "whatever is left", which
   * came out at 1.865 while every screenshot is 1.60. Every site plate then
   * fitted by height and sat in forty pixels of dead ground on each side.
   *
   * With the ratio on the picture instead, a 16:10 screenshot fills it
   * exactly: no gap, no crop. The artifact frame is padded by half the bar
   * height on each edge so that its total comes out identical to a windowed
   * plate, which is what keeps the rows level.
   *
   * Case study pages pass nothing and still get the image whole, at its real
   * proportion, which is where that matters.
   */
  boxed?: boolean;
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
        boxed ? "h-full w-full object-contain" : "h-auto w-full",
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
          boxed && "flex flex-col",
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
        {/* Fixed height, not padding-derived. The address pill is taller than the
            three controls, so a window with no label came out 13px shorter than
            one with a label, and a single unlabelled plate sat low in its row. */}
        <div className="glass-bar flex h-[50px] shrink-0 items-center gap-2 border-b border-rule px-4">
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
        <div
          className={cn(
            "overflow-hidden bg-paper-deep",
            boxed && "aspect-[16/10] w-full",
          )}
        >
          {image}
        </div>
      </figure>
    );
  }

  // artifact
  return (
    <figure
      className={cn(
        "overflow-hidden border border-rule bg-paper-deep",
        // Vertical only. Padding the sides as well would narrow the picture,
        // and a narrower picture at the same ratio is a shorter picture, which
        // is what left matted plates 31px short of windowed ones. 25px top and
        // bottom is half the 50px title bar, so the totals match exactly.
        boxed ? "py-[25px]" : "p-4 sm:p-6",
        className,
      )}
    >
      <div className={cn("overflow-hidden", boxed && "aspect-[16/10] w-full")}>{image}</div>
    </figure>
  );
}
