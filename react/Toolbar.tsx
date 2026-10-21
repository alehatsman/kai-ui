import clsx from "clsx"
import type { ReactNode } from "react"

/** A wrapping row of controls, named for assistive tech. `card` puts it on a surface. */
export function Toolbar({
  label,
  card = false,
  className,
  children,
}: {
  label: string
  card?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a labelled group of controls; fieldset brings form chrome
    <div
      className={clsx("toolbar", card && "toolbar--card", className)}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  )
}
