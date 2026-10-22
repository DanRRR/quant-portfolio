import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatDateShort,
  formatDateLong,
  yearOf,
  groupByYear,
} from "../src/lib/listing.ts";

test("formatDateShort renders d Mon yyyy and empty for bad input", () => {
  assert.equal(formatDateShort("2026-09-10"), "10 Sep 2026");
  assert.equal(formatDateShort("2026-09-01"), "1 Sep 2026");
  assert.equal(formatDateShort(""), "");
  assert.equal(formatDateShort("YYYY-MM-DD"), "");
});

test("formatDateLong renders d Month yyyy", () => {
  assert.equal(formatDateLong("2026-09-01"), "1 September 2026");
  assert.equal(formatDateLong(""), "");
});

test("yearOf finds the first 4-digit year or Undated", () => {
  assert.equal(yearOf("September 2026"), "2026");
  assert.equal(yearOf("2026-11-11"), "2026");
  assert.equal(yearOf("2026"), "2026");
  assert.equal(yearOf(""), "Undated");
  assert.equal(yearOf("May 2024"), "2024");
});

test("groupByYear orders years desc, Undated last, keeps item order", () => {
  const items = [{ p: "May 2024" }, { p: "Sep 2026" }, { p: "" }, { p: "Feb 2026" }];
  const g = groupByYear(items, (x) => yearOf(x.p));
  assert.deepEqual(
    g.map((x) => x.year),
    ["2026", "2024", "Undated"],
  );
  assert.deepEqual(
    g[0].items.map((x) => x.p),
    ["Sep 2026", "Feb 2026"],
  );
  assert.deepEqual(
    g[2].items.map((x) => x.p),
    [""],
  );
});
