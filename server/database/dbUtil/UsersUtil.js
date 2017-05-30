const Users = require('../').Users
const log = require('../../middleware/winstonLogger')

module.exports.findOrCreate = async ({ user_id, simple_id, screen_name }) => {
  try {
    if (await Users.count({ user_id })) {
      return await Users.findOne({ user_id })
    }
    const newUser = new Users({
      user_id,
      simple_id,
      screen_name,
    })

    newUser.haters = null
    newUser.markModified('haters')
    newUser.friends_ids = null
    newUser.markModified('friends_ids')
    const user = await newUser.save()

    log.verbose('-----New User Created in Database-----')
    log.verbose(user)

    return user
  } catch (err) {
    log.error(err)
    throw err
  }
}

module.exports.updateUserFriendsAndHaters = async (userId, haters, friends) => {
  try {
    const user = await Users.findOne({ user_id: userId })

    user.friends_ids = friends
    user.markModified('friends_ids')
    user.haters = haters
    user.markModified('haters')

    await user.save()
  } catch (err) {
    log.error(err)
    throw err
  }
}
