import { Img as Image } from "@/components/ui/Img";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { archive, type ArchiveItem } from "@/content/archive";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils/cn";

const ratioClass: Record<ArchiveItem["ratio"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

/**
 * The complete archive, as a grid.
 *
 * Cards lift and the image pushes in slightly on hover — the standard
 * dribbble-card behaviour, which works here because these are finished visual
 * pieces and the reward for hovering is seeing more of one.
 */
export function ArchiveFullGrid() {
  const animate = useMotionAllowed();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = archive.find((i) => i.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {archive.map((item, i) => (
          <motion.li
            key={item.id}
            initial={animate ? { opacity: 0, y: 14 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.45, ease: EASE, delay: animate ? (i % 3) * 0.06 : 0 }}
          >
            <button
              type="button"
              onClick={() => setOpenId(item.id)}
              className="group block w-full text-left"
              aria-label={`${item.title}, open larger`}
            >
              <span
                className={cn(
                  "relative block overflow-hidden rounded-lg border border-rule bg-paper-deep",
                  "transition-all duration-500 ease-rule",
                  "group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-24px_rgba(18,18,15,0.35)]",
                  ratioClass[item.ratio],
                )}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-rule group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-4 block border-t border-rule pt-3">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-body font-semibold text-ink">{item.title}</span>
                  <span className="meta tnum">{item.year}</span>
                </span>
                <span className="mt-1.5 block text-body text-muted">{item.note}</span>
              </span>
            </button>
          </motion.li>
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
