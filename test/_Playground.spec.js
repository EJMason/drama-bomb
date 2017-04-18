// const chai = require('chai')
// const request = require('supertest')
// const sinon = require('sinon')

// const util = require('../server/utilities/friendsUtil')
// const twitter = require('../server/utilities/twitterUtil')

// const expect = chai.expect

// const tester = {}

// tester.sum = (a,b) => a + b

// tester.full = () => {
//   let temp = tester.sum(1,2)
//   return temp + 1
// }

// describe('This is the testing playground', function() {
//   let stub
//   it('This is to see if I am doing it right', async function() {
//     stub = sinon.stub(twitter, 'getFollowersIds').callsFake(() => {return 'ITTTSSS WORKING!!!'})
//     //stub = sinon.stub(twitter, 'getFollowersIds').resolves('YEAHBOIIIII')
//     let a = await util.testMe()
//     expect(a).to.equal('YEAHBOIIIII')

//   })
// })