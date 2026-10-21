<script lang="ts">
  import type { Snippet } from "svelte"
  import { attachDialog, syncDialog } from "../behavior/dialog.ts"

  // A modal on a native <dialog>. `open` is the only truth: Esc, the ×, a backdrop click and a
  // method="dialog" submit all close it — through onClose when given (the parent decides),
  // else by writing `open` (use bind:open). With onSubmit the submit is yours.
  interface Props {
    open: boolean
    title: string
    onClose?: (() => void) | undefined
    onSubmit?: ((e: SubmitEvent) => void) | undefined
    footer?: Snippet | undefined
    class?: string | undefined
    children: Snippet
  }
  let {
    open = $bindable(),
    title,
    onClose,
    onSubmit,
    footer,
    class: className,
    children,
  }: Props = $props()

  let el: HTMLDialogElement | undefined = $state()

  function close() {
    if (onClose) onClose()
    else open = false
  }

  function submit(e: SubmitEvent) {
    if (!onSubmit) return
    e.preventDefault()
    onSubmit(e)
  }

  $effect(() => {
    if (el) syncDialog(el, open)
  })
</script>

<dialog bind:this={el} class={["modal", className]} {@attach (node) => attachDialog(node, close)}>
  <form class="modal__form" method="dialog" onsubmit={submit}>
    <header class="modal__head">
      <h2 class="modal__title">{title}</h2>
      <button type="button" class="modal__close" aria-label="Close" onclick={close}>×</button>
    </header>
    <div class="modal__body">{@render children()}</div>
    {#if footer}<footer class="modal__foot">{@render footer()}</footer>{/if}
  </form>
</dialog>
