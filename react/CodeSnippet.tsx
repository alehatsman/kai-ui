import clsx from "clsx"
import type { ReactNode } from "react"
import { inRange, type LineRange } from "../contract/index.ts"

/**
 * Read-only, line-numbered code. One entry per line, already highlighted (or
 * plain text): kai-ui never tokenises. `startLine` keeps the gutter matching
 * the original file when `lines` is a slice; `focus` tints a range.
 */
export function CodeSnippet({
  lines,
  startLine = 1,
  focus,
  className,
}: {
  lines: readonly ReactNode[]
  startLine?: number
  focus?: LineRange
  className?: string
}) {
  return (
    <div className={clsx("code-snippet", className)}>
      <table className="code-snippet__table">
        <tbody>
          {lines.map((line, i) => {
            const n = startLine + i
            return (
              <tr key={n} className={clsx("code-line", inRange(n, focus) && "is-focus")}>
                <td className="code-line__num" data-line={n} />
                <td className="code-line__text">{line}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
