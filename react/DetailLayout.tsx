import clsx from "clsx"
import type { ReactNode } from "react"

/** Detail-page shell: main column + an optional aside rail (put a Sidebar in it). */
export function DetailLayout({
  aside,
  className,
  children,
}: {
  aside?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={clsx("detail-layout", className)}>
      <div className="detail-layout__main">{children}</div>
      {aside}
    </div>
  )
}

/** The rail beside a detail page: a stack of SidebarSections. */
export function Sidebar({
  label,
  className,
  children,
}: {
  /** The rail's accessible name. */
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <aside className={clsx("sidebar", className)} aria-label={label}>
      {children}
    </aside>
  )
}

/** One labelled section of a Sidebar. */
export function SidebarSection({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <section className="sidebar__section">
      <h3 className="sidebar__label">{label}</h3>
      {children}
    </section>
  )
}
