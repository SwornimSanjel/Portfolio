import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SmartLink as Link } from "@/components/ui/SmartLink";
import { profile } from "@/content/profile";
import { nav } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { MobileMenu } from "./MobileMenu";

type Rect = { x: number; w: number };

/**
 * A glass capsule with a single moving indicator.
 *
 * The indicator is one absolutely-positioned element whose x and width are
 * animated between measured positions, rather than a border on each link,
 * which jumps.
 *
 * Three fixes live here.
 *
 * Position used to be read from `el.offsetLeft`. `offsetLeft` is measured from
 * the nearest *positioned* ancestor, and every item sits in an `li` that is
 * `relative` so it can stack above the pill — so it reported the offset of the
 * link inside its own `li`, which is zero. The pill sat over the first item on
 * every page while the genuinely active label rendered in paper white on the
 * paper ground and vanished. Rects are measured against the list itself now.
 *
 * The indicator also follows the pointer. Contact is an anchor to `/#contact`
 * and never counts as a page, so under an active-only indicator it was the one
 * item in the bar that did nothing at all on hover — which reads as broken,
 * because it is the item people reach for. Hovering any item moves the
 * indicator to it; leaving the bar returns it to the active page, or retracts
 * it if there is none.
 *
 * And a label only inverts while the indicator is actually under it. Tying
 * both to the same measured value means the worst available outcome is an
 * un-highlighted label rather than an invisible one.
 */
export function Nav() {
  const { pathname } = useLocation();
  const animate = useMotionAllowed();
  const listRef = useRef<HTMLUListElement>(null);
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [lifted, setLifted] = useState(false);
  const [overDark, setOverDark] = useState(false);

  const items = [...nav, { label: "Contact", href: "/#contact" }];
  // The contact anchor never counts as a page, so nothing is highlighted on
  // the homepage — a nav where something is always lit reads as broken.
  const activeHref =
    items.find((item) => !item.href.includes("#") && pathname.startsWith(item.href))?.href ??
    null;

  const shownHref = hovered ?? activeHref;
  const pill = shownHref ? rects[shownHref] : undefined;

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const listBox = list.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    list.querySelectorAll<HTMLElement>("[data-href]").forEach((el) => {
      const href = el.dataset.href;
      if (!href) return;
      const box = el.getBoundingClientRect();
      next[href] = { x: box.left - listBox.left, w: box.width };
    });
    setRects(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    // Anything that changes the list's layout re-measures it: a window
    // resize, a font swap replacing fallback metrics, a label reflowing.
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, pathname]);

  /**
   * One scroll handler answers both questions the header has: has the page
   * moved under it, and is it currently over an inverted section?
   *
   * It has to ask the second one because the header is fixed and the page
   * runs underneath it — the wordmark is inked, and over the dark hero an
   * inked wordmark is simply absent. Nothing in the markup can know that; the
   * header is not inside the section it happens to be covering.
   *
   * This was an IntersectionObserver first, which is the textbook answer and
   * the wrong one here. IO callbacks are delivered during the browser's
   * rendering steps, and a browser suspends those in a background or
   * offscreen tab — so in exactly the situation where the observer never
   * fires, the header keeps whatever theme it mounted with. Landing on a dark
   * hero in a backgrounded tab meant dark type on dark ground, permanently.
   *
   * Rects are measured directly instead: correct on the very first frame,
   * correct with no frames at all, and cheap. It is two reads against a
   * handful of elements on an event that was already being listened to.
   */
  useEffect(() => {
    const band = 36; // the header's vertical centre
    let sections: HTMLElement[] = [];

    const refresh = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>(".inverted"));
    };

    const update = () => {
      setLifted(window.scrollY > 24);
      setOverDark(
        sections.some((el) => {
          const { top, bottom } = el.getBoundingClientRect();
          return top <= band && bottom >= band;
        }),
      );
    };

    // The section list cannot be captured once and trusted. Routes are code
    // split, so a page's markup can arrive a tick or several after this
    // effect runs — cache it at mount and the header decides its theme
    // against a document that does not have the page in it yet, which is why
    // the wordmark came up inked over the dark hero on some loads and not
    // others. Re-read on a short ladder, then settle.
    const settle = () => {
      refresh();
      update();
    };

    settle();
    const ticks = [0, 120, 400].map((ms) => window.setTimeout(settle, ms));
    window.addEventListener("load", settle);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", settle);

    return () => {
      ticks.forEach(window.clearTimeout);
      window.removeEventListener("load", settle);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", settle);
    };
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className={cn(
            "group flex items-baseline gap-2.5 rounded-full py-1.5 transition-all duration-500 ease-rule",
            // The wordmark takes its own glass only once the page is moving
            // under it. At rest it sits on bare ground, which is quieter.
            lifted ? "glass px-4" : "px-0",
            overDark && !lifted ? "text-paper" : "text-ink",
          )}
          aria-label={`${profile.name} — home`}
        >
          <span className="text-[0.95rem] font-semibold tracking-tight">{profile.name}</span>
          <span
            className={cn(
              "hidden font-mono text-micro uppercase transition-colors duration-500 sm:inline",
              overDark && !lifted ? "text-paper/60" : "text-muted",
            )}
          >
            {profile.roleShort}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul
            ref={listRef}
            onMouseLeave={() => setHovered(null)}
            className="glass relative flex items-center gap-1 rounded-full p-1"
          >
            {/* Two implementations of one indicator, on purpose.
                
                With motion on it is a spring, which is the whole character of
                the bar. With motion off it is a plain positioned span — NOT a
                framer animation with `duration: 0`, which is what it used to
                be. Framer drives even a zero-length animation through its own
                requestAnimationFrame loop, and a browser suspends rAF in a
                background or offscreen tab, so the indicator simply never
                arrived: it stayed at its mounted position while the label it
                should have been under lit up underneath nothing. Layout does
                not need a frame to be correct. */}
            {pill &&
              (animate ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-1 rounded-full bg-ink"
                  initial={false}
                  animate={{ x: pill.x, width: pill.w }}
                  transition={{ type: "spring", stiffness: 460, damping: 40, mass: 0.7 }}
                  style={{ left: 0 }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 rounded-full bg-ink"
                  style={{ left: 0, transform: `translateX(${pill.x}px)`, width: pill.w }}
                />
              ))}
            {items.map((item) => {
              const lit = item.href === shownHref && Boolean(pill);
              return (
                <li key={item.href} className="relative z-10">
                  <Link
                    href={item.href}
                    data-href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                    aria-current={item.href === activeHref ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-1.5 font-mono text-micro uppercase transition-colors duration-300",
                      // Over the dark hero the capsule composites to a mid
                      // grey, and graphite on mid grey measures 2.9:1 — under
                      // the 4.5 this size of text needs. Ink on the same
                      // capsule measures 6.1. The capsule stays light; the
                      // type on it gets darker, not lighter.
                      lit
                        ? "text-paper"
                        : overDark
                          ? "text-ink hover:text-ink"
                          : "text-graphite hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileMenu overDark={overDark} />
      </div>
    </header>
  );
}
