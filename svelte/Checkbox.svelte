<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  // The label wraps the native input, so the text is its accessible name.
  interface Props extends Omit<HTMLInputAttributes, "type"> {
    label?: string | undefined
  }
  let { label, checked = $bindable(false), class: className, ...rest }: Props = $props()
</script>

<label class={["checkbox", className]}>
  <input type="checkbox" class="checkbox__input" bind:checked {...rest} />
  {#if label != null}<span class="checkbox__label">{label}</span>{/if}
</label>
