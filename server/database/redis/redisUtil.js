const redis = require('./')

const throwErr = (statusCode, message, method, defaultError = null) => {
  return {
    statusCode,
    message,
    method,
    defaultError,
  }
}

/**
 * Add to cache
 * @param {String} userId
 * @param {Object} tokens
 */
const addUserIdpAndHatersRedis = (userId, tokens, user) => {
  if (typeof tokens !== 'object') {
    throw new TypeError('Object must be of type Object')
  } else if (!tokens.token || !tokens.token_secret) {
    throw new TypeError('Object must have properties token & token_secret')
  } else {
    let values = {
      friends_ids: user.friends_ids,
      haters: user.haters,
      token: tokens.token,
      token_secret: tokens.token_secret,
    }
    values = JSON.stringify(values)
    redis.set(userId, values, 'ex', 3600)  // 2 hour expiry without chron ping
  }
}

const getUserInfoFromCache = async userId => {
  try {
    const user = await redis.get(userId)
    if (!user) {
      const errParams = [
        400,
        'There was an error in redisUtil : getUserInfoFromCache',
        'redisUtil : getUserInfoFromCache',
        err,
      ]
      throw throwErr(...errParams)
    }
    return JSON.parse(user)
  } catch (err) {
    throw err
  }
}

module.exports = {
  addUserIdpAndHatersRedis,
  getUserInfoFromCache,
  redis,
}
