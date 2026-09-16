import type { TimelineEntry } from "@/data/site";

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="timeline">
      {entries.map((entry) => (
        <article className="timeline-entry" key={`${entry.organisation}-${entry.period}`}>
          <p className="date-label">{entry.period}</p>
          <div>
            <h3>{entry.title}</h3>
            <p className="entry-meta">
              {entry.href ? <a href={entry.href} target="_blank" rel="noreferrer">{entry.organisation}</a> : entry.organisation}
              {entry.location && <span> · {entry.location}</span>}
            </p>
            <ul className="detail-list">{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          </div>
        </article>
      ))}
    </div>
  );
}
