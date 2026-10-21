import assert from "node:assert/strict"
import { mock, test } from "node:test"
import { createToaster } from "../../behavior/toast.ts"

test("push appends, defaults to accent, notifies; list is a new array per change", () => {
  const t = createToaster()
  let calls = 0
  t.subscribe(() => calls++)
  const before = t.list()
  const id = t.push("hi", { duration: 0 })
  assert.deepEqual(t.list(), [{ id, message: "hi", tone: "accent" }])
  assert.notEqual(t.list(), before)
  assert.equal(calls, 1)
})

test("auto-dismiss after duration; 0 is sticky", () => {
  mock.timers.enable({ apis: ["setTimeout"] })
  try {
    const t = createToaster()
    t.push("goes", { duration: 1000 })
    t.push("stays", { duration: 0 })
    mock.timers.tick(999)
    assert.equal(t.list().length, 2)
    mock.timers.tick(1)
    assert.deepEqual(
      t.list().map((x) => x.message),
      ["stays"]
    )
  } finally {
    mock.timers.reset()
  }
})

test("dismiss removes once, clears its timer, ignores unknown ids", () => {
  mock.timers.enable({ apis: ["setTimeout"] })
  try {
    const t = createToaster()
    let calls = 0
    t.subscribe(() => calls++)
    const id = t.push("x", { tone: "danger" })
    t.dismiss(id)
    t.dismiss(id)
    t.dismiss(999)
    mock.timers.tick(10_000)
    assert.equal(calls, 2)
    assert.deepEqual(t.list(), [])
  } finally {
    mock.timers.reset()
  }
})

test("unsubscribe stops notifications", () => {
  const t = createToaster()
  let calls = 0
  const off = t.subscribe(() => calls++)
  off()
  t.push("x", { duration: 0 })
  assert.equal(calls, 0)
})
