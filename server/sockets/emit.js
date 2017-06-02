const log = require('../middleware/winstonLogger')
const { socketError } = require('../services/errorLogging')

const errPfix = [err, __filename, __dirname]
const retry = 5

module.exports.emitUserDataToClient = (socket, data, tries = retry) => {
  socket
    .emit(data.userId, data, err => {
      if (err && tries > 0) {
        const errParams = [...errPfix, 'emit', 'emitUserDataToClient']
        log.error(`Socket | Emit Error: tries left: ${tries} `, socketError(...errParams))
        this.emitUserDataToClient(socket, data, (tries - 1))
      } else {
        log.verbose()
        // log it
      }
    })
}
