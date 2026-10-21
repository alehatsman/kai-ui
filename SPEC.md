# kai-ui — spec

Status: v0.1 core + v0.2 more implemented (branches feat/v0.1-core, feat/v0.2-more). Date: 2026-10-21.

## 1. Goal

One look, one vocabulary, across the fleet's web UIs. Monokai + GitHub themes.
Consumed by Svelte 5 and React 19 apps without either framework owning it.

Consumers (surveyed 2026-10-21):

| App | Stack | Today | Migration weight |
|---|---|---|---|
| codefort | React 19 | Origin of tokens + Monokai, 46 primitives in `src/ui/` | Medium — rename classes (§6.2), drop local `ui/` copies |
| autolab | React 19 | Port of codefort `@/ui`, BEM-fixed names | Low — closest to kai-ui already |
| money | Svelte 5 | Own warm palette, no `ui/` yet | Medium — visual redesign, adopt blocks |
| teleport | Svelte 5 + Tauri | Violet/gradient/glow, dark only, mobile-first | Medium — restyle, keep touch via density (§4.4) |

## 2. Scope

In: design tokens and themes, base stylesheet, framework-free BEM blocks,
thin React and Svelte bindings over those blocks, a theme bootstrap, one
gallery page with React/Svelte parity tests.

Out: routing, data fetching, state, icons library, charts, domain components
(money Grid/PanelFrame, teleport KeyBar/swipe rows, codefort DiffView/Comment).
Those stay in apps (UI.md rule 12/24).

## 3. Architecture — three layers

```
kai-ui/
  css/           layer 1 — framework-free. THE product.
    tokens.css     :root tokens + themes
    base.css       reset, focus ring, reduced motion, sr-only, scrollbars
    blocks/*.css   one BEM block per file (btn.css, badge.css, …)
    index.css      @imports all of the above in order
  contract/      shared TS: prop types both bindings implement (Tone, Size, ButtonProps…)
  theme/         vanilla TS: getTheme/setTheme/applyTheme + inline bootstrap snippet
  react/         layer 3a — thin .tsx bindings, clsx for class composition
  svelte/        layer 3b — thin .svelte bindings, class: directive
  gallery/       Vite app, both frameworks, one page (§7)
```

Layer 2 is "use the platform": `<dialog>`, `<details>`, `popover`, CSS-only
tooltip. No JS behavior library. Where JS is unavoidable (toast queue, menu
dismiss) it is a small vanilla module in `theme/`-style plain TS, wrapped by
each binding.

Rules:
- A binding owns markup + class composition only. No fetching, no router, no
  domain enums (UI.md rule 24).
- A CSS block works with hand-written markup. Bindings are convenience, not a
  requirement — a consumer may write `<button class="btn btn--primary">`.
- Every binding component takes `class`/`className` and spreads native props.
- Router-agnostic: link-like components render `<a href>`; React takes
  `as`, Svelte takes a snippet, for router links.

Rejected: web components (shadow DOM breaks the BEM/test-selector contract,
UI.md rule 1); compile-to-both tools (magic, a dependency); one framework only.

## 4. Tokens and themes

### 4.1 Names

Base set = the 49 names codefort and autolab already share, plus:

- Semantic tones (replace codefort `--state-*` and teleport/money ad-hoc pairs):
  `--tone-{success,warning,danger,done}` and `-bg` for each. Accent and
  neutral reuse `--accent`/`--accent-muted` and `--fg-muted`/`--neutral-muted`.
  `done` = GitHub purple / Monokai purple. Apps map domain → tone at call site.
- `--primary`, `--primary-hover`, `--fg-on-emphasis` (from autolab), plus
  `--accent-emphasis` — the filled-accent surface (segmented active, switch on).
  GitHub dark needs it darker than text accent to keep white text at AA.
