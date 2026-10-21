<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import type { SpaceStep, StackAlign } from "../contract/index.ts"

  // A column, the stack block. Default gap 4 (16px), children stretched.
  interface Props extends HTMLAttributes<HTMLElement> {
    gap?: SpaceStep
    align?: StackAlign
    as?: string
  }
  let {
    gap = 4,
    align = "stretch",
    as = "div",
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={as}
  class={["stack", `stack--gap-${gap}`, `stack--align-${align}`, className]}
  {...rest}
>
  {@render children?.()}
</svelte:element>
