import { expect, test } from "@playwright/test"
import { openGallery } from "./gallery.ts"

// Each theme state lands the right tokens on <body>, survives a reload (the
// inline bootstrap), and gets a full-page screenshot for review by eye
// (UI.md rule 29) under test-results/screens/.

const CASES = [
  { theme: "auto", scheme: "light", bg: "rgb(255, 255, 255)" },
  { theme: "auto", scheme: "dark", bg: "rgb(13, 17, 23)" },
  { theme: "github-light", scheme: "dark", bg: "rgb(255, 255, 255)" },
  { theme: "github-dark", scheme: "light", bg: "rgb(13, 17, 23)" },
  { theme: "monokai", scheme: "light", bg: "rgb(39, 40, 34)" },
] as const

for (const c of CASES) {
  test(`${c.theme} under OS ${c.scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: c.scheme, reducedMotion: "reduce" })
    await openGallery(page)
    await page
      .locator('[data-picker="theme"]')
      .getByRole("button", { name: themeLabel(c.theme) })
      .click()
    await page.reload()
    await openGallery(page)
    const attr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"))
    expect(attr).toBe(c.theme === "auto" ? null : c.theme)
    await expect(page.locator("body")).toHaveCSS("background-color", c.bg)
    await page.screenshot({
      path: `test-results/screens/${c.theme}-${c.scheme}.png`,
      fullPage: true,
    })
  })
}

test("touch density raises control height to 44px", async ({ page }) => {
  await openGallery(page)
  const btn = page.locator('[data-demo="btn-variants"] [data-fw="html"] .btn').first()
  await expect(btn).toHaveCSS("min-height", "32px")
  await page.getByLabel("Touch density").check()
  await expect(btn).toHaveCSS("min-height", "44px")
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: "test-results/screens/touch-phone.png", fullPage: true })
})

function themeLabel(theme: string): string {
  return (
    {
      auto: "Auto",
      "github-light": "GitHub light",
      "github-dark": "GitHub dark",
      monokai: "Monokai",
    }[theme] ?? theme
  )
}
