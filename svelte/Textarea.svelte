<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements"

  interface Props extends HTMLTextareaAttributes {
    invalid?: boolean
  }
  let { invalid = false, value = $bindable(), class: className, ...rest }: Props = $props()
</script>

<textarea
  bind:value
  class={["textarea", invalid && "is-invalid", className]}
  aria-invalid={invalid || undefined}
  {...rest}
></textarea>
