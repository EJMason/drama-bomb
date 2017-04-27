const redisUtil = require('../database/redis/redisUtil')
const util = require('../utilities/friendsUtil')

/**
 * Using a client chron task, this should check if user has any new friends or haters
 * req.params.idtoken should be a valid token
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
    /* followersHaters:
   newFriends: array of new user ids
    newHaters: array of new hater ids
      friends: most recent array from twitter of ALL friend's user_id(s)
      changed: Bollean if there are any bew friends or haters
       haters: at this pont, HATERS IS JUST THE OLD LIST FROM REDIS CACHE,
              but any haters that readded you are removed
    */
    if (followersHaters.newHaters.length) {
      followersHaters = util.getUpdateHatersAndSort(followersHaters, user_id)
    }

    // If the object has any changes, update properties in the database
    if (followersHaters.changed) {
      await util.updateDatabaseWithNewInfo(user_id, followersHaters)
      // util.updateDatabaseWithNewInfo(user_id, followersHaters).then()
      redisUtil.addUserIdpAndHatersRedis(
        user_id,
        { token, token_secret },
        { friends_ids, haters: followersHaters.haters })
    }

    res.status(200).send(followersHaters)
  } catch (err) {
    console.log(err)
    const status = err.statusCode || 400
    res.status(status).send(err)
  }
}

module.exports = {
  checkForNewFriendsAndHaters,
}
