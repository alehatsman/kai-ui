import clsx from "clsx"
import { pageList } from "../contract/index.ts"
import { Button } from "./Button.tsx"

/** Previous, page numbers, Next. 1-based; the caller owns `page`. Nothing for one page. */
export function Pagination({
  page,
  last,
  onPage,
  className,
}: {
  page: number
  last: number
  onPage: (page: number) => void
  className?: string
}) {
  if (last <= 1) return null
  return (
    <nav className={clsx("pagination", className)} aria-label="Pages">
      <Button size="small" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      {pageList(page, last).map((p, i) =>
        p === null ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: a gap has no identity but its position
          <span key={`gap-${i}`} className="pagination__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <Button
            key={p}
            size="small"
            className={clsx("pagination__page", p === page && "is-active")}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPage(p)}
          >
            {p}
          </Button>
        )
      )}
      <Button size="small" disabled={page >= last} onClick={() => onPage(page + 1)}>
        Next
      </Button>
    </nav>
  )
}
