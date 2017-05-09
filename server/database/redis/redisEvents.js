const Redis = require('ioredis')
const redis = require('./')

const sub = new Redis()

// sub.psubscribe('__keyevent@0__:expired')

// sub.on('pmessage', (pattern, channel) => {
//   if (channel === '__keyevent@0__:expired') {
//     redis.decr('usercount').then(numOfUsers => {
//       if (!numOfUsers) {
//         // stop crontask
//       }
//     })
//   }
// })

module.exports = sub
