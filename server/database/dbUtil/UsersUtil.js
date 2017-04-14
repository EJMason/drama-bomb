const Users = require('../models/Users')

const findOrCreate = async ({ user_id, simple_id, screen_name, friends_ids, haters = [] }) => {
  try {
    const user = await Users.count({ user_id })
    ? await Users.findOne({ user_id })
    : await Users.create({ user_id, simple_id, screen_name, friends_ids, haters })
    return user
  } catch (err) {
    throw err
  }
}

module.exports = { findOrCreate }
