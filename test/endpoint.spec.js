require('dotenv').config()
const chai = require('chai')
const mongoose = require('mongoose')
const request = require('supertest')
const sinon = require('sinon')

const app = require('../server/server')
const redis = require('../server/database/redis')
const authServices = require('../server/services/auth0Services')
const authUtil = require('../server/utilities/authUtil')
const Users = require('../server/database/').Users

const expect = chai.expect

const user_id = 'twitter|852672214348382208'
const simple_id = '852672214348382208'
const screen_name = 'test_ejm'

describe('---------API---------', function() {

    before(function(done){
      mongoose.connection.on('open', () => { done() })
    })

    after(function(done) {
    Users.remove({ user_id: 'twitter|852672214348382208' }).then(()=> {
      mongoose.connection.close(function() { done() })
    })
    })

    describe('POST auth/login/init', function() {

      afterEach(function() {
        Users.remove({ user_id: 'twitter|852672214348382208' }).then(()=> {
          redis.del('twitter|852672214348382208')
        })
      })

    it('should only accept posts with a valid body', function(done) {
      request(app)
        .post('/auth/login/init')
        .send({ user_id })
        .expect(412, done)
    })

    it('should only write to redis if user not already in cache', async function() {
      await request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })
        .expect(200)
    })

    it('should return 200 when completing a successful request', function(done) {
      request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })
        .expect(200)
        .then(resp => {
          expect(resp.body).to.haveOwnProperty('user_id')
          expect(resp.body).to.haveOwnProperty('simple_id')
          expect(resp.body).to.haveOwnProperty('screen_name')
          done()
        }).catch(err => {
          done()
        })
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

    it('should generate a new Managment Token if it is expired or does not exist', function(done) {
      const genOpts = sinon.spy(authServices, 'generateManagmentOptions')
      redis.del('mtoken')
      request(app)
        .post('/auth/login/init')
        .send({ user_id, simple_id, screen_name })
        .then(() => {
          sinon.assert.calledOnce(genOpts)
          genOpts.restore()
          done()
        })
    })

  })

})
