import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

// A git-tag install ships only `files`. Everything an export points at, and
// every relative import inside what ships, must stay inside them.

const root = new URL("../..", import.meta.url).pathname
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  files: string[]
  exports: Record<string, string | Record<string, string>>
}
const shipped = new Set(pkg.files)
const topDir = (path: string) => path.replace(/^\.\//, "").split("/")[0] ?? ""

test("every export target is in files", () => {
  for (const [key, target] of Object.entries(pkg.exports)) {
    for (const t of typeof target === "string" ? [target] : Object.values(target)) {
      assert.ok(shipped.has(topDir(t)), `${key} → ${t}`)
    }
  }
})

test("shipped sources import only shipped directories", () => {
  for (const dir of shipped) {
    for (const file of readdirSync(join(root, dir), { recursive: true }) as string[]) {
      if (!/\.(ts|tsx|svelte|css)$/.test(file)) continue
      const src = readFileSync(join(root, dir, file), "utf8")
      for (const m of src.matchAll(/(?:from |import |@import )["'](\.\.?\/[^"']+)["']/g)) {
        const spec = m[1] ?? ""
        const resolved = join(dir, file, "..", spec).replace(/\\/g, "/")
        assert.ok(shipped.has(topDir(resolved)), `${dir}/${file} imports ${spec}`)
      }
    }
  }
})
