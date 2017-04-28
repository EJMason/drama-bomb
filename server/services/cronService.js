const redis = require('../database/redis/redisUtil')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)


const getFollowerCountsFromTwitter = active => {
  try {
    const activeGroups = []
    while (active.length) { activeGroups.push(active.splice(0, maxTwitterSearch)) }

    const finished = activeGroups.map(group => {
      // let lucky = group[genRandomIdx(group.length)]
      let query = group.map(user => user.user_id).join(',')

      // select a random user to use their api key to get info about all individual users, 100 per request


    })
  } catch (err) {

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
