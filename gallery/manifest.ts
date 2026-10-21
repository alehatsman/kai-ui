// The gallery's table of contents. Every demo id is rendered three times —
// hand-written HTML, React, Svelte — and tests/e2e/parity.spec.ts holds the
// three to the same DOM.

export interface Demo {
  id: string
  label: string
}

export interface Section {
  id: string
  title: string
  demos: Demo[]
}

export const SECTIONS: Section[] = [
  {
    id: "button",
    title: "Button",
    demos: [
      { id: "btn-variants", label: "variants" },
      { id: "btn-small", label: "size small" },
      { id: "btn-disabled", label: "disabled" },
      { id: "btn-link", label: "link styled as button" },
    ],
  },
  {
    id: "controls",
    title: "Input · Select · Textarea",
    demos: [
      { id: "input", label: "input" },
      { id: "input-states", label: "invalid, disabled" },
      { id: "select", label: "select" },
      { id: "textarea", label: "textarea" },
    ],
  },
  {
    id: "field",
    title: "Field",
    demos: [
      { id: "field-hint", label: "with hint" },
      { id: "field-error", label: "with error" },
    ],
  },
  {
    id: "choice",
    title: "Checkbox · Radio · Switch",
    demos: [
      { id: "checkbox", label: "checkbox" },
      { id: "radio", label: "radio group" },
      { id: "switch", label: "switch" },
    ],
  },
  {
    id: "segmented",
    title: "SegmentedControl",
    demos: [{ id: "segmented", label: "pick one" }],
  },
  {
    id: "badge",
    title: "Badge · StatusDot",
    demos: [
      { id: "badge-tones", label: "badge tones" },
      { id: "dot-tones", label: "dot tones, visible label" },
      { id: "dot-pulse", label: "pulse, sr-only label" },
    ],
  },
  {
    id: "card",
    title: "Card",
    demos: [
      { id: "card-padded", label: "padded" },
      { id: "card-sections", label: "header + body" },
      { id: "card-selected", label: "selected" },
    ],
  },
  {
    id: "table",
    title: "Table",
    demos: [{ id: "table", label: "num columns, muted row" }],
  },
  {
    id: "layout",
    title: "Stack · Inline · PageHeader",
    demos: [
      { id: "stack", label: "stack gap 2" },
      { id: "inline-between", label: "inline justify between" },
      { id: "page-header", label: "page header" },
    ],
  },
  {
    id: "feedback",
    title: "EmptyState · ErrorMessage · Banner · Spinner",
    demos: [
      { id: "empty-state", label: "empty state" },
      { id: "error-message", label: "error, inline error" },
      { id: "banner-tones", label: "banner tones" },
      { id: "spinner", label: "spinner" },
    ],
  },
  {
    id: "data-state",
    title: "DataState",
    demos: [
      { id: "ds-loading", label: "loading" },
      { id: "ds-error", label: "error" },
      { id: "ds-empty", label: "empty" },
      { id: "ds-data", label: "data" },
    ],
  },
  {
    id: "overlays",
    title: "Dialog · ConfirmDialog · Menu · Tooltip",
    demos: [
      { id: "dialog", label: "dialog with a form" },
      { id: "confirm-dialog", label: "destructive confirm" },
      { id: "menu", label: "action menu" },
      { id: "menu-radio", label: "pick-one menu, align end" },
      { id: "tooltip", label: "tooltip top, bottom" },
    ],
  },
  {
    id: "toast",
    title: "ToastStack",
    demos: [{ id: "toast", label: "push by tone (stack shown in place)" }],
  },
  {
    id: "navigation",
    title: "Tabs · Pagination · Toolbar · Chip",
    demos: [
      { id: "tabs", label: "navigation tabs" },
      { id: "pagination", label: "page 5 of 12" },
      { id: "toolbar", label: "toolbar card with chips" },
    ],
  },
  {
    id: "misc",
    title: "Avatar · Skeleton · Disclosure · Banner dismiss",
    demos: [
      { id: "avatar", label: "sizes, initials" },
      { id: "skeleton", label: "line, text, block, circle" },
      { id: "disclosure", label: "closed, open" },
      { id: "banner-dismiss", label: "dismissible banner" },
    ],
  },
]
