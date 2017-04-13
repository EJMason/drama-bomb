const util = require('../database/dbUtil/UsersUtil')
const rds = require('../database/redis/redisUtil')

const example = (req, res) => {
  res.status(200).send('Hello, Auth!')
}

/**
 * Initial sequence for user login at /login/init
 * req.body - {user_id, simple_id, screen_name}
 */
const loginInit = async (req, res) => {
  // check if the user exists in the database, if not, add them to mongoose
  const user = await util.findOrCreate(req.body)

  
  // using the userId from auth0, get their idp tokens, save them to redis cache
  await rds.addUserKeysToRedisCache()

  res.status(200).send('Hello, Auth!')
}

module.exports = { example, loginInit }
