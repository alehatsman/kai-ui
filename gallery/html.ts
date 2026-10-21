// Layer 1 alone: each demo as hand-written markup, no binding. If a block
// needs JS to look right, it shows here first.

import { pageList } from "../contract/index.ts"
import { CODE_BLOCK_HTML, HL_LINES, MARKDOWN_HTML, runsHtml, SNIPPET_LINES } from "./content.ts"

const TONES = ["neutral", "accent", "success", "warning", "danger", "done"] as const
const mod = (block: string, tone: string) =>
  tone === "neutral" ? block : `${block} ${block}--${tone}`

const modalHead = (title: string) =>
  `<header class="modal__head"><h2 class="modal__title">${title}</h2><button type="button" class="modal__close" aria-label="Close">×</button></header>`

const menuItem = (label: string, extra = "") =>
  `<button type="button" class="menu__item" role="menuitem" tabindex="-1"${extra}>${label}</button>`

const pageButton = (p: number) =>
  p === 5
    ? `<button type="button" class="btn btn--small pagination__page is-active" aria-current="page">${p}</button>`
    : `<button type="button" class="btn btn--small pagination__page">${p}</button>`

const pages = pageList(5, 12)
  .map((p) =>
    p === null ? `<span class="pagination__gap" aria-hidden="true">…</span>` : pageButton(p)
  )
  .join("")

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const snippet = (lines: readonly string[], start: number, focus?: [number, number]) =>
  `<div class="code-snippet"><table class="code-snippet__table"><tbody>${lines
    .map((text, i) => {
      const n = start + i
      const cls = focus && n >= focus[0] && n <= focus[1] ? "code-line is-focus" : "code-line"
      return `<tr class="${cls}"><td class="code-line__num" data-line="${n}"></td><td class="code-line__text">${text}</td></tr>`
    })
    .join("")}</tbody></table></div>`

const chip = (label: string, count: number, checked: boolean) =>
  `<label class="chip"><input type="checkbox" class="chip__input"${checked ? " checked" : ""}><span class="chip__label">${label}</span><span class="chip__count">${count}</span></label>`

