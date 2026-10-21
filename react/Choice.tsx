import clsx from "clsx"
import type { ComponentPropsWithRef, ReactNode } from "react"

// checkbox, radio, switch: the label wraps the native input, so the text is its name.

type Props = ComponentPropsWithRef<"input"> & { label?: ReactNode }

export function Checkbox({ label, className, ...rest }: Props) {
  return (
    <label className={clsx("checkbox", className)}>
      <input type="checkbox" className="checkbox__input" {...rest} />
      {label == null ? null : <span className="checkbox__label">{label}</span>}
    </label>
  )
}

export function Radio({ label, className, ...rest }: Props) {
  return (
    <label className={clsx("radio", className)}>
      <input type="radio" className="radio__input" {...rest} />
      {label == null ? null : <span className="radio__label">{label}</span>}
    </label>
  )
}

/** An on/off toggle: a native checkbox under a sliding track. */
export function Switch({ label, className, ...rest }: Props) {
  return (
    <label className={clsx("switch", className)}>
      <span className="switch__control">
        <input type="checkbox" className="switch__input" {...rest} />
        <span className="switch__track" />
        <span className="switch__thumb" />
      </span>
      {label == null ? null : <span className="switch__label">{label}</span>}
    </label>
  )
}
