const redis = require('../database/redis')
const util = require('../utilities/friendsUtil')

const placeholder = (req, res) => {
  res.status(200).send('Hello, Friends!')
}

/**
 * Using a client chron task, this should check if user has any new friends or haters
 * req.params.idtoken should be a valid token
 */
const chronHaters = async (req, res) => {
  try {
    // make user token is valid, if valid return {user_id, screen_name}, else return null
    const idAndSn = await util.checkIdToken(req.params.idtoken)
    if (!idAndSn) throw util.throwErr(401, 'Token not valid')

    // get user Info from Redis, if not in Redis, log out the user from client
    const user = await redis.get(idAndSn.user_id)
    if (!user) throw util.throwErr(400, 'User not in cache')

    // get current followers from twitter Api, sort the ids
    const followers = await util.getSortedUserIds(idAndSn)

    // perform comparison algorithm, return object with new friends and haters and changed
    const followersHaters = util.findNewHatersAndFriends(user, followers)

    // If the object has any changes, update properties in the databas
    if (followersHaters.changed) {
      // get all of the new Hater objects from twitter api, if any and sort them
      if (followersHaters.newHaters.length) {
        followersHaters.newHaters = await util.getNewHatersFromTwitter(followersHaters.newHaters, idAndSn.user_id)
        util.sortHaters(followersHaters)
      }

      // send the updated users and haters to the database only if something has changed
      util.updateDatabaseWithNewInfo(idAndSn.user_id, followersHaters)

      // in the redis object, change the friends to the array pulled from twitter
      user.haters = followersHaters.haters
      user.friends_ids = followersHaters.friends
      redis.set(userId, user, 'ex', 3600)
    }
    // send client updated list of friends and haters
    res.status(200).send(followersHaters)
  } catch (err) { err.code ? res.status(err.code).send(err.message) : res.status(400).send(err) }
}

module.exports = { placeholder, chronHaters }
