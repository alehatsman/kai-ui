<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  interface Props extends HTMLInputAttributes {
    invalid?: boolean
  }
  let { invalid = false, value = $bindable(), class: className, ...rest }: Props = $props()
</script>

<input
  bind:value
  class={["input", invalid && "is-invalid", className]}
  aria-invalid={invalid || undefined}
  {...rest}
/>
