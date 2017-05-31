require('dotenv').config()
const express = require('express')
const path = require('path')
const expressWinston = require('express-winston')

const log = require('./middleware/winstonLogger')
const app = require('./appInstance')
// const http = require('./httpServer')

app.use(expressWinston.logger({
  winstonInstance: log,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} - {{res.responseTime}}ms',
  colorize: true,
}))


// app.use(express.static(path.resolve(__dirname, '..', 'build')))
require('./middleware')(app)
require('./routes')(app)
require('./database')


app.use(expressWinston.errorLogger({
  winstonInstance: log,
  msg: '{{res.statusCode}} | {{err.message}}',
  colorize: true,
}))

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
// })

const port = process.env.NODE_ENV !== 'production' ? 1337 : process.env.PORT
app.listen(port, () => {
  log.info(`Server now listening on port ${port}`)
  log.info(`NODE_ENV: ${process.env.NODE_ENV}`)
})

module.exports = app
