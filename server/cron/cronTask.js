const CronJob = require('cron').CronJob
const chalk = require('chalk')
const EventEmitter = require('events')

const util = require('../utilities/cronUtil')
const redisUtil = require('../database/redis/redisUtil')

class CronTask {
  constructor() {
    this.emitter = new EventEmitter()
    this.updateId = 10000

    this.ticker = this.ticker.bind(this)
    this.initializer = this.initializer.bind(this)
    this.heartBeater = this.heartBeater.bind(this)

    this.workerBee = new CronJob({
      cronTime: '*/5 * * * * *',
      onTick: this.ticker,
      onComplete: () => {},
      start: false,
    })

    this.heartbeat = new CronJob({
      cronTime: '0 */1 * * * *',
      onTick: this.heartBeater,
      onComplete: () => {},
      start: false,
    })
  }

  initializer() {
    console.log(chalk.bgBlue.magenta('------------- Cron Task Begin -------------'))
    this.workerBee.start()
    this.heartbeat.start()
  }

  resumeTask() {
    if (!this.workerBee.running) {
      console.log(chalk.bgBlue.magenta('------------- Starting Cron Task -------------'))
      this.workerBee.start()
      this.heartbeat.start()
    } else {
      console.log(chalk.bgBlue.magenta('Cron Task Already running'))
    }
  }

  stopTask() {
    console.log(chalk.bgBlue.magenta('------------- Pausing Cron Task -------------'))
    this.workerBee.stop()
    this.heartbeat.stop()
  }

  isRunning() {
    return (this.workerBee.running && this.heartBeater.running)
  }

  genId() {
    this.updateId++
    return this.updateId
  }

  /**
   * Ensures connection stays open to client
   * @memberof CronTask
   */
  heartBeater() {
    console.log(chalk.bgMagenta.blue('------------- Heartbeat -------------'))
    redisUtil.streamUsers(users => {
      if (users.length) {
        this.emitter.emit('heartbeat', users)
      }
    })
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
