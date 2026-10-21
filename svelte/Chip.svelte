<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  // A filter toggle: a real checkbox under a pill. Native props go to the input.
  interface Props extends Omit<HTMLInputAttributes, "type"> {
    label: string
    count?: number | undefined
  }
  let { label, count, checked = $bindable(false), class: className, ...rest }: Props = $props()
</script>

<label class={["chip", className]}>
  <input type="checkbox" class="chip__input" bind:checked {...rest} />
  <span class="chip__label">{label}</span>
  {#if count !== undefined}<span class="chip__count">{count}</span>{/if}
</label>
