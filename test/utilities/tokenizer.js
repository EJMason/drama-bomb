require('dotenv').config()
const jwt = require('jsonwebtoken')

const payload = {
  user_id: 'twitter|821069943986790400',
  screen_name: 'eliotstweets',
}

const secret = process.env.TEST_AUTH0_SECRET

const options = {
  expiresIn: '1d',
  issuer: process.env.AUTH0_DOMAIN,
  audience: process.env.TEST_AUTH0_CLIENTID,
  subject: 'twitter|821069943986790400',
}

module.export.genTestIdToken = async () => {
  const val = await jwt.sign(payload, secret, options)
  return val
}
