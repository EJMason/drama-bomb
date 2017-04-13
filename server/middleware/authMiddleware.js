
const validateBody = (req, res, next) => {
  if (!req.body || !req.body.user_id || !req.body.simple_id || !req.body.screen_name) {
    res
    .status(412)
    .send({ error: 'Body must contain user_id, simple_id and screen_name!' })
  } else {
    next()
  }
}

module.exports = { validateBody }
