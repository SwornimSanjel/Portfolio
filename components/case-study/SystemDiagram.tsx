"use client";

import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import type { DiagramStep } from "@/content/projects";
import { cn } from "@/lib/utils/cn";

/**
 * The one place GSAP earns its place.
 *
 * The diagram explains itself in the order it appears — the connectors draw
 * and the nodes arrive as you scroll, because the sequence *is* the
 * information. That's a scrubbed timeline, which is what ScrollTrigger is for;
 * doing it in Motion would mean hand-rolling scroll progress for nine elements.
 *
 * On touch it becomes a stepper — scrubbing a timeline with a thumb is worse
 * than tapping through it. Under reduced motion everything renders in its
 * final state, fully labelled: the information never lived in the animation.
 */
export function SystemDiagram({
  steps,
  heading,
  intro,
}: {
  steps: DiagramStep[];
  heading: string;
  intro?: string;
}) {
  const rootRef = useRef<HTMLOListElement>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    if (!allowed || !rootRef.current) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    let cleanup = () => {};
    let cancelled = false;

    // Loaded on demand — GSAP is ~40kB and only this component needs it.
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const markers = rootRef.current.querySelectorAll<HTMLElement>("[data-marker]");
      const connectors = rootRef.current.querySelectorAll<HTMLElement>("[data-connector]");

      const ctx = gsap.context(() => {
        // Text is never animated — only the drawing is. A reader who lands
        // mid-page, or never scrolls, still gets every word at full contrast.
        gsap.set(markers, { scale: 0.4, opacity: 0.35 });
        gsap.set(connectors, { scaleY: 0, transformOrigin: "top" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });

        markers.forEach((marker, i) => {
          tl.to(marker, { scale: 1, opacity: 1, duration: 0.5 }, i * 0.5);
          const connector = connectors[i];
          if (connector) tl.to(connector, { scaleY: 1, duration: 0.5 }, i * 0.5 + 0.25);
        });
      }, rootRef);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [allowed]);

  return (
    <figure className="my-14">
      <figcaption className="mb-6 border-t border-rule pt-4">
        <h3 className="text-h3 font-semibold text-ink">{heading}</h3>
        {intro && <p className="mt-2 max-w-measure text-body text-graphite">{intro}</p>}
      </figcaption>

      <ol ref={rootRef} className="relative">
        {steps.map((step, i) => (
          <li key={step.label} className="relative pl-10 sm:pl-14">
            {/* Connector to the next node. Verdigris = flow, and nothing else. */}
            {i < steps.length - 1 && (
              <span
                data-connector
                aria-hidden="true"
                className="absolute left-[7px] top-6 h-full w-px bg-jade/50 sm:left-[11px]"
              />
            )}
            <div className="pb-8">
              <span
                data-marker
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-4 h-[15px] w-[15px] rounded-full border sm:h-[23px] sm:w-[23px]",
                  step.owned
                    ? "border-accent bg-accent/15"
                    : "border-rule bg-paper",
                )}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-2">
                <h4 className="text-h3 font-semibold text-ink">{step.label}</h4>
                {step.owned && <span className="meta text-accent">System</span>}
              </div>
              <p className="mt-1 max-w-narrow text-body text-graphite">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
