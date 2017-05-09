const CronJob = require('cron').CronJob
const chalk = require('chalk')
const EventEmitter = require('events')

const util = require('./utilities/cronUtil')
const redis = require('./database/redis/redisUtil')

class CronTask {
  constructor() {
    this.emitter = new EventEmitter()

    this.ticker = this.ticker.bind(this)

    this.workerBee = new CronJob({
      cronTime: '*/10 * * * * *',
      onTick: this.ticker,
      onComplete: () => {
        console.log(chalk.bgBlue.magenta('Pausing Cron Task...'))
      },
      start: false,
    })
  }

  resumeTask() {
    console.log(chalk.bgBlue.magenta('Resuming Cron Task...'))
    this.workerBee.start()
  }

  stopTask() {
    console.log(chalk.bgBlue.magenta('Pausing Cron Task..., nobody logged in'))
    this.workerBee.stop()
  }

  ticker() {
    console.log(chalk.bgBlue.magenta('Cron Task: Checking logged in Users...'))
    util.cronCheck().then(data => {
      if (data) {
        this.emitter.emit('updated_users', data)
      }
    }).catch(err => {
      console.error('THERE WAS AN ERROR: ', err)
    })
  }

  checkEmitter() {
    this.emitter.emit('Updated_Users', 'MY EMITTER!! ITS WORKING!')
  }

}

// const checkerJob = new CronJob({
//   cronTime: '*/05 * * * * *',
//   onTick: () => {
//     console.log(chalk.bgBlue.magenta('Cron Task: Checking logged in Users...'))

//   },
//   onComplete: () => {
//     console.log(chalk.bgBlue.magenta('Pausing Cron Task...'))
//   },
//   start: false,
// })

/**
 * Checks if redis cache has users
 */
// const initJob = new CronJob({
//   cronTime: '*/30 * * * * *',
//   onTick: () => {
//     console.log(chalk.bgBlue.magenta('\nCron Task: Checking if Users are logged in...'))

//     util.checkUsersLoggedIn()
//       .then(usersExist => {
//         if (usersExist) {
//           checkerJob.start()
//         } else {
//           console.log(chalk.bgBlue.magenta('\nCron Task: Nobody Logged in... stopping'))
//           checkerJob.stop()
//         }
//       })
//     .catch(err => console.error('There was an error: ', err))
//   },
//   start: true,
//   runOnInit: true,
// })

module.exports = CronTask
