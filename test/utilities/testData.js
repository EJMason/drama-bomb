const redis = require('../../server/database/redis')
const haters = require('./haters')

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const genUsers = () => {
  let a = []
  for(var i =0; i < 40; i++) {
    a.push(getRandomInt(0, 9999999999))
  }
  return a
}

const data = {
      friends_ids: genUsers(),
      haters,
      token: '852718642722611200-eiIO1JLNBkQJpR4wLRE1duGsVZ6Nh7P',
      token_secret: 'gOBuefFOiyvWDpDqXah9MiDAdcReFKKW8PG16ino3KvEI',
}

redis.set('twitter|852718642722611200', JSON.stringify(data))

console.log('complete')
