const CronJob = require('cron').CronJob
const chalk = require('chalk')
const EventEmitter = require('events')

const util = require('./cronUtil')
const redisUtil = require('../database/redis/redisUtil')
const { buildSafeData } = require('../services/friendsServices')
const socketPub = require('../sockets/pub')

const log = require('../middleware/winstonLogger')

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
    log.verbose(chalk.bgBlue.magenta('Cron: Begin'))
    this.workerBee.start()
    this.heartbeat.start()
  }

  resumeTask() {
    if (!this.workerBee.running) {
      log.verbose(chalk.bgBlue.magenta('Cron: Begin'))
      this.workerBee.start()
      this.heartbeat.start()
    } else {
      log.debug(chalk.bgBlue.magenta('Cron Task Already running'))
    }
  }

  stopTask() {
    log.verbose(chalk.bgBlue.magenta('Cron: Pause'))
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
    log.verbose(chalk.bgMagenta.blue('Cron: Heartbeat'))
    redisUtil.streamUsers(users => {
      if (users.length) {
        this.emitter.emit('heartbeat', users)
      }
    })
  }

  ticker() {
    log.debug(chalk.bgBlue.magenta('Cron Task: Checking logged in Users...'))
    util.cronCheck().then(data => {
      if (data.length) {
        data.forEach(updatedUser => {
          // build the payload with relevant data
          const payload = buildSafeData(updatedUser)
          // send it
          socketPub.socketPubUserUpdate(payload.user_id, payload)
        })

        this.emitter.emit('updated_users', data)
      }
    }).catch(err => {
      throw err
    })
  }
}

module.exports = CronTask
