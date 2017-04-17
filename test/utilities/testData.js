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
      friends_ids: [ 57929458,231617496,239601600,697707365,995268086,1555162470,1698708957,1932028465,2632552626,2688892325,2804003565,3000965945,3337457192,3394363179,3467816149,3892750045,3965296254,4073454229,4604050084,4648654477,4938418363,5589151631,5650649614,5694271732,5747930101,5750060468,5792339707,5906579667,6985146101,7055720865,7788680008,7962722444,8237281085,8633061590,8673243842,9441329172,9648836724,9853671194,9889002061,9996353995 ],
      haters,
      token: '852718642722611200-eiIO1JLNBkQJpR4wLRE1duGsVZ6Nh7P',
      token_secret: 'gOBuefFOiyvWDpDqXah9MiDAdcReFKKW8PG16ino3KvEI',
}

redis.set('twitter|852718642722611200', JSON.stringify(data))

module.exports = () => { redis.set('twitter|852718642722611200', JSON.stringify(data)) }
