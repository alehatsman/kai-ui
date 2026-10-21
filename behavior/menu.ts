// A menu is a trigger button with popovertarget plus a popover="auto" list
// of role="menuitem" buttons. The platform gives top layer, light dismiss and
// focus return; this adds what it does not: aria-expanded, positioning next
// to the trigger (with flip), roving arrow keys, close on choose.
//
// Markup it expects (bindings render exactly this):
//   <div class="menu">
//     <button class="btn" popovertarget="ID" aria-haspopup="menu" aria-expanded="false" aria-controls="ID">…</button>
//     <div class="menu__popover" id="ID" popover role="menu" aria-label="…">
//       <button class="menu__item" role="menuitem" tabindex="-1">…</button>
//     </div>
//   </div>

const GAP = 4

function items(popover: HTMLElement): HTMLButtonElement[] {
  return [...popover.querySelectorAll<HTMLButtonElement>(".menu__item")].filter((b) => !b.disabled)
}

/** Fixed position under the trigger; above it when it would run off the bottom. */
export function placeMenu(
  trigger: HTMLElement,
  popover: HTMLElement,
  align: "start" | "end"
): void {
  const t = trigger.getBoundingClientRect()
  const height = popover.offsetHeight
  const below = t.bottom + GAP + height <= window.innerHeight || t.top - GAP - height < 0
  popover.style.top = `${below ? t.bottom + GAP : t.top - GAP - height}px`
  if (align === "end") {
    popover.style.left = "auto"
    popover.style.right = `${window.innerWidth - t.right}px`
  } else {
    popover.style.right = "auto"
    popover.style.left = `${Math.min(t.left, window.innerWidth - popover.offsetWidth - GAP)}px`
  }
}

function move(popover: HTMLElement, key: string): boolean {
  const list = items(popover)
  if (list.length === 0)
    return key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End"
  const at = list.indexOf(document.activeElement as HTMLButtonElement)
  const next: Record<string, number> = {
    ArrowDown: (at + 1) % list.length,
    ArrowUp: (at - 1 + list.length) % list.length,
    Home: 0,
    End: list.length - 1,
  }
  const target = next[key]
  if (target === undefined) return false
  list[target]?.focus()
  return true
}

/** Wire one `.menu` root. Returns a cleanup. */
export function attachMenu(root: HTMLElement): () => void {
  const trigger = root.querySelector<HTMLButtonElement>("[popovertarget]")
  const popover = root.querySelector<HTMLElement>(".menu__popover")
  if (!(trigger && popover)) return () => undefined
  const align = popover.classList.contains("menu__popover--end") ? "end" : "start"
  const reposition = () => placeMenu(trigger, popover, align)

  const onToggle = (e: Event) => {
    const open = (e as ToggleEvent).newState === "open"
    trigger.setAttribute("aria-expanded", String(open))
    if (open) {
      reposition()
      ;(items(popover)[0] ?? popover).focus()
      window.addEventListener("resize", reposition)
      window.addEventListener("scroll", reposition, true)
    } else {
      window.removeEventListener("resize", reposition)
      window.removeEventListener("scroll", reposition, true)
    }
  }
  const onKey = (e: KeyboardEvent) => {
    if (move(popover, e.key)) e.preventDefault()
  }
  // Choosing an item closes the menu. The binding's own click handler on the
  // item runs first (it is deeper), so onSelect sees the menu still open.
  const onClick = (e: MouseEvent) => {
    const item = (e.target as Element).closest<HTMLButtonElement>(".menu__item")
    if (item && !item.disabled) popover.hidePopover()
  }
  popover.addEventListener("toggle", onToggle)
  popover.addEventListener("keydown", onKey)
  popover.addEventListener("click", onClick)
  return () => {
    popover.removeEventListener("toggle", onToggle)
    popover.removeEventListener("keydown", onKey)
    popover.removeEventListener("click", onClick)
    window.removeEventListener("resize", reposition)
    window.removeEventListener("scroll", reposition, true)
  }
}
