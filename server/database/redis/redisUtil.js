const redis = require('./')
const Promise = require('bluebird')

const log = require('../../middleware/winstonLogger')

/**
 * Helper Function, builds out a redis JSON
 * @param {String} key
 * @param {Object} tokens
 * @param {Object} user
 */
const getValues = (key, tokens, user) => {
  const count = user.friends_ids ? Object.keys(user.friends_ids).length : 0
  return JSON.stringify({
    screen_name: user.screen_name,
    user_id: key.substr(key.indexOf('|') + 1),
    friends_ids: user.friends_ids,
    followers_count: count,
    haters: user.haters,
    token: tokens.token,
    token_secret: tokens.token_secret,
    updated: Date.now(),
  })
}


// -------------- For Export ------------------------ //

module.exports.addUserOnLogin = async (key, tokens, user) => {
  try {
    const alreadyIn = await redis.exists(key)
    if (!alreadyIn) {
      redis.set(key, getValues(key, tokens, user), 'ex', 3600) // one hour
      redis.incr('usercount')
    }
  } catch (err) {
    log.error(err)
    throw err
  }
}

// This is update how long the user in logged in, minutes
module.exports.updateExpiry = async key => {
  try {
    await redis.expire(key, 3600)
  } catch (err) {
    log.error(err)
    throw err
  }
}

// creates a way to search for all the users given a key parameter
const streamUsers = cb => {
  let all
  const userStream = redis.scanStream({ match: 'twitter|*' })
  userStream.on('data', users => {
    all = users
  })
  userStream.on('end', () => {
    cb(all)
  })
}

/**
 * This bulk queries the redis cache increasing get speed by 200%
 */
module.exports.getAllActiveUserIds = () => {
  return new Promise((resolve, reject) => {
    this.streamUsers(users => {
      redis.pipeline(users.map(val => ['get', val])).exec((err, results) => {
        if (!results.length) {
          resolve([])
        } else if (results[0][0]) {
          log.error(results[0][0])
          reject(results[0][0])
        } else {
          resolve(results.map(val => JSON.parse(val[1])))
        }
      })
    })
  })
}

/**
 * After change in followers, this will update the user JSON
 */
module.exports.updateChangedUser = async (key, updatedInfo, oldUser) => {
  try {
    const newUser = Object.assign({}, oldUser)
    newUser.friends_ids = updatedInfo.friends_ids
    newUser.haters = updatedInfo.haters
    newUser.followers_count = updatedInfo.friends_ids.length
    newUser.updated = Date.now()

    await redis.set(key, JSON.stringify(newUser), 'ex', 3600)
    return newUser
  } catch (err) {
    log.error(err)
    throw err
  }
}

/**
 * Expiring a user in Redis is essentially a cleanup action
 */
module.exports.onLogout = uid => {
  log.verbose(`${uid} removing from redis`)
  redis.expire(uid, 4)
}

// ---- on server startup ---- //
(() => { streamUsers(users => { redis.set('usercount', users.length) }) })()

module.exports.redis = redis
module.exports.streamUsers = streamUsers
