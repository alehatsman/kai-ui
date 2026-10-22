import { expect, test } from "@playwright/test"
import { DEMO_IDS, openGallery } from "./gallery.ts"

// Layer 1 is the contract: for every demo, the React and Svelte bindings must
// produce the same DOM as the hand-written HTML. Compared per element: tag,
// attributes, own text, live checked/value. Generated ids differ by framework,
// so id/for/aria-describedby/aria-labelledby/popovertarget/aria-controls are renamed in order
// of first appearance; radio
// `name` differs per cell so the three groups stay independent.

type Fw = "html" | "react" | "svelte"

interface Node {
  tag: string
  /** [name, value] pairs, sorted: attribute order is not part of the contract. */
  attrs: [string, string][]
  text: string
  live?: { checked: boolean; value: string }
  children: Node[]
}

test("HTML, React and Svelte render the same DOM for every demo", async ({ page }) => {
  await openGallery(page)
  const trees = await page.evaluate(collectTrees)

  for (const id of DEMO_IDS) {
    const t = trees[id]
    expect(t?.html.length, `${id}: html renders`).toBeGreaterThan(0)
    expect.soft(t?.react, `${id}: react ≠ html`).toEqual(t?.html)
    expect.soft(t?.svelte, `${id}: svelte ≠ html`).toEqual(t?.html)
  }
})

test("bindings are live: segmented and radio follow clicks", async ({ page }) => {
  await openGallery(page)
  for (const fw of ["react", "svelte"]) {
    const seg = page.locator(`[data-demo="segmented"] [data-fw="${fw}"]`)
    await seg.getByRole("button", { name: "Day" }).click()
    await expect(seg.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "true")
    await expect(seg.getByRole("button", { name: "Day" })).toHaveClass(/is-active/)
    await expect(seg.getByRole("button", { name: "Week" })).toHaveAttribute("aria-pressed", "false")

    const radios = page.locator(`[data-demo="radio"] [data-fw="${fw}"]`)
    await radios.getByLabel("Pro").check()
    await expect(radios.getByLabel("Pro")).toBeChecked()
    await expect(radios.getByLabel("Free")).not.toBeChecked()
  }
})

/** Runs in the page: every demo's cells, normalised. Self-contained — Playwright serialises it. */
function collectTrees(): Record<string, Record<Fw, Node[]>> {
  const SKIP = new Set(["value", "checked", "style"])
  // One attribute's comparable value, or null to skip it.
  function attrValue(el: Element, a: Attr, ref: (v: string) => string): string | null {
    if (SKIP.has(a.name)) return null
    if (a.name === "class") return el.classList.length ? [...el.classList].sort().join(" ") : null
    if (["id", "for", "popovertarget", "aria-controls"].includes(a.name)) return ref(a.value)
    if (a.name === "aria-describedby" || a.name === "aria-labelledby")
      return a.value.split(/\s+/).map(ref).join(" ")
    if (a.name === "name" && el instanceof HTMLInputElement && el.type === "radio") return "group"
    return a.value
  }
  function ownText(el: Element): string {
    return [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join("")
      .replace(/\s+/g, " ")
      .trim()
  }
  function normalise(cell: Element): Node[] {
    const ids = new Map<string, string>()
    const ref = (v: string) => {
      if (!ids.has(v)) ids.set(v, `id${ids.size}`)
      return ids.get(v) as string
    }
    const walk = (el: Element): Node => {
      const attrs: [string, string][] = []
      for (const a of el.attributes) {
        const value = attrValue(el, a, ref)
        if (value !== null) attrs.push([a.name, value])
      }
      attrs.sort(([x], [y]) => x.localeCompare(y))
      const node: Node = {
        tag: el.tagName.toLowerCase(),
        attrs,
        text: ownText(el),
        children: [...el.children].map(walk),
      }
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        node.live = { checked: el instanceof HTMLInputElement && el.checked, value: el.value }
      }
      return node
    }
    return [...cell.children].map(walk)
  }
  const out: Record<string, Record<Fw, Node[]>> = {}
  for (const row of document.querySelectorAll("[data-demo]")) {
    const byFw: Record<Fw, Node[]> = { html: [], react: [], svelte: [] }
    for (const cell of row.querySelectorAll("[data-fw]")) {
      byFw[cell.getAttribute("data-fw") as Fw] = normalise(cell)
    }
    out[row.getAttribute("data-demo") as string] = byFw
  }
  return out
}
