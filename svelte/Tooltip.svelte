<script lang="ts">
  import type { Snippet } from "svelte"
  import type { Placement, TooltipSlot } from "../contract/index.ts"

  // A hover/focus hint, CSS only. The control snippet gets the bubble's id:
  // {#snippet children({ describedBy })}<Button aria-describedby={describedBy}>…{/snippet}
  interface Props {
    label: string
    placement?: Placement
    class?: string | undefined
    children: Snippet<[TooltipSlot]>
  }
  let { label, placement = "top", class: className, children }: Props = $props()

  const id = $props.id()
</script>

<span class={["tooltip", className]}>
  {@render children({ describedBy: id })}
  <span {id} role="tooltip" class="tooltip__bubble tooltip__bubble--{placement}">{label}</span>
</span>
