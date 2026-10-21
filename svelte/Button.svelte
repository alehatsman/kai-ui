<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import type { ButtonSize, ButtonVariant } from "../contract/index.ts"

  // A `<button class="btn">`. Defaults to type="button": a bare button in a form submits.
  interface Props extends HTMLButtonAttributes {
    variant?: ButtonVariant
    size?: ButtonSize
  }
  let {
    variant = "default",
    size = "md",
    type = "button",
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<button
  {type}
  class={["btn", variant !== "default" && `btn--${variant}`, size === "small" && "btn--small", className]}
  {...rest}>{@render children?.()}</button
>
