import test from 'ava'
import Worker from '../index.js'

async function wait (duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

test('Worker works', async t => {
  let a = 0

  const worker = new Worker({
    async task () { a += 1 },
    interval: 10
  })

  await wait(20)

  // make sure it ran at least twice.
  t.true(a >= 2)

  worker.stop()
})

test('Worker doesnt start another round if previous round is unfinished', async t => {
  let a = 0

  const worker = new Worker({
    async task () {
      a += 1
      await wait(1000)
    },
    interval: 10
  })

  await wait(100)

  // ensure that task ran exactly once
  t.is(a, 1)

  worker.stop()
})

test('Worker doesnt crash if task errors', async t => {
  let a = 0
  let errorCount = 0
  let lastError

  const worker = new Worker({
    async task () {
      a += 1

      if (a === 1) {
        throw new Error('Error the first time!')
      }
    },
    onError (err) {
      errorCount += 1
      lastError = err
    },
    interval: 10
  })

  await wait(100)

  // make sure it ran at least twice
  t.true(a >= 2)
  t.is(errorCount, 1)
  t.true(lastError instanceof Error)
  t.is(lastError.message, 'Error the first time!')

  worker.stop()
})
