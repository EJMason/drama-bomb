
const twitter = require('../utilities/twitterUtil')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)

// binarySearch(twitterObj.id_str, group.users, 'user_id')
// const binarySearch = (val, arr, key) => {
//   let min = 0
//   let max = arr.length - 1
//   let currentIdx
//   let currentEle

//   while (min <= max) {
//     currentIdx = Math.floor((min + max) / 2)
//     currentEle = arr[currentIdx][key]

//     if (currentEle < val) {
//       min = currentIdx + 1
//     } else if (currentEle > val) {
//       max = currentIdx - 1
//     } else {
//       return currentIdx
//     }
//   }
//   return -1
// }

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
      console.log(`Names:     ${previousUserSnapshot.screen_name}  |  ${twitterUser.screen_name}`)
      console.log(`Usercount: ${previousUserSnapshot.followers_count}  |  ${twitterUser.followers_count}`)
      if (twitterUser.followers_count !== previousUserSnapshot.followers_count) {
        console.log('DIFFERENT: ADDING TO CHANGED!')
        changed.push(previousUserSnapshot)
      }
    })
  })
  return changed
}

