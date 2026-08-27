import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";
import { RuleDraw } from "@/components/typography/RuleDraw";
import type { ReactNode } from "react";

type Props = {
  id: string;
  /** Shown in the index rail and the condensed header. */
  label: string;
  /** Sequence number. Only passed where the running order is genuinely load-bearing. */
  index?: string;
  heading?: string;
  standfirst?: string;
  children: ReactNode;
  className?: string;
  inverted?: boolean;
  /** Suppress the opening hairline where a section follows an inverted block. */
  bare?: boolean;
};

/**
 * Every section of the site is announced the same way: a hairline draws, then
 * a mono label, then the heading. That repetition is the manual metaphor —
 * a reader learns the structure once and can then navigate by it.
 */
export function Section({
  id,
  label,
  index,
  heading,
  standfirst,
  children,
  className,
  inverted,
  bare,
}: Props) {
  return (
    <section
      id={id}
      data-section-label={label}
      className={cn(
        "scroll-mt-24 py-section",
        inverted && "inverted bg-paper text-graphite",
        className,
      )}
    >
      <Container>
        {!bare && <RuleDraw className="mb-8" />}
        <div className="grid gap-x-8 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="meta tnum">
              {index ? `${index} — ` : ""}
              {label}
            </p>
          </div>
          <div className="md:col-span-9">
            {heading && <h2 className="max-w-measure text-h2">{heading}</h2>}
            {standfirst && (
              <p className="mt-4 max-w-measure text-lead text-graphite">{standfirst}</p>
            )}
          </div>
        </div>
        <div className={cn(heading || standfirst ? "mt-12 md:mt-16" : "mt-0")}>{children}</div>
      </Container>
    </section>
  );
}
