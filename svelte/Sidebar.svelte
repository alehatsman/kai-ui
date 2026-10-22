<script lang="ts">
  import type { Snippet } from "svelte"

  // The rail beside a detail page: a stack of SidebarSections.
  interface Props {
    label: string
    class?: string | undefined
    children: Snippet
  }
  let { label, class: className, children }: Props = $props()
</script>

<aside class={["sidebar", className]} aria-label={label}>{@render children()}</aside>
