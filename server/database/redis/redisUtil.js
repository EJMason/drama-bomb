const redis = require('./')

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
    redis.set(userId, values, 'ex', 86400)

    // const friendsKey = `f_${userId}`
    // const friendsValues = JSON.stringify(friendsAndHaters)
    // redis.set(friendsKey, friendsValues, 'ex', 86400)
    // redis.hset(userId, 'friends', friendsValues, 'ex', 86400)

    // const keyValues = JSON.stringify(tokens)
    // redis.set(userId, keyValues, 'ex', 86400) // expire after one day
    // redis.hset(userId, 'keys', keyValues, 'ex', 86400)
  }
}

module.exports = { addUserIdpAndHatersRedis, redis }
