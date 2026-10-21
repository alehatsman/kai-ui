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
