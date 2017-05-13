const redisUtil = require('../database/redis/redisUtil')
const util = require('../utilities/friendsUtil')
const cron = require('../cron')

const ssEvents = (req, res) => {
  try {
    console.log(`\nUser ${req.params.uid} has Subscribed to listener!\n`)

    cron.emitter
      .on('updated_users', data => {
        data.forEach(user => {
          console.log(`\nSending data to: ${user.screen_name}\n`)
          const toSend = JSON.stringify(user)
          res.write(`id: ${cron.genId()} \n`)
          res.write(`event: ${user.user_id}\n`)
          res.write(`data: ${toSend}\n\n`)
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

/**
 * Controller for checking for new Haters and Friends
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const checkForNewFriendsAndHaters = async (req, res) => {
  try {
    const { user_id, screen_name } = req.profile
    // get user Info from Redis, if not in Redis, log out the user from client
    const { friends_ids, haters, token, token_secret } = await redisUtil.getUserInfoFromCache(user_id)
    // get current followers from twitter Api, sort the ids
    const newArrFromTwitter = await util.getSortedUserIds({ user_id, screen_name, token, token_secret })
    // perform comparison algorithm, return object with new friends and haters and changed
    let followersHaters = util.findNewHatersAndFriends({ friends_ids, haters }, newArrFromTwitter)
    // If there were any new haters, get their objects
    if (followersHaters.newHaters.length) {
      followersHaters = util.getUpdateHatersAndSort(followersHaters, user_id)
    }
    // If the object has any changes, update properties in the database
    if (followersHaters.changed) {
      util.updateDatabaseWithNewInfo(user_id, followersHaters)
      redisUtil.addUserIdpAndHatersRedis(user_id, { token, token_secret }, followersHaters)
    }
    // complete
    res.status(200).send(followersHaters)
  } catch (err) { // ----------- Error Handling -------- //
    console.error(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}

const userPingisLoggedIn = (req, res) => {
  try {
    redisUtil.updateExpiry(req.profile.user_id)
    res.status(200).send('success')
  } catch (err) {
    console.error(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}


module.exports = {
  checkForNewFriendsAndHaters,
  userPingisLoggedIn,
  ssEvents,
}
