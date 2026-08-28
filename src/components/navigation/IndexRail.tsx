import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Entry = { id: string; label: string };

/**
 * The fixed index down the left edge — the device the whole "manual" idea
 * hangs on. It reads the sections out of the DOM rather than taking a prop,
 * so a page can add or reorder sections without also updating a list.
 *
 * Desktop only. Below 1280px the current section label lives in the header
 * instead, which is why this can disappear without losing information.
 */
export function IndexRail() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-section-label]"),
    );
    setEntries(
      sections.map((el) => ({ id: el.id, label: el.dataset.sectionLabel ?? "" })),
    );

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // A band across the upper-middle of the viewport: the section you are
      // reading, not the one that has merely appeared.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="Section index"
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col gap-3">
        {entries.map((entry, i) => {
          const active = entry.id === activeId;
          return (
            <li key={entry.id} className="pointer-events-auto">
              <a
                href={`#${entry.id}`}
                className="group relative flex items-center"
                aria-current={active ? "true" : undefined}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px transition-all duration-500 ease-rule",
                    active ? "w-8 bg-ink" : "w-4 bg-rule group-hover:w-6",
                  )}
                />
                {/* Hover-only in every state, including active: a permanently
                    visible label collides with the headline at container
                    widths. Absolutely positioned and pointer-events-none so
                    the hidden label never adds width to the link and never
                    intercepts a click meant for the page behind it. */}
                <span
                  className={cn(
                    "pointer-events-none absolute left-11 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.14em]",
                    "opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                    active ? "text-ink" : "text-muted",
                  )}
                >
                  <span className="tnum">{String(i + 1).padStart(2, "0")}</span> {entry.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
