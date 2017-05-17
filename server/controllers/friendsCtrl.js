const redisUtil = require('../database/redis/redisUtil')
const util = require('../utilities/friendsUtil')
const { buildSafeData } = require('../services/friendsServices')
const cron = require('../cron')

module.exports.ssEvents = (req, res) => {
  try {
    if (!req.params.uid) {
      throw new Error('uid not defined')
    }
    console.log(`\nUser ${req.params.uid} has Subscribed to listener!\n`)

    cron.emitter
      .on('updated_users', data => {
        data.forEach(user => {
          console.log(`\nSending updates to: ${user.screen_name}\n`)
          // This is info to be sent
          const toSend = buildSafeData(user)
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
          console.log(`\nSending heartbeat <3 ${user}\n`)

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
  } catch (error) {
    console.error('Error in ssEvents')
  }
}

module.exports.userPingisLoggedIn = (req, res) => {
  try {
    redisUtil.updateExpiry(req.profile.user_id)
    res.status(200).send('success')
  } catch (err) {
    // console.error(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}
