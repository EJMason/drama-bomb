const mongoose = require('mongoose')

const Schema = mongoose.Schema

const haterSchema = new Schema({
  user_id: Number,
  screen_name: String,
  image: String,
  first_name: String,
  family_name: String,
  passive: Boolean,
  aggressive: Boolean,
  apology: Boolean,
  demon_mode: { type: Boolean, default: false },
}, { autoIndex: false })

const userSchema = new Schema({
  user_id: Number,
  screen_name: String,
  token: String,
  token_secret: String,
  friends_ids: [Number],
  haters: [haterSchema],
}, { autoIndex: false })

const Users = mongoose.model('User', userSchema)

module.exports = Users
