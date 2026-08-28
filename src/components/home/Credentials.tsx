import { profile } from "@/content/profile";
import { company } from "@/content/social";

/**
 * The identity strip under the hero.
 *
 * This used to be four counts — 6 projects, 5 roles, 3 people, "Pvt. Ltd." —
 * and they said nothing. "6 projects documented" is a fact about this website,
 * not about the person; "5 roles since 2025" reads as instability rather than
 * range; and a company suffix is not an achievement. Vanity metrics are worse
 * than no metrics, because a reader who cannot find the significance in a
 * number assumes there is none.
 *
 * What a stranger actually wants in the four seconds after the headline is
 * who, what, where, and what he does. So it is a record card, not a scoreboard
 * — the same information a business card carries, which is the right register
 * for a founder.
 */
export function Credentials() {
  const facts = [
    { label: "Role", value: profile.roleShort },
    { label: "Company", value: company.name },
    { label: "Based in", value: profile.locationShort },
    // Avernek's actual service lines, taken from the company's own material.
    // This said "AI systems · Design · Delivery", which was a guess: "design"
    // is what he came from, not what the company sells, and "delivery" is a
    // stage of work rather than a thing a client buys.
    { label: "Focus", value: "AI automation · Marketing · Web development" },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-paper/60 px-5 py-6 sm:px-6">
          {/* `meta` resolves to muted, which measures 4.2:1 against this card
              on the dark hero — under the 4.5 a label at this size needs.
              Graphite clears it comfortably. */}
          <dt className="meta text-graphite">{fact.label}</dt>
          <dd className="mt-2.5 text-body font-semibold text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