export const HTML_DEMOS: Record<string, string> = {
  "btn-variants": `
    <button type="button" class="btn">Default</button>
    <button type="button" class="btn btn--primary">Primary</button>
    <button type="button" class="btn btn--ghost">Ghost</button>
    <button type="button" class="btn btn--danger">Danger</button>`,
  "btn-small": `
    <button type="button" class="btn btn--small">Default</button>
    <button type="button" class="btn btn--primary btn--small">Primary</button>
    <button type="button" class="btn btn--ghost btn--small">Ghost</button>
    <button type="button" class="btn btn--danger btn--small">Danger</button>`,
  "btn-disabled": `
    <button type="button" class="btn" disabled>Default</button>
    <button type="button" class="btn btn--primary" disabled>Primary</button>`,
  "btn-link": `<a class="btn btn--primary" href="#btn-link">Link as button</a>`,

  input: `<input class="input" placeholder="Plain input">`,
  "input-states": `
    <input class="input is-invalid" aria-invalid="true" value="not-an-email">
    <input class="input" disabled placeholder="Disabled">`,
  select: `<select class="select"><option>GitHub</option><option>Monokai</option></select>`,
  textarea: `<textarea class="textarea" placeholder="Notes"></textarea>`,

  "field-hint": `
    <div class="field">
      <label class="field__label" for="html-email">Email</label>
      <input class="input" type="email" id="html-email" aria-describedby="html-email-hint">
      <span class="field__hint" id="html-email-hint">We never share it.</span>
    </div>`,
  "field-error": `
    <div class="field">
      <label class="field__label" for="html-name">Name</label>
      <input class="input is-invalid" aria-invalid="true" id="html-name" aria-describedby="html-name-error">
      <span class="field__error" id="html-name-error">Required.</span>
    </div>`,

  checkbox: `
    <label class="checkbox"><input type="checkbox" class="checkbox__input"><span class="checkbox__label">Email me</span></label>
    <label class="checkbox"><input type="checkbox" class="checkbox__input" checked><span class="checkbox__label">Subscribed</span></label>
    <label class="checkbox"><input type="checkbox" class="checkbox__input" disabled><span class="checkbox__label">Disabled</span></label>`,
  radio: `
    <label class="radio"><input type="radio" class="radio__input" name="plan-html" value="free" checked><span class="radio__label">Free</span></label>
    <label class="radio"><input type="radio" class="radio__input" name="plan-html" value="pro"><span class="radio__label">Pro</span></label>`,
  switch: `
    <label class="switch"><span class="switch__control"><input type="checkbox" class="switch__input"><span class="switch__track"></span><span class="switch__thumb"></span></span><span class="switch__label">Notifications</span></label>
    <label class="switch"><span class="switch__control"><input type="checkbox" class="switch__input" checked><span class="switch__track"></span><span class="switch__thumb"></span></span><span class="switch__label">Dark mode</span></label>
    <label class="switch"><span class="switch__control"><input type="checkbox" class="switch__input" disabled><span class="switch__track"></span><span class="switch__thumb"></span></span><span class="switch__label">Locked</span></label>`,

  segmented: `
    <div class="segmented" role="group" aria-label="Range">
      <button type="button" class="segmented__option" aria-pressed="false">Day</button>
      <button type="button" class="segmented__option is-active" aria-pressed="true">Week</button>
      <button type="button" class="segmented__option" aria-pressed="false">Month</button>
    </div>`,

  "badge-tones": TONES.map((t) => `<span class="${mod("badge", t)}">${t}</span>`).join(""),
  "dot-tones": TONES.map(
    (t) =>
      `<span class="status"><span class="${mod("dot", t)}" aria-hidden="true"></span><span class="status__label">${t}</span></span>`
  ).join(""),
  "dot-pulse": `<span class="status"><span class="dot dot--success dot--pulse" aria-hidden="true"></span><span class="sr-only">Online</span></span>`,

  "card-padded": `<div class="card card--padded">A padded card.</div>`,
  "card-sections": `
    <div class="card">
      <div class="card__header"><h3 class="card__title">Balances</h3><span class="badge badge--success">synced</span></div>
      <div class="card__body">Card body.</div>
    </div>`,
  "card-selected": `<div class="card card--padded card--selected">Selected card.</div>`,

  table: `
    <table class="data-table data-table--fit">
      <thead><tr><th class="data-table__head">Account</th><th class="data-table__head data-table__head--num">Balance</th></tr></thead>
      <tbody>
        <tr><td class="data-table__cell">Cash</td><td class="data-table__cell data-table__cell--num">1,200.00</td></tr>
        <tr><td class="data-table__cell">Stocks</td><td class="data-table__cell data-table__cell--num">8,450.10</td></tr>
        <tr class="data-table__row--muted"><td class="data-table__cell">Closed</td><td class="data-table__cell data-table__cell--num">0.00</td></tr>
      </tbody>
    </table>`,

  stack: `
    <div class="stack stack--gap-2 stack--align-stretch">
      <div class="gallery__box">One</div><div class="gallery__box">Two</div><div class="gallery__box">Three</div>
    </div>`,
  "inline-between": `
    <div class="inline inline--gap-2 inline--align-center inline--justify-between gallery__fill">
      <div class="gallery__box">Left</div><div class="gallery__box">Right</div>
    </div>`,
  "page-header": `
    <header class="page-header gallery__fill">
      <h1 class="page-header__title">Dashboards</h1>
      <span class="page-header__meta">12 panels</span>
      <div class="page-header__actions">
        <button type="button" class="btn btn--small">Edit</button>
        <button type="button" class="btn btn--primary btn--small">New</button>
      </div>
    </header>`,

  "empty-state": `<div class="empty-state gallery__fill"><p class="empty-state__title">No dashboards yet</p>Create one to get started.</div>`,
  "error-message": `
    <div class="error-message" role="alert">Could not reach the server.</div>
    <div class="error-message error-message--inline" role="alert">Required.</div>`,
  "banner-tones": `
    <div class="banner gallery__fill" role="status">Heads up: maintenance at 02:00.</div>
    <div class="banner banner--success gallery__fill" role="status">Saved.</div>
    <div class="banner banner--warning gallery__fill" role="status">Sync is 3 hours behind.</div>
    <div class="banner banner--danger gallery__fill" role="alert">Import failed.</div>`,
  spinner: `<span class="spinner" role="status"><span class="spinner__ring" aria-hidden="true"></span><span class="spinner__label">Loading…</span></span>`,

  "ds-loading": `<span class="spinner" role="status"><span class="spinner__ring" aria-hidden="true"></span><span class="spinner__label">Loading…</span></span>`,
  "ds-error": `<div class="error-message" role="alert">Request failed: 502</div>`,
  "ds-empty": `<div class="empty-state gallery__fill"><p class="empty-state__title">Nothing here</p></div>`,
  "ds-data": `<ul class="gallery__list"><li>alpha</li><li>beta</li></ul>`,

  dialog: `
    <button type="button" class="btn">Open dialog</button>
    <dialog class="modal"><form class="modal__form" method="dialog">
      ${modalHead("Rename dashboard")}
      <div class="modal__body"><div class="field"><label class="field__label" for="html-dlg-name">Name</label><input class="input" id="html-dlg-name"></div></div>
      <footer class="modal__foot"><button type="button" class="btn btn--ghost">Cancel</button><button type="submit" class="btn btn--primary">Save</button></footer>
    </form></dialog>`,
  "confirm-dialog": `
    <button type="button" class="btn btn--danger">Delete…</button>
    <dialog class="modal"><form class="modal__form" method="dialog">
      ${modalHead("Delete dashboard?")}
      <div class="modal__body">This removes 12 panels. It cannot be undone.</div>
      <footer class="modal__foot"><button type="button" class="btn btn--ghost">Cancel</button><button type="button" class="btn btn--danger">Delete</button></footer>
    </form></dialog>`,
  menu: `
    <div class="menu">
      <button type="button" class="btn" popovertarget="html-menu-a" aria-haspopup="menu" aria-expanded="false" aria-controls="html-menu-a">Actions</button>
      <div id="html-menu-a" popover="auto" role="menu" aria-label="Dashboard actions" class="menu__popover">
        ${menuItem("Duplicate")}${menuItem("Export CSV")}${menuItem("Delete", " disabled")}
      </div>
    </div>`,
  "menu-radio": `
    <div class="menu">
      <button type="button" class="btn btn--small" popovertarget="html-menu-b" aria-haspopup="menu" aria-expanded="false" aria-controls="html-menu-b">Theme</button>
      <div id="html-menu-b" popover="auto" role="menu" aria-label="Theme" class="menu__popover menu__popover--end">
        <button type="button" class="menu__item" role="menuitemradio" aria-checked="false" tabindex="-1">GitHub</button>
        <button type="button" class="menu__item" role="menuitemradio" aria-checked="true" tabindex="-1">Monokai</button>
      </div>
    </div>`,
  tooltip: `
    <span class="tooltip"><button type="button" class="btn" aria-describedby="html-tip-a">Copy</button><span id="html-tip-a" role="tooltip" class="tooltip__bubble tooltip__bubble--top">Copy to clipboard</span></span>
    <span class="tooltip"><button type="button" class="btn btn--ghost" aria-describedby="html-tip-b">Help</button><span id="html-tip-b" role="tooltip" class="tooltip__bubble tooltip__bubble--bottom">Opens the docs</span></span>`,

  toast: `
    <button type="button" class="btn btn--small">Info</button>
    <button type="button" class="btn btn--small">Success</button>
    <button type="button" class="btn btn--small">Danger</button>
    <section class="toast-stack" aria-label="Notifications" aria-live="polite">
      <div class="toast toast--success"><span class="toast__message">Saved.</span><button type="button" class="toast__close" aria-label="Dismiss">×</button></div>
    </section>`,

  tabs: `
    <nav class="tabs gallery__fill" aria-label="Repository">
      <a href="#overview" class="tabs__item" aria-current="page">Overview</a>
      <a href="#issues" class="tabs__item">Issues<span class="tabs__count">12</span></a>
      <a href="#settings" class="tabs__item">Settings</a>
    </nav>`,
  pagination: `
    <nav class="pagination" aria-label="Pages">
      <button type="button" class="btn btn--small">Previous</button>${pages}<button type="button" class="btn btn--small">Next</button>
    </nav>`,
  toolbar: `
    <div class="toolbar toolbar--card gallery__fill" role="group" aria-label="Filters">
      ${chip("Open", 4, true)}${chip("Closed", 9, false)}
      <button type="button" class="btn btn--ghost btn--small">Clear</button>
    </div>`,

  avatar: `
    <span class="avatar avatar--sm" role="img" aria-label="Ada Lovelace" title="Ada Lovelace">AL</span>
    <span class="avatar" role="img" aria-label="Ada Lovelace" title="Ada Lovelace">AL</span>
    <span class="avatar avatar--lg" role="img" aria-label="Ada Lovelace" title="Ada Lovelace">AL</span>
    <span class="avatar avatar--lg" role="img" aria-label="linus" title="linus">L</span>`,
  skeleton: `
    <div class="gallery__stack">
      <span class="skeleton skeleton--line" style="width: 40%" aria-hidden="true"></span>
      <span class="skeleton-text" aria-hidden="true"><span class="skeleton skeleton--line"></span><span class="skeleton skeleton--line"></span><span class="skeleton skeleton--line"></span></span>
      <span class="skeleton skeleton--block" aria-hidden="true"></span>
      <span class="skeleton skeleton--circle" aria-hidden="true"></span>
    </div>`,
  disclosure: `
    <details class="disclosure gallery__fill"><summary class="disclosure__summary">Advanced options</summary><div class="disclosure__body">Hidden until opened.</div></details>
    <details class="disclosure gallery__fill" open><summary class="disclosure__summary">Details</summary><div class="disclosure__body">Open from the start.</div></details>`,
  "banner-dismiss": `
    <div class="banner banner--warning gallery__fill" role="status"><div class="banner__message">Sync is 3 hours behind.</div><button type="button" class="banner__dismiss" aria-label="Dismiss">×</button></div>`,
  markdown: `<div class="markdown-body gallery__fill">${MARKDOWN_HTML}</div>`,
  "code-block": CODE_BLOCK_HTML,
  "code-snippet": snippet(SNIPPET_LINES.map(esc), 41, [43, 44]),
  "code-snippet-hl": snippet(HL_LINES.map(runsHtml), 1),
}
