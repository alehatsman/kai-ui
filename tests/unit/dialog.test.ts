import assert from "node:assert/strict"
import { test } from "node:test"
import { attachDialog, syncDialog } from "../../behavior/dialog.ts"

// Just enough of HTMLDialogElement: open/showModal/close, and a `close`
// event queued like the browser queues it.
class FakeDialog extends EventTarget {
  open: boolean = false
  isConnected = true
  showModal() {
    this.open = true
  }
  close() {
    if (!this.open) return
    this.open = false
    setTimeout(() => this.dispatchEvent(new Event("close")))
  }
}
const tick = () => new Promise((r) => setTimeout(r, 5))

function setup() {
  const el = new FakeDialog()
  let closes = 0
  const detach = attachDialog(el as unknown as HTMLDialogElement, () => closes++)
  return { el, dialog: el as unknown as HTMLDialogElement, detach, closes: () => closes }
}

test("a close the parent asked for does not echo back as onClose", async () => {
  const { dialog, closes } = setup()
  syncDialog(dialog, true)
  syncDialog(dialog, false)
  await tick()
  assert.equal(dialog.open, false)
  assert.equal(closes(), 0)
})

test("Esc (cancel) is prevented and routed to onClose once", () => {
  const { el, closes } = setup()
  el.open = true
  const cancel = new Event("cancel", { cancelable: true })
  el.dispatchEvent(cancel)
  assert.equal(cancel.defaultPrevented, true)
  assert.equal(closes(), 1)
})

test("a native close (method=dialog submit) calls onClose once", async () => {
  const { el, closes } = setup()
  el.showModal()
  el.close()
  await tick()
  assert.equal(closes(), 1)
})

test("syncDialog is idempotent and skips a disconnected element", () => {
  const { el, dialog } = setup()
  el.isConnected = false
  syncDialog(dialog, true)
  assert.equal(dialog.open, false)
  el.isConnected = true
  syncDialog(dialog, true)
  syncDialog(dialog, true)
  assert.equal(dialog.open, true)
})

test("detach closes a dialog left open", () => {
  const { dialog, detach } = setup()
  syncDialog(dialog, true)
  detach()
  assert.equal(dialog.open, false)
})
