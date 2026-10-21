import clsx from "clsx"
import { type ReactNode, useId } from "react"
import type { FieldSlot } from "../contract/index.ts"

/**
 * A labelled form field, the `field` block. Pass the control as a render prop to get the ids:
 * `<Field label="Name">{({ controlId, describedBy }) => <Input id={controlId}
 * aria-describedby={describedBy} />}</Field>`, or pass `htmlFor` and wire them yourself.
 */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  htmlFor?: string
  className?: string
  children: ReactNode | ((slot: FieldSlot) => ReactNode)
}) {
  const generated = useId()
  const controlId = htmlFor ?? generated
  const hintId = hint == null ? undefined : `${controlId}-hint`
  const errorId = error == null || error === false ? undefined : `${controlId}-error`
  const describedBy = clsx(hintId, errorId) || undefined
  return (
    <div className={clsx("field", className)}>
      <label className="field__label" htmlFor={controlId}>
        {label}
      </label>
      {typeof children === "function" ? children({ controlId, describedBy }) : children}
      {hintId ? (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {errorId ? (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  )
}
