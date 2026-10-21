// A toast queue as a plain module (UI.md rule 21): the app creates one
// toaster, anything may push to it, the binding's ToastStack renders it.

import type { BannerTone } from "../contract/index.ts"

export interface Toast {
  id: number
  message: string
  tone: BannerTone
}

export interface ToastOptions {
  tone?: BannerTone
  /** Auto-dismiss after this many ms; 0 keeps it until dismissed. Default 4000. */
  duration?: number
}

export interface Toaster {
  push(message: string, options?: ToastOptions): number
  dismiss(id: number): void
  /** Current toasts, oldest first. A new array on every change. */
  list(): readonly Toast[]
  /** Called on every change. Returns an unsubscribe. */
  subscribe(fn: () => void): () => void
}

export function createToaster(): Toaster {
  let toasts: readonly Toast[] = []
  let nextId = 1
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  const listeners = new Set<() => void>()
  const emit = () => {
    for (const fn of listeners) fn()
  }

  function dismiss(id: number) {
    clearTimeout(timers.get(id))
    timers.delete(id)
    const next = toasts.filter((t) => t.id !== id)
    if (next.length === toasts.length) return
    toasts = next
    emit()
  }

  return {
    push(message, { tone = "accent", duration = 4000 } = {}) {
      const id = nextId++
      toasts = [...toasts, { id, message, tone }]
      if (duration > 0)
        timers.set(
          id,
          setTimeout(() => dismiss(id), duration)
        )
      emit()
      return id
    },
    dismiss,
    list: () => toasts,
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
