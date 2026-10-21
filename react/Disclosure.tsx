import clsx from "clsx"
import type { ComponentPropsWithRef, ReactNode } from "react"

/** A native `<details>`: `summary` always visible. `open` / `onToggle` pass through. */
export function Disclosure({
  summary,
  className,
  children,
  ...rest
}: Omit<ComponentPropsWithRef<"details">, "summary"> & { summary: ReactNode }) {
  return (
    <details className={clsx("disclosure", className)} {...rest}>
      <summary className="disclosure__summary">{summary}</summary>
      <div className="disclosure__body">{children}</div>
    </details>
  )
}
