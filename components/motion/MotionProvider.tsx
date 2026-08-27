"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * One place decides whether the site animates.
 *
 * Components read `useMotionAllowed()` instead of each calling
 * `useReducedMotion()`, so there is a single source of truth and no component
 * can forget.
 *
 * Scrolling is native. A smoothing library was tried here and removed: any
 * amount of easing on the wheel puts the page a few frames behind the input,
 * and on this design it bought nothing that was worth that.
 *
 * A route-transition `template.tsx` was also tried and removed. It faded the
 * whole document in on every navigation, which meant two things: every click
 * cost a few hundred milliseconds of nothing, and in any environment where
 * requestAnimationFrame is throttled the entire page stayed at opacity zero.
 * Never animate the whole document as a unit — animate parts of it.
 */
const MotionContext = createContext<boolean>(true);

export function useMotionAllowed(): boolean {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  // Assume motion is off until mounted, so SSR and first paint agree.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Belt and braces: after any reveal has had time to finish, mark the
  // document settled. `globals.css` then forces masked lines to their final
  // position, so no environment can leave the headline stranded off-screen.
  useEffect(() => {
    const timer = window.setTimeout(
      () => document.documentElement.classList.add("motion-settled"),
      1500,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const allowed = mounted && !prefersReduced;

  return <MotionContext.Provider value={allowed}>{children}</MotionContext.Provider>;
}
