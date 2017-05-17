
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

const checkIfHatersHaveAddedYou = (haters, changes) => {
  let haterIsFriend
  haters = haters.filter(hater => {
    haterIsFriend = false
    changes.newFriends.forEach(val => { if (hater.user_id === val) haterIsFriend = true })
    return !haterIsFriend
  })
  return haters
}

const buildSafeData = user => {
  return JSON.stringify({
    screen_name: user.screen_name,
    user_id: user.user_id,
    followers_count: user.followers_count,
    friends_ids: user.friends_ids,
    haters: user.haters,
  })
}

const buildHater = hater => {
  console.log('THIS IS THE HATER: ', hater)
  return {
    user_id: hater.id_str,
    screen_name: hater.screen_name,
    image: hater.profile_image_url,
    name: hater.name,
    profile_color: hater.profile_background_color,
    url: `twitter.com/${hater.screen_name}`,
    passive: null,
    aggressive: null,
    apology: null,
    demon: null,
  }
}

const fixHaters = objOfHaters => {
  return Object.keys(objOfHaters).reduce((acc, key) => {
    acc[objOfHaters[key].id_str] = buildHater(objOfHaters[key])
    return acc
  }, {})
}

module.exports = {
  findAllNew,
  checkIfHatersHaveAddedYou,
  buildSafeData,
  fixHaters,
}
