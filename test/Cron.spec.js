const chai = require('chai')
const redis = require('../server/database/redis/redisUtil') 

const expect = chai.expect

describe('Cron ', function() {

  describe('Helper Functions', function() {
    let allUsers_one

    beforeEach(async function() {
      await redis.redis.set('twitter|one', 'one')
      await redis.redis.set('twitter|two', 'two')
      await redis.redis.set('twitter|three', 'three')
      await redis.redis.set('twitter|four', 'four')

    })

    afterEach(async function() {
      await redis.redis.del('twitter|one', 'one')
      await redis.redis.del('twitter|two', 'two')
      await redis.redis.del('twitter|three', 'three')
      await redis.redis.del('twitter|four', 'four')
    })

    it('get all users from redis', async function() {
      allUsers_one = await redis.getAllActiveUsers(100)
      expect(allUsers_one).to.be.an('array')
    })

  })

  xdescribe('Cron Overall', function() {

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
})