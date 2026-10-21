import assert from "node:assert/strict"
import { beforeEach, test } from "node:test"
import {
  applyTheme,
  bootstrapSnippet,
  getTheme,
  setTheme,
  type ThemeId,
} from "../../theme/index.ts"

// A minimal <html> + localStorage: enough for theme/ and the inline snippet.
class FakeRoot {
  attrs = new Map<string, string>()
  setAttribute(k: string, v: string) {
    this.attrs.set(k, v)
  }
  removeAttribute(k: string) {
    this.attrs.delete(k)
  }
}
let store: Map<string, string>
let throwing = false
const root = new FakeRoot()
Object.assign(globalThis, {
  document: { documentElement: root },
  localStorage: {
    getItem: (k: string) => {
      if (throwing) throw new Error("denied")
      return store.get(k) ?? null
    },
    setItem: (k: string, v: string) => {
      if (throwing) throw new Error("denied")
      store.set(k, v)
    },
  },
})

beforeEach(() => {
  store = new Map()
  throwing = false
  root.attrs.clear()
})

const KEY = "app:theme"
const runSnippet = (fallback: ThemeId) => new Function(bootstrapSnippet(KEY, fallback))()

const CASES: {
  stored: string | null
  fallback: ThemeId
  throws?: boolean
  want: string | undefined
}[] = [
  { stored: null, fallback: "auto", want: undefined },
  { stored: null, fallback: "monokai", want: "monokai" },
  { stored: "github-dark", fallback: "monokai", want: "github-dark" },
  { stored: "auto", fallback: "monokai", want: undefined },
  { stored: "bogus", fallback: "github-light", want: "github-light" },
  { stored: "monokai", fallback: "auto", throws: true, want: undefined },
]

for (const c of CASES) {
  test(`stored=${c.stored} fallback=${c.fallback}${c.throws ? " (storage throws)" : ""} → ${c.want ?? "none"}`, () => {
    if (c.stored !== null) store.set(KEY, c.stored)
    throwing = c.throws ?? false
    applyTheme(getTheme(KEY, c.fallback))
    const viaModule = root.attrs.get("data-theme")
    root.attrs.clear()
    runSnippet(c.fallback)
    assert.equal(viaModule, c.want)
    assert.equal(root.attrs.get("data-theme"), c.want)
  })
}

test("setTheme persists and applies; survives throwing storage", () => {
  setTheme(KEY, "monokai")
  assert.equal(store.get(KEY), "monokai")
  assert.equal(root.attrs.get("data-theme"), "monokai")
  throwing = true
  setTheme(KEY, "auto")
  assert.equal(root.attrs.has("data-theme"), false)
})
