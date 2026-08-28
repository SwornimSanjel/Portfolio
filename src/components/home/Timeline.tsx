import { SmartLink as Link } from "@/components/ui/SmartLink";
import { experience } from "@/content/experience";
import { fact } from "@/content/verify";
import { Settle, SettleItem } from "@/components/typography/Settle";

export function Timeline({ limit }: { limit?: number }) {
  const entries = limit ? experience.slice(0, limit) : experience;

  return (
    <Settle className="border-t border-rule">
      {entries.map((entry) => (
        <SettleItem key={entry.id}>
          <div className="grid gap-x-8 gap-y-2 border-b border-rule py-6 md:grid-cols-12">
            <p className="meta tnum md:col-span-3">{entry.display}</p>
            <div className="md:col-span-6">
              <h3 className="text-h3 font-semibold text-ink">
                {entry.project ? (
                  <Link href={`/work/${entry.project}`} className="link-underline">
                    {fact(entry.role)}
                  </Link>
                ) : (
                  fact(entry.role)
                )}
              </h3>
              <p className="mt-1 text-body text-graphite">{fact(entry.org)}</p>
              <p className="mt-3 max-w-measure text-body text-muted">{entry.note}</p>
            </div>
            <p className="meta md:col-span-3 md:text-right">
              {entry.engagement} · {entry.mode}
            </p>
          </div>
        </SettleItem>
      ))}
    </Settle>
  );
}
