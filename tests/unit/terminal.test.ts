import assert from "node:assert/strict"
import { test } from "node:test"
import { BASE, type Decls, OS_DARK, readTokenBlocks, theme } from "../../scripts/tokens-css.ts"
import { terminalTheme } from "../../theme/terminal.ts"

// terminalTheme() reads computed tokens. Stand in for the browser with each
// theme's declarations from css/tokens.css (theme block over :root).

const blocks = readTokenBlocks()
const KEYS = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]

function themed(decls: Decls) {
  const g = globalThis as { getComputedStyle?: unknown }
  g.getComputedStyle = () => ({ getPropertyValue: (n: string) => decls[n] ?? "" })
  try {
    return terminalTheme({} as HTMLElement)
  } finally {
    Reflect.deleteProperty(g, "getComputedStyle")
  }
}

for (const selector of [BASE, OS_DARK, theme("monokai")]) {
  test(`terminalTheme under ${selector}: 21 colours, all from tokens`, () => {
    const decls = { ...blocks.get(BASE), ...blocks.get(selector) }
    const t = themed(decls)
    assert.equal(Object.keys(t).length, 21)
    for (const [k, v] of Object.entries(t)) assert.match(v, /^#[0-9a-f]{6}$/, k)
    assert.equal(t.background, decls["--code-bg"])
    assert.equal(t.cursor, decls["--fg"])
    for (const k of KEYS) {
      assert.equal(t[k as "red"], decls[`--ansi-${k}`])
      assert.equal(
        t[`bright${k[0]?.toUpperCase()}${k.slice(1)}` as "brightRed"],
        decls[`--ansi-bright-${k}`]
      )
    }
  })
}
