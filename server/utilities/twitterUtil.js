const rp = require('request-promise')
const services = require('../services/twitterServices')
const log = require('../middleware/winstonLogger')

const baseUrl = 'https://api.twitter.com/1.1'

/**
 * Twitter API: /followers/ids
 * @param {Object} qs
 * @param {string} qs.user_id  - Twitter User Id
 * @param {string} qs.screen_name - Twitter handle
 * @returns {Promise}
 */
module.exports.getFollowersIds = async ({ user_id, screen_name, token, token_secret }) => {
  try {
    const uri = `${baseUrl}/followers/ids.json`
    // Query string parameters
    const qs = {
      user_id,
      screen_name,
      stringify_ids: true,
    }
    // Oauth nonsense
    const headers = await services.genTwitterAuthHeader('GET', uri, user_id, qs, { token, token_secret })
    return rp({ uri, qs, headers })
  } catch (err) {
    log.error(err)
    throw err
  }
}

/**
 * Twitter API: /users/lookup
 * @param {Object} qs
 * @param {string} qs.user_id  - Comma seperated list of user ids
 * @param {Object} keys
 * @param {string} keys.token
 * @param {string} keys.token_secret
 * @returns {Promise}
 */
module.exports.getUsersLookup = async (qs, userId, keys) => {
  try {
    const uri = `${baseUrl}/users/lookup.json`
    const headers = await services.genTwitterAuthHeader('GET', uri, userId, qs, keys)
    return rp({ uri, qs, headers, json: true })
  } catch (err) {
    log.error(err)
    throw err
  }
}
