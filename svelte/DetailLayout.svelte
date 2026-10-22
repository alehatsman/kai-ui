<script lang="ts">
  import type { Snippet } from "svelte"

  // Detail-page shell: main column + an optional aside rail (put a Sidebar in it).
  interface Props {
    aside?: Snippet
    class?: string | undefined
    children: Snippet
  }
  let { aside, class: className, children }: Props = $props()
</script>

<div class={["detail-layout", className]}>
  <div class="detail-layout__main">{@render children()}</div>
  {@render aside?.()}
</div>
