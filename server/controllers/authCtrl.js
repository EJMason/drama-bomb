const userUtil = require('../database/dbUtil/UsersUtil')
const authUtil = require('../utilities/authUtil')
const redisUtil = require('../database/redis/redisUtil')

const example = (req, res) => {
  res.status(200).send('Hello, Auth!')
}

/**
 * Initial sequence for user login at auth/login/init
 * req.body - {user_id, simple_id, screen_name}
 */
const loginInit = async (req, res) => {
  try {
    const userInfo = {
      user_id: req.profile.user_id,
      simple_id: req.profile.simple_id,
      screen_name: req.profile.screen_name,
    }
    // Upon logging in,
      // check if user is in the database,
      // do not add if they are, get info
    const user = await userUtil.findOrCreate(userInfo)
    // Auth0 managment API, get their idp token
    const tokens = await authUtil.getUserIdp(user.user_id)
    // Once complete, add them to redis db
    await redisUtil.addUserIdpAndHatersRedis(user.user_id, tokens, user)

    res.status(200).send(user)
  } catch (err) {
    console.log(Object.keys(err))
    console.log(err.message)
    res.status(400).send(err)
  }
}

module.exports = { example, loginInit }
