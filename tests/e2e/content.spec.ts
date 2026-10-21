import { expect, test } from "@playwright/test"
import { openGallery } from "./gallery.ts"

// v0.3 content blocks: the CSS promises the parity test cannot see.

const ALL = ["html", "react", "svelte"] as const

test.beforeEach(async ({ page }) => {
  await openGallery(page)
})

for (const fw of ALL) {
  test(`${fw}: code-snippet numbers from startLine, tints the focus range`, async ({ page }) => {
    const rows = page.locator(`[data-demo="code-snippet"] [data-fw="${fw}"] .code-line`)
    await expect(rows).toHaveCount(8)
    const first = rows.first().locator(".code-line__num")
    const num = await first.evaluate((el) => getComputedStyle(el, "::before").content)
    expect(num).toBe('"41"')
    // The number is generated content: selecting the code never copies it.
    await expect(first).toHaveText("")
    await expect(rows.nth(2)).toHaveClass(/is-focus/)
    await expect(rows.nth(3)).toHaveClass(/is-focus/)
    await expect(
      page.locator(`[data-demo="code-snippet"] [data-fw="${fw}"] .is-focus`)
    ).toHaveCount(2)
  })

  test(`${fw}: highlighted runs take --hl-* colours; an empty line keeps its height`, async ({
    page,
  }) => {
    const c = page.locator(`[data-demo="code-snippet-hl"] [data-fw="${fw}"]`)
    const colour = (sel: string) =>
      c
        .locator(sel)
        .first()
        .evaluate((el) => getComputedStyle(el).color)
    const hl = await page.evaluate(() => {
      const probe = document.createElement("span")
      document.body.append(probe)
      const read = (v: string) => {
        probe.style.color = `var(${v})`
        return getComputedStyle(probe).color
      }
      const out = { keyword: read("--hl-keyword"), comment: read("--hl-comment") }
      probe.remove()
      return out
    })
    expect(await colour(".hljs-keyword")).toBe(hl.keyword)
    expect(await colour(".hljs-comment")).toBe(hl.comment)
    const empty = c.locator(".code-line").nth(3)
    await expect(empty.locator(".code-line__text")).toHaveText("")
    expect((await empty.boundingBox())?.height).toBe(20)
  })

  test(`${fw}: markdown body — inline code filled, fenced code not, wide table stays inside`, async ({
    page,
  }) => {
    const md = page.locator(`[data-demo="markdown"] [data-fw="${fw}"] .markdown-body`)
    const bg = (sel: string) =>
      md
        .locator(sel)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(await bg("p code")).not.toBe("rgba(0, 0, 0, 0)")
    expect(await bg("pre code")).toBe("rgba(0, 0, 0, 0)")
    // The body stays inside its (flex) cell; table and fenced block stay inside the body.
    const cell = page.locator(`[data-demo="markdown"] [data-fw="${fw}"]`)
    const right = async (l: typeof md) => {
      const b = await l.boundingBox()
      return (b?.x ?? 0) + (b?.width ?? 0)
    }
    expect(await right(md)).toBeLessThanOrEqual((await right(cell)) + 0.5)
    expect(await right(md.locator("table"))).toBeLessThanOrEqual((await right(md)) + 0.5)
    expect(await right(md.locator("pre"))).toBeLessThanOrEqual((await right(md)) + 0.5)
  })
}
