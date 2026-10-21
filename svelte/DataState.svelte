<script lang="ts" generics="T">
  import type { Snippet } from "svelte"
  import ErrorMessage from "./ErrorMessage.svelte"
  import Spinner from "./Spinner.svelte"

  // The loading → error → empty → data gate, once (UI.md rule 26).
  interface Props {
    data: readonly T[] | null | undefined
    isLoading: boolean
    error: unknown
    empty: Snippet
    loading?: Snippet | undefined
    children: Snippet<[readonly T[]]>
  }
  let { data, isLoading, error, empty, loading, children }: Props = $props()
</script>

{#if isLoading}
  {#if loading}{@render loading()}{:else}<Spinner />{/if}
{:else if error}
  <ErrorMessage {error} />
{:else if !data || data.length === 0}
  {@render empty()}
{:else}
  {@render children(data)}
{/if}
