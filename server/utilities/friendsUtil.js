const twitter = require('./twitterUtil')
const services = require('../services/friendsServices')
const dbUtil = require('../database/dbUtil/UsersUtil')
const redisUtil = require('../database/redis/redisUtil')

// -------------------- HELPER FUNCTIONS ------------------------ //

const throwErr = (statusCode, message, method, defaultError = null) => {
  message = message || 'Unkown error'
  return {
    statusCode,
    message,
    method: `error in cronService in ${method} method`,
    defaultError,
  }
}

/**
 * Gets the new hater objects from twitter
 * @param {Array} haterIds
 * @param {String} userId
 * @return {Array}
 */
const getNewHatersFromTwitter = async (haterIds, userId, keys) => {
  try {
    // user_id is the parameter name twitter needs, it isn't the user id'
    return await twitter.getUsersLookup({ user_id: haterIds.join() }, userId, keys)
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : getNewHatersFromTwitter',
      'friendsUtil : getNewHatersFromTwitter',
      err,
    ]
    throw throwErr(...errParams)
  }
}

/**
 * This is the new method for comparing users
 * @param {Array} twitterIds - New array from twitter
 * @param {Object} friendsIds - Old hash table of friends
 * @param {Object} haters - Hash tables of current haters
 */
const findUpdatedInfo = (twitterIds, friendsIds, haters) => {
  try {
    friendsIds = friendsIds ? friendsIds : {}
    haters = haters ? haters : {}

    const friends = {}
    let userCount = 0

    twitterIds.forEach(key => {
      delete friendsIds[key]
      delete haters[key]
      friends[key] = key
      userCount++
    })

    return {
      friends,
      haters,
      newHaterIds: friendsIds,
      userCount,
    }
  } catch (error) {
    return error
  }
}

const buildNewUserData = (user, friends, haters, newHaters, count) => {
  try {
    // clean up the huge objects from twitter
    // const builtHaters = services.fixHaters(newHaters)
    // Merge the object of the previous haters with the new ones
    const mergedHaters = Object.assign({}, haters, services.fixHaters(newHaters))
    return {
      screen_name: user.screen_name,
      user_id: user.user_id,
      friends_ids: friends,
      followers_count: count,
      haters: mergedHaters,
      token: user.token,
      token_secret: user.token_secret,
      updated: Date.now(),
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

const updateFromTwitter = async user => {
  try {
    let twitterIds = await twitter.getFollowersIds({
      user_id: user.user_id,
      screen_name: user.screen_name,
      token: user.token,
      token_secret: user.token_secret,
    })
    twitterIds = JSON.parse(twitterIds)
    // friends - A hash table of friends ids fresh from twitter
    // haters - method took the old haters and checked if any of them have re-added
    // newHaterIds - users recently unfollowed user
    const { friends, haters, newHaterIds, userCount } = findUpdatedInfo(twitterIds.ids, user.friends_ids, user.haters)
    
    let newHaters = {}
    const keys = Object.keys(newHaterIds)
    if (keys.length) {
      const tokens = { token: user.token, token_secret: user.token_secret }
      newHaters = await getNewHatersFromTwitter(keys, user.user_id, tokens)
    }
    // create the new object to put into redis and the database
    const updatedData = buildNewUserData(user, friends, haters, newHaters, userCount)
    // Add the new info to the database
    dbUtil.updateUserFriendsAndHaters(`twitter|${updatedData.user_id}`, updatedData.haters, updatedData.friends_ids)
    redisUtil.redis.set(`twitter|${updatedData.user_id}`, JSON.stringify(updatedData))
    return updatedData
  } catch (err) {
    throw throwErr(400, '', 'updateFromTwitter', err)
  }
}

const sseHead = () => ({
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  'Access-Control-Allow-Origin': '*',
})

module.exports = {
  throwErr,
  getNewHatersFromTwitter,
  findUpdatedInfo,
  buildNewUserData,
  updateFromTwitter,
  sseHead,
}
