<script lang="ts">
  import { type AvatarSize, initials } from "../contract/index.ts"

  // An image, or up to two initials on the accent fill. `name` is the accessible label.
  interface Props {
    name: string
    src?: string | undefined
    size?: AvatarSize
    class?: string | undefined
  }
  let { name, src, size = "md", class: className }: Props = $props()

  let failed: string | undefined = $state()
  const showImage = $derived(src !== undefined && failed !== src)
</script>

<span
  class={["avatar", size !== "md" && `avatar--${size}`, className]}
  role="img"
  aria-label={name}
  title={name}
>
  {#if showImage}
    <img class="avatar__img" {src} alt="" onerror={() => (failed = src)} />
  {:else}
    {initials(name)}
  {/if}
</span>
