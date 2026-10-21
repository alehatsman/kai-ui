import clsx from "clsx"
import { type FormEvent, type ReactNode, useEffect, useRef } from "react"
import { attachDialog, syncDialog } from "../behavior/dialog.ts"
import { Button } from "./Button.tsx"
import { ErrorMessage } from "./Feedback.tsx"

/**
 * A modal, the `modal` block on a native `<dialog>`. `open` is the only truth: Esc, the ×,
 * a backdrop click and a `method="dialog"` submit all call `onClose`. With `onSubmit`, the
 * form submit is yours (default prevented) — close it by setting `open` false.
 */
export function Dialog({
  open,
  title,
  onClose,
  onSubmit,
  footer,
  className,
  children,
}: {
  open: boolean
  title: ReactNode
  onClose: () => void
  onSubmit?: ((e: FormEvent<HTMLFormElement>) => void) | undefined
  footer?: ReactNode
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    const el = ref.current
    return el ? attachDialog(el, () => onCloseRef.current()) : undefined
  }, [])
  useEffect(() => {
    if (ref.current) syncDialog(ref.current, open)
  }, [open])
  return (
    <dialog ref={ref} className={clsx("modal", className)}>
      <form
        className="modal__form"
        method="dialog"
        onSubmit={
          onSubmit &&
          ((e) => {
            e.preventDefault()
            onSubmit(e)
          })
        }
      >
        <header className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer == null ? null : <footer className="modal__foot">{footer}</footer>}
      </form>
    </dialog>
  )
}

/** A destructive confirm: Dialog + Cancel + a danger confirm, the mutation error inline. */
export function ConfirmDialog({
  open,
  title,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  pending = false,
  error,
  children,
}: {
  open: boolean
  title: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  onClose: () => void
  pending?: boolean
  error?: unknown
  children: ReactNode
}) {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <ErrorMessage error={error} inline />
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={pending}>
            {pending ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  )
}
