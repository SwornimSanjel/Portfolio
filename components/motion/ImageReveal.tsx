"use client";

import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * `mount` runs the reveal immediately — for anything above the fold, where
   * waiting on an intersection callback risks the image never appearing.
   * `inView` waits until the element is scrolled to. Default is `inView`.
   */
  trigger?: "mount" | "inView";
};

/**
 * An image arrives by being uncovered, not by fading in.
 *
 * A clip-path wipe reads as a print being revealed, which suits a page built
 * around plates; a fade reads as a page that hasn't finished loading. The
 * image also settles from a slight overscale, so there is something moving
 * under the mask rather than a static picture behind it.
 *
 * Both the wipe and the scale start from a hidden state, so — exactly like the
 * hero headline — the element carries `data-reveal`, and `globals.css` forces
 * it open once MotionProvider marks the document settled. No environment where
 * requestAnimationFrame is throttled can leave an image clipped to nothing.
 */
export function ImageReveal({ children, className, delay = 0, trigger = "inView" }: Props) {
  const animate = useMotionAllowed();
  if (!animate) return <div className={className}>{children}</div>;

  const onMount = trigger === "mount";
  const shown = { clipPath: "inset(0 0 0% 0)" };
  const settled = { scale: 1 };

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      {...(onMount
        ? { animate: shown }
        : { whileInView: shown, viewport })}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <motion.div
        data-reveal
        className="h-full w-full"
        initial={{ scale: 1.08 }}
        {...(onMount
          ? { animate: settled }
          : { whileInView: settled, viewport })}
        transition={{ duration: 1.2, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
