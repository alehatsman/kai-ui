// The prop contract both bindings implement. Value-level types only: what a
// slot holds (ReactNode, Snippet) is each framework's business.

import { ICONS, type IconName } from "./icons.ts"

export { ICONS, type IconName }

/** Semantic colour, never domain. The feature maps `merged` → "done". */
export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "done"

export type ButtonVariant = "default" | "primary" | "ghost" | "danger"
export type ButtonSize = "md" | "small"

/** A step on the spacing scale (`--space-1` … `--space-6`); 0 is no gap. */
export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type StackAlign = "start" | "center" | "end" | "stretch"
export type InlineAlign = "start" | "center" | "end" | "baseline"
export type InlineJustify = "start" | "center" | "end" | "between"

/** Banner has no neutral or done: a strip is information, good, caution or bad. */
export type BannerTone = "accent" | "success" | "warning" | "danger"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

/** The ids a Field hands its control. */
export interface FieldSlot {
  controlId: string
  describedBy: string | undefined
}

/** Modifier for a tone; neutral is the block's default and has none. */
export function toneClass(block: string, tone: Tone): string | undefined {
  return tone === "neutral" ? undefined : `${block}--${tone}`
}

/** Error → text, the one way both bindings render an unknown error. */
export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export type Placement = "top" | "bottom" | "left" | "right"
export type AvatarSize = "sm" | "md" | "lg"
export type SkeletonVariant = "line" | "block" | "circle"

/** Ids a Tooltip hands its control, as Field does. */
export interface TooltipSlot {
  describedBy: string
}

/** A navigation tab: a link. `current` marks the page you are on. */
export interface TabItem {
  label: string
  href: string
  current?: boolean
  count?: number
}

/** Page numbers to show: first, last, and two either side of `current`; null is a gap. */
export function pageList(current: number, last: number): (number | null)[] {
  const out: (number | null)[] = []
  for (let p = 1; p <= last; p++) {
    if (p === 1 || p === last || Math.abs(p - current) <= 2) out.push(p)
    else if (out.at(-1) !== null) out.push(null)
  }
  return out
}

/** Up to two initials: first letters of the first and last words. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.charAt(0) ?? ""
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? "") : ""
  return (first + last).toUpperCase() || "?"
}

/** A CSS length from a number (px) or a string (as given). */
export function cssLength(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined
  return typeof v === "number" ? `${v}px` : v
}

/** A menu entry. `L` is what a label may be: a string, or a framework node. */
export interface MenuItem<L = string> {
  label: L
  onSelect: () => void
  disabled?: boolean
  /** Set on every item of a pick-one menu: renders menuitemradio + aria-checked. */
  selected?: boolean
}

/** Inclusive 1-based line range, e.g. the lines a review comment annotates. */
export type LineRange = readonly [from: number, to: number]

/** True when line `n` falls inside `range` (inclusive). No range, no match. */
export function inRange(n: number, range: LineRange | undefined): boolean {
  return range !== undefined && n >= range[0] && n <= range[1]
}

export interface IconOptions {
  /** Accessible name. Without one the icon is decorative (aria-hidden). */
  label?: string | undefined
  /** Pixel size; the glyphs are drawn for 16. */
  size?: number
  className?: string | undefined
}

export interface IconAttrs {
  class: string
  width: number
  height: number
  viewBox: string
  fill: string
  role?: "img"
  "aria-label"?: string
  "aria-hidden"?: "true"
}

/** The attributes an icon's `<svg>` carries — one source for all three renderers. */
export function iconAttrs({ label, size = 16, className }: IconOptions = {}): IconAttrs {
  return {
    class: className ? `icon ${className}` : "icon",
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" }),
  }
}

const escAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

/** An icon as markup, for plain HTML. */
export function iconSvg(name: IconName, opts: IconOptions = {}): string {
  const attrs = Object.entries(iconAttrs(opts))
    .map(([k, v]) => `${k}="${escAttr(String(v))}"`)
    .join(" ")
  const paths = ICONS[name].map((d) => `<path d="${d}"></path>`).join("")
  return `<svg ${attrs}>${paths}</svg>`
}

/** One CheckDropdown option. `label` shows and is what search matches; else `value`. */
export interface CheckOption {
  value: string
  label?: string | undefined
  count?: number | undefined
}

export const optionName = (o: CheckOption): string => o.label ?? o.value

/** Options to show: selected values missing from `options` first (still ticked), then matches. */
export function checkOptions(
  options: readonly CheckOption[],
  selected: readonly string[],
  query: string
): CheckOption[] {
  const q = query.trim().toLowerCase()
  const unknown = selected.filter((v) => !options.some((o) => o.value === v))
  const shown = q ? options.filter((o) => optionName(o).toLowerCase().includes(q)) : options
  return [...unknown.map((value) => ({ value })), ...shown]
}

/** The selection after ticking (`on`) or unticking `value`. `single` holds at most one. */
export function toggleSelection(
  selected: readonly string[],
  value: string,
  on: boolean,
  single = false
): string[] {
  if (single) return on ? [value] : []
  if (on) return selected.includes(value) ? [...selected] : [...selected, value]
  return selected.filter((v) => v !== value)
}

/** The trigger text: `anyLabel` for none, the one name, or "N selected". */
export function checkSummary(
  selected: readonly string[],
  options: readonly CheckOption[],
  anyLabel = "Any"
): string {
  if (selected.length === 0) return anyLabel
  if (selected.length > 1) return `${selected.length} selected`
  const only = selected[0] ?? ""
  const o = options.find((x) => x.value === only)
  return o ? optionName(o) : only
}

/** A count as shown beside an option: grouped thousands, nothing for 0 / none. */
export const countText = (n: number | undefined): string => (n ? n.toLocaleString("en-US") : "")
