<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements"

  // The data-table block. `fit` sizes it to content; `wrap` scrolls it sideways in itself.
  interface Props extends HTMLTableAttributes {
    fit?: boolean
    wrap?: boolean
  }
  let { fit = false, wrap = false, class: className, children, ...rest }: Props = $props()
</script>

{#snippet table()}
  <table class={["data-table", fit && "data-table--fit", className]} {...rest}>
    {@render children?.()}
  </table>
{/snippet}

{#if wrap}
  <div class="data-table__wrap">{@render table()}</div>
{:else}
  {@render table()}
{/if}
