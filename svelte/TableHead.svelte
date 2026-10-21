<script lang="ts">
  import type { HTMLThAttributes } from "svelte/elements"

  interface Props extends HTMLThAttributes {
    num?: boolean
  }
  let { num = false, class: className, children, ...rest }: Props = $props()
</script>

<th class={["data-table__head", num && "data-table__head--num", className]} {...rest}
  >{@render children?.()}</th
>
