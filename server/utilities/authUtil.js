const oauthSignature = require('oauth-signature')

const genNonce = length => {
  const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += lettersAndNumbers.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const genTimestamp = () => {
  const date = new Date()
  return date.getHours()
}

const genDefaultAuthParams = () => {
  return {
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    oauth_nonce: genNonce(12),
    oauth_timestamp: genTimestamp(),
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
const genTwitterAuthHeader = (httpMethod, url, userId, query) => {
  const user = Cache.getUser(userId)

  let authParams = genDefaultAuthParams()
  authParams.oauth_token = user.token
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
}

module.exports = { genNonce, genTwitterAuthHeader }
