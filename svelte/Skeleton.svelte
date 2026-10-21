<script lang="ts">
  import { cssLength, type SkeletonVariant } from "../contract/index.ts"

  // A shimmering placeholder. Decorative (aria-hidden): announce loading elsewhere.
  interface Props {
    variant?: SkeletonVariant
    width?: string | number | undefined
    height?: string | number | undefined
    class?: string | undefined
  }
  let { variant = "line", width, height, class: className }: Props = $props()
</script>

<span
  class={["skeleton", `skeleton--${variant}`, className]}
  style:width={cssLength(width)}
  style:height={cssLength(height)}
  aria-hidden="true"
></span>
