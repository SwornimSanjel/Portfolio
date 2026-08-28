import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

/**
 * One link component, three behaviours — the thing `next/link` was doing for
 * us, written out.
 *
 *  - An external target (`http…`, `mailto:`, `tel:`) is a plain anchor, and
 *    gets `rel="noreferrer noopener"` if it opens in a new tab.
 *  - A same-page or cross-page hash (`/#contact`, `#work`) navigates first if
 *    the path differs, then scrolls to the element itself. The router will not
 *    do that for you: it restores scroll position and ignores the fragment.
 *  - Anything else is a client-side route change.
 *
 * Written as one component rather than three so that call sites read the same
 * as they did before, and nobody has to remember which kind of href they hold.
 */
export type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);

/** Scroll to a fragment, honouring the fixed 72px header. */
export function scrollToHash(hash: string, smooth = true) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}

/**
 * The same, but for a target that does not exist yet because the route it
 * lives on is still being rendered.
 *
 * Deliberately a timeout loop rather than `requestAnimationFrame`. A browser
 * suspends rAF outright in a background or offscreen tab — open a link to
 * `/#contact` in one and the callback simply never runs, leaving the reader at
 * the top of a page they asked to be scrolled down. Timers are throttled in
 * that state but they still fire.
 */
export function scrollToHashWhenReady(hash: string, attempts = 20) {
  const id = hash.replace(/^#/, "");
  const tick = (left: number) => {
    if (document.getElementById(id) || left === 0) {
      scrollToHash(hash, false);
      return;
    }
    window.setTimeout(() => tick(left - 1), 25);
  };
  tick(attempts);
}

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  function SmartLink({ href, onClick, children, ...rest }, ref) {
    const navigate = useNavigate();

    if (isExternal(href)) {
      const opensNewTab = rest.target === "_blank";
      return (
        <a
          ref={ref}
          href={href}
          rel={rest.rel ?? (opensNewTab ? "noreferrer noopener" : undefined)}
          onClick={onClick}
          {...rest}
        >
          {children}
        </a>
      );
    }

    const hashAt = href.indexOf("#");
    if (hashAt !== -1) {
      const path = href.slice(0, hashAt) || "/";
      const hash = href.slice(hashAt);

      const handle = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        if (window.location.pathname === path) {
          scrollToHash(hash);
          return;
        }
        // Navigate, then scroll once the destination has rendered.
        navigate(path);
        scrollToHashWhenReady(hash);
      };

      return (
        <a ref={ref} href={href} onClick={handle} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={href} onClick={onClick} {...rest}>
        {children}
      </RouterLink>
    );
  },
);

export default SmartLink;
