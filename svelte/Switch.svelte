<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  // An on/off toggle: a native checkbox under a sliding track.
  interface Props extends Omit<HTMLInputAttributes, "type"> {
    label?: string | undefined
  }
  let { label, checked = $bindable(false), class: className, ...rest }: Props = $props()
</script>

<label class={["switch", className]}>
  <span class="switch__control">
    <input type="checkbox" class="switch__input" bind:checked {...rest} />
    <span class="switch__track"></span>
    <span class="switch__thumb"></span>
  </span>
  {#if label != null}<span class="switch__label">{label}</span>{/if}
</label>
