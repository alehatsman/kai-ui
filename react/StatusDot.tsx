import clsx from "clsx"
import { type Tone, toneClass } from "../contract/index.ts"

/** A colour dot with a text twin: `label` is visible with `showLabel`, sr-only otherwise. */
export function StatusDot({
  tone = "neutral",
  label,
  pulse = false,
  showLabel = false,
  className,
}: {
  tone?: Tone
  label: string
  pulse?: boolean
  showLabel?: boolean
  className?: string
}) {
  return (
    <span className={clsx("status", className)}>
      <span
        className={clsx("dot", toneClass("dot", tone), pulse && "dot--pulse")}
        aria-hidden="true"
      />
      <span className={showLabel ? "status__label" : "sr-only"}>{label}</span>
    </span>
  )
}
