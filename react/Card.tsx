import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"

/** A bordered surface. Compose with `card__header` / `card__title` / `card__body`, or `padded`. */
export function Card({
  padded = false,
  selected = false,
  className,
  ...rest
}: ComponentPropsWithRef<"div"> & { padded?: boolean; selected?: boolean }) {
  return (
    <div
      className={clsx("card", padded && "card--padded", selected && "card--selected", className)}
      {...rest}
    />
  )
}
