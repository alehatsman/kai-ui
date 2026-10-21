import clsx from "clsx"
import type { ComponentPropsWithRef } from "react"
import { type Tone, toneClass } from "../contract/index.ts"

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: ComponentPropsWithRef<"span"> & { tone?: Tone }) {
  return <span className={clsx("badge", toneClass("badge", tone), className)} {...rest} />
}
