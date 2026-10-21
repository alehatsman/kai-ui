import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"

/** A filter toggle: a real checkbox under a pill. Native props go to the input. */
export function Chip({
  label,
  count,
  className,
  ...rest
}: Omit<ComponentPropsWithRef<"input">, "type"> & { label: string; count?: number }) {
  return (
    <label className={clsx("chip", className)}>
      <input type="checkbox" className="chip__input" {...rest} />
      <span className="chip__label">{label}</span>
      {count === undefined ? null : <span className="chip__count">{count}</span>}
    </label>
  )
}
