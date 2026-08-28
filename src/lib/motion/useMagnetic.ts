import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/components/motion/MotionProvider";

/**
 * Pointer-distance pull.
 *
 * The distance math is the idea behind React Bits' Magnet; everything else is
 * rewritten — much lower strength, a hard radius, transform written directly
 * rather than through a spring, and gated to fine pointers so it never fires
 * on touch. Used on exactly two things: the contact link and nav items.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.18, radius = 90) {
  const ref = useRef<T | null>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    // The centre is cached rather than measured per move. Calling
    // getBoundingClientRect() on every pointermove forces a synchronous
    // layout, and a mouse moving while the page scrolls will do that on
    // every frame — the classic layout-thrash pattern. The element only
    // moves when the page scrolls or resizes, so recompute there instead.
    let cx = 0;
    let cy = 0;
    let stale = true;

    const measure = () => {
      // Read the untransformed centre: subtract any pull already applied.
      const rect = el.getBoundingClientRect();
      const applied = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      cx = rect.left + rect.width / 2 - applied.m41;
      cy = rect.top + rect.height / 2 - applied.m42;
    };
    measure();

    const onMove = (event: PointerEvent) => {
      // Re-measure lazily, here, rather than on the scroll event itself.
      // getBoundingClientRect forces a synchronous layout, and this hook is
      // mounted on several elements at once, so measuring on scroll meant one
      // forced layout per instance per scroll event for a value nothing reads
      // until the pointer next moves. Scrolling only marks the cache dirty
      // now; the cost lands on the first pointermove afterwards, which is the
      // moment it is actually needed.
      if (stale) {
        measure();
        stale = false;
      }

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      // Cheap rejection before scheduling any work at all.
      if (Math.abs(dx) > radius || Math.abs(dy) > radius) {
        if (el.style.transform) {
          cancelAnimationFrame(frame);
          el.style.transform = "";
        }
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Math.hypot(dx, dy) > radius) {
          el.style.transform = "";
          return;
        }
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };

    const invalidate = () => {
      stale = true;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("blur", reset);
      cancelAnimationFrame(frame);
    };
  }, [allowed, strength, radius]);

  return ref;
}
