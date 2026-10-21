import clsx from "clsx"
import type { ElementType, HTMLAttributes, ReactNode } from "react"
import type { InlineAlign, InlineJustify, SpaceStep, StackAlign } from "../contract/index.ts"

interface Common extends HTMLAttributes<HTMLElement> {
  gap?: SpaceStep
  /** Render as another element ("section", "ul"). */
  as?: ElementType
  children: ReactNode
}

/** A column, the `stack` block. Default gap 4 (16px), children stretched. */
export function Stack({
  gap = 4,
  align = "stretch",
  as: Tag = "div",
  className,
  ...rest
}: Common & { align?: StackAlign }) {
  return (
    <Tag
      className={clsx("stack", `stack--gap-${gap}`, `stack--align-${align}`, className)}
      {...rest}
    />
  )
}

/** A row, the `inline` block. Default gap 2 (8px), centred, no wrap. */
export function Inline({
  gap = 2,
  align = "center",
  justify = "start",
  wrap = false,
  as: Tag = "div",
  className,
  ...rest
}: Common & { align?: InlineAlign; justify?: InlineJustify; wrap?: boolean }) {
  return (
    <Tag
      className={clsx(
        "inline",
        `inline--gap-${gap}`,
        `inline--align-${align}`,
        `inline--justify-${justify}`,
        wrap && "inline--wrap",
        className
      )}
      {...rest}
    />
  )
}
