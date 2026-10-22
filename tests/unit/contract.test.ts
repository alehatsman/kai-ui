import assert from "node:assert/strict"
import { test } from "node:test"
import {
  checkOptions,
  checkSummary,
  countText,
  cssLength,
  ICONS,
  iconAttrs,
  iconSvg,
  initials,
  inRange,
  pageList,
  toggleSelection,
} from "../../contract/index.ts"

test("pageList: first, last, two either side, gaps collapsed", () => {
  assert.deepEqual(pageList(5, 12), [1, null, 3, 4, 5, 6, 7, null, 12])
  assert.deepEqual(pageList(1, 3), [1, 2, 3])
  assert.deepEqual(pageList(1, 10), [1, 2, 3, null, 10])
  assert.deepEqual(pageList(10, 10), [1, null, 8, 9, 10])
  assert.deepEqual(pageList(4, 7), [1, 2, 3, 4, 5, 6, 7])
})

test("initials: first and last word, upper-cased, ? for empty", () => {
  assert.equal(initials("Ada Lovelace"), "AL")
  assert.equal(initials("  grace  brewster murray hopper "), "GH")
  assert.equal(initials("linus"), "L")
  assert.equal(initials("   "), "?")
})

test("cssLength: number is px, string as given", () => {
  assert.equal(cssLength(12), "12px")
  assert.equal(cssLength("40%"), "40%")
  assert.equal(cssLength(undefined), undefined)
})

test("inRange: inclusive both ends, no range never matches", () => {
  assert.equal(inRange(43, [43, 44]), true)
  assert.equal(inRange(44, [43, 44]), true)
  assert.equal(inRange(42, [43, 44]), false)
  assert.equal(inRange(45, [43, 44]), false)
  assert.equal(inRange(1, undefined), false)
})

const OPTS = [
  { value: "ber", label: "Berlin", count: 1204 },
  { value: "ham", label: "Hamburg" },
  { value: "muc" },
]

test("checkOptions: unknown selected first, query matches label or value", () => {
  assert.deepEqual(
    checkOptions(OPTS, ["zzz"], "").map((o) => o.value),
    ["zzz", "ber", "ham", "muc"]
  )
  assert.deepEqual(
    checkOptions(OPTS, [], " HAM ").map((o) => o.value),
    ["ham"]
  )
  assert.deepEqual(
    checkOptions(OPTS, [], "mu").map((o) => o.value),
    ["muc"]
  )
  assert.deepEqual(checkOptions(OPTS, [], "nope"), [])
})

test("toggleSelection: add once, remove, single holds one", () => {
  assert.deepEqual(toggleSelection(["a"], "b", true), ["a", "b"])
  assert.deepEqual(toggleSelection(["a", "b"], "b", true), ["a", "b"])
  assert.deepEqual(toggleSelection(["a", "b"], "a", false), ["b"])
  assert.deepEqual(toggleSelection(["a"], "b", true, true), ["b"])
  assert.deepEqual(toggleSelection(["a"], "a", false, true), [])
})

test("checkSummary and countText", () => {
  assert.equal(checkSummary([], OPTS), "Any")
  assert.equal(checkSummary([], OPTS, "All sites"), "All sites")
  assert.equal(checkSummary(["ber"], OPTS), "Berlin")
  assert.equal(checkSummary(["zzz"], OPTS), "zzz")
  assert.equal(checkSummary(["ber", "ham"], OPTS), "2 selected")
  assert.equal(countText(1204), "1,204")
  assert.equal(countText(0), "")
  assert.equal(countText(undefined), "")
})

test("icons: every name has path data; attrs decorative unless labelled", () => {
  for (const [name, paths] of Object.entries(ICONS)) {
    assert.ok(paths.length > 0 && paths.every((d) => /^[Mm]/.test(d)), name)
  }
  assert.equal(iconAttrs()["aria-hidden"], "true")
  assert.equal(iconAttrs({ label: "Passed" }).role, "img")
  assert.equal(iconAttrs({ label: "Passed" })["aria-hidden"], undefined)
  const svg = iconSvg("check", { label: 'a "b" <c>', size: 24, className: "x" })
  assert.match(svg, /^<svg class="icon x" width="24" height="24" viewBox="0 0 16 16"/)
  assert.match(svg, /aria-label="a &quot;b&quot; &lt;c>"/)
  assert.match(svg, /<path d="M[^"]+"><\/path><\/svg>$/)
})
