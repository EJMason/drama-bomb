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
    const friendsAndHaters = {
      friends_ids: user.friends_ids,
      haters: user.haters,
    }
    const friendsKey = `f_${userId}`
    const friendsValues = JSON.stringify(friendsAndHaters)
    redis.set(friendsKey, friendsValues, 'ex', 86400)

    const keyValues = JSON.stringify(tokens)
    redis.set(userId, keyValues, 'ex', 86400) // expire after one day
  }
}

module.exports = { addUserIdpAndHatersRedis, redis }
