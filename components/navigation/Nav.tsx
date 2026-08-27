"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { nav } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { MobileMenu } from "./MobileMenu";

/**
 * A pill nav with a single moving indicator.
 *
 * The indicator is one absolutely-positioned element whose x and width are
 * animated between the active link's measured position — rather than a border
 * on each link, which jumps. It is measured from the DOM on mount, on resize
 * and on route change, so it stays correct at every width and after a font
 * swap (which is when a hardcoded position would drift).
 */
export function Nav() {
  const pathname = usePathname();
  const animate = useMotionAllowed();
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [lifted, setLifted] = useState(false);

  const items = [...nav, { label: "Contact", href: "/#contact" }] as const;
  // The contact anchor never counts as a page, so nothing is highlighted on
  // the homepage — a nav where something is always lit reads as broken.
  const activeHref =
    items.find((item) => !item.href.includes("#") && pathname.startsWith(item.href))?.href ??
    null;

  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      if (!list || !activeHref) {
        setPill(null);
        return;
      }
      const el = list.querySelector<HTMLElement>(`[data-href="${activeHref}"]`);
      if (!el) {
        setPill(null);
        return;
      }
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure once webfonts land, or the pill sits under the fallback metrics.
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeHref, pathname]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2.5 text-ink"
          aria-label={`${profile.name} — home`}
        >
          <span className="text-[0.95rem] font-semibold tracking-tight">{profile.name}</span>
          <span className="hidden font-mono text-micro uppercase text-muted sm:inline">
            {profile.roleShort}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul
            ref={listRef}
            className={cn(
              "relative flex items-center gap-1 rounded-full border p-1 transition-colors duration-500",
              lifted ? "border-rule bg-paper/90 backdrop-blur-sm" : "border-transparent",
            )}
          >
            {pill && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-1 rounded-full bg-ink"
                initial={false}
                animate={{ x: pill.x, width: pill.w }}
                transition={
                  animate
                    ? { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }
                    : { duration: 0 }
                }
                style={{ left: 0 }}
              />
            )}
            {items.map((item) => {
              const active = item.href === activeHref;
              return (
                <li key={item.href} className="relative z-10">
                  <Link
                    href={item.href}
                    data-href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-1.5 font-mono text-micro uppercase transition-colors duration-300",
                      active ? "text-paper" : "text-graphite hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
