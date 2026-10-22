// A CheckDropdown is a select-looking trigger with popovertarget plus a
// popover="auto" panel of checkboxes (radios when single). The platform gives
// top layer, light dismiss, Esc and focus return; this adds aria-expanded,
// placement under the trigger (placeMenu, at least as wide as it), focus on
// open, close after a pick when single, and Enter in search ticking the sole
// match. Selection state belongs to the caller (binding or page).
//
// Markup it expects (bindings render exactly this):
//   <div class="check-dropdown [check-dropdown--single]">
//     <span class="check-dropdown__label" id="L">…</span>
//     <button class="check-dropdown__button" popovertarget="P" aria-controls="P"
//             aria-expanded="false" aria-labelledby="L S">
//       <span class="check-dropdown__summary" id="S">…</span> <svg class="icon">…</svg>
//     </button>
//     <div class="check-dropdown__panel" id="P" popover="auto">
//       <fieldset class="check-dropdown__fieldset"> [search] list [none] [clear] </fieldset>
//     </div>
//   </div>

import { placeMenu } from "./menu.ts"

const inputs = (panel: HTMLElement) =>
  [...panel.querySelectorAll<HTMLInputElement>(".check-dropdown__input")].filter((i) => !i.disabled)

/** Wire one `.check-dropdown` root. Returns a cleanup. */
export function attachCheckDropdown(root: HTMLElement): () => void {
  const trigger = root.querySelector<HTMLButtonElement>(".check-dropdown__button")
  const panel = root.querySelector<HTMLElement>(".check-dropdown__panel")
  if (!(trigger && panel)) return () => undefined
  const single = root.classList.contains("check-dropdown--single")
  const reposition = () => {
    panel.style.minWidth = `${trigger.offsetWidth}px`
    placeMenu(trigger, panel, "start")
  }

  const onToggle = (e: Event) => {
    const open = (e as ToggleEvent).newState === "open"
    trigger.setAttribute("aria-expanded", String(open))
    if (open) {
      reposition()
      const search = panel.querySelector<HTMLInputElement>(".check-dropdown__search")
      ;(search ?? inputs(panel)[0] ?? panel).focus()
      window.addEventListener("resize", reposition)
      window.addEventListener("scroll", reposition, true)
    } else {
      window.removeEventListener("resize", reposition)
      window.removeEventListener("scroll", reposition, true)
    }
  }
  // A pick in a single (radio) dropdown is the whole interaction: close.
  const onChange = (e: Event) => {
    const t = e.target as HTMLInputElement
    if (single && t.type === "radio" && t.checked) panel.hidePopover()
  }
  // Enter in the search box ticks the one remaining option, if exactly one.
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (e.key !== "Enter" || !t.classList.contains("check-dropdown__search")) return
    e.preventDefault()
    const list = inputs(panel)
    if (list.length === 1) list[0]?.click()
  }
  panel.addEventListener("toggle", onToggle)
  panel.addEventListener("change", onChange)
  panel.addEventListener("keydown", onKey)
  return () => {
    panel.removeEventListener("toggle", onToggle)
    panel.removeEventListener("change", onChange)
    panel.removeEventListener("keydown", onKey)
    window.removeEventListener("resize", reposition)
    window.removeEventListener("scroll", reposition, true)
  }
}
