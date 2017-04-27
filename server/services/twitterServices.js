const oauthSignature = require('oauth-signature')

// ----------------- Helper Methods ----------------- //
const genNonce = length => {
  const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += lettersAndNumbers.charAt(Math.floor(Math.random() * lettersAndNumbers.length))
  }
  return text
}

const genTimestamp = () => Math.floor(Date.now() / 1000)

const genDefaultAuthParams = (token, query) => {
  const defaultObj = {
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    oauth_nonce: genNonce(12),
    oauth_timestamp: genTimestamp(),
    oauth_token: token,
  }
  return Object.assign({}, defaultObj, query)
}

const genOAuthSignature = (authParams, tokenSecret, url, httpMethod) => {
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET
  return oauthSignature.generate(httpMethod, url, authParams, consumerSecret, tokenSecret)
}

// ----------------- Exported Methods ----------------- //
/**
 * Generates OAuth compliant headers for making requests to twitter REST API
 * @param {string} httpMethod - request method
 * @param {string} url - Twitter endpoint url
 * @param {string} userId - user id hash key
 * @param {object} query - parameters
 * @return {object} headers for twitter api
 */
const genTwitterAuthHeader = async (httpMethod, url, userId, query, { token, token_secret }) => {
  try {
    const authParams = genDefaultAuthParams(token, query)
    const signature = genOAuthSignature(authParams, token_secret, url, httpMethod)
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
    const error = {
      defaultError: err,
      message: 'error generating headers',
      method: 'twitterServices/genTwitterAuthHeader',
    }
    throw error
  }
}

module.exports = {
  genNonce,
  genTimestamp,
  genDefaultAuthParams,
  genOAuthSignature,
  genTwitterAuthHeader,
}
