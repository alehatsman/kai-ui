<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"

  // A bordered surface. Compose with card__header / card__title / card__body, or `padded`.
  interface Props extends HTMLAttributes<HTMLDivElement> {
    padded?: boolean
    selected?: boolean
  }
  let { padded = false, selected = false, class: className, children, ...rest }: Props = $props()
</script>

<div
  class={["card", padded && "card--padded", selected && "card--selected", className]}
  {...rest}
>
  {@render children?.()}
</div>
