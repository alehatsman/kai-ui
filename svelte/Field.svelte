<script lang="ts">
  import type { Snippet } from "svelte"
  import type { FieldSlot } from "../contract/index.ts"

  // A labelled form field. The control snippet receives the ids:
  // {#snippet children({ controlId, describedBy })}<Input id={controlId} aria-describedby={describedBy} />{/snippet}
  interface Props {
    label: string
    hint?: string | undefined
    error?: string | undefined
    htmlFor?: string | undefined
    class?: string | undefined
    children: Snippet<[FieldSlot]>
  }
  let { label, hint, error, htmlFor, class: className, children }: Props = $props()

  const generated = $props.id()
  const controlId = $derived(htmlFor ?? generated)
  const hintId = $derived(hint == null ? undefined : `${controlId}-hint`)
  const errorId = $derived(error == null || error === "" ? undefined : `${controlId}-error`)
  const describedBy = $derived([hintId, errorId].filter(Boolean).join(" ") || undefined)
</script>

<div class={["field", className]}>
  <label class="field__label" for={controlId}>{label}</label>
  {@render children({ controlId, describedBy })}
  {#if hintId}<span class="field__hint" id={hintId}>{hint}</span>{/if}
  {#if errorId}<span class="field__error" id={errorId}>{error}</span>{/if}
</div>
