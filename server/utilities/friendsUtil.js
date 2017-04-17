const twitter = require('../utilities/twitterUtil')

const throwErr = (code, msg) => ({ code, msg })

const getSortedUserIds = async ({ user_id, screen_name }) => {
  try {
    let arrayOfUserIds = await twitter.getFollowersIds({ user_id, screen_name })
    arrayOfUserIds = arrayOfUserIds.sort((a, b) => a - b)
    return arrayOfUserIds
  } catch (err) { return console.err(err) }
}

const findNewHatersAndFriends = (user, followers) => {

}

module.exports = { throwErr, getSortedUserIds, findNewHatersAndFriends }
