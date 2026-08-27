"use client";

import { motion } from "framer-motion";
import { ruleDraw, viewport } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/cn";

/**
 * A section is beginning.
 *
 * The site's default reveal. A hairline draws left-to-right instead of the
 * content fading upward — which is both quieter and the structural device the
 * whole design is built on.
 */
export function RuleDraw({ className }: { className?: string }) {
  const animate = useMotionAllowed();

  if (!animate) {
    return <hr className={cn("rule border-0 border-t border-rule", className)} />;
  }

  return (
    <motion.hr
      aria-hidden="true"
      className={cn("origin-left border-0 border-t border-rule", className)}
      variants={ruleDraw}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    />
  );
}
