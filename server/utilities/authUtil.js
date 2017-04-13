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
  try {
    const response = await rp(options)
    return JSON.parse(response).access_token
  } catch (err) {
    throw err
  }
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

  try {
    const response = await rp(options)
    const keys = JSON.parse(response).identities[0]
    return { token: keys.access_token, token_secret: keys.access_token_secret }
  } catch (err) {
    throw err
  }
}

const getUserIdpTest = async (userId, tok, options = {}) => {
  const encodedUri = encodeURIComponent(userId)
  options.method = 'GET'
  options.url = `${process.env.AUTH0_DOMAIN}/api/v2/users/${encodedUri}`
  options.headers = { authorization: `Bearer ${tok}` }

  try {
    const response = await rp(options)
    const keys = JSON.parse(response).identities[0]
    return { token: keys.access_token, token_secret: keys.access_token_secret }
  } catch (err) {
    throw err
  }
}

const loginSequence = async ({ user_id, simple_id, screen_name }) => {
  if (!services.checkIfWebTokenIsExpired(explorerManagmentAccessToken)) {
    explorerManagmentAccessToken = await getManagmentToken()
  }
  const idp = await getUserIdp(user_id)
  await usersUtil.findAndUpdateUser({ user_id, simple_id, screen_name, idp })
}

module.exports = {
  getManagmentToken,
  getUserIdp,
  getUserIdpTest,
  loginSequence,
  explorerManagmentAccessToken,
}
