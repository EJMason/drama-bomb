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
    // get all of the users from redis, that means they are logged in
    // put them into groups of 100
    const groupsOfUsers = cronService.groupsUsers(await redis.getAllActiveUserIds())
    console.log('\n\n Here are the active groups: ', groupsOfUsers)
    // generate the twitter queries for each group, request twitter api

    console.log('\nBegin cronService.genTwitterQueries')
    const twitterRequests = cronService.genTwitterQueries(groupsOfUsers)
    console.log('\nBegin Promise.all')
    const arrOfResponses = await Promise.all(twitterRequests)
    arrOfResponses.forEach((val, i) => {
      console.log(`${i}. ${val}`)
    })

    // take the multi-dimensional array, flatten it, and sort it
    // const sortedResponses = cronService.updateResponses(arrOfResponses)

    // // compare the active to changed using a binary search
    // const changedUsers = cronService.compareUserVersions(sortedResponses)

    // console.log('Here are the changed Users: ', changedUsers)
    // now we need to modify the endpoint method in friends to
    // accomodate the ability to find updated data on multiple users
    // lets just get to here first
  } catch (err) {
    throw throwErr(null, 'Error in chron job', 'cronCheck', err)
  }
}
