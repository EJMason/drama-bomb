
const twitter = require('../utilities/twitterUtil')

const maxTwitterSearch = 99

const genRandomIdx = max =>
  Math.floor(Math.random() * max)

const genTwitterQueryString = arrOfUsers =>
  arrOfUsers.map(user => user.user_id).join(',')

module.exports.groupsUsers = arr => {
  const copy = arr.slice()
  const grouped = []
  while (copy.length) {
    grouped.push(copy.splice(0, maxTwitterSearch))
  }
  return grouped
}

module.exports.genTwitterQueries = groups => {
  return groups.map(group => {
    queryStr = genTwitterQueryString(group)
    const { user_id, token, token_secret } = group[genRandomIdx(group.length)]
    return twitter.getUsersLookup({ user_id: query }, user_id, { token, token_secret })
  })
}

