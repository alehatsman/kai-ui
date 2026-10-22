<script lang="ts">
  import type { Snippet } from "svelte"

  // One labelled section of a Sidebar.
  interface Props {
    label: string
    children: Snippet
  }
  let { label, children }: Props = $props()
</script>

<section class="sidebar__section">
  <h3 class="sidebar__label">{label}</h3>
  {@render children()}
</section>
