<script lang="ts">
  import { type Tone, toneClass } from "../contract/index.ts"

  // A colour dot with a text twin: `label` is visible with showLabel, sr-only otherwise.
  interface Props {
    tone?: Tone
    label: string
    pulse?: boolean
    showLabel?: boolean
    class?: string | undefined
  }
  let {
    tone = "neutral",
    label,
    pulse = false,
    showLabel = false,
    class: className,
  }: Props = $props()
</script>

<span class={["status", className]}>
  <span class={["dot", toneClass("dot", tone), pulse && "dot--pulse"]} aria-hidden="true"></span>
  <span class={showLabel ? "status__label" : "sr-only"}>{label}</span>
</span>
