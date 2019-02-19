# Async Worker

```
npm i @danieldiekmeier/async-worker
```


## Usage

Do you have a task that needs to run every now and then? Do you not want to worry about setting up a cronjob, but also not just slap a `setInterval` on it and call it a day? Then this package is the middle ground for you.

Put your worker logic somewhere in your application logic, reuse all your stuff, it's going to be fine!

✨ async/await is fully supported and encouraged ✨

Here is a code example:

```
import Worker from '@danieldiekmeier/async-worker'

new Worker({
  // This function is called on every task execution.
  async task () {
    await database.removeOldStuff()
  },

  // Set the minimum time between task executions, in milliseconds (ms).
  // In this case, it would run once per hour.
  interval: 60 * 60 * 1000,

  // Whenever the task errors, this function is called with the error.
  onError (err) {
    fancyLogger(err)
  }
})
```

The Worker doesn't start the task if the previous execution is still running. That way, you don't have to worry about having long running tasks like complex database cleanup or slow download tasks.
