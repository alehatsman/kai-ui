import clsx from "clsx"
import type { ReactNode } from "react"

export function PageHeader({
  title,
  meta,
  actions,
  className,
}: {
  title: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <header className={clsx("page-header", className)}>
      <h1 className="page-header__title">{title}</h1>
      {meta == null ? null : <span className="page-header__meta">{meta}</span>}
      {actions == null ? null : <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
