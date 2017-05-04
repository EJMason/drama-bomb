const chai = require('chai')
const redis = require('../server/database/redis/redisUtil') 

const expect = chai.expect

describe('Cron', function() {

  before(async function() {
    // await redis.redis.set('a', 'one')
    // await redis.redis.set('b', 'two')

    // const stream = redis.redis.scanStream()

    redis.redis.scanStream({match: 'twitter*'}).on('data', (res) => {
      console.log(res)
    })

  })

  it('get all logged in users from redis', function() {
      expect()
  })

  it('select a random user within the range of users for their key', function() {

  })

  it('hit Twitter Api users/lookup.json', function() {

  })

  it('find and add all users that have differing properties', function() {

  })

  it('updates database and redis only for users that needed to be updated', function() {

  })
})