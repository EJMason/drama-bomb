class UserCache {
  constructor() {
    this.cache = {
      821069943986790400: {
        user_id: '821069943986790400',
        screen_name: 'eliotstweets',
        token: process.env.TEMP_TOKEN,
        token_secret: process.env.TEMP_SECRET,
      },
    }
  }

  addUser({ user_id, screen_name, token, token_secret }) {
    this.cache[user_id] = { user_id, screen_name, token, token_secret }
  }

  removeUser(userId) {
    delete this.cache[userId]
  }

  getUser(userId) {
    return this.cache[userId]
  }
}

module.exports = UserCache
