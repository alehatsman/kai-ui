// The prop contract both bindings implement. Value-level types only: what a
// slot holds (ReactNode, Snippet) is each framework's business.

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
