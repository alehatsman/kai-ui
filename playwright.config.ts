import { createHash } from "node:crypto"
import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig, devices } from "@playwright/test"

// Boots the gallery's Vite dev server and points Chromium at it. One port per
// checkout (5200-5299 from this directory's real path), as autolab: worktrees
// never share a server. PW_PORT overrides. A taken port fails loudly.
const checkout = realpathSync(fileURLToPath(new URL(".", import.meta.url)))
const checkoutPort = 5200 + (createHash("sha256").update(checkout).digest().readUInt32BE(0) % 100)
const { PW_PORT, CI } = process.env
const port = Number(PW_PORT ?? checkoutPort)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!CI,
  retries: CI ? 2 : 0,
  reporter: "list",
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --strictPort --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
  },
})
