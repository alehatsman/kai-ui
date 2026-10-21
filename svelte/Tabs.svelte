<script lang="ts">
  import type { TabItem } from "../contract/index.ts"

  // Navigation tabs: links, aria-current="page" on the current one.
  interface Props {
    label: string
    items: readonly TabItem[]
    class?: string | undefined
  }
  let { label, items, class: className }: Props = $props()
</script>

<nav class={["tabs", className]} aria-label={label}>
  {#each items as item (item.href)}
    <a href={item.href} class="tabs__item" aria-current={item.current ? "page" : undefined}
      >{item.label}{#if item.count !== undefined}<span class="tabs__count">{item.count}</span>{/if}</a
    >
  {/each}
</nav>
