
const twitter = require('../utilities/twitterUtil')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)

const binarySearch = (val, arr, key) => {
  let min = 0
  let max = arr.length - 1
  let currentIdx
  let currentEle

  while (min <= max) {
    currentIdx = Math.floor((min + max) / 2)
    currentEle = arr[currentIdx][key]

    if (currentEle < val) {
      min = currentIdx + 1
    } else if (currentEle > val) {
      max = currentIdx - 1
    } else {
      return currentIdx
    }
  }
  return -1
}

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
 */
module.exports.compareItems = (groupsOfUsers, responses) => {
  const changed = []
  let idx
  groupsOfUsers.forEach((group, i) => {
    // sort users in array by user_id
    group.users.sort((a, b) => a.user_id - b.user_id)
    responses[i].forEach(twitterObj => {
      // find idx of pair
      idx = binarySearch(twitterObj.id_str, group.users, 'user_id')
      if (twitterObj.followers_count !== group.users[idx].followers_count) {
        changed.push(group.users[idx])
      }
    })
  })
  return changed
}

