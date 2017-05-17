const Users = require('../').Users

const findOrCreate = async ({ user_id, simple_id, screen_name }) => {
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

    console.log('-----New User Created in Database-----')
    console.log(user)

    return user
  } catch (err) {
    throw err
  }
}

const updateUserFriendsAndHaters = async (userId, haters, friends) => {
  try {
    const user = await Users.findOne({ user_id: userId })

    user.friends_ids = friends
    user.markModified('friends_ids')
    user.haters = haters
    user.markModified('haters')

    await user.save()
  } catch (err) {
    throw err
  }
}

module.exports = { findOrCreate, updateUserFriendsAndHaters }
