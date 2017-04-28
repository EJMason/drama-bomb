const redis = require('./')

const throwErr = (statusCode, method, message, defaultError = null) => {
  message = message || 'Error message unspecified'
  return {
    statusCode,
    message: 'There was an error in redisUtil : getUserInfoFromCache',
    method: `redisUtil.js : ${method}`,
    defaultError,
  }
}

/**
 * Add to cache
 * @param {String} userId
 * @param {Object} tokens
 */
const addUserIdpAndHatersRedis = (userId, tokens, user) => {
  try {
    if (typeof tokens !== 'object') {
      throw throwErr(400, 'addUserIdpAndHatersRedis', 'must be of type Object')
    } else if (!tokens.token || !tokens.token_secret) {
      throw throwErr(400, 'addUserIdpAndHatersRedis', 'Object must have properties token & token_secret')
    } else {
      let values = {
        friends_ids: user.friends_ids,
        haters: user.haters,
        token: tokens.token,
        token_secret: tokens.token_secret,
        updated: Date.now(),
      }
      values = JSON.stringify(values)
      redis.set(userId, values, 'ex', 3600)  // 2 hour expiry without chron ping
    }
  } catch (err) {
    throw throwErr(400, 'addUserIdpAndHatersRedis', null, err)
  }
}

const getUserInfoFromCache = async userId => {
  try {
    const user = await redis.get(userId)
    if (!user) { throw throwErr(400, 'getUserInfoFromCache', 'User not in cache.') }
    return JSON.parse(user)
  } catch (err) {
    throw throwErr(400, 'getUserInfoFromCache', null, err)
  }
}

const updateExpiry = async key => {
  try {
    await redis.expire(key, 300)
  } catch (err) {
    throw throwErr(400, 'updateExpiry', null, err)
  }
}

module.exports = {
  addUserIdpAndHatersRedis,
  getUserInfoFromCache,
  updateExpiry,
  redis,
}
