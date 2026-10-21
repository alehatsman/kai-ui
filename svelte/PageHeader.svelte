<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    title: string
    meta?: string | undefined
    actions?: Snippet | undefined
    class?: string | undefined
  }
  let { title, meta, actions, class: className }: Props = $props()
</script>

<header class={["page-header", className]}>
  <h1 class="page-header__title">{title}</h1>
  {#if meta != null}<span class="page-header__meta">{meta}</span>{/if}
  {#if actions}<div class="page-header__actions">{@render actions()}</div>{/if}
</header>
