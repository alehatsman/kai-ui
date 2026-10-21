<script lang="ts">
  import { pageList } from "../contract/index.ts"
  import Button from "./Button.svelte"

  // Previous, page numbers, Next. 1-based; bind:page, or page + onPage. Nothing for one page.
  interface Props {
    page: number
    last: number
    onPage?: ((page: number) => void) | undefined
    class?: string | undefined
  }
  let { page = $bindable(), last, onPage, class: className }: Props = $props()

  function go(p: number) {
    page = p
    onPage?.(p)
  }
</script>

{#if last > 1}
  <nav class={["pagination", className]} aria-label="Pages">
    <Button size="small" disabled={page <= 1} onclick={() => go(page - 1)}>Previous</Button>
    {#each pageList(page, last) as p, i (p ?? `gap-${i}`)}
      {#if p === null}
        <span class="pagination__gap" aria-hidden="true">…</span>
      {:else}
        <Button
          size="small"
          class={["pagination__page", p === page && "is-active"]}
          aria-current={p === page ? "page" : undefined}
          onclick={() => go(p)}>{p}</Button
        >
      {/if}
    {/each}
    <Button size="small" disabled={page >= last} onclick={() => go(page + 1)}>Next</Button>
  </nav>
{/if}
