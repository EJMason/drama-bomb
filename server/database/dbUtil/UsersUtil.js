const Users = require('../models/Users')

const findOrCreate = async ({ user_id, screen_name }) => {
  try {
    let user = null
    const exists = await Users.count({ user_id })

    if (exists) {
      user = await Users.findOne({ user_id })
    } else {
      user = await Users.create({ user_id, screen_name })
    }
    return user
  } catch (err) {
    throw err
  }
}

module.exports = { findOrCreate }
