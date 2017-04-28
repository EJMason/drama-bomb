const rp = require('request-promise')
const services = require('../services/twitterServices')

const baseUrl = 'https://api.twitter.com/1.1'

const throwErr = (statusCode, message, method, defaultError = null) => {
  return {
    statusCode,
    message,
    method,
    defaultError,
  }
}

/**
 * Twitter API: /followers/ids
 * @param {Object} qs
 * @param {string} qs.user_id  - Twitter User Id
 * @param {string} qs.screen_name - Twitter handle
 * @returns {Promise}
 */
const getFollowersIds = async ({ user_id, screen_name, token, token_secret }) => {
  try {
    const uri = `${baseUrl}/followers/ids.json`
    const qs = { user_id, screen_name }
    const headers = await services.genTwitterAuthHeader('GET', uri, user_id, { user_id, screen_name }, { token, token_secret })
    return rp({ uri, qs, headers, json: true })
  } catch (err) {
    const errParams = [
      400,
      'There was an error in twitterUtil : getFollowersIds',
      'twitterUtil : getFollowersIds',
      err,
    ]
    throw throwErr(...errParams)
  }
}

/**
 * Twitter API: /users/lookup
 * @param {Object} qs
 * @param {string} qs.user_id  - Comma seperated list of user ids
 * @returns {Promise}
 */
const getUsersLookup = async (qs, userId) => {
  try {
    const uri = `${baseUrl}/users/lookup.json`
    /*
    WHY DOES services.genTwitterAuthHeader NOT HAVE LAST PARAMETER: KEYS?!?!?!?!
    THIS SHOULD NOT WORK!!!!!!!
    */
    const headers = await services.genTwitterAuthHeader('GET', uri, userId, qs)
    return rp({ uri, qs, headers, json: true })
  } catch (err) {
    const errParams = [
      400,
      'There was an error in twitterUtil : getUsersLookup',
      'twitterUtil : getUsersLookup',
      err,
    ]
    throw throwErr(...errParams)
  }
}

module.exports = {
  getFollowersIds,
  getUsersLookup,
}
