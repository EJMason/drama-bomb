const socket = require('./socketClient')
const log = require('../middleware/winstonLogger')

// const { socketError } = require('../services/errorLogging')

// const { emitUserDataToClient } = require('./emit')

// const errPfix = [err, __filename, __dirname]

module.exports.socketPubUserUpdate = (userId, payload) => {
  const data = {
    event: 'user-update',
    payload: {
      userId,
      payload,
    },
  }

  socket
    .publish('drama-bomb', data, err => {
      if (err) {
        // const errParams = [...errPfix, 'socketPubUserUpdate', 'publish']
        log.error('API/Socket Error @ pub/userUpdate', 'error')
      } else {
        log.verbose('API/Socket PUBLISH SUCCESS USER_UPDATE')
      }
    })
}
