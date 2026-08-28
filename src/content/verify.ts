/**
 * Unverified-fact marker.
 *
 * Several biographical fields conflict between the supplied brief and the
 * LinkedIn record, and a few facts aren't recorded anywhere yet. Rather than
 * guessing — which is the one thing a portfolio must never do — those fields
 * are wrapped in `unverified()` and carry the reason with them.
 *
 * NOTE ON WHAT THIS DOES AND DOES NOT DO.
 *
 * This comment used to claim that an `assertVerified()` ran at module load
 * and failed the production build if an unverified value reached a shipped
 * page. No such function was ever written. In production `fact()` simply
 * drops the flag and renders the best current answer, so every unresolved
 * conflict publishes silently as though it were confirmed.
 *
 * The marker is therefore an authoring aid, not a safety net: it shows the ⚑
 * in development so the open questions stay visible while writing, and
 * `collectUnverified()` can list them. Nothing enforces resolution. The nine
 * open items are resolved by asking, not by tooling.
 */

const MARK = "⚑"; // ⚑ — visible in dev, never in production

export type Unverified = {
  readonly __unverified: true;
  /** Best current answer, used for layout and dev rendering. */
  readonly value: string;
  /** What specifically needs confirming, and from whom. */
  readonly question: string;
};

export function unverified(value: string, question: string): Unverified {
  return { __unverified: true, value, question };
}

export function isUnverified(v: unknown): v is Unverified {
  return typeof v === "object" && v !== null && "__unverified" in v;
}

/** A field that may or may not be confirmed yet. */
export type Fact = string | Unverified;

/** Render a fact for display. Flags it in development, never in production. */
export function fact(f: Fact): string {
  if (!isUnverified(f)) return f;
  return process.env.NODE_ENV === "production" ? f.value : `${f.value} ${MARK}`;
}

/** Every open question, collected for the /colophon disclosure and for CI. */
export function collectUnverified(source: Record<string, unknown>): string[] {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (isUnverified(node)) {
      out.push(node.question);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object" && node !== null) {
      Object.values(node).forEach(walk);
    }
  };
  walk(source);
  return out;
}
