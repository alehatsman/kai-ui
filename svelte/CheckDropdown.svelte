<script lang="ts">
  import { attachCheckDropdown } from "../behavior/check-dropdown.ts"
  import {
    type CheckOption,
    checkOptions,
    checkSummary,
    countText,
    optionName,
    toggleSelection,
  } from "../contract/index.ts"
  import Icon from "./Icon.svelte"

  // A select-looking button over a popover panel of checkboxes (radios when
  // `single`). Each tick calls onChange at once and updates `selected`
  // (bindable). Placement, focus and close-on-pick by behavior/check-dropdown.ts.
  interface Props {
    label: string
    options: readonly CheckOption[]
    selected?: string[]
    onChange?: (next: string[]) => void
    summary?: (selected: readonly string[], options: readonly CheckOption[]) => string
    single?: boolean
    required?: boolean
    anyLabel?: string
    disabled?: boolean
    searchFrom?: number
    class?: string | undefined
  }
  let {
    label,
    options,
    selected = $bindable([]),
    onChange,
    summary,
    single = false,
    required = false,
    anyLabel = "Any",
    disabled = false,
    searchFrom = 8,
    class: className,
  }: Props = $props()

  const id = $props.id()
  let query = $state("")
  const shown = $derived(checkOptions(options, selected, query))
  const text = $derived(
    summary ? summary(selected, options) : checkSummary(selected, options, anyLabel)
  )

  function set(next: string[]) {
    selected = next
    onChange?.(next)
  }
</script>

<div class={["check-dropdown", single && "check-dropdown--single", className]} {@attach attachCheckDropdown}>
  <span class="check-dropdown__label" id="{id}-label">{label}</span>
  <button
    type="button"
    class="check-dropdown__button"
    popovertarget="{id}-panel"
    aria-controls="{id}-panel"
    aria-expanded="false"
    aria-labelledby="{id}-label {id}-summary"
    disabled={disabled || options.length === 0}
  >
    <span class="check-dropdown__summary" id="{id}-summary">{text}</span>
    <Icon name="triangle-down" />
  </button>
  <div
    class="check-dropdown__panel"
    id="{id}-panel"
    popover="auto"
    ontoggle={(e) => {
      if (e.newState === "closed") query = ""
    }}
  >
    <fieldset class="check-dropdown__fieldset">
      <legend class="sr-only">{label}</legend>
      {#if options.length >= searchFrom}
        <input
          type="search"
          class="check-dropdown__search"
          placeholder="Type to find…"
          aria-label="Find {label}"
          bind:value={query}
        />
      {/if}
      <div class="check-dropdown__list">
        {#if single && !query.trim()}
          <label class="check-dropdown__option">
            <input
              type="radio"
              class="check-dropdown__input"
              name={id}
              checked={selected.length === 0}
              onchange={() => set([])}
            />
            <span class="check-dropdown__name">{anyLabel}</span>
            <span class="check-dropdown__count"></span>
          </label>
        {/if}
        {#each shown as o (o.value)}
          {@const on = selected.includes(o.value)}
          <label class="check-dropdown__option">
            <input
              type={single ? "radio" : "checkbox"}
              class="check-dropdown__input"
              name={single ? id : undefined}
              checked={on}
              disabled={required && on && selected.length === 1}
              onchange={(e) => set(toggleSelection(selected, o.value, e.currentTarget.checked, single))}
            />
            <span class="check-dropdown__name">{optionName(o)}</span>
            <span class="check-dropdown__count">{countText(o.count)}</span>
          </label>
        {/each}
      </div>
      {#if query.trim() && shown.length === 0}<p class="check-dropdown__none">No match</p>{/if}
      {#if !(single || required) && selected.length > 0}
        <button type="button" class="btn btn--ghost btn--small check-dropdown__clear" onclick={() => set([])}
          >Clear</button
        >
      {/if}
    </fieldset>
  </div>
</div>
