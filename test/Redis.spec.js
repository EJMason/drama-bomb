const chai = require('chai')
const request = require('supertest')
const expect = chai.expect

const redisUtil = require('../server/database/redis/redisUtil')

describe('Redis', function() {
  
  describe('Adding to the redis cache', function() {
    
    before(function() {
      redisUtil.addUserKeysToRedisCache('123456', {token: 'testertoken12345667', token_secret: '11223344455'})
    })

    after(function() {
      redisUtil.redis.del('123456')
    })

    it('should set a cache for api keys for logged in users', async function() {
      let getItem = await redisUtil.redis.get('123456')
      getItem = JSON.parse(getItem)
      expect(getItem).to.not.be.null
      expect(getItem).to.be.an('object')
      expect(getItem).to.have.property('token')
      expect(getItem).to.have.property('token')

    })

  })
})