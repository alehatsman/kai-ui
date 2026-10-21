<script lang="ts">
  import type { HTMLTdAttributes } from "svelte/elements"

  interface Props extends HTMLTdAttributes {
    num?: boolean
    nowrap?: boolean
    muted?: boolean
  }
  let {
    num = false,
    nowrap = false,
    muted = false,
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<td
  class={[
    "data-table__cell",
    num && "data-table__cell--num",
    nowrap && "data-table__cell--nowrap",
    muted && "data-table__cell--muted",
    className,
  ]}
  {...rest}>{@render children?.()}</td
>
