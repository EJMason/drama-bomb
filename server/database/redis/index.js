const Redis = require('ioredis')
const chalk = require('chalk')

const redis = new Redis()
const sub = new Redis()

// redis.config('set', 'notify-keyspace-events', 'Ex')

// redis.on('message', (channel, message) => {
//   console.log(`This is the channel: ${channel} and this is the message: ${message}`)
// })

sub.psubscribe('__keyevent@0__:expired')

sub.on('pmessage', (pattern, channel, message) => {
  if (channel === '__keyevent@0__:expired') {
    redis.decr('usercount').then(numOfUsers => {
      if (!numOfUsers) {
        
      }
    })
  }
})

redis.monitor((err, monitor) => {
  monitor.on('monitor', (time, args) => {
    const one = chalk.red('REDIS')
    const two = chalk.magenta('Action:')
    const three = chalk.magenta('Key:')
    console.log(`[${one}] ${two} ${args[0]} ${three} ${args[1]}`)
  })
})

module.exports = redis
