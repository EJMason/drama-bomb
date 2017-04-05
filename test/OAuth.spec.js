const chai = require('chai')
const request = require('supertest')

const authUtil = require('../server/utilities/authUtil')

const expect = chai.expect

describe('Twitter API -> ', function() {

  describe('genNonce Helper Funciton', function() {
    
    before(function() {
      let nonce = authUtil.genNonce(12)
      let nonce1 = authUtil.genNonce(12)
      let nonce2 = authUtil.genNonce(12)
      let nonce3 = authUtil.genNonce(12)
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


    it('genTwitterAuthHeader should ', function() {
      let header = authUtil.genTwitterAuthHeader('821069943986790400-M7M3hgXPxYCkLG8WryboS8Ih9kBB5hC', 'tH9%2FGL5idopCFyhdMiFnuFX%2FVo0%3D')
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