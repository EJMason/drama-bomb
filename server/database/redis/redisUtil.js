const redis = require('./')
const Promise = require('bluebird')

redis.on('del', val => console.log('KEY HAS EXPIRED: ', val))

const throwErr = (statusCode, method, message, defaultError = null) => {
  message = message || 'Error message unspecified'
  return {
    statusCode,
    message,
    method: `redisUtil.js : ${method}`,
    defaultError,
  }
}

const getValues = (key, tokens, user) => JSON.stringify({
  screen_name: user.screen_name,
  user_id: key.substr(key.indexOf('|') + 1),
  friends_ids: user.friends_ids,
  followers_count: user.friends_ids.length,
  haters: user.haters,
  token: tokens.token,
  token_secret: tokens.token_secret,
  updated: Date.now(),
})

// -------------- For Export ------------------------ //

const addUserOnLogin = async (key, tokens, user) => {
  try {
    const alreadyIn = await redis.exists(key)
    if (!alreadyIn) {
      redis.set(key, getValues(key, tokens, user), 'ex', 3600)
      redis.incr('usercount')
    }
  } catch (error) {
    throw throwErr(400, 'initOnLogin', null, err)
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

const updateChangedUser = async (key, updatedInfo, oldUser) => {
  try {
    const newUser = Object.assign({}, oldUser)
    newUser.friends_ids = updatedInfo.friends_ids
    newUser.haters = updatedInfo.haters
    newUser.followers_count = updatedInfo.friends_ids.length
    newUser.updated = Date.now()

    await redis.set(key, JSON.stringify(newUser), 'ex', 3600)
    return newUser
  } catch (err) {
    throw throwErr(400, 'updateChangeduser', null, err)
  }
}

module.exports = {
  addUserOnLogin,
  getUserInfoFromCache,
  updateExpiry,
  getAllActiveUserIds,
  updateChangedUser,
  redis,
}
