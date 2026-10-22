import { ICONS, type IconName, type IconOptions, iconAttrs } from "../contract/index.ts"

/** An Octicon. Decorative unless `label` is set; colour follows the text. */
export function Icon({ name, ...opts }: { name: IconName } & IconOptions) {
  const { class: className, ...attrs } = iconAttrs(opts)
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: iconAttrs gives role="img" + aria-label, or aria-hidden
    <svg className={className} {...attrs}>
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
