import Link from "next/link";
import { profile } from "@/content/profile";
import { social, company } from "@/content/social";
import { fact } from "@/content/verify";
import { nav } from "@/lib/constants/site";
import { Container } from "./Container";

/**
 * The footer restates the one thing a visitor might still want — how to reach
 * him — and then gets out of the way. Large contact line, three columns of
 * links, one rule, a colophon.
 */
export function Footer() {
  const email = fact(profile.contact.email);

  return (
    <footer className="border-t border-rule bg-paper-deep">
      <Container>
        <div className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="meta">Get in touch</p>
              <a
                href={`mailto:${email}`}
                className="mt-5 inline-block text-h2 font-semibold tracking-tight text-ink underline decoration-accent decoration-1 underline-offset-[6px] transition-colors hover:text-accent"
              >
                {email}
              </a>
              <p className="mt-6 max-w-narrow text-body text-graphite">
                {profile.footer.tagline}
              </p>
            </div>

            <nav aria-label="Footer" className="lg:col-span-3">
              <h2 className="meta mb-5">Pages</h2>
              <ul className="flex flex-col gap-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-underline text-body text-graphite hover:text-ink">
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
                      className="link-underline text-body text-graphite hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="mt-3 border-t border-rule pt-3">
                  <a
                    href={company.site}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-body text-graphite hover:text-ink"
                  >
                    {company.name} ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="meta normal-case">{profile.footer.disclosure}</p>
            <p className="meta tnum">
              {profile.locationShort} · © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
