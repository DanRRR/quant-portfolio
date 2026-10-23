/** Minimal inline-link markup for data strings: "[text](https://url)" → a link segment.
 *  Lets src/data/site.ts (a .ts file, no JSX) carry links inside timeline bullets. */
export type InlineSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInlineLinks(text: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const start = m.index ?? 0;
    if (start > last) out.push({ type: "text", text: text.slice(last, start) });
    out.push({ type: "link", text: m[1], href: m[2] });
    last = start + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}
