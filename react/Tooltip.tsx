import clsx from "clsx"
import { type ReactNode, useId } from "react"
import type { Placement, TooltipSlot } from "../contract/index.ts"

/**
 * A hover/focus hint, CSS only. The control gets the bubble's id as a render prop, as Field
 * does: `<Tooltip label="Copy">{({ describedBy }) => <Button aria-describedby={describedBy}>…`.
 */
export function Tooltip({
  label,
  placement = "top",
  className,
  children,
}: {
  label: string
  placement?: Placement
  className?: string
  children: (slot: TooltipSlot) => ReactNode
}) {
  const id = useId()
  return (
    <span className={clsx("tooltip", className)}>
      {children({ describedBy: id })}
      <span id={id} role="tooltip" className={`tooltip__bubble tooltip__bubble--${placement}`}>
        {label}
      </span>
    </span>
  )
}
