const chai = require('chai')
const request = require('supertest')
const expect = chai.expect

const redisUtil = require('../server/database/redis/redisUtil')

let fakeTokens = {token: 'testertoken12345667', token_secret: '11223344455'}
const user_id = 'twitter|852672214348382208'
const simple_id = '852672214348382208'
const screen_name = 'test_ejm'

describe('---------Friends Utilities and Routes---------', function() {

  describe('Route /friends/chron/haters/:idtoken', function() {

    describe('Controller: chronHaters', function() {
      it('chronHaters controller should be invoked', function() {

      })

      it('should respond 400 if user is not logged in', function() {

      })
    })

    describe('Utility: checkIdToken', function() {

      
      
      it('should return null if an unsigned or invaled token is passed as a parameter', function() {

      })

      it('should return an object from the JWT if signed and valid', function() {

      })
    })

     describe('Utility: findNewHatersAndFriends', function() {

      it('should sort the user ids of the incoming array of followers', function() {

      })

      it('should compare previous haters/friends to current with linear time', function() {

      })

      it('should return an object with property "changed" with correct boolean', function() {

      })

      it('should return an object with friends and haters properly populated', function() {

      })
    })

    describe('Utility: updateDatabaseWithNewInfo', function() {

      it('should update the database with updated friends and haters', function() {

      })
    })
    
  })

})