import { expect, type Locator, type Page, test } from "@playwright/test"
import { openGallery } from "./gallery.ts"

// v0.4: CheckDropdown (layer 2 via behavior/check-dropdown.ts), Icon, DetailLayout.

const ALL = ["html", "react", "svelte"] as const
const BOUND = ["react", "svelte"] as const

const cell = (page: Page, demo: string, fw: string): Locator =>
  page.locator(`[data-demo="${demo}"] [data-fw="${fw}"]`)

test.beforeEach(async ({ page }) => {
  await openGallery(page)
})

for (const fw of ALL) {
  test(`${fw}: check-dropdown opens under its trigger, focuses search, Esc returns focus`, async ({
    page,
  }) => {
    const c = cell(page, "check-dropdown", fw)
    const trigger = c.locator(".check-dropdown__button")
    const panel = c.locator(".check-dropdown__panel")
    await expect(trigger).toHaveAccessibleName("Site 2 selected")
    await trigger.click()
    await expect(panel).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(panel.locator(".check-dropdown__search")).toBeFocused()
    const [t, p] = await Promise.all([trigger.boundingBox(), panel.boundingBox()])
    expect(p && t && p.y >= t.y + t.height).toBe(true)
    expect(p && t && p.width >= t.width - 0.5).toBe(true)
    await page.keyboard.press("Escape")
    await expect(panel).not.toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
  })
}

for (const fw of BOUND) {
  test(`${fw}: check-dropdown ticks, searches, Enter picks the sole match, clears`, async ({
    page,
  }) => {
    const c = cell(page, "check-dropdown", fw)
    const trigger = c.locator(".check-dropdown__button")
    const panel = c.locator(".check-dropdown__panel")
    await trigger.click()
    await panel.getByLabel("Hamburg").check()
    await expect(trigger).toHaveAccessibleName("Site 3 selected")
    await expect(panel).toBeVisible()

    const search = panel.locator(".check-dropdown__search")
    await search.fill("stutt")
    await expect(panel.locator(".check-dropdown__option")).toHaveCount(1)
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAccessibleName("Site 4 selected")
    await search.fill("zzz")
    await expect(panel.locator(".check-dropdown__none")).toHaveText("No match")

    // Native search: the first Esc clears the text, the second closes.
    await page.keyboard.press("Escape")
    await expect(search).toHaveValue("")
    await expect(panel).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(panel).not.toBeVisible()

    // Closing clears the query.
    await trigger.click()
    await search.fill("ham")
    await trigger.click()
    await expect(panel).not.toBeVisible()
    await trigger.click()
    await expect(search).toHaveValue("")
    await panel.getByRole("button", { name: "Clear" }).click()
    await expect(trigger).toHaveAccessibleName("Site Any")
    await expect(panel.getByRole("button", { name: "Clear" })).toHaveCount(0)
  })

  test(`${fw}: single check-dropdown — a pick closes, Any clears`, async ({ page }) => {
    const c = cell(page, "check-dropdown-single", fw)
    const trigger = c.locator(".check-dropdown__button")
    const panel = c.locator(".check-dropdown__panel")
    await trigger.click()
    await expect(panel.locator(".check-dropdown__search")).toHaveCount(0)
    await panel.getByLabel("BMW").check()
    await expect(panel).not.toBeVisible()
    await expect(trigger).toHaveAccessibleName("Make BMW")
    await trigger.click()
    await panel.getByLabel("Any").check()
    await expect(panel).not.toBeVisible()
    await expect(trigger).toHaveAccessibleName("Make Any")
  })

  test(`${fw}: required check-dropdown locks the last tick; no options = disabled`, async ({
    page,
  }) => {
    const c = cell(page, "check-dropdown-required", fw)
    const [site, model] = [
      c.locator(".check-dropdown").first(),
      c.locator(".check-dropdown").nth(1),
    ]
    await expect(model.locator(".check-dropdown__button")).toBeDisabled()
    await site.locator(".check-dropdown__button").click()
    const panel = site.locator(".check-dropdown__panel")
    await expect(panel.getByLabel("Hamburg")).toBeDisabled()
    await panel.getByLabel("Berlin").check()
    await expect(panel.getByLabel("Hamburg")).toBeEnabled()
    await expect(panel.getByRole("button", { name: "Clear" })).toHaveCount(0)
  })
}

for (const fw of ALL) {
  test(`${fw}: icons — labelled is an image, decorative is hidden, colour from text`, async ({
    page,
  }) => {
    const c = cell(page, "icon-labelled", fw)
    await expect(c.getByRole("img", { name: "Passed" })).toBeVisible()
    await expect(c.getByRole("img", { name: "Failed" })).toHaveAttribute("width", "24")
    await expect(c.locator("a svg")).toHaveAttribute("aria-hidden", "true")
    const [fill, colour] = await c
      .getByRole("img", { name: "Passed" })
      .evaluate((el) => [getComputedStyle(el).fill, getComputedStyle(el).color])
    expect(fill).toBe(colour)
  })

  test(`${fw}: detail-layout wraps the rail below when narrow, beside when wide`, async ({
    page,
  }) => {
    const c = cell(page, "detail-layout", fw)
    const main = c.locator(".detail-layout__main")
    const rail = c.locator(".sidebar")
    await expect(rail).toHaveAccessibleName("Details")
    const below = async () => {
      const [m, r] = await Promise.all([main.boundingBox(), rail.boundingBox()])
      return Boolean(m && r && r.y >= m.y + m.height)
    }
    expect(await below()).toBe(true) // three columns: each cell is narrow
    await page.setViewportSize({ width: 1600, height: 900 })
    await page
      .getByRole("button", { name: fw === "html" ? "HTML" : fw === "react" ? "React" : "Svelte" })
      .click()
    await expect.poll(below).toBe(false)
  })
}
