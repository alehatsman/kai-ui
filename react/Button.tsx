import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"
import type { ButtonSize, ButtonVariant } from "../contract/index.ts"

/** The `btn` block's classes, for a router `<Link>` or `<a>` that must look like a button. */
export function buttonClass({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string | undefined
} = {}): string {
  return clsx(
    "btn",
    variant !== "default" && `btn--${variant}`,
    size === "small" && "btn--small",
    className
  )
}

/** A `<button class="btn">`. Defaults to `type="button"`: a bare button in a form submits. */
export function Button({
  variant = "default",
  size = "md",
  className,
  type = "button",
  ...rest
}: ComponentPropsWithRef<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...rest} />
}
