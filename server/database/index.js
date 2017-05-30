const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const log = require('../middleware/winstonLogger')

const conn = (process.env.NODE_ENV !== 'testing') ? process.env.DB_MONGO_CONN : process.env.DB_MONGO_TEST
mongoose.connect(conn)

const userSchema = require('./models/Users')(mongoose.Schema)

const Users = mongoose.model('User', userSchema)

mongoose.connection.on('open', () => {
  log.verbose('Connected to DB')
})

mongoose.connection.on('close', () => {
  log.verbose('Disconnected from DB')
})

module.exports = { Users }
