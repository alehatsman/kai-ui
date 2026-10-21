<script lang="ts" generics="T extends string">
  import type { SegmentedOption } from "../contract/index.ts"

  // Pick one of a few. bind:value, or value + onChange — the caller owns where it lives.
  interface Props {
    label: string
    options: readonly SegmentedOption<T>[]
    value: T
    onChange?: ((value: T) => void) | undefined
    disabled?: boolean
    class?: string | undefined
  }
  let {
    label,
    options,
    value = $bindable(),
    onChange,
    disabled = false,
    class: className,
  }: Props = $props()

  function pick(next: T) {
    value = next
    onChange?.(next)
  }
</script>

<div class={["segmented", className]} role="group" aria-label={label}>
  {#each options as o (o.value)}
    <button
      type="button"
      class={["segmented__option", o.value === value && "is-active"]}
      aria-pressed={o.value === value}
      {disabled}
      onclick={() => pick(o.value)}>{o.label}</button
    >
  {/each}
</div>
