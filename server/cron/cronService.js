const twitter = require('../utilities/twitterUtil')
const log = require('../middleware/winstonLogger')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)

// ------------------- For Export ------------------- //

/**
 * Clusters groups into useable format
 */
module.exports.groupsUsers = arr => {
  const grouped = []
  while (arr.length) {
    grouped.push(arr.splice(0, maxTwitterSearch))
  }
  return grouped.map(cluster => cluster.reduce((acc, val) => {
    acc.users.push(val)
    acc.ids.push(val.user_id)
    return acc
  }, { users: [], ids: [] }))
}

/**
 * Generates Twitter Queries
 */
module.exports.genTwitterQueries = groups => {
  return groups.map(group => {
    queryStr = group.ids.join()
    const { user_id, token, token_secret } = group.users[genRandomIdx(group.ids.length)]
    return twitter.getUsersLookup({ user_id: queryStr }, user_id, { token, token_secret })
  })
}

/**
 * Checks against usercount to check for changes in followers
 * //groups of 100 for twitter
 * groupsOfUsers: [ { users: [{userObject1}, {userObject2}], ids: ['user1ID', 'user2Id'] }]
 * // groups correspond to twitter users
 * arrayOfTwitterResponses: [ [ {user1}, {user100} ], [ {user101}, {user200} ] ]
 */
module.exports.compareItems = (groupsOfUsers, twitterApiResponses) => {
  const changed = []
  groupsOfUsers.forEach((group, i) => {
    // sort users in array by user_id
    const groupHashTable = group.users.reduce((acc, user) => {
      acc[user.user_id] = user
      return acc
    }, {})

    twitterApiResponses[i].forEach(twitterUser => {
      const previousUserSnapshot = groupHashTable[twitterUser.id]
      log.verbose(`Names:     ${previousUserSnapshot.screen_name}  |  ${twitterUser.screen_name}`)
      log.verbose(`Usercount: ${previousUserSnapshot.followers_count}  |  ${twitterUser.followers_count}`)
      if (twitterUser.followers_count !== previousUserSnapshot.followers_count) {
        changed.push(previousUserSnapshot)
      }
    })
  })
  return changed
}

