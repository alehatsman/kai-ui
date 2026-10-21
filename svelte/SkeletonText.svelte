<script lang="ts">
  // A paragraph's worth of lines; the last one shorter.
  interface Props {
    lines?: number
    class?: string | undefined
  }
  let { lines = 3, class: className }: Props = $props()
</script>

<span class={["skeleton-text", className]} aria-hidden="true">
  {#each { length: lines }, i (i)}<span class="skeleton skeleton--line"></span>{/each}
</span>
