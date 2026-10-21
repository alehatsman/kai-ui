import { useSyncExternalStore } from "react"
import type { Toaster } from "../behavior/toast.ts"

/** Renders a toaster's queue. Mount once; push from anywhere via the toaster module. */
export function ToastStack({ toaster }: { toaster: Toaster }) {
  const toasts = useSyncExternalStore(toaster.subscribe, toaster.list)
  return (
    <section className="toast-stack" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={t.tone === "accent" ? "toast" : `toast toast--${t.tone}`}
          role={t.tone === "danger" ? "alert" : undefined}
        >
          <span className="toast__message">{t.message}</span>
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss"
            onClick={() => toaster.dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </section>
  )
}
