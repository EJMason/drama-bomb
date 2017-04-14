const oauthSignature = require('oauth-signature')
const redis = require('../database/redis')

const genNonce = length => {
  const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += lettersAndNumbers.charAt(Math.floor(Math.random() * lettersAndNumbers.length))
  }
  return text
}

const genTimestamp = () => Math.floor(Date.now() / 1000)


const genDefaultAuthParams = token => {
  return {
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    oauth_nonce: genNonce(12),
    oauth_timestamp: genTimestamp(),
    oauth_token: token,
  }
}

const genOAuthSignature = (authParams, tokenSecret, url, httpMethod) => {
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET
  return oauthSignature.generate(httpMethod, url, authParams, consumerSecret, tokenSecret)
}

/**
 * Generates OAuth compliant headers for making requests to twitter REST API
 * @param {string} httpMethod - request method
 * @param {string} url - Twitter endpoint url
 * @param {string} userId - user id hash key
 * @param {object} query - parameters
 * @return {object} headers for twitter api
 */
const genTwitterAuthHeader = async (httpMethod, url, userId, query) => {
  try {
    let user = await redis.get(userId)
    user = JSON.parse(user)
    if (!user) { throw new Error('User Not in Database!') }
    let authParams = genDefaultAuthParams(user.token)
    authParams = Object.assign({}, authParams, query)

    const signature = genOAuthSignature(authParams, user.token_secret, url, httpMethod)

    const str = [
      `OAuth oauth_consumer_key=${authParams.oauth_consumer_key}, `,
      'oauth_signature_method=HMAC-SHA1, ',
      `oauth_timestamp=${authParams.oauth_timestamp}, `,
      `oauth_nonce=${authParams.oauth_nonce}, `,
      'oauth_version=1.0, ',
      `oauth_token=${authParams.oauth_token}, `,
      `oauth_signature=${signature}`]
    return { Authorization: str.join('') }
  } catch (err) {
    return err
  }
}

module.exports = {
  genNonce,
  genTimestamp,
  genDefaultAuthParams,
  genOAuthSignature,
  genTwitterAuthHeader,
}
