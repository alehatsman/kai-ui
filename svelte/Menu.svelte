<script lang="ts">
  import { attachMenu } from "../behavior/menu.ts"
  import type { ButtonSize, ButtonVariant, MenuItem } from "../contract/index.ts"

  // A button-triggered action menu on popover="auto"; keys and placement by behavior/menu.ts.
  interface Props {
    label: string
    trigger: string
    items: readonly MenuItem[]
    align?: "start" | "end"
    variant?: ButtonVariant
    size?: ButtonSize
    class?: string | undefined
  }
  let {
    label,
    trigger,
    items,
    align = "start",
    variant = "default",
    size = "md",
    class: className,
  }: Props = $props()

  const id = $props.id()
</script>

<div class={["menu", className]} {@attach attachMenu}>
  <button
    type="button"
    class={["btn", variant !== "default" && `btn--${variant}`, size === "small" && "btn--small"]}
    popovertarget={id}
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls={id}>{trigger}</button
  >
  <div
    {id}
    popover="auto"
    role="menu"
    aria-label={label}
    class={["menu__popover", align === "end" && "menu__popover--end"]}
  >
    {#each items as item, i (i)}
      <button
        type="button"
        class="menu__item"
        role={item.selected === undefined ? "menuitem" : "menuitemradio"}
        aria-checked={item.selected}
        tabindex="-1"
        disabled={item.disabled}
        onclick={item.onSelect}>{item.label}</button
      >
    {/each}
  </div>
</div>
