
const UserCache = function () {
  const cache = {}

  this.addUser = function ({ user_id, screen_name, token, token_secret }) {
    cache.user_id = { user_id, screen_name, token, token_secret }
  }

  this.removeUser = userId => {
    delete cache[userId]
  }

  this.getUser = userId => {
    return cache[userId]
  }
}

module.export = UserCache
