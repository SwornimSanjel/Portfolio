import { motion } from "framer-motion";
import { settleGroup, settleItem, viewport } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import type { ReactNode } from "react";

/**
 * Metadata settle — detail arrives just after its subject.
 * Used for figure captions, stack lists, timeline rows.
 */
export function Settle({
  children,
  className,
  stagger = 0.03,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const animate = useMotionAllowed();
  if (!animate) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={settleGroup(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function SettleItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const animate = useMotionAllowed();
  if (!animate) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={settleItem}>
      {children}
    </motion.div>
  );
}
