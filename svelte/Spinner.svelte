<script lang="ts">
  interface Props {
    label?: string
    class?: string | undefined
  }
  let { label = "Loading…", class: className }: Props = $props()
</script>

<span class={["spinner", className]} role="status">
  <span class="spinner__ring" aria-hidden="true"></span>
  <span class="spinner__label">{label}</span>
</span>
