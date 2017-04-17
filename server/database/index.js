const mongoose = require('mongoose')
const chalk = require('chalk')
mongoose.Promise = require('bluebird')

mongoose.connect(process.env.DB_MONGO_CONN)

mongoose.connection.on('open', () => {
  console.log(chalk.bgBlue.black('\n\nConnection to Database has been established!\n'))
})
