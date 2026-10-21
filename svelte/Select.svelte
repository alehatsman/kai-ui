<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements"

  interface Props extends HTMLSelectAttributes {
    invalid?: boolean
  }
  let {
    invalid = false,
    value = $bindable(),
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<select
  bind:value
  class={["select", invalid && "is-invalid", className]}
  aria-invalid={invalid || undefined}
  {...rest}
>
  {@render children?.()}
</select>
