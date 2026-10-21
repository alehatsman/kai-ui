import clsx from "clsx"
import type { ReactNode } from "react"
import { type BannerTone, errorText } from "../contract/index.ts"

export function EmptyState({
  title,
  children,
  className,
}: {
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx("empty-state", className)}>
      <p className="empty-state__title">{title}</p>
      {children}
    </div>
  )
}

/** The red error box (`inline`: text only, inside a form). A falsy `error` renders nothing. */
export function ErrorMessage({
  error,
  inline = false,
  className,
  id,
}: {
  error: unknown
  inline?: boolean
  className?: string
  id?: string
}) {
  if (!error) return null
  return (
    <div
      className={clsx("error-message", inline && "error-message--inline", className)}
      id={id}
      role="alert"
    >
      {errorText(error)}
    </div>
  )
}

/** A full-width strip. danger is announced (`role="alert"`), the rest politely (`status`). */
export function Banner({
  tone = "accent",
  children,
  className,
}: {
  tone?: BannerTone
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx("banner", tone !== "accent" && `banner--${tone}`, className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      {children}
    </div>
  )
}

export function Spinner({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <span className={clsx("spinner", className)} role="status">
      <span className="spinner__ring" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </span>
  )
}
