const userUtil = require('../database/dbUtil/UsersUtil')
const authUtil = require('../utilities/authUtil')
const redisUtil = require('../database/redis/redisUtil')

const log = require('../middleware/winstonLogger')

/**
 * Initial sequence for user login at auth/login/init
 * req.body - {user_id, simple_id, screen_name}
 */
module.exports.loginInit = async (req, res) => {
  try {
    log.debug('1 -> [file] authCtrl | [method] loginInit ')
    const userInfo = {
      user_id: req.profile.user_id,
      simple_id: req.profile.simple_id,
      screen_name: req.profile.screen_name,
    }
    log.debug('2 -> [file] authCtrl | [method] loginInit ')
    const user = await userUtil.findOrCreate(userInfo)
    // Auth0 managment API, get their idp token
    log.debug('3 -> [file] authCtrl | [method] loginInit ')
    const tokens = await authUtil.getUserIdp(userInfo.user_id)
    log.debug('4 -> [file] authCtrl | [method] loginInit ')
    await redisUtil.addUserOnLogin(userInfo.user_id, tokens, user)
    log.debug('5 -> [file] authCtrl | [method] loginInit ')
    res.status(200).send(user)
  } catch (err) {
    log.error(err)
    res.status(400).send(err)
  }
}

module.exports.logout = (req, res) => {
  try {
    redisUtil.onLogout(req.profile.user_id)
    res.status(200).send('logout_complete')
  } catch (err) {
    res.status(400).send('logout error: ', err)
  }
}
