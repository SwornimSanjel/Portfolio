import { SmartLink } from "@/components/ui/SmartLink";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

/**
 * The site's only call-to-action control.
 *
 * A portfolio is a sales document — someone reads it and either gets in touch
 * or does not — and this page had no button on it anywhere above the fold.
 * There are exactly two variants, and a page should use one of each at most:
 * a solid primary and an outlined secondary. Offering a reader five equal actions
 * is the same as offering none.
 *
 * The hover is one gesture, not three: the surface lifts a little, its shadow
 * deepens to match, and the trailing glyph slides in the direction it points.
 * The magnetic pull is the same helper the contact link uses, gated to fine
 * pointers so a thumb never triggers it.
 */
export function Button({
  href,
  children,
  variant = "primary",
  glyph = "→",
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  glyph?: string | null;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.14, 74);

  return (
    <SmartLink
      ref={ref}
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-mono text-micro uppercase",
        "transition-[transform,box-shadow,background-color,color] duration-500 ease-rule",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        variant === "primary"
          ? [
              "bg-ink text-paper",
              "shadow-[0_1px_2px_rgba(18,18,15,0.16),0_10px_26px_-14px_rgba(18,18,15,0.55)]",
              "hover:-translate-y-0.5 hover:bg-ink-soft",
              "hover:shadow-[0_2px_4px_rgba(18,18,15,0.18),0_20px_38px_-16px_rgba(18,18,15,0.6)]",
            ]
          : [
              // Outlined, not frosted. On the dark hero this reads as a
              // hairline control against the ground; on cream it reads as a
              // secondary next to the solid primary. Glass here bought a
              // floating pill and nothing else.
              "border border-ink/25 text-ink",
              "hover:-translate-y-0.5 hover:border-ink/50 hover:bg-ink/[0.04]",
            ],
        className,
      )}
      {...rest}
    >
      {children}
      {glyph && (
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-rule group-hover:translate-x-1"
        >
          {glyph}
        </span>
      )}
    </SmartLink>
  );
}
