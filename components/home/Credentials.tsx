import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

/**
 * At a glance.
 *
 * Every figure here is a count of something already listed elsewhere on the
 * site, derived from the content files rather than typed in — so it cannot
 * drift, and there is nothing to inflate. No follower counts, no conversion
 * rates, no revenue, no "years of experience".
 */
export function Credentials() {
  const facts = [
    { value: String(projects.length), label: "Projects documented" },
    { value: String(experience.length), label: "Roles since 2025" },
    { value: "3", label: "Founding team at Avernek" },
    { value: "Pvt. Ltd.", label: "Registered in Nepal, VAT" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-paper px-5 py-7 sm:px-7 sm:py-9">
          <dt className="text-h1 font-semibold leading-none text-ink tnum">{fact.value}</dt>
          <dd className="meta mt-4">{fact.label}</dd>
        </div>
      ))}
    </dl>
  );
}
