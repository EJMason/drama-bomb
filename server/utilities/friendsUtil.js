const jwt = require('jsonwebtoken')
const twitter = require('../utilities/twitterUtil')
const services = require('../services/friendsServices')
const dbUtil = require('../database/dbUtil/UsersUtil')

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
  // Meat and potatoes to check if there are any new friends or enemies
  const changes = services.findAllNew(friends_ids, newArrFromTwitter)
  // check if any of the haters from the past have readded you
  haters = services.checkIfHatersHaveAddedYou(haters, changes)
  return {
    newFriends: changes.newFriends,
    newHaters: changes.newHaters,
    friends: newArrFromTwitter,
    changed: Boolean(changes.newFriends.length || changes.newHaters.length),
    haters,
  }
}

const getNewHatersFromTwitter = async (haterIds, userId) => {
  let names
  haterIds = haterIds.split()
  try {
    const haters = await twitter.getUsersLookup({ user_id: haterIds }, userId)
    return haters.map(hater => {
      names = hater.name.split(' ')
      if (!names[1]) {
        names.push('')
      }
      return {
        user_id: hater.id,
        screen_name: hater.screen_name,
        image: hater.profile_image_url,
        first_name: names[0],
        last_name: names[1],
      }
    })
  } catch (err) {
    return err
  }
}

const sortHaters = ({ haters, newHaters }) => {
  haters.push(...newHaters)
  haters.sort((a, b) => a.user_id - b.user_id)
}

const updateDatabaseWithNewInfo = async (userId, { haters, friends }) => {
  try {
    await dbUtil.updateUserFriendsAndHaters(userId, haters, friends)
  } catch (err) {
    throw err
  }
}

module.exports = {
  throwErr,
  checkIdToken,
  getSortedUserIds,
  findNewHatersAndFriends,
  getNewHatersFromTwitter,
  sortHaters,
  updateDatabaseWithNewInfo,
}
