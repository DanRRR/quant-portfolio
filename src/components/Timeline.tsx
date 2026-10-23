import type { TimelineEntry } from "@/data/site";
import { parseInlineLinks } from "@/lib/inline";

/** Renders a detail string, turning "[text](url)" into external links. */
function Detail({ text }: { text: string }) {
  return parseInlineLinks(text).map((seg, i) =>
    seg.type === "link" ? (
      <a key={i} href={seg.href} target="_blank" rel="noreferrer">
        {seg.text}
      </a>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="timeline">
      {entries.map((entry) => (
        <article className="timeline-entry" key={`${entry.title}-${entry.period}`}>
          {/* Reordered 2026-10-23: title, then period, then organisation and details
              (was: period in a left column beside a wrapped <div>). */}
          <h3>
            {entry.href && !entry.organisation ? (
              <a href={entry.href} target="_blank" rel="noreferrer">{entry.title}</a>
            ) : (
              entry.title
            )}
          </h3>
          <p className="date-label">{entry.period}</p>
          {entry.organisation && (
            <p className="entry-meta">
              {entry.href ? <a href={entry.href} target="_blank" rel="noreferrer">{entry.organisation}</a> : entry.organisation}
              {entry.location && <span> · {entry.location}</span>}
            </p>
          )}
          <ul className="detail-list">{entry.details.map((detail) => <li key={detail}><Detail text={detail} /></li>)}</ul>
        </article>
      ))}
    </div>
  );
}
