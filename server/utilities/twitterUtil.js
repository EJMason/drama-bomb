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
const getFollowersIds = qs => {
  const uri = `${baseUrl}/followers/ids.json`
  const headers = services.genTwitterAuthHeader('GET', uri, qs.user_id, qs)
  return rp({ uri, qs, headers, json: true })
}

/**
 * Twitter API: Once a users id is obtained, use that id to get
 * otherProfile information about a user
 */
const getUserProfileInformation = () => {

}

/**
 * Twitter API: Send private messages to other users
 */
const sendPrivateMessage = () => {

}

module.exports = {
  getFollowersIds,
  sendPrivateMessage,
  getUserProfileInformation,
}
