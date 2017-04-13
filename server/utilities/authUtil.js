const rp = require('request-promise')
const services = require('../services/auth0Services')
const usersUtil = require('../database/dbUtil/UsersUtil')

let explorerManagmentAccessToken = ''

/**
 * Auth0 endpoint /oauth/token
 * @returns {object} access_token and token_type
 */
const getManagmentToken = async () => {
  const options = services.generateManagmentOptions()
  const response = await rp(options)
  return response.access_token
}

/**
 * Auth0 endpoint /api/v2/users/USER_ID
 * @param {*} userId - id of user from Auth0 token
 * @param {*} options - default object
 */
const getUserIdp = async (userId, options = {}) => {
  const encodedUri = encodeURIComponent(userId)
  options.method = 'GET'
  options.url = `${process.env.AUTH0_DOMAIN}/api/v2/users/${encodedUri}`
  options.headers = { authorization: `Bearer ${ExplorerManagmentAccessToken}` }
  
  const response = await rp(options)
  const keys = response.identities[0]
  return { token: keys.access_token, token_secret: keys.access_token_secret }
}

const loginSequence = async ({ user_id, simple_id, screen_name }) => {
  if (!services.checkIfWebTokenIsExpired(explorerManagmentAccessToken)) {
    explorerManagmentAccessToken = await getManagmentToken()
  }
  const idp = await getUserIdp(user_id)
  await usersUtil.findAndUpdateUser({ user_id, simple_id, screen_name, idp })
}

module.exports = { requestManagmentToken, loginSequence }
