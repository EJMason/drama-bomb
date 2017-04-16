require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = () => {
  const payload = {
    user_id: 'twitter|852718642722611200',
    screen_name: 'EJTester1',
  }
  const secret = process.env.TEST_AUTH0_SECRET
  const options = {
    expiresIn: '1d',
    issuer: process.env.AUTH0_DOMAIN,
    audience: process.env.TEST_AUTH0_CLIENTID,
    subject: 'twitter|852718642722611200',
  }
  return jwt.sign(payload, secret, options)
}


