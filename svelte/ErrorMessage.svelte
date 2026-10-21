<script lang="ts">
  import { errorText } from "../contract/index.ts"

  // The red error box (`inline`: text only, inside a form). A falsy `error` renders nothing.
  interface Props {
    error: unknown
    inline?: boolean
    id?: string | undefined
    class?: string | undefined
  }
  let { error, inline = false, id, class: className }: Props = $props()
</script>

{#if error}
  <div class={["error-message", inline && "error-message--inline", className]} {id} role="alert">
    {errorText(error)}
  </div>
{/if}
