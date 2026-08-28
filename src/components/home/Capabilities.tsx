import { capabilities } from "@/content/capabilities";
import { Settle, SettleItem } from "@/components/typography/Settle";

/**
 * No percentages, no bars, no icons. A capability list that refuses to
 * quantify itself is more credible than one claiming React 95%.
 */
export function Capabilities() {
  return (
    <Settle className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
      {capabilities.map((group) => (
        <SettleItem
          key={group.id}
          // Hairline grid, so a card cannot lift without tearing the rule
          // it shares with its neighbour. The hover is a ground shift and
          // an accent on the title instead — same acknowledgement, no
          // damage to the grid.
          className="group bg-paper p-6 transition-colors duration-500 ease-rule hover:bg-paper-deep lg:p-7"
        >
          <h3 className="text-h3 font-semibold text-ink transition-colors duration-500 ease-rule group-hover:text-accent">
            {group.title}
          </h3>
          <p className="mt-2 text-body text-muted">{group.premise}</p>
          <ul className="mt-5 flex flex-col gap-1.5 border-t border-rule pt-5">
            {group.items.map((item) => (
              <li key={item} className="text-body text-graphite">
                {item}
              </li>
            ))}
          </ul>
        </SettleItem>
      ))}
    </Settle>
  );
}
