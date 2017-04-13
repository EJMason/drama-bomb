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

const findAndUpdateUser = async ({ user_id, simple_id, screen_name, idp }) => {
  const cond = { user_id }
  const update = {
    user_id,
    simple_id,
    screen_name,
    token: idp.token,
    token_secret: idp.token_secret,
  }
  const options = { upsert: true }
  const user = await Users.findOneAndUpdate(cond, update, options)
  return user
}

module.exports = { findAndUpdateUser, findOrCreate }
