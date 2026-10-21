// The modal half of layer 2. The parent's `open` is the only truth: every
// native way a <dialog> closes itself (Esc, a method="dialog" submit) and a
// backdrop click are routed to onClose instead, and syncDialog makes the
// element follow `open`.

// Closes the parent asked for. Their `close` event must not echo back as a
// second onClose — the event is queued, so it is matched up in the handler.
const closingBySync = new WeakSet<HTMLDialogElement>()

/** Make the element match `open`. Safe to call on every render. */
export function syncDialog(el: HTMLDialogElement, open: boolean): void {
  if (open && !el.open && el.isConnected) el.showModal()
  else if (!open && el.open) {
    closingBySync.add(el)
    el.close()
  }
}

/** Route Esc, backdrop click and native close to `onClose`. Returns a cleanup. */
export function attachDialog(el: HTMLDialogElement, onClose: () => void): () => void {
  const onCancel = (e: Event) => {
    // Esc: keep the dialog open until the parent says otherwise.
    e.preventDefault()
    onClose()
  }
  const onClick = (e: MouseEvent) => {
    if (e.target === el) onClose()
  }
  // A method="dialog" submit (or anything else) closed it natively.
  const onNativeClose = () => {
    if (closingBySync.delete(el)) return
    onClose()
  }
  el.addEventListener("cancel", onCancel)
  el.addEventListener("click", onClick)
  el.addEventListener("close", onNativeClose)
  return () => {
    el.removeEventListener("cancel", onCancel)
    el.removeEventListener("click", onClick)
    el.removeEventListener("close", onNativeClose)
    // Unmounted while open: no orphaned modal left in the top layer.
    if (el.open) el.close()
  }
}
