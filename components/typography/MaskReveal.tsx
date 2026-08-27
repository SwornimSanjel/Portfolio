"use client";

import { motion } from "framer-motion";
import { EASE, durations } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/cn";
import type { ElementType } from "react";

type Props = {
  /** One string per line. Splitting is explicit — no measuring, no layout thrash. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
};

/**
 * Headline arrival.
 *
 * The line-splitting idea is React Bits' Split Text; the animation is ours.
 * Each line wipes out from behind a fixed edge via overflow clipping instead
 * of fading and translating, so the text never drifts and the baseline holds.
 *
 * The heading element itself stays a plain semantic tag — only the inner line
 * spans are motion components, each with its own delay. Wrapping the tag in
 * `motion.create()` at render time would mint a new component identity on
 * every render, which silently strands the lines in their hidden state.
 *
 * Reduced motion: renders the lines outright. Nothing is lost — the words were
 * never carried by the animation.
 */
export function MaskReveal({
  lines,
  as: Tag = "h1",
  className,
  lineClassName,
  delay = 0,
}: Props) {
  const animate = useMotionAllowed();

  if (!animate) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        // The clipping wrapper. `pb` keeps descenders from being sliced.
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-mask-line
            className={cn("block", lineClassName)}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: durations.reveal,
              ease: EASE,
              delay: delay + i * 0.04,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
