import clsx from "clsx"
import { cssLength, type SkeletonVariant } from "../contract/index.ts"

/** A shimmering placeholder. Decorative (aria-hidden): announce loading elsewhere. */
export function Skeleton({
  variant = "line",
  width,
  height,
  className,
}: {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  className?: string
}) {
  return (
    <span
      className={clsx("skeleton", `skeleton--${variant}`, className)}
      style={{ width: cssLength(width), height: cssLength(height) }}
      aria-hidden="true"
    />
  )
}

/** A paragraph's worth of lines; the last one shorter. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={clsx("skeleton-text", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholders, position is identity
        <span key={i} className="skeleton skeleton--line" />
      ))}
    </span>
  )
}
