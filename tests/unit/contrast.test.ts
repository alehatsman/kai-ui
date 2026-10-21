import assert from "node:assert/strict"
import { test } from "node:test"
import { BASE, contrast, readTokenBlocks, resolveTheme, theme } from "../../scripts/tokens-css.ts"

// Text/surface pairs blocks actually draw. AA body text: 4.5.
const PAIRS: [fg: string, bg: string][] = [
  ["--fg", "--bg"],
  ["--fg", "--bg-canvas"],
  ["--fg", "--bg-card"],
  ["--fg", "--control-bg"],
  ["--fg", "--control-bg-hover"],
  ["--fg", "--neutral-muted"],
  ["--fg", "--accent-muted"],
  ["--fg-muted", "--bg"],
  ["--fg-muted", "--bg-canvas"],
  ["--fg-muted", "--bg-card"],
  ["--accent", "--bg"],
  ["--accent", "--bg-card"],
  ["--accent", "--accent-muted"],
  ["--fg-on-emphasis", "--accent-emphasis"],
  ["--fg-on-emphasis", "--primary"],
  ["--fg-on-emphasis", "--primary-hover"],
  ["--code-fg", "--code-bg"],
  ...["success", "warning", "danger", "done"].flatMap((t): [string, string][] => [
    [`--tone-${t}`, `--tone-${t}-bg`],
    [`--tone-${t}`, "--bg"],
    [`--tone-${t}`, "--bg-card"],
    ["--fg", `--tone-${t}-bg`],
  ]),
]

const blocks = readTokenBlocks()
const THEMES: Record<string, string> = {
  "github-light": BASE,
  "github-dark": theme("github-dark"),
  monokai: theme("monokai"),
}

for (const [name, selector] of Object.entries(THEMES)) {
  test(`${name}: text pairs meet WCAG AA (4.5:1)`, () => {
    const t = resolveTheme(blocks, selector)
    const failures = PAIRS.map(([f, b]) => ({ f, b, ratio: contrast(t[f], t[b], t["--bg"]) }))
      .filter((p) => p.ratio < 4.5)
      .map((p) => `${p.f} on ${p.b}: ${p.ratio.toFixed(2)}`)
    assert.deepEqual(failures, [])
  })
}
