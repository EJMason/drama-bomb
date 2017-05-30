const Redis = require('ioredis')
const log = require('../../middleware/winstonLogger')

const prod = (process.env.NODE_ENV === 'production') ? true : false
const port = prod ? process.env.REDIS_PORT : 6379
const url = prod ? process.env.REDIS_URL : '127.0.0.1'

log.verbose(`Connecting to Redis ${url}:${port}`)
const redis = new Redis(port, url)

redis.monitor((err, monitor) => {
  monitor.on('monitor', (time, args) => {
    log.debug(`REDIS ---|--- ACTION: ${args[0]} KEY: ${args[1]}`)
  })
})

module.exports = redis
