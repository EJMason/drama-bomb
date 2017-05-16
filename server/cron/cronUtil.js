const Promise = require('bluebird')

const redis = require('../database/redis/redisUtil')
const cronService = require('../services/cronService')
const friendsUtil = require('../utilities/friendsUtil')

const throwErr = (statusCode, message, method, defaultError = null) => {
  return {
    statusCode,
    message,
    method: `error in cronService in ${method} method`,
    defaultError,
  }
}

module.exports.checkUsersLoggedIn = () => {
  return new Promise((resolve, reject) => {
    redis.getAllActiveUserIds()
      .then(users => {
        const groups = cronService.groupsUsers(users)
        resolve(groups.length ? true : false)
      })
      .catch(reject)
  })
}

module.exports.cronCheck = async () => {
  try {
    // get all of the users from redis, that means they are logged in, groups of 100
    const groupsOfUsers = cronService.groupsUsers(await redis.getAllActiveUserIds())
    // generate the twitter queries for each group, request twitter api
    const arrOfResponses = await Promise.all(cronService.genTwitterQueries(groupsOfUsers))

    // compare twitter to redis to see if anyone was unfollowed
    const changedUsers = cronService.compareItems(groupsOfUsers, arrOfResponses)
    if (changedUsers.length) {
      const result = await Promise.all(changedUsers.map(user => friendsUtil.updateFromTwitter(user)))
      return result
    }
    return []
  } catch (err) {
    throw throwErr(null, 'Error in chron job', 'cronCheck', err)
  }
}
