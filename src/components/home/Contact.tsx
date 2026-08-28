import { profile } from "@/content/profile";
import { social } from "@/content/social";
import { fact } from "@/content/verify";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useMagnetic } from "@/lib/motion/useMagnetic";

/**
 * The close.
 *
 * Everything above this is evidence; this is the ask, and it gets the only
 * glass panel on the page so the eye lands on it after a long scroll. One
 * primary action — the email — stated twice on purpose: as a button for
 * someone skimming, and as the literal address for someone who would rather
 * copy it than let their machine decide which mail client opens.
 */
export function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>(0.14, 80);
  const email = fact(profile.contact.email);

  return (
    <section id="contact" data-section-label="Contact" className="scroll-mt-24 py-section">
      <Container>
        <div className="glass relative isolate overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[12%] -top-[45%] -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.12),transparent)] blur-2xl"
          />

          <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="meta">Contact</p>
            </div>

            <div className="md:col-span-9">
              <h2 className="max-w-[16ch] text-h1 text-ink">{profile.contact.headline}</h2>
              <p className="mt-5 max-w-narrow text-lead text-graphite">{profile.contact.body}</p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Button href={`mailto:${email}`} glyph="↗">
                  Email me
                </Button>
                <a
                  ref={emailRef}
                  href={`mailto:${email}`}
                  className="inline-block font-sans text-h3 font-semibold text-ink underline decoration-accent decoration-1 underline-offset-[6px] transition-colors duration-300 will-change-transform hover:text-accent"
                >
                  {email}
                </a>
              </div>

              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-5">
                {social
                  .filter((s) => s.primary)
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        href={fact(item.href)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-underline meta text-graphite transition-colors hover:text-ink"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
