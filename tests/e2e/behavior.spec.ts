import { expect, type Locator, type Page, test } from "@playwright/test"
import { openGallery } from "./gallery.ts"

// Layer 2 in a real browser: every interactive v0.2 block, driven the same way
// in each column. HTML runs on behavior/ alone; React and Svelte through their
// bindings. Same assertions for all three.

const ALL = ["html", "react", "svelte"] as const
const BOUND = ["react", "svelte"] as const

const cell = (page: Page, demo: string, fw: string): Locator =>
  page.locator(`[data-demo="${demo}"] [data-fw="${fw}"]`)

test.beforeEach(async ({ page }) => {
  await openGallery(page)
})

for (const fw of ALL) {
  test(`${fw}: dialog opens, and Esc, ×, Cancel each close it`, async ({ page }) => {
    const c = cell(page, "dialog", fw)
    const dialog = c.locator("dialog")
    const open = c.getByRole("button", { name: "Open dialog" })
    await expect(dialog).not.toBeVisible()

    await open.click()
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: "Rename dashboard" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()

    await open.click()
    await dialog.getByRole("button", { name: "Close" }).click()
    await expect(dialog).not.toBeVisible()

    await open.click()
    await dialog.getByRole("button", { name: "Cancel" }).click()
    await expect(dialog).not.toBeVisible()

    // Reopens after every way of closing: the parent's state never drifted.
    await open.click()
    await expect(dialog).toBeVisible()
  })

  test(`${fw}: dialog closes on backdrop click, not on a click inside`, async ({ page }) => {
    const c = cell(page, "dialog", fw)
    const dialog = c.locator("dialog")
    await c.getByRole("button", { name: "Open dialog" }).click()
    await dialog.getByLabel("Name").click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog).not.toBeVisible()
  })

  test(`${fw}: menu opens, roves with arrows, Esc returns focus`, async ({ page }) => {
    const c = cell(page, "menu", fw)
    const trigger = c.getByRole("button", { name: "Actions" })
    const menu = c.getByRole("menu")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    await trigger.click()
    await expect(menu).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(menu.getByRole("menuitem", { name: "Duplicate" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(menu.getByRole("menuitem", { name: "Export CSV" })).toBeFocused()
    // Delete is disabled: ArrowDown wraps past it.
    await page.keyboard.press("ArrowDown")
    await expect(menu.getByRole("menuitem", { name: "Duplicate" })).toBeFocused()
    await page.keyboard.press("End")
    await expect(menu.getByRole("menuitem", { name: "Export CSV" })).toBeFocused()

    await page.keyboard.press("Escape")
    await expect(menu).not.toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
  })

  test(`${fw}: menu sits under its trigger and closes on choose`, async ({ page }) => {
    const c = cell(page, "menu", fw)
    const trigger = c.getByRole("button", { name: "Actions" })
    await trigger.click()
    const t = await trigger.boundingBox()
    const m = await c.getByRole("menu").boundingBox()
    expect(m && t && Math.abs(m.y - (t.y + t.height)) <= 6).toBe(true)
    expect(m && t && Math.abs(m.x - t.x) <= 1).toBe(true)
    await c.getByRole("menuitem", { name: "Duplicate" }).click()
    await expect(c.getByRole("menu")).not.toBeVisible()
  })

  test(`${fw}: tooltip shows on focus`, async ({ page }) => {
    const c = cell(page, "tooltip", fw)
    const tip = c.getByRole("tooltip", { name: "Copy to clipboard" })
    await expect(tip).not.toBeVisible()
    await c.getByRole("button", { name: "Copy" }).focus()
    await expect(tip).toBeVisible()
    await expect(c.getByRole("button", { name: "Copy" })).toHaveAccessibleDescription(
      "Copy to clipboard"
    )
  })
}

for (const fw of BOUND) {
  test(`${fw}: pick-one menu marks the choice`, async ({ page }) => {
    const c = cell(page, "menu-radio", fw)
    await c.getByRole("button", { name: "Theme" }).click()
    await c.getByRole("menuitemradio", { name: "GitHub" }).click()
    await c.getByRole("button", { name: "Theme" }).click()
    await expect(c.getByRole("menuitemradio", { name: "GitHub" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    await expect(c.getByRole("menuitemradio", { name: "Monokai" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  test(`${fw}: confirm dialog confirms and closes`, async ({ page }) => {
    const c = cell(page, "confirm-dialog", fw)
    await c.getByRole("button", { name: "Delete…" }).click()
    const dialog = c.locator("dialog")
    await expect(dialog).toBeVisible()
    await dialog.getByRole("button", { name: "Delete", exact: true }).click()
    await expect(dialog).not.toBeVisible()
  })

  test(`${fw}: dialog submit closes through onSubmit`, async ({ page }) => {
    const c = cell(page, "dialog", fw)
    await c.getByRole("button", { name: "Open dialog" }).click()
    await c.locator("dialog").getByLabel("Name").fill("Net worth")
    await page.keyboard.press("Enter")
    await expect(c.locator("dialog")).not.toBeVisible()
  })

  test(`${fw}: toasts push, stack, announce danger, dismiss`, async ({ page }) => {
    const c = cell(page, "toast", fw)
    const stack = c.locator(".toast-stack")
    await expect(stack.locator(".toast")).toHaveCount(1)
    await c.getByRole("button", { name: "Danger" }).click()
    await expect(stack.locator(".toast")).toHaveCount(2)
    await expect(stack.getByRole("alert")).toHaveText(/Import failed\./)
    await stack.getByRole("alert").getByRole("button", { name: "Dismiss" }).click()
    await expect(stack.locator(".toast")).toHaveCount(1)
  })

  test(`${fw}: pagination moves the current page`, async ({ page }) => {
    const c = cell(page, "pagination", fw)
    await c.getByRole("button", { name: "Next" }).click()
    await expect(c.getByRole("button", { name: "6" })).toHaveAttribute("aria-current", "page")
    await c.getByRole("button", { name: "12" }).click()
    await expect(c.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  test(`${fw}: chip toggles, banner dismisses`, async ({ page }) => {
    const closed = cell(page, "toolbar", fw).getByRole("checkbox", { name: /Closed/ })
    await expect(closed).not.toBeChecked()
    await closed.check()
    await expect(closed).toBeChecked()
    const b = cell(page, "banner-dismiss", fw)
    await b.getByRole("button", { name: "Dismiss" }).click()
    await expect(b.getByRole("status")).toHaveCount(0)
  })
}
