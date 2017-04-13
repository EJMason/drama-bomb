const redis = require('./')

/**
 * Add to cache
 * @param {String} userId
 * @param {Object} tokens
 */
const addUserKeysToRedisCache = (userId, tokens) => {
  if (typeof tokens !== 'object') {
    throw new TypeError('Object must be of type Object')
  } else if (!tokens.token || !tokens.token_secret) {
    throw new TypeError('Object must have properties token & token_secret')
  } else {
    const keyValues = JSON.stringify(tokens)
    redis.set(userId, keyValues)
  }
}

module.exports = { addUserKeysToRedisCache, redis }
