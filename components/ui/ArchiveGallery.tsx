"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { archive } from "@/content/archive";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/cn";

/**
 * An accordion gallery for the interface studies.
 *
 * The pattern is the familiar expanding-panels one (React Bits Pro ships an
 * `AccordionGallery`); this is written against our own tokens and props, and
 * fixes the two things those versions usually skip:
 *
 *  - It is hover-driven on a mouse and click-driven on touch, rather than
 *    hover-only, so a phone can open every panel.
 *  - Under reduced motion and below `md` it collapses to a plain grid, because
 *    a row of 40px-wide slivers is unusable on a narrow screen.
 *
 * Panels grow with flex-grow rather than width, so the row always fills the
 * container exactly and nothing is cropped unpredictably.
 */
export function ArchiveGallery() {
  const animate = useMotionAllowed();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = archive.slice(0, 7);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close]);

  const open = lightbox === null ? null : items[lightbox];

  return (
    <>
      {/* Accordion — mouse and keyboard, wide screens only. */}
      <ul className="hidden gap-2 md:flex md:h-[440px]">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <motion.li
              key={item.id}
              className="relative overflow-hidden rounded-lg border border-rule bg-paper-deep"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              animate={{ flexGrow: isActive ? 3.4 : 1 }}
              transition={animate ? { duration: 0.55, ease: EASE } : { duration: 0 }}
              style={{ flexBasis: 0, flexGrow: isActive ? 3.4 : 1 }}
            >
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="absolute inset-0 h-full w-full text-left"
                aria-label={`${item.title} — open larger`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 640px, 50vw"
                  className={cn(
                    "object-cover transition-all duration-700 ease-rule",
                    isActive ? "scale-100 grayscale-0" : "scale-105 grayscale",
                  )}
                />
                {/* Scrim only under the label, so the artwork stays readable. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/85 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-mono text-micro uppercase text-paper/70">
                    {item.tags[0]}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block text-h3 font-semibold text-paper transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {item.title}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* Narrow screens get a plain grid. Slivers are not a mobile pattern. */}
      <ul className="grid grid-cols-2 gap-3 md:hidden">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="block w-full text-left"
              aria-label={`${item.title} — open larger`}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-lg border border-rule bg-paper-deep">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
              </span>
              <span className="mt-2 block font-mono text-micro uppercase text-muted">
                {item.tags[0]}
              </span>
              <span className="mt-0.5 block text-body font-semibold text-ink">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4 sm:p-10"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={animate ? { opacity: 0 } : undefined}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={close}
          >
            <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image
                src={open.src}
                alt={open.title}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 1000px, 95vw"
                className="mx-auto h-auto max-h-[75vh] w-auto rounded-lg border border-paper/15 object-contain"
              />
              <figcaption className="mx-auto mt-5 flex max-w-3xl flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-h3 font-semibold text-paper">{open.title}</h3>
                  <p className="mt-1.5 max-w-measure text-body text-paper/70">{open.note}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  className="font-mono text-micro uppercase text-paper underline underline-offset-4"
                >
                  Close
                </button>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
