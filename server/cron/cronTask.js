const CronJob = require('cron').CronJob
const chalk = require('chalk')
const EventEmitter = require('events')

const util = require('../utilities/cronUtil')

class CronTask {
  constructor() {
    this.emitter = new EventEmitter()
    this.updateId = 10000

    this.ticker = this.ticker.bind(this)
    this.initializer = this.initializer.bind(this)

    this.workerBee = new CronJob({
      cronTime: '*/5 * * * * *',
      onTick: this.ticker,
      onComplete: () => {},
      start: false,
    })
  }

  initializer() {
    console.log(chalk.bgBlue.magenta('Cron Task Begin...'))
    this.workerBee.start()
  }

  resumeTask() {
    if (!this.workerBee.running) {
      console.log(chalk.bgBlue.magenta('Resuming Cron Task...'))
      this.workerBee.start()
    } else {
      console.log(chalk.bgBlue.magenta('Cron Task Already running'))
    }
  }

  stopTask() {
    console.log(chalk.bgBlue.magenta('Pausing Cron Task...'))
    this.workerBee.stop()
  }

  genId() {
    this.updateId++
    return this.updateId
  }

  ticker() {
    console.log(chalk.bgBlue.magenta('Cron Task: Checking logged in Users...'))
    util.cronCheck().then(data => {
      if (data.length) {
        this.emitter.emit('updated_users', data)
      }
    }).catch(err => {
      console.error('THERE WAS AN ERROR: ', err)
    })
  }
}

module.exports = CronTask
