export type Heading = { id: string; label: string };

/** Remove inline markdown/math markers, leaving plain words. */
function stripInline(text: string): string {
  return text
    .replace(/\$[^$]*\$/g, (m) => m.slice(1, -1)) // $x$ -> x
    .replace(/`([^`]*)`/g, "$1") // `code` -> code
    .replace(/\*\*([^*]*)\*\*/g, "$1") // **bold** -> bold
    .replace(/\*([^*]*)\*/g, "$1") // *em* -> em
    .replace(/__([^_]*)__/g, "$1")
    .replace(/_([^_]*)_/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/\s+/g, " ")
    .trim();
}

/** Lowercase, markers stripped, non-alphanumerics collapsed to "-", trimmed of dashes. */
export function slugify(text: string): string {
  return stripInline(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Hands out "slug", then "slug-2", "slug-3", … for repeated slugs. */
function makeUniqueSlugs(): (slug: string) => string {
  const seen = new Map<string, number>();
  return (slug) => {
    const count = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, count);
    return count === 1 ? slug : `${slug}-${count}`;
  };
}

/**
 * Top-level `#` and `##` lines outside fenced code blocks, in order.
 * `#` is treated as `##` (the renderer demotes body h1s the same way).
 */
export function extractHeadings(markdown: string): Heading[] {
  const unique = makeUniqueSlugs();
  const out: Heading[] = [];
  let inFence = false;
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (/^(```|~~~)/.test(line.trimStart())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,2})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const label = stripInline(match[2]);
    out.push({ id: unique(slugify(label)), label });
  }
  return out;
}

type Node = {
  type: string;
  depth?: number;
  value?: string;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown>; [key: string]: unknown };
};

function textOf(node: Node): string {
  if (node.type === "text" || node.type === "inlineCode" || node.type === "inlineMath") {
    return node.value ?? "";
  }
  return (node.children ?? []).map(textOf).join("");
}

/**
 * Remark plugin: demote top-level h1 to h2, and give every h2 an id that
 * matches what `extractHeadings` produces for the same source.
 */
export function remarkSectionHeadings() {
  return (tree: Node) => {
    const unique = makeUniqueSlugs();
    for (const node of tree.children ?? []) {
      if (node.type !== "heading") continue;
      if (node.depth === 1) node.depth = 2;
      if (node.depth !== 2) continue;
      const id = unique(slugify(textOf(node)));
      node.data = node.data ?? {};
      node.data.hProperties = { ...(node.data.hProperties ?? {}), id };
    }
  };
}
