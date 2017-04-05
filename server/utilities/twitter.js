const rp = require('request-promise')
const util = require('../utilities/authUtil')

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
  const headers = util.genTwitterAuthHeader('GET', uri, qs.user_id, qs)
  return rp({ uri, qs, headers, json: true })
}

module.exports.getFollowersIds = getFollowersIds
