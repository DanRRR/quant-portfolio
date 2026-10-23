import { test } from "node:test";
import assert from "node:assert/strict";
import { parseInlineLinks } from "../src/lib/inline.ts";

test("plain text is a single text segment", () => {
  assert.deepEqual(parseInlineLinks("Managed society operations."), [
    { type: "text", text: "Managed society operations." },
  ]);
});

test("[text](url) becomes a link segment between text segments", () => {
  assert.deepEqual(
    parseInlineLinks("Won gold at the [Championships](https://a.example), sanctioned by [MTGB](https://b.example)."),
    [
      { type: "text", text: "Won gold at the " },
      { type: "link", text: "Championships", href: "https://a.example" },
      { type: "text", text: ", sanctioned by " },
      { type: "link", text: "MTGB", href: "https://b.example" },
      { type: "text", text: "." },
    ],
  );
});

test("link text may contain parentheses", () => {
  assert.deepEqual(parseInlineLinks("[Nationals (UK)](https://x.example)"), [
    { type: "link", text: "Nationals (UK)", href: "https://x.example" },
  ]);
});
