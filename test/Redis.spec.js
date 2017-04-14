const chai = require('chai')
const mongoose = require('mongoose')
const Users = require('../server/database/models/Users')
const usersUtil = require('../server/database/dbUtil/UsersUtil')
const request = require('supertest')
const expect = chai.expect

const redisUtil = require('../server/database/redis/redisUtil')

let fakeTokens = {token: 'testertoken12345667', token_secret: '11223344455'}
const fakeHaters = []
const user_id = 'twitter|852672214348382208'
const simple_id = '852672214348382208'
const screen_name = 'test_ejm'

xdescribe('---------Redis---------', function() {
   
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

    before(function(done) {
        redisUtil.addUserIdpAndHatersRedis(user_id, fakeTokens, fakeHaters)
        redisUtil.addUserIdpAndHatersRedis('123456', fakeTokens, fakeHaters)
        done()
    })
  
  describe('Adding keys and haters to the redis cache', function() {
    
    it('should set a cache for api keys for logged in users', async function() {
      await usersUtil.findOrCreate({ user_id, simple_id, screen_name, friends_ids: [5757575, 0097987, 5466434], haters: [{}, {}] })
      let getItem = await redisUtil.redis.get(user_id)
      
      getItem = JSON.parse(getItem)

      expect(getItem).to.not.be.null
      expect(getItem).to.be.an('object')
      expect(getItem).to.have.property('token')
      expect(getItem).to.have.property('token_secret')
      expect(getItem).to.have.property('friends_ids')
      expect(getItem).to.have.property('haters')

    })
  })

})