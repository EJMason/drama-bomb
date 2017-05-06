
const twitter = require('../utilities/twitterUtil')

const maxTwitterSearch = 99

const genRandomIdx = max => Math.floor(Math.random() * max)

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

module.exports.genTwitterQueries = groups => {
  return groups.map(group => {
    queryStr = group.ids.join()
    const { user_id, token, token_secret } = group.users[genRandomIdx(group.ids.length)]
    return twitter.getUsersLookup({ user_id: queryStr }, user_id, { token, token_secret })
  })
}

