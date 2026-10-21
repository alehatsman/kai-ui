import assert from "node:assert/strict"
import { test } from "node:test"
import { ALL_TOKENS, THEMED } from "../../contract/tokens.ts"
import { BASE, OS_DARK, readTokenBlocks, theme } from "../../scripts/tokens-css.ts"

const blocks = readTokenBlocks()
const sorted = (xs: Iterable<string>) => [...xs].sort()

test(":root defines exactly the registry", () => {
  assert.deepEqual(sorted(Object.keys(blocks.get(BASE) ?? {})), sorted(ALL_TOKENS))
})

for (const selector of [OS_DARK, theme("github-dark"), theme("monokai")]) {
  test(`${selector} overrides exactly the themed set`, () => {
    assert.deepEqual(sorted(Object.keys(blocks.get(selector) ?? {})), sorted(THEMED))
  })
}

test("OS-dark block equals github-dark", () => {
  assert.deepEqual(blocks.get(OS_DARK), blocks.get(theme("github-dark")))
})

test("github-light adds no tokens (it is :root)", () => {
  assert.deepEqual(blocks.get(theme("github-light")), {})
})
