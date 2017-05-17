
const genUserSchema = Schema => {
  return new Schema({
    user_id: String,
    simple_id: String,
    screen_name: String,
    friends_ids: Schema.Types.Mixed,
    haters: Schema.Types.Mixed,
  }, { autoIndex: false })
}

module.exports = genUserSchema
