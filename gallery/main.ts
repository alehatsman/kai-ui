// The gallery page: toolbar wiring, tokens, and one row per demo with the
// HTML, React and Svelte renders side by side. Plain DOM — the page itself
// must not favour either framework.

import "../css/index.css"
import "./gallery.css"
import { createElement } from "react"
import { createRoot } from "react-dom/client"
import { mount } from "svelte"
import { attachCheckDropdown } from "../behavior/check-dropdown.ts"
import { attachDialog, syncDialog } from "../behavior/dialog.ts"
import { attachMenu } from "../behavior/menu.ts"
import { TOKENS, type TokenGroup } from "../contract/tokens.ts"
import { applyDensity, getTheme, isThemeId, setTheme } from "../theme/index.ts"
import { THEME_KEY } from "./config.ts"
import { HTML_DEMOS } from "./html.ts"
import { SECTIONS } from "./manifest.ts"
import { ReactDemo } from "./ReactDemo.tsx"
import SvelteDemo from "./SvelteDemo.svelte"

const VIEWS = ["all", "html", "react", "svelte"] as const
const FRAMEWORKS = ["html", "react", "svelte"] as const

const gallery = document.getElementById("gallery") as HTMLElement

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

const byPicker = <T extends HTMLElement>(name: string) =>
  document.querySelector<T>(`[data-picker="${name}"]`)

/** Wire a toolbar segmented control: is-active + aria-pressed follow `current`. */
function picker(name: string, current: string, onPick: (value: string) => void) {
  const group = byPicker(name)
  if (!group) return
  const buttons = [...group.querySelectorAll<HTMLButtonElement>("button")]
  const mark = (value: string) => {
    for (const b of buttons) {
      const on = b.getAttribute("data-value") === value
      b.classList.toggle("is-active", on)
      b.setAttribute("aria-pressed", String(on))
    }
  }
  mark(current)
  for (const b of buttons) {
    b.addEventListener("click", () => {
      const value = b.getAttribute("data-value") ?? ""
      mark(value)
      onPick(value)
    })
  }
}

// ── toolbar ────────────────────────────────────────────────────────────────
picker("theme", getTheme(THEME_KEY), (v) => {
  if (isThemeId(v)) setTheme(THEME_KEY, v)
  renderTokens()
})
picker("view", "all", (v) => {
  for (const view of VIEWS) gallery.classList.toggle(`gallery--view-${view}`, view === v)
})
gallery.classList.add("gallery--view-all")
byPicker<HTMLInputElement>("density")?.addEventListener("change", (e) => {
  applyDensity((e.target as HTMLInputElement).checked ? "touch" : "default")
})

// ── tokens ─────────────────────────────────────────────────────────────────
const COLOUR_GROUPS: TokenGroup[] = ["surface", "tone", "code", "series", "ansi"]
const tokenSection = el("section", "gallery__section")
tokenSection.id = "tokens"
const tokenBody = el("div", "gallery__tokens")
tokenSection.append(el("h2", "gallery__heading", "Tokens"), tokenBody)
gallery.append(tokenSection)

function renderTokens() {
  const css = getComputedStyle(document.documentElement)
  const read = (n: string) => css.getPropertyValue(n).trim()
  tokenBody.replaceChildren()
  for (const group of COLOUR_GROUPS) {
    tokenBody.append(el("h3", "gallery__sublabel", group))
    const grid = el("div", "token-grid")
    for (const name of TOKENS[group]) {
      const cell = el("div", "token")
      const swatch = el("span", "token__swatch")
      swatch.style.background = `var(${name})`
      cell.append(swatch, el("code", "token__name", name), el("span", "token__value", read(name)))
      grid.append(cell)
    }
    tokenBody.append(grid)
  }
  tokenBody.append(el("h3", "gallery__sublabel", "space · radius"))
  const sizes = el("div", "token-grid")
  for (const name of [...TOKENS.space, ...TOKENS.radius]) {
    const cell = el("div", "token")
    const sample = el("span", name.startsWith("--space") ? "token__bar" : "token__radius")
    if (name.startsWith("--space")) sample.style.width = `var(${name})`
    else sample.style.borderRadius = `var(${name})`
    cell.append(sample, el("code", "token__name", name), el("span", "token__value", read(name)))
    sizes.append(cell)
  }
  tokenBody.append(sizes)
  tokenBody.append(el("h3", "gallery__sublabel", "text"))
  for (const name of TOKENS.text) {
    const line = el("div", "token token--row")
    const sample = el("span", "token__type", "The quick brown fox")
    sample.style.fontSize = `var(${name})`
    line.append(el("code", "token__name", `${name} · ${read(name)}`), sample)
    tokenBody.append(line)
  }
}
renderTokens()
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderTokens)

// The HTML column wires its few interactive blocks the way a hand-written
// page would: behavior/ functions, no framework. A dialog opens from the
// button just before it; its × and ghost Cancel close it.
function wireHtml(cell: HTMLElement) {
  for (const root of cell.querySelectorAll<HTMLElement>(".menu")) attachMenu(root)
  for (const root of cell.querySelectorAll<HTMLElement>(".check-dropdown"))
    attachCheckDropdown(root)
  for (const dialog of cell.querySelectorAll<HTMLDialogElement>("dialog.modal")) {
    const set = (open: boolean) => syncDialog(dialog, open)
    attachDialog(dialog, () => set(false))
    dialog.previousElementSibling?.addEventListener("click", () => set(true))
    for (const close of dialog.querySelectorAll(".modal__close, .modal__foot .btn")) {
      if ((close as HTMLButtonElement).type !== "submit")
        close.addEventListener("click", () => set(false))
    }
  }
}

// ── demos ──────────────────────────────────────────────────────────────────
for (const section of SECTIONS) {
  const node = el("section", "gallery__section")
  node.id = section.id
  node.append(el("h2", "gallery__heading", section.title))
  const head = el("div", "demo demo--head")
  head.append(el("span", "demo__label"))
  for (const fw of FRAMEWORKS) head.append(el("span", `demo__cell demo__cell--${fw}`, fw))
  node.append(head)

  for (const demo of section.demos) {
    const row = el("div", "demo")
    row.setAttribute("data-demo", demo.id)
    const label = el("div", "demo__label", demo.label)
    label.append(el("code", "demo__id", demo.id))
    row.append(label)
    const cell = (fw: (typeof FRAMEWORKS)[number]) => {
      const target = el("div", `demo__cell demo__cell--${fw}`)
      target.setAttribute("data-fw", fw)
      row.append(target)
      return target
    }
    const cells = { html: cell("html"), react: cell("react"), svelte: cell("svelte") }
    cells.html.innerHTML = HTML_DEMOS[demo.id] ?? ""
    wireHtml(cells.html)
    createRoot(cells.react).render(createElement(ReactDemo, { id: demo.id }))
    mount(SvelteDemo, { target: cells.svelte, props: { id: demo.id } })
    node.append(row)
  }
  gallery.append(node)
}
