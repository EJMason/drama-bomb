const buildHater = hater => {
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

module.exports.buildSafeData = user => {
  return JSON.stringify({
    screen_name: user.screen_name,
    user_id: user.user_id,
    followers_count: user.followers_count,
    friends_ids: user.friends_ids,
    haters: user.haters,
  })
}

module.exports.fixHaters = objOfHaters => {
  return Object.keys(objOfHaters).reduce((acc, key) => {
    acc[objOfHaters[key].id_str] = buildHater(objOfHaters[key])
    return acc
  }, {})
}

