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

module.exports.cronCheck = async () => {
  try {
    // get all of the users from redis, that means they are logged in, groups of 100
    const groupsOfUsers = cronService.groupsUsers(await redis.getAllActiveUserIds())

   /*
      What should I do here if groupsOfUsers is empty?
    */

    // generate the twitter queries for each group, request twitter api
    const arrOfResponses = await Promise.all(cronService.genTwitterQueries(groupsOfUsers))

    // compare twitter to redis to see if anyone was unfollowed
    const changedUsers = cronService.compareItems(groupsOfUsers, arrOfResponses)

    if (changedUsers.length) {
      const result = await Promise.all(changedUsers.map(user => friendsUtil.updateFromTwitter(user)))
      console.log('THIS IS THE RESULT: ', result)
    }
  } catch (err) {
    console.error('ERROR IN CRONUTIL: ', err)
    throw throwErr(null, 'Error in chron job', 'cronCheck', err)
  }
}
