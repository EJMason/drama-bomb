const userUtil = require('../database/dbUtil/UsersUtil')
const authUtil = require('../utilities/authUtil')
const redisUtil = require('../database/redis/redisUtil')

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
    // --------------- REFACTORED ---------------------- //
    const user = await userUtil.findOrCreate(userInfo)
    // Auth0 managment API, get their idp token
    // --------------- REFACTORED ---------------------- //
    const tokens = await authUtil.getUserIdp(userInfo.user_id)
    // Once complete, add them to redis db
    // --------------- REFACTORED ---------------------- //
    await redisUtil.addUserOnLogin(userInfo.user_id, tokens, user)

    res.status(200).send(user)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

// --------------- REFACTORED ---------------------- //
const logout = (req, res) => {
  try {
    redisUtil.onLogout(req.profile.user_id)
    res.status(200).send('logout_complete')
  } catch (err) {
    res.status(400).send('logout error: ', err)
  }
}

module.exports = { loginInit, logout }
