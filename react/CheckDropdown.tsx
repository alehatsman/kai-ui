import clsx from "clsx"
import { useEffect, useId, useRef, useState } from "react"
import { attachCheckDropdown } from "../behavior/check-dropdown.ts"
import {
  type CheckOption,
  checkOptions,
  checkSummary,
  countText,
  optionName,
  toggleSelection,
} from "../contract/index.ts"
import { Icon } from "./Icon.tsx"

/**
 * A select-looking button over a popover panel of checkboxes (radios when
 * `single`). Each tick calls `onChange` at once; `selected` is the truth.
 * Placement, focus and close-on-pick by behavior/check-dropdown.ts.
 */
export function CheckDropdown({
  label,
  options,
  selected,
  onChange,
  summary,
  single = false,
  required = false,
  anyLabel = "Any",
  disabled = false,
  searchFrom = 8,
  className,
}: {
  label: string
  options: readonly CheckOption[]
  selected: readonly string[]
  onChange: (next: string[]) => void
  summary?: (selected: readonly string[], options: readonly CheckOption[]) => string
  /** Radios, with an `anyLabel` row that clears; a pick closes the panel. */
  single?: boolean
  /** The last ticked option cannot be cleared. */
  required?: boolean
  anyLabel?: string
  disabled?: boolean
  /** Show the search box from this many options. */
  searchFrom?: number
  className?: string
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  useEffect(() => (root.current ? attachCheckDropdown(root.current) : undefined), [])

  const shown = checkOptions(options, selected, query)
  const text = summary ? summary(selected, options) : checkSummary(selected, options, anyLabel)
  const tick = (value: string, on: boolean) =>
    onChange(toggleSelection(selected, value, on, single))

  return (
    <div
      ref={root}
      className={clsx("check-dropdown", single && "check-dropdown--single", className)}
    >
      <span className="check-dropdown__label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        className="check-dropdown__button"
        popoverTarget={`${id}-panel`}
        aria-controls={`${id}-panel`}
        aria-expanded="false"
        aria-labelledby={`${id}-label ${id}-summary`}
        disabled={disabled || options.length === 0}
      >
        <span className="check-dropdown__summary" id={`${id}-summary`}>
          {text}
        </span>
        <Icon name="triangle-down" />
      </button>
      <div
        className="check-dropdown__panel"
        id={`${id}-panel`}
        popover="auto"
        onToggle={(e) => {
          if (e.newState === "closed") setQuery("")
        }}
      >
        <fieldset className="check-dropdown__fieldset">
          <legend className="sr-only">{label}</legend>
          {options.length >= searchFrom ? (
            <input
              type="search"
              className="check-dropdown__search"
              placeholder="Type to find…"
              aria-label={`Find ${label}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          ) : null}
          <div className="check-dropdown__list">
            {single && !query.trim() ? (
              <label className="check-dropdown__option">
                <input
                  type="radio"
                  className="check-dropdown__input"
                  name={id}
                  checked={selected.length === 0}
                  onChange={() => onChange([])}
                />
                <span className="check-dropdown__name">{anyLabel}</span>
                <span className="check-dropdown__count" />
              </label>
            ) : null}
            {shown.map((o) => {
              const on = selected.includes(o.value)
              return (
                <label className="check-dropdown__option" key={o.value}>
                  <input
                    type={single ? "radio" : "checkbox"}
                    className="check-dropdown__input"
                    name={single ? id : undefined}
                    checked={on}
                    disabled={required && on && selected.length === 1}
                    onChange={(e) => tick(o.value, e.target.checked)}
                  />
                  <span className="check-dropdown__name">{optionName(o)}</span>
                  <span className="check-dropdown__count">{countText(o.count)}</span>
                </label>
              )
            })}
          </div>
          {query.trim() && shown.length === 0 ? (
            <p className="check-dropdown__none">No match</p>
          ) : null}
          {!(single || required) && selected.length > 0 ? (
            <button
              type="button"
              className="btn btn--ghost btn--small check-dropdown__clear"
              onClick={() => onChange([])}
            >
              Clear
            </button>
          ) : null}
        </fieldset>
      </div>
    </div>
  )
}
