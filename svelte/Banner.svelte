<script lang="ts">
  import type { Snippet } from "svelte"
  import type { BannerTone } from "../contract/index.ts"

  // A full-width strip. danger is announced (role="alert"), the rest politely (status).
  interface Props {
    tone?: BannerTone
    children: Snippet
    class?: string | undefined
  }
  let { tone = "accent", children, class: className }: Props = $props()
</script>

<div
  class={["banner", tone !== "accent" && `banner--${tone}`, className]}
  role={tone === "danger" ? "alert" : "status"}
>
  {@render children()}
</div>
