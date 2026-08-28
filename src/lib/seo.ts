import { useEffect } from "react";
import { siteUrl } from "@/lib/constants/site";
import { profile } from "@/content/profile";

/**
 * Per-route document metadata.
 *
 * Next's `metadata` export ran on a server and wrote the tags into the HTML.
 * There is no server now, so these are written into the head on mount. The
 * defaults for the site as a whole are already in `index.html`, which is what
 * a crawler that does not execute JavaScript sees; this narrows them to the
 * page. Google renders JavaScript before indexing, so the per-page titles and
 * descriptions below are picked up.
 *
 * If a crawler that does *not* render ever becomes important — a link
 * unfurler, say — the fix is prerendering at build time, not a framework:
 * see README, "If you ever need per-page HTML".
 */
export type Seo = {
  /** Page title. The site name is appended, matching the old title template. */
  title?: string;
  description?: string;
  /** Path, e.g. "/work/avernek". Resolved against the site origin. */
  canonical?: string;
  ogType?: "website" | "article";
};

const DEFAULT_TITLE = `${profile.name} · ${profile.role}`;

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSeo({ title, description, canonical, ogType = "website" }: Seo) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${profile.name}` : DEFAULT_TITLE;
    const desc = description ?? profile.claim;
    const url = `${siteUrl}${canonical ?? window.location.pathname}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", desc);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", desc);
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    setCanonical(url);
  }, [title, description, canonical, ogType]);
}
