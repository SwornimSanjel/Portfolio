import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/constants/site";

/**
 * Two cuts of one typeface. Geist carries every heading, every paragraph and
 * every control; Geist Mono carries metadata. Hierarchy comes from weight,
 * size and tracking — there is no second family and no italic anywhere.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.claim,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description: profile.claim,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.claim,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    worksFor: { "@type": "Organization", name: "Avernek Technologies", url: "https://avernek.com/" },
    url: siteUrl,
  };

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
