const socket = require('./socketClient')
const log = require('../middleware/winstonLogger')

const { socketError } = require('../services/errorLogging')

const errPfix = [err, __filename, __dirname]

module.exports.socketPubUserUpdate = (userId, payload) => {
  const data = {
    userId, // definelty as just number
    payload,
  }

  socket
    .publish('userUpdate', data, err => {
      if (err) {
        const errParams = [...errPfix, 'publish', 'userUpdate']
        log.error('API/Socket Error @ pub/userUpdate', socketError(...errParams))
      } else {
        // emit new data to client
      }
    })
}
