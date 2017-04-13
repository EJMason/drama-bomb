const userUtil = require('../database/dbUtil/UsersUtil')
const authUtil = require('../utilities/authUtil')
const redisUtil = require('../database/redis/redisUtil')

const example = (req, res) => {
  res.status(200).send('Hello, Auth!')
}

/**
 * Initial sequence for user login at /login/init
 * req.body - {user_id, simple_id, screen_name}
 */
const loginInit = async (req, res) => {
  const user = await userUtil.findOrCreate(req.body)
  const tokens = await authUtil.getUserIdp(user.user_id)
  await redisUtil.addUserKeysToRedisCache(user.user_id, tokens)

  res.status(200).send('Login Sequence Complete!')
}

module.exports = { example, loginInit }
