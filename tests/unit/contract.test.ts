import assert from "node:assert/strict"
import { test } from "node:test"
import { cssLength, initials, inRange, pageList } from "../../contract/index.ts"

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
