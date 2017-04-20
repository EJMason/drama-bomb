const mongoose = require('mongoose')
const chalk = require('chalk')
mongoose.Promise = require('bluebird')

const conn = (process.env.NODE_ENV === 'testing') ? process.env.DB_MONGO_CONN : DB_MONGO_TEST
mongoose.connect(conn)

const userSchema = require('./models/Users')(mongoose.Schema)

const Users = mongoose.model('User', userSchema)

mongoose.connection.on('open', () => {
  console.log(chalk.bgBlue.black(`\nConnection to ${process.env.NODE_ENV} Database has been established!`))
})

mongoose.connection.on('close', () => {
  console.log(chalk.bgRed.black('\nConnection to Database has been CLOSED!'))
})

module.exports = { Users }
