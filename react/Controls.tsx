import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"

// input, select, textarea. `invalid` adds is-invalid and aria-invalid together.

export function Input({
  invalid = false,
  className,
  ...rest
}: ComponentPropsWithRef<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={clsx("input", invalid && "is-invalid", className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}

export function Textarea({
  invalid = false,
  className,
  ...rest
}: ComponentPropsWithRef<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={clsx("textarea", invalid && "is-invalid", className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}

export function Select({
  invalid = false,
  className,
  ...rest
}: ComponentPropsWithRef<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={clsx("select", invalid && "is-invalid", className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}
