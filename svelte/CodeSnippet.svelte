<script lang="ts">
  import type { Snippet } from "svelte"
  import { inRange, type LineRange } from "../contract/index.ts"

  // Read-only, line-numbered code. One entry per line, plain text; pass a
  // `line` snippet to render highlighted runs. kai-ui never tokenises.
  interface Props {
    lines: readonly string[]
    startLine?: number
    focus?: LineRange | undefined
    line?: Snippet<[text: string, n: number]>
    class?: string | undefined
  }
  let { lines, startLine = 1, focus, line, class: className }: Props = $props()
</script>

<div class={["code-snippet", className]}>
  <table class="code-snippet__table">
    <tbody>
      {#each lines as text, i (i)}
        {@const n = startLine + i}
        <tr class={["code-line", inRange(n, focus) && "is-focus"]}>
          <td class="code-line__num" data-line={n}></td>
          <td class="code-line__text">{#if line}{@render line(text, n)}{:else}{text}{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
