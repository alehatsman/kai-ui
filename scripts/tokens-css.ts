// Reads css/tokens.css into { selector → { --name → value } }. Only as smart as
// that file's own shape: flat blocks, one `--name: value;` per declaration,
// one level of @media. Shared by the unit tests and the contrast check.

import { readFileSync } from "node:fs"

export const BASE = ":root"
export const OS_DARK = ":root:not([data-theme])"
export const theme = (id: string) => `:root[data-theme="${id}"]`

export type Decls = Record<string, string>

export function readTokenBlocks(
  path = new URL("../css/tokens.css", import.meta.url)
): Map<string, Decls> {
  const css = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
  const blocks = new Map<string, Decls>()
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = (m[1] ?? "").trim()
    const decls: Decls = {}
    for (const d of (m[2] ?? "").split(";")) {
      const i = d.indexOf(":")
      const name = d.slice(0, i).trim()
      if (i > 0 && name.startsWith("--")) decls[name] = d.slice(i + 1).trim()
    }
    blocks.set(selector, decls)
  }
  return blocks
}

/** Base tokens with a theme block laid over them; var() refs resolved. */
export function resolveTheme(blocks: Map<string, Decls>, selector: string): Decls {
  const merged: Decls = { ...blocks.get(BASE), ...(selector === BASE ? {} : blocks.get(selector)) }
  const resolve = (v: string, depth = 0): string =>
    depth > 8
      ? v
      : v.replace(/var\((--[\w-]+)\)/g, (_, n: string) => resolve(merged[n] ?? "", depth + 1))
  return Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, resolve(v)]))
}

type RGBA = [number, number, number, number]

export function parseColor(v: string): RGBA | null {
  const hex = /^#([0-9a-f]{6})$/i.exec(v)
  if (hex?.[1]) {
    const n = Number.parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1]
  }
  const rgb = /^rgb\((\d+) (\d+) (\d+)(?: \/ (\d+)%)?\)$/.exec(v)
  if (rgb)
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] ? Number(rgb[4]) / 100 : 1]
  return null
}

function over([r, g, b, a]: RGBA, [br, bg, bb]: RGBA): RGBA {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1]
}

function luminance([r, g, b]: RGBA): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast of fg over bg; a translucent bg is composited over `canvas` first. */
export function contrast(
  fg: string | undefined,
  bg: string | undefined,
  canvas: string | undefined
): number {
  const c = parseColor(canvas ?? "")
  const b = parseColor(bg ?? "")
  const f = parseColor(fg ?? "")
  if (!(c && b && f)) throw new Error(`unparsable colour: ${fg} / ${bg} / ${canvas}`)
  const back = over(b, c)
  const front = over(f, back)
  const [hi, lo] = [luminance(front), luminance(back)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}
