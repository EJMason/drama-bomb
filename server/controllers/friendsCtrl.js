const twitter = require('../utilities/twitterUtil')

const placeholder = (req, res) => {
  res.status(200).send('Hello, Friends!')
}

async function getUserIds(req, res) {
  try {
    const arrayOfUserIds = await twitter.getFollowersIds(req.body.params)
    arrayOfUserIds.sort((a, b) => a - b)
  } catch (err) {
    res.status(400).send('Hello, Friends!')
  }
  twitter.getFollowersIds()
}

module.exports = { placeholder, getUserIds }
