<script lang="ts">
  import type { Snippet } from "svelte"
  import Button from "./Button.svelte"
  import Dialog from "./Dialog.svelte"
  import ErrorMessage from "./ErrorMessage.svelte"

  // A destructive confirm: Dialog + Cancel + a danger confirm, the mutation error inline.
  interface Props {
    open: boolean
    title: string
    confirmLabel?: string
    onConfirm: () => void
    onClose?: (() => void) | undefined
    pending?: boolean
    error?: unknown
    children: Snippet
  }
  let {
    open = $bindable(),
    title,
    confirmLabel = "Confirm",
    onConfirm,
    onClose,
    pending = false,
    error,
    children,
  }: Props = $props()

  function close() {
    if (onClose) onClose()
    else open = false
  }
</script>

<Dialog {open} {title} onClose={close}>
  {@render children()}
  {#snippet footer()}
    <ErrorMessage {error} inline />
    <Button variant="ghost" onclick={close} disabled={pending}>Cancel</Button>
    <Button variant="danger" onclick={onConfirm} disabled={pending}>
      {pending ? "Working…" : confirmLabel}
    </Button>
  {/snippet}
</Dialog>
