<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"

  interface Props extends HTMLAttributes<HTMLTableRowElement> {
    muted?: boolean
  }
  let { muted = false, class: className, children, ...rest }: Props = $props()
</script>

<tr class={[muted && "data-table__row--muted", className]} {...rest}>{@render children?.()}</tr>
