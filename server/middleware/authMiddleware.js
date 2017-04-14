const jwt = require('express-jwt')

const validateBody = (req, res, next) => {
  if (!req.body || !req.body.user_id || !req.body.simple_id || !req.body.screen_name) {
    res
    .status(412)
    .send({ error: 'Body must contain user_id, simple_id and screen_name!' })
  } else {
    next()
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

module.exports = { validateBody, validateJwt: generateProductionMiddleware() }
