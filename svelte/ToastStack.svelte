<script lang="ts">
  import type { Toast, Toaster } from "../behavior/toast.ts"

  // Renders a toaster's queue. Mount once; push from anywhere via the toaster module.
  let { toaster }: { toaster: Toaster } = $props()

  let toasts: readonly Toast[] = $state([])
  $effect(() => {
    toasts = toaster.list()
    return toaster.subscribe(() => {
      toasts = toaster.list()
    })
  })
</script>

<section class="toast-stack" aria-label="Notifications" aria-live="polite">
  {#each toasts as t (t.id)}
    <div
      class={t.tone === "accent" ? "toast" : `toast toast--${t.tone}`}
      role={t.tone === "danger" ? "alert" : undefined}
    >
      <span class="toast__message">{t.message}</span>
      <button type="button" class="toast__close" aria-label="Dismiss" onclick={() => toaster.dismiss(t.id)}
        >×</button
      >
    </div>
  {/each}
</section>
