import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"

/** The `data-table` block. `fit` sizes it to content; `wrap` scrolls it sideways in itself. */
export function Table({
  fit = false,
  wrap = false,
  className,
  ...rest
}: ComponentPropsWithRef<"table"> & { fit?: boolean; wrap?: boolean }) {
  const table = (
    <table className={clsx("data-table", fit && "data-table--fit", className)} {...rest} />
  )
  return wrap ? <div className="data-table__wrap">{table}</div> : table
}

/** A header cell; `num` right-aligns it over a number column. */
export function TableHead({
  num = false,
  className,
  ...rest
}: ComponentPropsWithRef<"th"> & { num?: boolean }) {
  return (
    <th className={clsx("data-table__head", num && "data-table__head--num", className)} {...rest} />
  )
}

/** A row; `muted` greys it out. */
export function TableRow({
  muted = false,
  className,
  ...rest
}: ComponentPropsWithRef<"tr"> & { muted?: boolean }) {
  return (
    <tr className={clsx(muted && "data-table__row--muted", className) || undefined} {...rest} />
  )
}

/** A body cell: `num` (right, tabular), `nowrap`, `muted`. */
export function TableCell({
  num = false,
  nowrap = false,
  muted = false,
  className,
  ...rest
}: ComponentPropsWithRef<"td"> & { num?: boolean; nowrap?: boolean; muted?: boolean }) {
  return (
    <td
      className={clsx(
        "data-table__cell",
        num && "data-table__cell--num",
        nowrap && "data-table__cell--nowrap",
        muted && "data-table__cell--muted",
        className
      )}
      {...rest}
    />
  )
}
