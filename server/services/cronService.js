const redis = require('../database/redis/redisUtil')
const twitter = require('../utilities/twitterUtil')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)

// return all the users that have a different follower number
const getFollowerCountsFromTwitter = async active => {
  try {
    // splits all the users into groups of 100, that is the max query size twitter api can accomodate
    const activeGroups = []
    while (active.length) { activeGroups.push(active.splice(0, maxTwitterSearch)) }

    // this will _____ with each group
    const finished = activeGroups.map(group => {
      // this is creating the query string to send to the twitter api
      const query = group.map(user => user.user_id).join(',')
      const { user_id, token, token_secret } = group[genRandomIdx(group.length)]

      return twitter.getUsersLookup(query, user_id, { token, token_secret })
    })
  } catch (err) {
    throw
  }
}

module.export.cronCheck = async () => {
  // get all of the users from redis, that means they are logged in
  const activeUsers = await redis.getAllActiveUsers()
  // put all users that have a different 'followers' value into an array, they need to be checked
  const updatedData = getFollowerCountsFromTwitter(activeUsers)
  // check all the changed users friends and haters to see if someone unfollowed them or have new friends
  // update all the users that changed in redis
  // update all the users that changed in Database
}
