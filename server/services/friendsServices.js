
const findAllNew = (friends, twitter) => {
  let idx = 0
  const newHaters = []
  const newFriends = []
  twitter.push(Infinity)

  for (let i = 0; i < friends.length; i++) {
    if (friends[i] < twitter[idx]) newHaters.push(friends[i])
    else if (friends[i] > twitter[idx]) {
      while (friends[i] > twitter[idx]) {
        newFriends.push(twitter[idx])
        idx++
      }
      i--
    } else idx++
  }

  while (idx < twitter.length) {
    newFriends.push(twitter[idx])
    idx++
  }
  newFriends.pop()
  twitter.pop()
  return { newFriends, newHaters }
}

module.exports = {
  findAllNew,
}
