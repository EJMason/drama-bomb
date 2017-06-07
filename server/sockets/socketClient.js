// info: http://socketcluster.io/#!/docs/api-socketcluster-client
const socketCluster = require('socketcluster-client')
const log = require('../middleware/winstonLogger')

const isProd = Boolean(process.env.NODE_ENV === 'production')

const hostname = isProd ? process.env.SOCK_HOST : '127.0.0.1'
const port = isProd ? process.env.SOCK_PORT : 8000

const socket = socketCluster.connect({ hostname, port })

socket
  .on('connect', () => {
    log.verbose('Socket: API Server Has Connected to SocketCluster ', {
      id: socket.id,
      state: socket.state,
    })
  })

socket
  .on('error', err => {
    log.error('SOCKET: GLOBAL ERROR --> ', { error: err })
  })

socket
  .on('test', (data, res) => {
    console.log('IT CAME BACK')
    res(null, 'Good!')
  })

module.exports = socket

/*
---- on(event, handler) ----
[handler] - a function in the form: handler(data, res)
  * [res] fn to send back
        error --> res('This is an error') / res(1234, 'This is the error message for error code 1234')
        non-error response --> res(null, 'This is a normal response message')
*/

