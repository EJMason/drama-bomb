const twitter = require('../utilities/twitterUtil')
const redis = require('../database/redis')
const util = require('../utilities/friendsUtil')

const placeholder = (req, res) => {
  res.status(200).send('Hello, Friends!')
}

const chronHaters = async (req, res) => {
  try {
    // make user token is valid, if valid return {user_id, screen_name}, else return null
    const idAndSn = util.checkIdToken(req.params.idtoken)
    if (!idAndSn) return res.status(401).send('Token Invalid')
    // get user Info from Redis, if not in Redis, log out the user from client
    const user = await redis.get(idAndSn.user_id)
    if (!user) return res.status(400).send('User not in cache')
    // get followers from twitter, sort the ids
    const followers = await twitter.getFollowersIds(idAndSn)
    // perform comparison algorithm, return object with new friends and haters and changed
    const followersHaters = await util.findNewHatersAndFriends(user, followers)
    // IF the object has any changes, update properties in the database
    if (followersHaters.changed) {
      util.updateDatabaseWithNewInfo(followersHaters)
      // in the redis object, change the friends to the array pulled from twitter
      user.haters = followersHaters.haters
      user.friends_ids = followersHaters.friends_ids
      redis.set(userId, user, 'ex', 3600)
    }
    // send client updated list of friends and haters
    return res.status(200).send(followersHaters)
  } catch (err) {
    return res.status(400).send('An error has occured')
  }
}

async function getUserIds(req, res) {
  try {
    const arrayOfUserIds = await twitter.getFollowersIds(req.body.params)
    arrayOfUserIds.sort((a, b) => a - b)
  } catch (err) {
    res.status(400).send('Hello, Friends!')
  }
  twitter.getFollowersIds()
}

module.exports = { placeholder, chronHaters, getUserIds }
