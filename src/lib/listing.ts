const UNDATED = "Undated";

function parseIsoDate(iso: string): Date | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = MONTHS_LONG.map((m) => m.slice(0, 3));

// Fixed tables rather than toLocaleDateString: ICU's en-GB abbreviates
// September as "Sept", and we want the same output on every runtime.
function formatDate(iso: string, month: "short" | "long"): string {
  const date = parseIsoDate(iso);
  if (!date) return "";
  const names = month === "short" ? MONTHS_SHORT : MONTHS_LONG;
  return `${date.getUTCDate()} ${names[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "2026-09-10" -> "10 Sep 2026"; "" or unparseable -> "". */
export function formatDateShort(iso: string): string {
  return formatDate(iso, "short");
}

/** "2026-09-01" -> "1 September 2026"; "" or unparseable -> "". */
export function formatDateLong(iso: string): string {
  return formatDate(iso, "long");
}

/** First 4-digit run in the text, or "Undated". */
export function yearOf(text: string): string {
  const match = /\d{4}/.exec(text ?? "");
  return match ? match[0] : UNDATED;
}

export type YearGroup<T> = { year: string; items: T[] };

/** Groups items by key; years descending, "Undated" last; input order kept within a group. */
export function groupByYear<T>(items: T[], key: (item: T) => string): YearGroup<T>[] {
  const byYear = new Map<string, T[]>();
  for (const item of items) {
    const year = key(item);
    const bucket = byYear.get(year);
    if (bucket) bucket.push(item);
    else byYear.set(year, [item]);
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => {
      if (a === UNDATED) return 1;
      if (b === UNDATED) return -1;
      return b.localeCompare(a);
    })
    .map(([year, groupItems]) => ({ year, items: groupItems }));
}
