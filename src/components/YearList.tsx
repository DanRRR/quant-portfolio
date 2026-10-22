import Link from "next/link";

/** One year's worth of list items; the section id feeds the rail. */
export function YearGroup({ year, children }: { year: string; children: React.ReactNode }) {
  return (
    <section id={`y-${year}`} className="year-group">
      <h2 className="year">{year}</h2>
      {children}
    </section>
  );
}

type ListItemProps = {
  id?: string;
  meta: string;
  title: string;
  href: string;
  external?: boolean;
  summary: string;
  foot?: React.ReactNode;
};

/** Date/category line, bold title link, one-line summary, faint footer line. */
export function ListItem({ id, meta, title, href, external, summary, foot }: ListItemProps) {
  return (
    <div className="post-row u" id={id}>
      <p className="post-date">{meta}</p>
      <p className="post-title">
        {external ? (
          <a href={href} target="_blank" rel="noreferrer">
            {title}
          </a>
        ) : (
          <Link href={href}>{title}</Link>
        )}
      </p>
      <p className="post-subtitle">{summary}</p>
      {foot ? <p className="tags">{foot}</p> : null}
    </div>
  );
}
