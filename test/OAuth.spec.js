require('dotenv').config()
const chai = require('chai')
const request = require('supertest')

const services = require('../server/services/twitterServices')

const expect = chai.expect

describe('Twitter API -> ', function() {

  describe('genNonce Helper Funciton', function() {
    let nonce, nonc1, nonce2, nonce3
    before(function() {
      nonce = services.genNonce(12)
      nonce1 = services.genNonce(12)
      nonce2 = services.genNonce(12)
      nonce3 = services.genNonce(12)
    })

    it('genNonce should generate a random string', function() {
      expect(nonce).to.be.a('string')
      expect(nonce).to.have.length.within(11, 13)
    })

    it('genNonce should generate a random string', function() {
      expect(nonce1).to.not.equal(nonce2)
      expect(nonce3).to.not.equal(nonce2)
      expect(nonce1).to.not.equal(nonce3)
    })


    xit('genTwitterAuthHeader should ', function() {
      let header = services.genTwitterAuthHeader('', '')
      expect(header).to.be.an('object')
      expect(header).to.have.all.keys('Authorization')
      expect(header.Authorization).to.have.string('OAuth oauth_consumer_key=')
      expect(header.Authorization).to.have.string('oauth_signature_method=HMAC-SHA1, ')
      expect(header.Authorization).to.have.string('oauth_timestamp=')
      expect(header.Authorization).to.have.string('oauth_nonce=')
      expect(header.Authorization).to.have.string('oauth_version=1.0, ')
      expect(header.Authorization).to.have.string('oauth_token=821069943986790400-M7M3hgXPxYCkLG8WryboS8Ih9kBB5hC')
      expect(header.Authorization).to.have.string('oauth_signature=tH9%2FGL5idopCFyhdMiFnuFX%2FVo0%3D')
    })

  })

})