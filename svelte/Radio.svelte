<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  // bind:group on the component binds the group of radios sharing `name`.
  interface Props extends Omit<HTMLInputAttributes, "type"> {
    label?: string | undefined
    group?: unknown
  }
  let { label, group = $bindable(), class: className, ...rest }: Props = $props()
</script>

<label class={["radio", className]}>
  <input type="radio" class="radio__input" bind:group {...rest} />
  {#if label != null}<span class="radio__label">{label}</span>{/if}
</label>
