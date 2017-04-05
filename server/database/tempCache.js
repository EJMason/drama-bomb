
const UserCache = function () {
  const cache = {
    821069943986790400: {
      user_id: '821069943986790400',
      screen_name: 'eliotstweets',
      token: process.env.TEMP_TOKEN,
      token_secret: process.env.TEMP_SECRET,
    },
  }

  this.addUser = ({ user_id, screen_name, token, token_secret }) => {
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
