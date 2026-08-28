import { SmartLink as Link } from "@/components/ui/SmartLink";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";
import { profile } from "@/content/profile";

export function MobileMenu({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const animate = useMotionAllowed();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes, focus returns to the trigger, and the page behind is
  // locked. All three matter — an open menu you can scroll behind is a bug.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={cn(
          "font-mono text-meta uppercase transition-colors duration-500 md:hidden",
          overDark ? "text-paper" : "text-ink",
        )}
      >
        {open ? "Close" : "Menu"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={animate ? { opacity: 0 } : undefined}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="container-page flex h-16 shrink-0 items-center justify-between">
              <span className="text-h3 font-semibold text-ink">{profile.initials}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="font-mono text-meta uppercase text-ink"
              >
                Close
              </button>
            </div>

            <nav aria-label="Primary" className="container-page flex flex-1 flex-col justify-center">
              {[...nav, { label: "Contact", href: "/#contact" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={animate ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, ease: EASE, delay: animate ? 0.06 + i * 0.05 : 0 }}
                  className="border-t border-rule last:border-b"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5 text-h2 font-semibold text-ink"
                  >
                    <span className="meta tnum text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="container-page pb-10">
              <p className="meta">{profile.locationShort}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
