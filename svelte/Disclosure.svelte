<script lang="ts">
  import type { HTMLDetailsAttributes } from "svelte/elements"

  // A native <details>: `summary` always visible. bind:open for its state.
  interface Props extends HTMLDetailsAttributes {
    summary: string
  }
  let { summary, open = $bindable(false), class: className, children, ...rest }: Props = $props()
</script>

<details class={["disclosure", className]} bind:open {...rest}>
  <summary class="disclosure__summary">{summary}</summary>
  <div class="disclosure__body">{@render children?.()}</div>
</details>
