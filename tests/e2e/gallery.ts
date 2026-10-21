import { expect, type Page } from "@playwright/test"
import { SECTIONS } from "../../gallery/manifest.ts"

export const DEMO_IDS = SECTIONS.flatMap((s) => s.demos.map((d) => d.id))

/** Open the gallery and wait until every cell of every demo has rendered. */
export async function openGallery(page: Page): Promise<void> {
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(m.text())
  })
  await page.goto("/")
  await expect(page.locator("[data-demo]")).toHaveCount(DEMO_IDS.length)
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-demo] [data-fw]")].every((c) => c.childElementCount > 0)
  )
  expect(errors).toEqual([])
}
