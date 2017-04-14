const mongoose = require('mongoose')

const Schema = mongoose.Schema

const haterSchema = new Schema({
  user_id: {
    type: String,
    required: [true, 'user id is required'],
  },
  screen_name: {
    type: String,
    required: [true, 'screen name is required'],
  },
  image: String,
  first_name: String,
  family_name: String,
  passive: Boolean,
  aggressive: Boolean,
  apology: Boolean,
  demon_mode: { type: Boolean, default: false },
}, { autoIndex: false })

const userSchema = new Schema({
  user_id: String,
  simple_id: String,
  screen_name: String,
  friends_ids: {
    type: [Number],
    default: [],
  },
  haters: {
    type: [haterSchema],
    default: [],
  },
}, { autoIndex: false })

const Users = mongoose.model('User', userSchema)

module.exports = Users
