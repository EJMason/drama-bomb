const CronTask = require('./cronTask')
const Redis = require('ioredis')

const redis = require('../database/redis')

const sub = new Redis()
sub.psubscribe('__keyevent@0__:expired')
sub.psubscribe('__keyevent@0__:set')

const cron = new CronTask()
cron.initializer()

sub.on('pmessage', (pattern, channel) => {
  if (channel === '__keyevent@0__:expired') {
    redis.decr('usercount')
      .then(numOfUsers => {
        if (!numOfUsers) {
          cron.stopTask()
        }
      })
      .catch(err => { throw err })
  } else if (channel === '__keyevent@0__:set') {
    redis.get('usercount')
      .then(count => {
        if (count) {
          cron.resumeTask()
        }
      })
      .catch(err => { throw err })
  }
})

module.exports = cron
