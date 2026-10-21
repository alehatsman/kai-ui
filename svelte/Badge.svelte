<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { type Tone, toneClass } from "../contract/index.ts"

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone
  }
  let { tone = "neutral", class: className, children, ...rest }: Props = $props()
</script>

<span class={["badge", toneClass("badge", tone), className]} {...rest}>{@render children?.()}</span>
