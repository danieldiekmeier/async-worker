import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import Worker from '../worker.js'

async function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

test('Worker works', async () => {
  let a = 0

  const worker = new Worker({
    async task() {
      a += 1
    },
    interval: 10,
  })

  await wait(20)

  // make sure it ran at least twice.
  assert(a >= 2)

  worker.stop()
})

test('Worker doesnt start another round if previous round is unfinished', async () => {
  let a = 0

  const worker = new Worker({
    async task() {
      a += 1
      await wait(500)
    },
    interval: 10,
  })

  await wait(100)

  // ensure that task ran exactly once
  assert(a === 1)

  worker.stop()
})

test('Worker doesnt crash if task errors', async () => {
  let a = 0
  let errorCount = 0
  let lastError

  const worker = new Worker({
    async task() {
      a += 1

      if (a === 1) {
        throw new Error('Error the first time!')
      }
    },
    onError(err) {
      errorCount += 1
      lastError = err
    },
    interval: 10,
  })

  await wait(100)

  // make sure it ran at least twice
  assert(a >= 2)
  assert(errorCount === 1)
  assert(lastError instanceof Error)
  assert(lastError.message === 'Error the first time!')

  worker.stop()
})
