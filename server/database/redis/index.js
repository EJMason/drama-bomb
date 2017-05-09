const Redis = require('ioredis')
const chalk = require('chalk')

const redis = new Redis()
// const sub = new Redis()

// sub.psubscribe('__keyevent@0__:expired')

// sub.on('pmessage', (pattern, channel) => {
//   if (channel === '__keyevent@0__:expired') {
//     redis.decr('usercount').then(numOfUsers => {
//       if (!numOfUsers) {
//         // stop crontask
//       }
//     })
//   }
// })

redis.monitor((err, monitor) => {
  monitor.on('monitor', (time, args) => {
    const one = chalk.red('REDIS')
    const two = chalk.magenta('Action:')
    const three = chalk.magenta('Key:')
    console.log(`[${one}] ${two} ${args[0]} ${three} ${args[1]}`)
  })
})

module.exports = redis
