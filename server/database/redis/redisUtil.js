const redis = require('./')
const Promise = require('bluebird')

const throwErr = (statusCode, method, message, defaultError = null) => {
  message = message || 'Error message unspecified'
  return {
    statusCode,
    message,
    method: `redisUtil.js : ${method}`,
    defaultError,
  }
}

/**
 * Add to cache
 * @param {String} userId
 * @param {Object} tokens
 */
const addUserIdpAndHatersRedis = (key, tokens, user) => {
  try {
    if (typeof tokens !== 'object') {
      throw throwErr(400, 'addUserIdpAndHatersRedis', 'must be of type Object')
    } else if (!tokens.token || !tokens.token_secret) {
      throw throwErr(400, 'addUserIdpAndHatersRedis', 'Object must have properties token & token_secret')
    } else {
      let values = {
        user_id: key.substr(key.indexOf('|') + 1),
        friends_ids: user.friends_ids,
        followers_count: user.friends_ids.length,
        haters: user.haters,
        token: tokens.token,
        token_secret: tokens.token_secret,
        updated: Date.now(),
      }
      values = JSON.stringify(values)
      redis.set(key, values, 'ex', 3600)  // 2 hour expiry without chron ping
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

const getAllActiveUserIds = () => {
  const params = { match: 'twitter|*' }
  let pipeQueries
  return new Promise((resolve, reject) => {
    const stream = redis.scanStream(params)
    stream.on('data', value => { pipeQueries = value })
    stream.on('end', () => {
      redis.pipeline(pipeQueries.map(val => ['get', val])).exec((err, results) => {
        console.log('HERE ARE RESULTS: ', results)
        if (!results.length) {
          resolve([])
        } else if (results[0][0]) {
          reject(throwErr(400, 'getAllActiveUsers', null, results[0][0]))
        } else {
          resolve(results.map(val => JSON.parse(val[1])))
        }
      })
    })
  })
}

module.exports = {
  addUserIdpAndHatersRedis,
  getUserInfoFromCache,
  updateExpiry,
  getAllActiveUserIds,
  redis,
}
