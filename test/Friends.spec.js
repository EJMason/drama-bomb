const chai = require('chai')
const request = require('supertest')
const expect = chai.expect

const util = require('../server/utilities/friendsUtil')
const redisUtil = require('../server/database/redis/redisUtil')
const token = require('./utilities/tokenizer')()

xdescribe('---------Friends Utilities and Routes---------', function() {

  describe('Route /friends/chron/haters/:idtoken', function() {

    describe('Utility: checkIdToken', function() {

      it('should return null if an unsigned or invaled token is passed as a parameter', async function() {
        const incorrectToken = util.checkIdToken('1235i', process.env.TEST_AUTH0_SECRET)
        expect(incorrectToken).to.be.null
      })

      it('should return an object from the JWT if signed and valid', function() {
        console.log(token)
        const idAndSn = util.checkIdToken(token, process.env.TEST_AUTH0_SECRET)
        expect(correctToken).to.be.an('object')
        expect(correctToken).to.have.Property('screen_name', 'EJTester1')
        expect(correctToken).to.have.Property('user_id', 'twitter|852718642722611200')
      })
    })

     describe('Utility: findNewHatersAndFriends', function() {

      it('should return an object with property "changed" with correct boolean', function() {

      })

      it('should return an object with friends and haters properly populated', function() {

      })

      it('should compare previous haters/friends to current with linear time', function() {
        // use a spy to check number of iterations
      })
    })

    describe('Utility: updateDatabaseWithNewInfo', function() {

      it('should update the database with updated friends and haters', function() {

      })
    })

    describe('Controller: chronHaters', function() {
      it('chronHaters controller should be invoked', function() {

      })

      it('should respond 400 if user is not logged in', function() {

      })
    })
    
  })

})