const Redis = require('ioredis')
const chalk = require('chalk')

const redis = new Redis()

redis.monitor((err, monitor) => {
  monitor.on('monitor', (time, args) => {
    const one = chalk.red('REDIS')
    const two = chalk.magenta('Action:')
    const three = chalk.magenta('Key:')
    console.log(`---> [${one}] ${two} ${args[0]} ${three} ${args[1]}`)
  })
})

module.exports = redis
