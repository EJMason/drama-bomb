require('dotenv').config()
const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')

const app = require('../server/server')
const redis = require('../server/database/redis')
const util = require('../server/utilities/twitterUtil')
const auth = require('../server/utilities/authUtil')

const expect = chai.expect

const user_id = 'twitter|852718642722611200'
const simple_id = '852718642722611200'
const screen_name = 'EJTester1'

/*
Make sure when deploying to add user to redis, 
there isn't really an elegant way to automate this yet
*/

describe('---------Twitter Api---------', function() {

    describe('GET followers/ids', function() {

    it('getFollowersIds should return an object with an array of user ids', async function() {
      const response = await util.getFollowersIds({ user_id, screen_name })
      expect(response.ids).to.be.an('array')
    })

  })
})
