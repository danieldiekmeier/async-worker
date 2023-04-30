export default class Worker {
  constructor ({ task, onError, interval }) {
    this.task = task
    this.onError = onError || (() => {})

    this.lock = false

    this.execute()
    this.interval = setInterval(() => {
      this.execute()
    }, interval)
  }

  async execute () {
    if (this.lock) return

    this.lock = true

    try {
      await this.task()
    } catch (err) {
      this.onError(err)
    }

    this.lock = false
  }

  stop () {
    clearInterval(this.interval)
    this.interval = null
  }
}
