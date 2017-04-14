const chai = require('chai')
const mongoose = require('mongoose')
const Users = require('../server/database/models/Users')
const usersUtil = require('../server/database/dbUtil/UsersUtil')
const request = require('supertest')
const expect = chai.expect

const redisUtil = require('../server/database/redis/redisUtil')

let fakeTokens = {token: 'testertoken12345667', token_secret: '11223344455'}
const user_id = 'twitter|852672214348382208'
const simple_id = '852672214348382208'
const screen_name = 'test_ejm'

describe('---------Redis---------', function() {
   
   beforeEach(function(done) {
      if(mongoose.connection.db) {
        done()
      } else {
        mongoose.connect(process.env.DB_MONGO_TEST, done)
      }
    })

    after(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        mongoose.connection.close(function() {
          redisUtil.redis.del('123456')
          redisUtil.redis.del(user_id)
          done()
        })
      })
    })
  
  describe('Adding keys and haters to the redis cache', function() {
    
    before(async function() {
      await usersUtil.findOrCreate({ user_id, simple_id, screen_name, friends_ids: [5757575, 0097987, 5466434], haters: [{}, {}] })
      redisUtil.addUserIdpAndHatersRedis(user_id, fakeTokens, fakeHaters)
      redisUtil.addUserIdpAndHatersRedis('123456', fakeTokens, fakeHaters)
    })

    it('should set a cache for api keys for logged in users', async function() {
      let getItem = await redisUtil.redis.get('123456')
      
      getItem = JSON.parse(getItem)

      expect(getItem).to.not.be.null
      expect(getItem).to.be.an('object')
      expect(getItem).to.have.property('token')
      expect(getItem).to.have.property('token_secret')

    })

    it('should generate another redis key, caching haters and friends', async function() {
      let getItem = await redisUtil.redis.get(user_id)
      getItem = JSON.parse(getItem)
      let getFriends = await redisUtil.redis.get(`f_${user_id}`)
      getFriends = JSON.parse(getFriends)
      expect(getFriends).to.not.be.null
      expect(getFriends).to.be.an('object')
      expect(getFriends).to.have.property('friends_ids')
      expect(getFriends).to.have.property('haters')
    })
  })

})