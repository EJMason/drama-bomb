const rp = require('request-promise')
const services = require('../services/twitterServices')

const baseUrl = 'https://api.twitter.com/1.1'

/**
 * Twitter API: /followers/ids
 * @param {Object} qs
 * @param {string} qs.user_id  - Twitter User Id
 * @param {string} qs.screen_name - Twitter handle
 * @returns {Promise}
 */
const getFollowersIds = async qs => {
  const uri = `${baseUrl}/followers/ids.json`
  const headers = await services.genTwitterAuthHeader('GET', uri, qs.user_id, qs)
  return rp({ uri, qs, headers, json: true })
}

/**
 * Twitter API: /users/lookup
 * @param {Object} qs
 * @param {string} qs.user_id  - Comma seperated list of user ids
 * @returns {Promise}
 */
const getUsersLookup = async (qs, userId) => {
  const uri = `${baseUrl}/users/lookup.json`
  const headers = await services.genTwitterAuthHeader('GET', uri, userId, qs)
  return rp({ uri, qs, headers, json: true })
}

/**
 * Twitter API: Send private messages to other users
 */
const sendPrivateMessage = () => {

}

module.exports = {
  getFollowersIds,
  sendPrivateMessage,
  getUsersLookup,
}
