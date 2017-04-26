const jwt = require('express-jwt')
const jsonwt = require('jsonwebtoken')

const shhh = (process.env.NODE_ENV === 'testing')
? process.env.TEST_AUTH0_SECRET
: process.env.AUTH0_CLIENT_SECRET

const validateBody = (req, res, next) => {
  if (!req.body || !req.body.user_id || !req.body.simple_id || !req.body.screen_name) {
    res
    .status(412)
    .send({ error: 'Body must contain user_id, simple_id and screen_name!' })
  } else {
    next()
  }
}

const checkJWT = (req, res, next) => {
  try {
    const profile = jsonwt.verify(req.headers.authorization, scrt = shhh)
    req.profile = profile
    req.profile.simple_id = profile.user_id.substr(profile.user_id.indexOf('|') + 1)
    next()
  } catch (err) {
    res
      .status(404)
      .send('Invalid Token')
  }
}

const generateProductionMiddleware = () => {
  if (process.env.TESTING) {
    return (req, res, next) => { next() }
  }
  return jwt({
    secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: process.env.AUTH0_DOMAIN,
    algorithms: ['HS256'],
  })
}

module.exports = { validateBody, checkJWT, validateJwt: generateProductionMiddleware() }
