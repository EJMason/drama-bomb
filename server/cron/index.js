const CronTask = require('./cronTask')
const Redis = require('ioredis')

const log = require('../middleware/winstonLogger')
const redis = require('../database/redis')

const prod = (process.env.NODE_ENV === 'production') ? true : false
const port = prod ? process.env.REDIS_PORT : 6379
const url = prod ? process.env.REDIS_URL : '127.0.0.1'

log.verbose(`Connecting to Redis keyspace ${url}:${port}`)
const sub = new Redis(port, url)
sub.config('SET', 'notify-keyspace-events', 'KEA')
sub.psubscribe('__keyevent@0__:expired')
sub.psubscribe('__keyevent@0__:set')

const cron = new CronTask()

log.debug('Initializing the usercount')
redis
  .get('usercount')
  .then(count => {
    if (count > 0) {
      cron.resumeTask()
    } else {
      cron.stopTask()
    }
  })

sub.on('pmessage', (pattern, channel, key) => {
  if (channel === '__keyevent@0__:expired') {
    // do a quick check of user count to see if server should stop
    redis
      .decr('usercount')
      .then(numOfUsers => {
        if (!numOfUsers) {
          cron.stopTask()
        }
      })
      .catch(err => {
        log.error(err)
        throw err
      })

      // Also, set in the database
  } else if (channel === '__keyevent@0__:set') {
    if (key.includes('twitter') && !cron.isRunning()) {
      log.debug('Cron: Checking usercount to start/stop')
      redis
        .get('usercount')
        .then(count => {
          log.debug(`This is the current user count in Redis is: ${count}`)
          if (count) {
            cron.resumeTask()
          }
        })
        .catch(err => {
          log.error(err)
          throw err
        })
    }
  }
})

module.exports = cron
