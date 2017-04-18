const jwt = require('jsonwebtoken')
const twitter = require('../utilities/twitterUtil')
const services = require('../services/friendsServices')

const throwErr = (code, msg) => ({ code, msg })

const checkIdToken = (token, scrt = process.env.AUTH0_CLIENT_SECRET) => {
  try {
    const valid = jwt.verify(token, scrt)
    return {
      user_id: valid.user_id,
      screen_name: valid.screen_name,
    }
  } catch (err) {
    return null
  }
}

const getSortedUserIds = async ({ user_id, screen_name }) => {
  try {
    let arrayOfUserIds = await twitter.getFollowersIds({ user_id, screen_name })
    arrayOfUserIds = arrayOfUserIds.sort((a, b) => a - b)
    return arrayOfUserIds
  } catch (err) { return console.err(err) }
}

const findNewHatersAndFriends = ({ friends_ids, haters }, newArrFromTwitter) => {
  const changes = services.findAllNew(friends_ids, newArrFromTwitter)
  // remove any haters that may have readded you
  haters = haters.filter(hater => {
    let haterIsFriend = false
    changes.newFriends.forEach(val => { if (hater.user_id === val) haterIsFriend = true })
    return haterIsFriend
  })

  return {
    newFriends: changes.newFriends,
    newHaters: changes.newHaters,
    friends: newArrFromTwitter,
    changed: Boolean(changes.newFriends.length || changes.newHaters.length),
    haters,
  }
}

const updateDatabaseWithNewInfo = followersHaters => {
  return followersHaters
}

module.exports = {
  throwErr,
  checkIdToken,
  getSortedUserIds,
  findNewHatersAndFriends,
  updateDatabaseWithNewInfo,
}
