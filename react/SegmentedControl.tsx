import clsx from "clsx"
import type { SegmentedOption } from "../contract/index.ts"

/** Pick one of a few: joined buttons, the chosen one `is-active` and `aria-pressed`. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  /** The group's accessible name. */
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a labelled group of toggle buttons; no native element fits
    <div className={clsx("segmented", className)} role="group" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            className={clsx("segmented__option", active && "is-active")}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
