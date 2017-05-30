const redisUtil = require('../database/redis/redisUtil')
const util = require('../utilities/friendsUtil')
const cron = require('../cron')
const log = require('../middleware/winstonLogger')
const { buildSafeData } = require('../services/friendsServices')

module.exports.ssEvents = (req, res) => {
  try {
    if (!req.params.uid) {
      log.error('friendsCtrl:ssEvents uid not defined')
      throw new Error('uid not defined')
    }

    cron.emitter
      .on('updated_users', data => {
        data.forEach(user => {
          // This is info to be sent
          const toSend = buildSafeData(user)
          log.verbose('Server Sent Event Dispatched', toSend)
          // sending
          res.write(`id: ${cron.genId()} \n`)
          res.write(`event: ${user.user_id}\n`)
          res.write(`data: ${toSend}\n\n`)
        })
      })

    // This is the heartbeat to keep errors from happening
    cron.emitter
      .on('heartbeat', users => {
        users.forEach(user => {
          user = user.substr(user.indexOf('|') + 1)

          res.write(`id: ${cron.genId()} \n`)
          res.write(`event: ${user.user_id}\n`)
          res.write('data: heartbeat\n\n')
        })
      })

    redisUtil.redis.exists(`twitter|${req.params.uid}`)
      .then(userExists => {
        if (userExists) {
          res.writeHead(200, util.sseHead())
        } else {
          res.status(400).send('not in cache, logout')
        }
      })
  } catch (err) {
    log.error(err)
    res.status(400).send('Error in SSE')
  }
}

module.exports.userPingisLoggedIn = (req, res) => {
  try {
    redisUtil.updateExpiry(req.profile.user_id)
    res.status(200).send('success')
  } catch (err) {
    log.error(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}
