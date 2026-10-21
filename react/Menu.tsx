import clsx from "clsx"
import { type ReactNode, useEffect, useId, useRef } from "react"
import { attachMenu } from "../behavior/menu.ts"
import type { ButtonSize, ButtonVariant, MenuItem } from "../contract/index.ts"
import { buttonClass } from "./Button.tsx"

/** A button-triggered action menu on popover="auto"; keys and placement by behavior/menu.ts. */
export function Menu({
  label,
  trigger,
  items,
  align = "start",
  variant = "default",
  size = "md",
  className,
}: {
  /** The menu's accessible name. */
  label: string
  trigger: ReactNode
  items: readonly MenuItem<ReactNode>[]
  align?: "start" | "end"
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => (root.current ? attachMenu(root.current) : undefined), [])
  return (
    <div ref={root} className={clsx("menu", className)}>
      <button
        type="button"
        className={buttonClass({ variant, size })}
        popoverTarget={id}
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls={id}
      >
        {trigger}
      </button>
      <div
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        className={clsx("menu__popover", align === "end" && "menu__popover--end")}
      >
        {items.map((item, i) => (
          // biome-ignore lint/a11y/useAriaPropsSupportedByRole: role is menuitemradio whenever aria-checked is set
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: items are a static list; label may be a node
            key={i}
            type="button"
            className="menu__item"
            role={item.selected === undefined ? "menuitem" : "menuitemradio"}
            aria-checked={item.selected}
            tabIndex={-1}
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
