const twitter = require('./twitterUtil')
const services = require('../services/friendsServices')
const dbUtil = require('../database/dbUtil/UsersUtil')
const redisUtil = require('../database/redis/redisUtil')

// -------------------- HELPER FUNCTIONS ------------------------ //

const throwErr = (statusCode, message, method, defaultError = null) => {
  message = message || 'Unkown error'
  return {
    statusCode,
    message,
    method: `error in cronService in ${method} method`,
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
  const allHaters = haters.concat(newHaters)
  allHaters.sort((a, b) => a.user_id - b.user_id)
  return allHaters
}

/**
 * Gets the new hater objects from twitter
 * @param {Array} haterIds
 * @param {String} userId
 * @return {Array}
 */
const getNewHatersFromTwitter = async (haterIds, userId, keys) => {
  let names
  const stringOfUserIds = haterIds.join()
  try {
    // user_id is the parameter name twitter needs, it isn't the user id'
    const haters = await twitter.getUsersLookup({ user_id: stringOfUserIds }, userId, keys)

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
    // gets the current array of user ids from twitter api
    let arrayOfUserIds = await twitter.getFollowersIds({ user_id, screen_name, token, token_secret })
    // return arrayOfUserIds.ids.sort((a, b) => a - b)
    arrayOfUserIds = arrayOfUserIds.ids.sort((a, b) => a - b)
    return arrayOfUserIds
  } catch (err) {
    const errParams = [
      400,
      'There was an error in friendsUtil : getSortedUserIds',
      'friendsUtil : getSortedIds',
      err,
    ]
    throw throwErr(...errParams)
  }
}

const findNewHatersAndFriends = ({ friends_ids, haters }, sortedIdsFromTwitter) => {
  // Meat and potatoes to check if there are any new friends or enemies, returns arrays of ids
  const { newFriends, newHaters } = services.findAllNew(friends_ids, sortedIdsFromTwitter)

  // check if any of the haters from the past have readded you, returns array of ids
  haters = services.checkIfHatersHaveAddedYou(haters, { newFriends, newHaters })

  return {
    newFriends,
    newHaters,
    friends_ids: sortedIdsFromTwitter,
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
const getUpdateHatersAndSort = async (followersHaters, userId, keys) => {
  try {
    // take haters ids and get their data objects from twitter
    const arrOfHatersObjects = await getNewHatersFromTwitter(followersHaters.newHaters, userId, keys)
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
 * @param {String} userId
 */
const updateDatabaseWithNewInfo = async (userId, { haters, friends_ids }) => {
  try {
    await dbUtil.updateUserFriendsAndHaters(userId, haters, friends_ids)
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

/**
 * If user count is different, this will do the logic for finding
 * user changes - for cron task!
 * @param {Object} user - various data for changed user
 * @param {Array} user.friends_ids
 * @param {Array} user.haters
 * @param {Number} user.followers_count
 * @param {String} user.screen_name
 * @param {String} user.user_id
 * @param {String} user.token
 * @param {String} user.token_secret
 */
const updateFromTwitter = async user => {
  try {
    const sortedIdsFromTwitter = await getSortedUserIds(user)
    let followersHaters = findNewHatersAndFriends(user, sortedIdsFromTwitter)
    const keys = { token: user.token, token_secret: user.token_secret }

    if (followersHaters.newHaters.length) {
      followersHaters = await getUpdateHatersAndSort(followersHaters, user.user_id, keys)
    }

    updateDatabaseWithNewInfo(`twitter|${user.user_id}`, followersHaters)

    return await redisUtil.updateChangedUser(`twitter|${user.user_id}`, followersHaters, user)
  } catch (err) {
    throw throwErr(400, '', 'updateFromTwitter', err)
  }
}

module.exports = {
  throwErr,
  getSortedUserIds,
  findNewHatersAndFriends,
  getUpdateHatersAndSort,
  updateDatabaseWithNewInfo,
  updateFromTwitter,
}
