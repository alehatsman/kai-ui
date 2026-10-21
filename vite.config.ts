import { svelte } from "@sveltejs/vite-plugin-svelte"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { THEME_KEY } from "./gallery/config.ts"
import { bootstrapSnippet } from "./theme/index.ts"

// The gallery dogfoods the theme bootstrap: the same snippet an app inlines
// into its index.html, applied before first paint.
function themeBootstrap(): Plugin {
  return {
    name: "kai-ui-theme-bootstrap",
    transformIndexHtml: (html) =>
      html.replace(
        "<!-- kai-ui:theme-bootstrap -->",
        `<script>${bootstrapSnippet(THEME_KEY)}</script>`
      ),
  }
}

export default defineConfig({
  root: "gallery",
  plugins: [react({ include: /\.tsx$/ }), svelte(), themeBootstrap()],
  build: { outDir: "../dist/gallery", emptyOutDir: true },
})
