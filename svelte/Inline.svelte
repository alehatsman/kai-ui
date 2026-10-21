<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import type { InlineAlign, InlineJustify, SpaceStep } from "../contract/index.ts"

  // A row, the inline block. Default gap 2 (8px), centred, no wrap.
  interface Props extends HTMLAttributes<HTMLElement> {
    gap?: SpaceStep
    align?: InlineAlign
    justify?: InlineJustify
    wrap?: boolean
    as?: string
  }
  let {
    gap = 2,
    align = "center",
    justify = "start",
    wrap = false,
    as = "div",
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={as}
  class={[
    "inline",
    `inline--gap-${gap}`,
    `inline--align-${align}`,
    `inline--justify-${justify}`,
    wrap && "inline--wrap",
    className,
  ]}
  {...rest}
>
  {@render children?.()}
</svelte:element>
