const twitter = require('./twitterUtil')
const services = require('../services/friendsServices')
const dbUtil = require('../database/dbUtil/UsersUtil')

// -------------------- HELPER FUNCTIONS ------------------------ //

const throwErr = (statusCode, message, method, defaultError = null) => {
  return {
    statusCode,
    message,
    method,
    defaultError,
  }
}

/**
 * Merges haters with new Haters, then sorts them
 * @param {Array} Haters
 * @param {Array} newHaters
 * @return {Array}
 */
const sortHaters = ({ haters, newHaters }) => {
  const allhaters = haters.concat(newHaters)
  allhaters.sort((a, b) => a.user_id - b.user_id)
  return allHaters
}

/**
 * Gets the new hater objects from twitter
 * @param {Array} haterIds
 * @param {String} userId
 * @return {Array}
 */
const getNewHatersFromTwitter = async (haterIds, userId) => {
  let names
  const stringOfUserIds = haterIds.join()
  try {
    // user_id is the parameter name twitter needs, it isn't the user id'
    const haters = await twitter.getUsersLookup({ user_id: stringOfUserIds }, userId)

    // Builds out an array of the new hater objects
    return haters.map(hater => {
      names = hater.name.split(' ')
      if (!names[1]) { names.push('') }
      return {
        user_id: hater.id,
        screen_name: hater.screen_name,
        image: hater.profile_image_url,
        first_name: names[0],
        last_name: names[1],
      }
    })
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : getNewHatersFromTwitter',
      'friendsUtil : getNewHatersFromTwitter',
      err,
    ]
    throw throwErr(...errParams)
  }
}

// --------------------------- For Export --------------------------- //

const getSortedUserIds = async ({ user_id, screen_name, token, token_secret }) => {
  try {
    let arrayOfUserIds = await twitter.getFollowersIds({ user_id, screen_name, token, token_secret })
    arrayOfUserIds = arrayOfUserIds.ids.sort((a, b) => a - b)
    return arrayOfUserIds
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : getNewHatersFromTwitter',
      'friendsUtil : getSortedIds',
      err,
    ]
    throw throwErr(...errParams)
  }
}

/**
 *
 * @param {*} param0
 * @param {*} newArrFromTwitter
 */
const findNewHatersAndFriends = ({ friends_ids, haters }, newArrFromTwitter) => {
  // Meat and potatoes to check if there are any new friends or enemies, returns arrays of ids
  const { newFriends, newHaters } = services.findAllNew(friends_ids, newArrFromTwitter)

  // check if any of the haters from the past have readded you, returns array of ids
  haters = services.checkIfHatersHaveAddedYou(haters, { newFriends, newHaters })

  return {
    newFriends,
    newHaters,
    friends: newArrFromTwitter,
    changed: Boolean(newFriends.length || newHaters.length),
    haters,
  }
}

/**
 *
 * @param {Object}
 * @param {Array} newHaters
 * @param {String} user_id
 */
const getUpdateHatersAndSort = async (followersHaters, userId) => {
  try {
    // take haters ids and get their data objects from twitter
    const arrOfHatersObjects = await getNewHatersFromTwitter(followersHaters.newHaters, userId)
    // sort the results and merge them into the new haters
    const allHaters = sortHaters({ haters: followersHaters.haters, newHaters: arrOfHatersObjects })
    followersHaters.haters = allHaters

    return Object.assign({}, followersHaters)
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : getUpdateHatersAndSort',
      'friendsUtil : getUpdateHatersAndSort',
      err,
    ]
    throw throwErr(...errParams)
  }
}

/**
 *
 * @param {*} userId
 * @param {*} param1
 */
const updateDatabaseWithNewInfo = async (userId, { haters, friends }) => {
  try {
    await dbUtil.updateUserFriendsAndHaters(userId, haters, friends)
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : updateDatabaseWithNewInfo',
      'friendsUtil : updateDatabaseWithNewInfo',
      err,
    ]
    throw throwErr(...errParams)
  }
}

module.exports = {
  throwErr,
  getSortedUserIds,
  findNewHatersAndFriends,
  getUpdateHatersAndSort,
  updateDatabaseWithNewInfo,
}
