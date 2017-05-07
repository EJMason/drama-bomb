const redisUtil = require('../database/redis/redisUtil')
const util = require('../utilities/friendsUtil')

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
    console.log(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}

const userPingisLoggedIn = (req, res) => {
  try {
    const { user_id } = req.profile
    redisUtil.updateExpiry(user_id)
    res.status(200).send('success')
  } catch (err) {
    console.log(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}


module.exports = {
  checkForNewFriendsAndHaters,
  userPingisLoggedIn,
}
