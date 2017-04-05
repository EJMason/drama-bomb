const rp = require('request-promise')

const util = require('../utilities/authUtil')

class TwitterApi {
  constructor() {
    this.baseUrl = 'https://api.twitter.com/1.1'
  }

  getFollowersIds(userId) {

  }
}

const TwitterApi = function () {
  this.baseUrl = 'https://api.twitter.com/1.1'

}

TwitterApi.prototype.getFollowersIds = function (user_id) {
  const options = {
    uri: `${this.baseUrl}/followers/ids.json`,
    qs: { screen_name, user_id },
    headers: util.genTwitterAuthHeader()
  }
  rp()
}


