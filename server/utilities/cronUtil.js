const Promise = require('bluebird')

const redis = require('../database/redis/redisUtil')
const cronService = require('../services/cronService')

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
    console.log('\n\n Here are the active groups: ', groupsOfUsers)
    /*
      What should I do here if groupsOfUsers is empty?
    */

    // generate the twitter queries for each group, request twitter api
    const twitterRequests = cronService.genTwitterQueries(groupsOfUsers)
    const arrOfResponses = await Promise.all(twitterRequests)

    const changedUsers = cronService.compareItems(groupsOfUsers, arrOfResponses)

    console.log('HERE ARE THE CHANGED USERS: ', changedUsers)

    // now we need to modify the endpoint method in friends to
    // accomodate the ability to find updated data on multiple users
    // lets just get to here first
  } catch (err) {
    console.error('ERROR IN CRONUTIL')
    throw throwErr(null, 'Error in chron job', 'cronCheck', err)
  }
}
