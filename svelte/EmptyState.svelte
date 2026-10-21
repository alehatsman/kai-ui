<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    title: string
    children?: Snippet | undefined
    class?: string | undefined
  }
  let { title, children, class: className }: Props = $props()
</script>

<div class={["empty-state", className]}>
  <p class="empty-state__title">{title}</p>
  {@render children?.()}
</div>
