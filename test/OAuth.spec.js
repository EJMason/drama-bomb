require('dotenv').config()
const chai = require('chai')
const request = require('supertest')

const util = require('../server/utilities/authUtil')

const expect = chai.expect

describe('Auth0', function() {
  let token = ''

  describe('Auth0 Managment Token', function() {

    it('should be able to access /oauth/token successfully', async function() {
      token = await util.getManagmentToken()
      expect(token).to.be.a.string
      expect(token).to.not.be.undefined
    })
  })

  describe('Auth0 Managment API testing with valid token', function() {

    xit('should be able to access the endpoint /api/v2/users/{id}, through getUserIdp', async function() {
      twitterIdp = await util.getUserIdpTest('twitter|821069943986790400', token)
      expect(twitterIdp).to.be.an('object')
      expect(twitterIdp).to.have.property('token')
      expect(twitterIdp).to.have.property('token_secret')
      expect(twitterIdp.token).to.contain('ZykZ87h')
      expect(twitterIdp.token_secret).to.contain('NerNAr9AHhQq')
    })
  })
})