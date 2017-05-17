const Promise = require('bluebird')

const redis = require('../database/redis/redisUtil')
const cronService = require('../services/cronService')
const friendsUtil = require('../utilities/friendsUtil')

const throwErr = (statusCode, message, method, defaultError = null) => {
  return {
    statusCode,
    message,
    method: `error in cronUtil in ${method} method`,
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
    // console.log('\nTHIS IS FROM REDIS: ', groupsOfUsers)
    // console.log('\n')
    // generate the twitter queries for each group, request twitter api
    const arrOfResponses = await Promise.all(cronService.genTwitterQueries(groupsOfUsers))
    // console.log('THIS IS THE ARRAY FROM TWITTER: ', arrOfResponses)
    // console.log('\n')
    // changedUsers is ust an array of users that have a different followers count
    const changedUsers = cronService.compareItems(groupsOfUsers, arrOfResponses)
    console.log('\nThese are the changed users: ', changedUsers)
    console.log('\n')

    if (changedUsers.length) {
      const result = await Promise.all(changedUsers.map(user => friendsUtil.updateFromTwitter(user)))
      console.log('\nTHIS IS THE RESULT: ', result)
      console.log('\n')
      return result
    }
    return []
  } catch (err) {
    throw throwErr(null, 'Error in chron job', 'cronCheck', err)
  }
}
