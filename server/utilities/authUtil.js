const rp = require('request-promise')

const services = require('../services/auth0Services')
const redis = require('../database/redis')
const log = require('../middleware/winstonLogger')

/**
 * Auth0 endpoint /oauth/token
 * @returns {object} access_token and token_type
 */
const getManagmentToken = async () => {
  try {
    let mtoken = await redis.get('mtoken')
    if (!mtoken || services.checkIfWebTokenIsExpired(mtoken)) {
      const options = services.generateManagmentOptions()
      const response = await rp(options)
      mtoken = JSON.parse(response).access_token
      redis.set('mtoken', mtoken)
    }
    return mtoken
  } catch (err) {
    log.error(err)
    throw err
  }
}

/**
 * Auth0 endpoint /api/v2/users/USER_ID
 * @param {String} userId - id of user from Auth0 token
 */
module.exports.getUserIdp = async userId => {
  try {
    const mtoken = await getManagmentToken()
    const response = await rp({
      method: 'GET',
      url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      headers: { authorization: `Bearer ${mtoken}` },
    })
    const keys = JSON.parse(response).identities[0]
    return { token: keys.access_token, token_secret: keys.access_token_secret }
  } catch (err) {
    log.error(err)
    throw err
  }
}
