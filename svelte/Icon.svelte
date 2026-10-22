<script lang="ts">
  import { ICONS, type IconName, iconAttrs } from "../contract/index.ts"

  // An Octicon. Decorative unless `label` is set; colour follows the text.
  interface Props {
    name: IconName
    label?: string | undefined
    size?: number
    class?: string | undefined
  }
  let { name, label, size = 16, class: className }: Props = $props()
</script>

<svg {...iconAttrs({ label, size, className })}>
  {#each ICONS[name] as d (d)}<path {d}></path>{/each}
</svg>
