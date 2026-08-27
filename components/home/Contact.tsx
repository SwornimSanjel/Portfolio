"use client";

import { profile } from "@/content/profile";
import { social } from "@/content/social";
import { fact } from "@/content/verify";
import { Container } from "@/components/layout/Container";
import { useMagnetic } from "@/lib/motion/useMagnetic";

export function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>(0.14, 80);
  const email = fact(profile.contact.email);

  return (
    <section id="contact" data-section-label="Contact" className="py-section">
      <Container>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="meta">Contact</p>
          </div>
          <div className="md:col-span-9">
            <h2 className="max-w-[13ch] text-h1 text-ink">
              {profile.contact.headline}
            </h2>
            <p className="mt-5 max-w-narrow text-lead text-graphite">{profile.contact.body}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              <a
                ref={emailRef}
                href={`mailto:${email}`}
                className="inline-block font-sans text-h3 font-semibold text-ink underline decoration-accent decoration-1 underline-offset-[6px] will-change-transform"
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
                      className="link-underline meta text-graphite hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
