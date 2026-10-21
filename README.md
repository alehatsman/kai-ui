# kai-ui

The fleet's UI kit: tokens, BEM blocks, and thin React and Svelte bindings.
Two looks — GitHub (light/dark) and Monokai. Design and decisions: [SPEC.md](SPEC.md).
Rules it follows: [ts-quality docs/UI.md](https://github.com/alehatsman/ts-quality/blob/main/docs/UI.md).

## Use

```jsonc
// package.json
"kai-ui": "github:alehatsman/kai-ui#v0.1.0"
```

```css
/* app base stylesheet — kai-ui first, app blocks after */
@import "kai-ui/css";
```

```tsx
import { Button, Field, Input } from "kai-ui/react"
```

```svelte
<script lang="ts">
  import { Button, Field, Input } from "kai-ui/svelte"
</script>
```

Plain markup works too — most blocks need no JS: `<button class="btn btn--primary">`.
The few that do (dialog, menu, toast) take one call from `kai-ui/behavior`:
`attachMenu(root)`, `attachDialog(el, onClose)` + `syncDialog(el, open)`, `createToaster()`.

### Components

Button · Input · Select · Textarea · Field · Checkbox · Radio · Switch ·
SegmentedControl · Chip · Badge · StatusDot · Avatar · Card · Table · Stack ·
Inline · Toolbar · PageHeader · Tabs · Pagination · EmptyState · ErrorMessage ·
Banner · Spinner · Skeleton · DataState · Disclosure · Dialog · ConfirmDialog ·
Menu · Tooltip · ToastStack · CodeSnippet. All of them live in the gallery.

### Content

kai-ui styles rendered content; it never parses markdown or tokenises code.
Keep your renderer and highlighter, put kai-ui classes on their output:
`<div class="markdown-body">` around rendered markdown, `<pre class="code-block">`
for fenced code. highlight.js / lowlight `hljs-*` scopes take the theme's
`--hl-*` colours with no extra stylesheet.

### Themes

`data-theme` on `<html>`: absent = GitHub following the OS, `github-light`,
`github-dark`, `monokai`. `data-density="touch"` for 44px targets.
An app with a theme switcher inlines `bootstrapSnippet(key, fallback)` from
`kai-ui/theme` in `<head>` and calls `setTheme(key, id)`.

## Develop

```sh
npm install
npm run dev      # the gallery: every component, HTML | React | Svelte side by side
npm run check    # lint, types, unit, e2e
```

Adding a component: CSS block in `css/blocks/`, prop types in `contract/`,
a binding in `react/` and `svelte/`, a demo in all three gallery renderers
(`gallery/html.ts`, `ReactDemo.tsx`, `SvelteDemo.svelte`) + `manifest.ts`.
The parity test fails until the three agree.
