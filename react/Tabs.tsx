import clsx from "clsx"
import { Fragment, type ReactNode } from "react"
import type { TabItem } from "../contract/index.ts"

export interface TabLinkProps {
  href: string
  className: string
  "aria-current": "page" | undefined
  children: ReactNode
}

/**
 * Navigation tabs: links, `aria-current="page"` on the current one. Router-agnostic — pass
 * `renderLink` to render your router's link: `renderLink={(p) => <Link to={p.href} {...p} />}`.
 */
export function Tabs({
  label,
  items,
  renderLink = (p) => <a {...p} />,
  className,
}: {
  label: string
  items: readonly TabItem[]
  renderLink?: (props: TabLinkProps) => ReactNode
  className?: string
}) {
  return (
    <nav className={clsx("tabs", className)} aria-label={label}>
      {items.map((item) => (
        <Fragment key={item.href}>
          {renderLink({
            href: item.href,
            className: "tabs__item",
            "aria-current": item.current ? "page" : undefined,
            children: (
              <>
                {item.label}
                {item.count === undefined ? null : (
                  <span className="tabs__count">{item.count}</span>
                )}
              </>
            ),
          })}
        </Fragment>
      ))}
    </nav>
  )
}
