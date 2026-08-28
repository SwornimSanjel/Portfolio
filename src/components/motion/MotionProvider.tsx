import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * One place decides whether the site animates.
 *
 * Components read `useMotionAllowed()` instead of each calling
 * `useReducedMotion()`, so there is a single source of truth and no component
 * can forget.
 *
 * The answer is settled on the FIRST render and then never raised. Both
 * halves of that matter.
 *
 * Settled first, because every reveal on the site is written as
 * `initial={animate ? { opacity: 0, y: 16 } : false}`. If this value flipped
 * up after mount — as it did while the site was server-rendered and had to
 * assume "no motion" until hydration — an element would be handed an
 * `initial` of opacity 0 *after* its in-view observer had already fired, and
 * with `viewport={{ once: true }}` the observer never fires again. The
 * section then stays invisible for good. There is no server any more, so
 * there is nothing to agree with and no reason to guess.
 *
 * Never raised, and off entirely when the document starts hidden, because
 * these animations are what make the content *visible* — the page is authored
 * at opacity 0 and animated up. A browser suspends requestAnimationFrame in a
 * background or offscreen tab, which strands every reveal at whatever frame
 * it reached: a work grid at opacity 0.11, a nav indicator four pixels wide.
 * That is not a hypothetical; it is what an embedded preview pane, a
 * restored-from-background tab and a low-power mode all look like.
 *
 * So: if nobody is looking at the page while it loads, it renders finished
 * rather than animating into existence where no frames are coming. Nothing is
 * lost — there was no one to watch the animation — and the page can never be
 * caught half-revealed.
 *
 * Scrolling is native. A smoothing library was tried here and removed: any
 * amount of easing on the wheel puts the page a few frames behind the input,
 * and on this design it bought nothing that was worth that.
 */
const MotionContext = createContext<boolean>(true);

export function useMotionAllowed(): boolean {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(
    () => !window.matchMedia(QUERY).matches && !document.hidden,
  );

  // A preference for less motion is honoured the moment it is set. The
  // reverse is deliberately not wired up: raising this value mid-session is
  // the failure described above.
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => {
      if (mq.matches) setAllowed(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  return <MotionContext.Provider value={allowed}>{children}</MotionContext.Provider>;
}
