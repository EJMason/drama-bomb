require('dotenv').config()
const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')

const app = require('../server/server')
const redis = require('../server/database/redis')
const authServices = require('../server/services/auth0Services')
const authUtil = require('../server/utilities/authUtil')

const expect = chai.expect

const user_id = 'twitter|852672214348382208'
const simple_id = '852672214348382208'
const screen_name = 'test_ejm'

describe('---------API---------', function() {

    describe('POST auth/login/init', function() {

      afterEach(function() {
        redis.del('twitter|852672214348382208')
      })

    it('should only accept posts with a valid body', async function() {
      await request(app)
        .post('/auth/login/init')
        .send({ user_id })
        .expect(412)
    })

    it('should only write to redis if user not already in cache', async function() {
      await request(app)
        .post('/auth/login/init')
        .send({ 
          user_id: 'twitter|852718642722611200', 
          simple_id: '852718642722611200', 
          screen_name: 'EJTester1'
        })
        .expect(200)
    })

    it('should return 200 when completing a successful request', async function() {
      await request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })
        .expect(200, 'Login Sequence Complete!')
    })

    it('should get ipd tokens for users and cache them in redis', async function() {
      const getUserIdp = sinon.spy(authUtil, 'getUserIdp')

      await request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })
      
      const token = await redis.get('twitter|852672214348382208')
      expect(token).to.not.be.null
      expect(JSON.parse(token)).to.have.property('token')
      expect(JSON.parse(token)).to.have.property('token_secret')

      sinon.assert.calledOnce(getUserIdp)
      getUserIdp.restore()
    })

    it('should generate a new Managment Token if it is expired or does not exist', async function() {
      const genOpts = sinon.spy(authServices, 'generateManagmentOptions')
      redis.del('mtoken')
      await request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })

      sinon.assert.calledOnce(genOpts)
      genOpts.restore()
    })

  })

  xdescribe('Demon Routes ->', function() {
    
    it('Subscribe haters to  ', function() {})

  })

  xdescribe('Message Routes ->', function() {
    it('Send a passive message [ /message/passive ]', function() {})

    it('Send an aggressive message [ /message/aggressive ]', function() {})

    it('Send an apology message [ /message/apologize ]', function() {})
  })

})
