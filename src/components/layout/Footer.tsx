import { SmartLink as Link } from "@/components/ui/SmartLink";
import { profile } from "@/content/profile";
import { social, company } from "@/content/social";
import { fact } from "@/content/verify";
import { nav } from "@/lib/constants/site";
import { Container } from "./Container";

/**
 * The footer restates the one thing a visitor might still want — how to reach
 * him — and then gets out of the way.
 *
 * Two things were wrong here.
 *
 * The company link read "Avernek Technologies Pvt. Ltd. ↗" inside a column
 * roughly twenty characters wide, so the arrow wrapped onto a line of its own
 * and sat under the name like a bullet. An arrow is punctuation attached to
 * the last word, never a line. It is bound to the final word in a nowrap span
 * now, so the name may wrap but the glyph can never be orphaned. The legal
 * suffix moved to the colophon, where a legal name belongs.
 *
 * And the address was the company's. This is one person's portfolio, not
 * Avernek's, and a company inbox on it told the reader otherwise.
 */
export function Footer() {
  const email = fact(profile.contact.email);
  const companyWords = company.shortName.split(" ");
  const companyHead = companyWords.slice(0, -1).join(" ");
  const companyTail = companyWords[companyWords.length - 1];

  return (
    <footer className="border-t border-rule bg-paper-deep">
      <Container>
        <div className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="meta">Get in touch</p>
              <a
                href={`mailto:${email}`}
                // Long addresses must be allowed to break rather than push the
                // column wider than the grid on a narrow screen.
                className="mt-5 inline-block break-all text-h2 font-semibold tracking-tight text-ink underline decoration-accent decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-accent"
              >
                {email}
              </a>
              <p className="mt-6 max-w-narrow text-body text-graphite">
                {profile.footer.tagline}
              </p>
            </div>

            <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
              <h2 className="meta mb-5">Pages</h2>
              <ul className="flex flex-col gap-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-body text-graphite transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <h2 className="meta mb-5">Elsewhere</h2>
              <ul className="flex flex-col gap-2.5">
                {social.map((item) => (
                  <li key={item.id}>
                    <a
                      href={fact(item.href)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-body text-graphite transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-rule pt-5">
                <h2 className="meta mb-2.5">Company</h2>
                <a
                  href={company.site}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-body text-graphite transition-colors hover:text-ink"
                >
                  {companyHead}{" "}
                  {/* The arrow is bound to the final word so it can never wrap
                      onto a line by itself. */}
                  <span className="whitespace-nowrap">
                    {companyTail} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="meta normal-case">{profile.footer.disclosure}</p>
            <p className="meta tnum">
              {profile.locationShort} · © {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
