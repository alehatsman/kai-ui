import clsx from "clsx"
import { useState } from "react"
import { type AvatarSize, initials } from "../contract/index.ts"

/** An image, or up to two initials on the accent fill. `name` is the accessible label. */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string
  src?: string | undefined
  size?: AvatarSize
  className?: string
}) {
  const [failed, setFailed] = useState<string | undefined>(undefined)
  const showImage = src !== undefined && failed !== src
  return (
    <span
      className={clsx("avatar", size !== "md" && `avatar--${size}`, className)}
      role="img"
      aria-label={name}
      title={name}
    >
      {showImage ? (
        <img className="avatar__img" src={src} alt="" onError={() => setFailed(src)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}
