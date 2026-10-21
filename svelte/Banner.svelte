<script lang="ts">
  import type { Snippet } from "svelte"
  import type { BannerTone } from "../contract/index.ts"

  // A full-width strip. danger is announced (role="alert"), the rest politely (status).
  // onDismiss adds a × that calls it; the caller removes the banner.
  interface Props {
    tone?: BannerTone
    onDismiss?: (() => void) | undefined
    children: Snippet
    class?: string | undefined
  }
  let { tone = "accent", onDismiss, children, class: className }: Props = $props()
</script>

<div
  class={["banner", tone !== "accent" && `banner--${tone}`, className]}
  role={tone === "danger" ? "alert" : "status"}
>
  {#if onDismiss}
    <div class="banner__message">{@render children()}</div>
    <button type="button" class="banner__dismiss" aria-label="Dismiss" onclick={onDismiss}>×</button>
  {:else}
    {@render children()}
  {/if}
</div>
