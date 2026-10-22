import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  extractHeadings,
  remarkSectionHeadings,
} from "../src/lib/headings.ts";

test("slugify strips markdown and math markers", () => {
  assert.equal(slugify("What **breaks** the `conclusion` $x$"), "what-breaks-the-conclusion-x");
  assert.equal(slugify("  Core idea  "), "core-idea");
  assert.equal(slugify("FEB-RN: Compute & Complexity"), "feb-rn-compute-complexity");
});

test("extractHeadings demotes h1, skips h3+, skips code fences, dedupes", () => {
  const md = [
    "# Summary",
    "",
    "text",
    "",
    "```python",
    "# not a heading",
    "## nor this",
    "```",
    "",
    "## Core idea",
    "",
    "### sub",
    "",
    "## Core idea",
    "",
  ].join("\n");
  assert.deepEqual(extractHeadings(md), [
    { id: "summary", label: "Summary" },
    { id: "core-idea", label: "Core idea" },
    { id: "core-idea-2", label: "Core idea" },
  ]);
});

test("extractHeadings cleans inline markdown in labels", () => {
  assert.deepEqual(extractHeadings("## What **breaks** the `conclusion`\n"), [
    { id: "what-breaks-the-conclusion", label: "What breaks the conclusion" },
  ]);
});

test("extractHeadings returns [] when there are no headings", () => {
  assert.deepEqual(extractHeadings("just a paragraph\n\nand another"), []);
});

test("remarkSectionHeadings demotes h1 and assigns ids matching extractHeadings", () => {
  const tree = {
    type: "root",
    children: [
      { type: "heading", depth: 1, children: [{ type: "text", value: "Summary" }] },
      { type: "heading", depth: 2, children: [{ type: "text", value: "Core idea" }] },
      { type: "heading", depth: 2, children: [{ type: "text", value: "Core idea" }] },
      { type: "heading", depth: 3, children: [{ type: "text", value: "sub" }] },
      { type: "paragraph", children: [{ type: "text", value: "body" }] },
    ],
  };
  remarkSectionHeadings()(tree as never);
  const headings = tree.children.filter((n) => n.type === "heading") as Array<{
    depth: number;
    data?: { hProperties?: { id?: string } };
  }>;
  assert.deepEqual(
    headings.map((h) => [h.depth, h.data?.hProperties?.id]),
    [
      [2, "summary"],
      [2, "core-idea"],
      [2, "core-idea-2"],
      [3, undefined],
    ],
  );
});