- `--text-control`: font size inside inputs (touch density sets 16px).
- `--control-h` 32px, `--control-h-sm` 26px (from autolab).
- `--hl-*` (9) + `--code-bg/-fg/-line-hl` (from codefort).
- `--series-1..8` chart palette per theme (for money's Plot; not used by blocks).
- `--z-{dropdown,overlay,toast}`, `--content-max`.

Dropped: `--state-*` (domain), `--color-folder` (codefort-local),
`--stage*` (autolab-local), money `--s*` (→ `--series-*`).

`css/tokens.css` is the single source; `contract/tokens.ts` lists every name
and a test fails if they diverge (autolab `tokens.ts` precedent).

### 4.2 Themes

| `data-theme` on `<html>` | Renders |
|---|---|
| absent | GitHub, light/dark follows OS (`prefers-color-scheme`) |
| `github-light` | GitHub light, forced |
| `github-dark` | GitHub dark, forced |
| `monokai` | Monokai, always dark |

Values: GitHub = codefort `styles.css:8-140`; Monokai = codefort
`styles.css:155-205`. Each block sets `color-scheme` accordingly.

### 4.3 Theme bootstrap

`kai-ui/theme`: `getTheme(key)`, `setTheme(key, id)`, `applyTheme(id)`, and
`bootstrapSnippet(key, default)` — a string the app inlines into
`index.html` `<head>` to apply before first paint. Storage key is per app
(`codefort:theme`). localStorage access wrapped in try/catch. Apps that never
offer a switcher (autolab, money) skip it and get OS-following GitHub.

### 4.4 Density

`[data-density="touch"]` on `<html>` raises `--control-h` to 44px, bumps
input font to 16px (iOS no-zoom). Teleport sets it under `(pointer: coarse)`.

## 5. Component list

### v0.1 core

| Component | Block | Props (shared contract) | Source |
|---|---|---|---|
| Button | `btn` | `variant: default\|primary\|ghost\|danger`, `size: md\|small` | codefort/autolab |
| Input / Textarea / Select | `input` `textarea` `select` | native + `invalid` | autolab |
| Field | `field` | `label, hint, error, id` + slot giving `{controlId, describedBy}` | autolab |
| Checkbox / Radio / Switch | `checkbox` `radio` `switch` | `label` + native | autolab |
| SegmentedControl | `segmented` | `options, value, onChange, label` | codefort |
| Badge | `badge` | `tone` | autolab |
| StatusDot | `status` + `dot` | `tone, pulse, label, showLabel` (sr-only twin) | teleport/money |
| Card | `card` | `padded, selected` | codefort |
| Table | `data-table` | `fit, wrap`; Head `num`; Row `muted`; Cell `num, nowrap, muted` | autolab |
| Stack / Inline | `stack` `inline` | `gap 0-6, align, justify, wrap, as` | codefort |
| PageHeader | `page-header` | `title, meta, actions` | codefort |
| EmptyState | `empty-state` | `title` + children | autolab |
| ErrorMessage / Banner | `error-message` `banner` | `error, inline` / `tone` | autolab/money/teleport |
| Spinner | `spinner` | `label` | autolab |
| DataState | — | `data, loading, error, empty` + 4 render branches | codefort (UI.md rule 26) |

### v0.2 more

Layer 2 lands here: behaviour that needs JS lives once, in `behavior/`, as
plain functions over DOM nodes. Both bindings call them from an effect /
action; a hand-written-HTML user calls them directly. No framework owns it.

| Component | Block | Props (shared contract) | Behaviour |
|---|---|---|---|
| Dialog | `modal` | `open, title, onClose, onSubmit?, footer` | native `<dialog>` + `behavior/dialog.ts`: `syncDialog(el, open)`, `attachDialog(el, onClose)` — Esc, backdrop click, `method="dialog"` submit all route to `onClose`; parent `open` is the only truth |
| ConfirmDialog | `modal` | `open, title, confirmLabel, onConfirm, onClose, pending, error` | Dialog + danger confirm + cancel |
| Menu | `menu` | `label, trigger, items: {label, onSelect, disabled?, selected?}[], align, variant, size` | `popover="auto"` (top layer, light dismiss, focus return) + `behavior/menu.ts` `attachMenu(root)`: aria-expanded, fixed positioning with flip, arrow/Home/End roving, close on choose |
| Tooltip | `tooltip` | `label, placement` + control slot `{ describedBy }` | CSS only (`:hover`, `:focus-within`) |
| ToastStack | `toast-stack`, `toast` | `toaster` | `behavior/toast.ts` `createToaster()`: `push(message, {tone, duration})`, `dismiss`, `subscribe`. A plain module the app owns (UI.md rule 21), no context |
| Tabs | `tabs` | `label, items: {label, href, current?, count?}[]` (+ React `renderLink`) | none — navigation tabs are links with `aria-current="page"`. In-page switching is SegmentedControl |
| Pagination | `pagination` | `page, last, onPage` (1-based) | `pageList()` in contract, shared |
| Skeleton | `skeleton` | `variant: line\|block\|circle, width, height`; SkeletonText `lines` | CSS shimmer, inert under reduced motion |
| Disclosure | `disclosure` | `summary, open` | native `<details>` |
| Toolbar | `toolbar` | `label, card` | none; `role="group"` (a `toolbar` role would owe arrow-key roving) |
| Chip | `chip` | `label, checked, count?` | native checkbox inside a label |
| Avatar | `avatar` | `name, src?, size: sm\|md\|lg` | initials (≤2) when no `src` |
| Banner | `banner` | + `onDismiss?` → `banner__dismiss` | replaces the planned Notice |

Interfaces held across both bindings: same props, same DOM (parity test),
callbacks named `onX`. Svelte additionally offers `bind:` for `open`
(Dialog, Disclosure) and `checked` (Chip).

v0.2 edge cases:
- Dialog `open` true at mount → `showModal()` after the element connects.
  Unmount while open → closes (no orphaned top-layer modal).
- Esc fires `cancel`; kai-ui prevents the native close and calls `onClose`, so
  a parent that refuses (keeps `open`) keeps the dialog open.
- Backdrop click = click whose target is the `<dialog>` itself, never a child.
- Menu inside `overflow: hidden` (cards, tables): popover is top layer, never clipped.
- Menu near the viewport bottom/right edge: flips above / aligns end.
- Menu items all disabled: opening focuses the popover itself, keys do nothing.
- popover support: Chromium 114+, Safari/WebKit 17+, Firefox 125+. WebKitGTK
  (teleport desktop) ≥ 2.44 — check the Tauri target before teleport adopts Menu.
- Toast: duration 0 = sticky; danger toasts `role="alert"`, the rest live in
  the stack's `aria-live="polite"`. Timers cleared on dismiss.
- Tooltip is a hint, never the only label: an icon-only trigger still needs `aria-label`.
- Pagination renders nothing for `last <= 1`.
- Avatar `src` that fails to load: shows initials (onerror swaps in the fallback).

### Later — decide after v0.2

Markdown body CSS, code-highlight block, xterm ANSI theme derived from tokens
(teleport), CheckDropdown, icon set (Octicon-style inline SVG), Sidebar /
DetailLayout.

## 6. Interfaces

### 6.1 Package

One package, subpath exports. Consumed as a git tag dependency:
`"kai-ui": "github:alehatsman/kai-ui#v0.1.0"`.

```
kai-ui/css        → css/index.css (or css/<file>)
kai-ui/theme      → theme/index.ts
kai-ui/behavior   → behavior/index.ts (dialog, menu, toast — for hand-written HTML)
kai-ui/react      → react/index.ts    (peers: react ≥19, clsx — optional)
kai-ui/svelte     → svelte/index.ts   (peer: svelte ≥5.20 — optional; .svelte source)
kai-ui/contract   → contract/index.ts
```

Ships source, no build step: every consumer is Vite + TS on the same
ts-quality baseline, so it compiles kai-ui like its own code. A git dependency
installs with nothing to run (codefort deploys from a temp clone; money bans
CDNs). Revisit only if a consumer appears that cannot compile TS. Runtime
deps: none; `clsx` is a peer of the React binding.

### 6.2 Class names (canonical, BEM, UI.md rules 3–8)

autolab's names win where codefort differs:
`.table → .data-table`, `.empty → .empty-state`, `.error → .error-message`,
`.control → .checkbox/.radio`, `.badge--<issue-state> → .badge--<tone>`.
State flags: `is-active`, `is-invalid`, `is-loading`.

### 6.3 Consumer contract

```css
@import "kai-ui/css";          /* tokens + base + all blocks */
```
App-local blocks may read kai-ui tokens; never redefine kai-ui blocks.
App-local tokens live in the app's base stylesheet, prefixed by app if they
might collide.

## 7. Gallery

`gallery/` — one Vite app, React and Svelte plugins together, one page.

- Sticky bar: theme switcher (auto / github-light / github-dark / monokai),
  density toggle, framework view (React | Svelte | side-by-side).
- Tokens section: live swatches read via `getComputedStyle` (autolab
  `DevTokensPage` precedent).
- One section per component; every variant × size × state. Each demo has a
  stable `data-demo="btn-primary-sm"` id, rendered once per framework.
- Also a plain-HTML column per demo (no binding) — proves layer 1 stands alone.

## 8. Edge cases

- No JS / binding: blocks render correctly from hand-written HTML.
- localStorage throws (Safari private, Tauri webview quirks): default theme, no crash.
- Theme flash: bootstrap must run before first stylesheet paint.
- OS theme changes live while `data-theme` absent: pure CSS, no listener.
- Monokai lime + white text fails contrast (codefort `styles.css:1704`): Monokai
  sets `--fg-on-emphasis` to its dark canvas — a token, not a patch.
- Canonical Monokai pink `#f92672` is 3.9:1 on `#272822`, under AA: Monokai
  `--tone-danger` is `#ff6188`. Syntax keywords keep the canonical pink.
- Danger buttons stay text-on-tint on hover in every theme (no filled danger),
  so no theme needs a second on-emphasis colour.
- Reduced motion: all transitions/keyframes inert (spinner, skeleton, toast).
- Consumer CSS order: kai-ui first, app after; specificity = single class, so app wins ties.
- SSR: none of the four apps SSR; bindings must still not touch `window` at import.
- Two bindings drift: caught by parity test (§9).
- Tauri webview (teleport desktop): WebKitGTK/WebView2 — `popover` support
  must be checked before v0.2 Menu; fallback = `<details>`.

## 9. Validation

1. **Token parity**: test — every `:root` name in `tokens.css` is in `contract/tokens.ts` and vice versa; every theme block defines the same set.
2. **Binding parity**: Playwright — for each `data-demo`, React, Svelte and plain-HTML renders produce identical element tree + class lists.
3. **Visual**: Playwright screenshots of the gallery × 4 theme states × 2 densities. Reviewed by eye on change (UI.md rule 29).
4. **Lint**: Biome; `tsq/ci` ui-lint gate (bem-class, raw-color, raw-radius, raw-duration) over `css/`.
5. **Contrast**: script checks fg/bg token pairs ≥ WCAG AA per theme.
6. **Types**: `tsc` for contract + react; `svelte-check` for svelte.
7. **Consumer smoke**: autolab adopts v0.1 first (closest shape) before tagging v0.1.0.

## 10. Rollout

1. Amend ts-quality `docs/UI.md` rule 2 (+ 9, 11, 28): kai-ui is the fleet
   vocabulary; in-repo `ui/` holds only local primitives; gallery lives in kai-ui.
   Update money `web/CLAUDE.md:10` to match.
2. v0.1 core + gallery. Tag after autolab smoke.
3. Migrate: autolab → codefort → money → teleport. One PR per app.
4. v0.2, then reassess "later" list.

## 11. v0.1 as built

- Gallery: `npm run dev`. Toolbar: theme, view (all / HTML / React / Svelte), touch density.
- `npm run check`: Biome, tsc + svelte-check, unit (token parity, WCAG contrast
  per theme, theme bootstrap), Playwright (DOM parity across HTML/React/Svelte
  for every demo, live bindings, each theme state + reload, touch density).
- Screenshots per theme land in `test-results/screens/` for review by eye.
- ts-quality ui-lint over `css/` and `gallery/gallery.css`: clean.

### v0.2 as built

- 13 more components per binding (Dialog, ConfirmDialog, Menu, Tooltip,
  ToastStack, Tabs, Pagination, Skeleton, SkeletonText, Disclosure, Toolbar,
  Chip, Avatar) + Banner `onDismiss`. `behavior/`: dialog, menu, toast.
- Gallery: 16 more demos; the HTML column wires dialogs and menus with
  `behavior/` alone, so layer 2 is proven without a framework.
- Tests: unit +12 (pageList, initials, cssLength, toaster timers, dialog
  sync/echo); e2e +27 (`behavior.spec.ts`: dialog Esc/×/Cancel/backdrop/submit,
  menu roving/Esc focus return/placement/choose, tooltip, toast, pagination,
  chip, banner) — each across the columns it applies to.
- Found while building: syncDialog's own `close()` echoed back as onClose (a
  queued `close` event). Fixed with a per-element marker; a unit test fails
  without it.
- Skeleton is a translucent `--neutral-muted` tint: canvas/border tones read
  darker than the page in GitHub dark and vanish in GitHub light.
- Menu item labels: `MenuItem<L>` in the contract — `ReactNode` in React,
  string in Svelte (tsc cannot read type exports from `.svelte`).

## 12. Open questions

- Default theme per app: codefort = monokai (today). autolab/money/teleport = ?
- Body base size: codefort/autolab 14px (`--text-md`), money 14px, teleport system 16px. Proposal: 14px; touch density bumps inputs only.
- Font stacks: system only (money bans font services). Confirm no webfont ever.
- License / visibility of repo: private.
- Tabs is navigation only. In-page tab panels (role=tablist, arrow keys) —
  needed by any app? SegmentedControl covers switching today.
- Teleport desktop: confirm the Tauri WebKitGTK version supports `popover`
  before it adopts Menu.
