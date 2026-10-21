<script lang="ts">
  import type { Snippet } from "svelte"

  // A wrapping row of controls, named for assistive tech. `card` puts it on a surface.
  interface Props {
    label: string
    card?: boolean
    class?: string | undefined
    children: Snippet
  }
  let { label, card = false, class: className, children }: Props = $props()
</script>

<div class={["toolbar", card && "toolbar--card", className]} role="group" aria-label={label}>
  {@render children()}
</div>
